const User = require("../models/userModels");
const { Octokit } = require("@octokit/rest");

async function setGitHubToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.get("github")) {
        const octokit = new Octokit({ auth: user.connectServices.get("github").access_token });
        return octokit;
    } else {
        throw new Error("Failed to set GitHub token for user.");
    }
}

function updateOrPushIngredient(ingredients, ingredient) {
    const index = ingredients.findIndex((item) => item.name === ingredient.name);
    if (index !== -1) {
        ingredients[index].value = ingredient.value;
    } else {
        ingredients.push(ingredient);
    }
}

function replacePlaceholdersWithIngredients(str, ingredients) {
    return str.replace(/<([^>]+)>/g, (match, placeholder) => {
        const ingredient = ingredients.find((ing) => ing.name === placeholder);
        return ingredient ? ingredient.value : match;
    });
}

async function processTriggerData(areaEntry, key, value) {
    if (!areaEntry.trigger.data) {
        areaEntry.trigger.data = { key, value };
        await areaEntry.save();
        return false;
    } else if (areaEntry.trigger.data.value !== value) {
        areaEntry.trigger.data = { key, value };
        await areaEntry.save();
        return true;
    }
    return false;
}

async function anyNewCommit(areaEntry) {
    try {
        const octokit = await setGitHubToken(areaEntry.userId);
        const user = await User.findById(areaEntry.userId);
        const commits = await octokit.repos.listCommits({
            owner: user.connectServices.get("github").data.login,
            repo: areaEntry.trigger.parameters[0].input,
            per_page: 1,
        });
        const recentCommit = commits.data.length > 0 ? commits.data[0] : null;
        if (!recentCommit) return false;
        if (!areaEntry.trigger.ingredients) {
            areaEntry.trigger.ingredients = [];
        }
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "commit_message", value: recentCommit.commit.message });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "committer_name", value: recentCommit.commit.committer.name });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "commit_date", value: recentCommit.commit.committer.date });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "commit_url", value: recentCommit.html_url });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repository_name", value: areaEntry.trigger.parameters[0].input });
        return await processTriggerData(areaEntry, "commitId", recentCommit.node_id);
    } catch (error) {
        if (!areaEntry.trigger.data) await processTriggerData(areaEntry, "commitId", 0);
        return false;
    }
}

async function anyNewIssue(areaEntry) {
    try {
        const octokit = await setGitHubToken(areaEntry.userId);
        const issues = await octokit.issues.listForAuthenticatedUser({
            filter: "created",
            per_page: 1,
        });
        const recentIssue = issues.data.length > 0 ? issues.data[0] : null;
        if (!recentIssue) return false;

        if (!areaEntry.trigger.ingredients) areaEntry.trigger.ingredients = [];
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_title", value: recentIssue.title });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_url", value: recentIssue.html_url });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_body", value: recentIssue.body });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_creator", value: recentIssue.user.login });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_date", value: recentIssue.created_at });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repository_name", value: recentIssue.repository.full_name.split('/')[1] });
        return await processTriggerData(areaEntry, "issueId", recentIssue.id);
    } catch (error) {
        if (!areaEntry.trigger.data) await processTriggerData(areaEntry, "issueId", 0);
        return false;
    }
}

async function newIssueAssignedToYou(areaEntry) {
    try {
        const octokit = await setGitHubToken(areaEntry.userId);
        const issues = await octokit.issues.listForAuthenticatedUser({
            filter: "assigned",
            per_page: 1,
        });
        const recentIssue = issues.data.length > 0 ? issues.data[0] : null;
        if (!recentIssue) return false;
        if (!areaEntry.trigger.ingredients) areaEntry.trigger.ingredients = [];
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_title", value: recentIssue.title });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_url", value: recentIssue.html_url });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_body", value: recentIssue.body });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "issue_creator", value: recentIssue.user.login });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "assigned_to_you_date", value: recentIssue.created_at });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repository_name", value: recentIssue.repository.full_name.split('/')[1] });
        return await processTriggerData(areaEntry, "assignedIssueId", recentIssue.id);
    } catch (error) {
        if (!areaEntry.trigger.data) await processTriggerData(areaEntry, "assignedIssueId", 0);
        return false;
    }
}

async function newRepositoryByUserOrOrg(areaEntry) {
    try {
        const octokit = await setGitHubToken(areaEntry.userId);
        const specifiedName = areaEntry.trigger.parameters[0].input;
        let repos = await octokit.repos.listForUser({
            username: specifiedName,
            per_page: 100,
        });
        if (repos.data.length === 0) {
            repos = await octokit.repos.listForOrg({
                org: specifiedName,
                per_page: 100,
            });
        }
        repos.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const recentRepository = repos.data.length > 0 ? repos.data[0] : null;
        if (!recentRepository) return false;

        if (!areaEntry.trigger.ingredients) areaEntry.trigger.ingredients = [];
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repository_name", value: recentRepository.name });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repository_url", value: recentRepository.html_url });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repository_description", value: recentRepository.description });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repositpry_owner", value: recentRepository.owner.login });
        updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "repositpry_date", value: recentRepository.created_at });
        return await processTriggerData(areaEntry, "repoId", recentRepository.id);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        if (!areaEntry.trigger.data) await processTriggerData(areaEntry, "repoId", 0);
        return false;
    }
}

async function createIssue(userId, repoName, title, body, ingredients) {
    try {
        const octokit = await setGitHubToken(userId);
        const user = await User.findById(userId);
        const githubUsername = user.connectServices.get("github").data.login;
        title = replacePlaceholdersWithIngredients(title, ingredients);
        body = replacePlaceholdersWithIngredients(body, ingredients);
        repoName = replacePlaceholdersWithIngredients(repoName, ingredients);
        const issue = await octokit.issues.create({
            owner: githubUsername,
            repo: repoName,
            title: title,
            body: body,
        });
        return issue.data;
    } catch (error) {
        console.error("Error creating issue:", error);
        throw error;
    }
}

module.exports = {
    anyNewCommit,
    anyNewIssue,
    newIssueAssignedToYou,
    newRepositoryByUserOrOrg,
    createIssue,
};
