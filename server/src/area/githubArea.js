const User = require("../models/userModels");
const Octokit = require("@octokit/rest");

async function setGitHubToken(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.github) {
        const octokit = new Octokit({ auth: user.connectServices.github.access_token });
        return octokit;
    } else {
        throw new Error("Failed to set GitHub token for user.");
    }
}

async function anyNewCommit(userId, repoName) {
    const octokit = await setGitHubToken(userId);
    const commits = await octokit.repos.listCommits({
        owner: userId,
        repo: repoName,
        per_page: 1
    });
    return commits.data.length > 0 ? commits.data[0] : null;
}

async function anyNewIssue(userId) {
    const octokit = await setGitHubToken(userId);
    const issues = await octokit.issues.listForRepo({
        owner: userId,
        filter: 'created',
        per_page: 1
    });
    return issues.data.length > 0 ? issues.data[0] : null;
}

async function newIssueAssignedToYou(userId) {
    const octokit = await setGitHubToken(userId);
    const issues = await octokit.issues.listForAuthenticatedUser({
        filter: 'assigned',
        per_page: 1
    });
    return issues.data.length > 0 ? issues.data[0] : null;
}

async function newRepositoryByUserOrOrg(userId, userOrOrgName) {
    const octokit = await setGitHubToken(userId);
    const repos = await octokit.repos.listForUser({
        username: userOrOrgName,
        per_page: 1
    });
    return repos.data.length > 0 ? repos.data[0] : null;
}

async function createIssue(userId, repoName, title, body) {
    const octokit = await setGitHubToken(userId);
    return octokit.issues.create({
        owner: userId,
        repo: repoName,
        title,
        body
    });
}

module.exports = {
    anyNewCommit,
    anyNewIssue,
    newIssueAssignedToYou,
    newRepositoryByUserOrOrg,
    createIssue
};
