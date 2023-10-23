const { Octokit } = require("@octokit/rest");
const User = require("../models/userModels");

async function setGitHubToken(user) {
    const githubService = user.connectServices.get("github");
    if (!githubService) {
        console.error("GitHub service not available for user:", user._id);
        throw new Error("GitHub service not connected for user.");
    }
    const octokit = new Octokit({ auth: githubService.access_token });
    return octokit;
}

async function checkRepositoryExists(user, repoName) {
    const octokit = await setGitHubToken(user);
    try {
        await octokit.repos.get({
            owner: user.connectServices.get("github").data.login,
            repo: repoName,
        });
        console.log(`Repository ${repoName} is valid.`);
        return true;
    } catch (error) {
        console.log(`Repository ${repoName} is invalid.`, error);
        return false;
    }
}

async function checkGithubParameters(userId, parameters) {
    const user = await User.findById(userId);
    for (let param of parameters) {
        switch (param.name) {
            case "repository_name":
            case "repository":
                if (!(await checkRepositoryExists(user, param.input))) {
                    throw new Error(`Invalid repository name ${param.input} provided`);
                }
                break;

            case "user_or_org_name":
                const octokit = await setGitHubToken(user);
                try {
                    await octokit.users.getByUsername({ username: param.input });
                } catch {
                    throw new Error(`Username or organization ${param.input} not found`);
                }
                break;

            case "title":
            case "body":
                if (!param.input || param.input.trim() === "") {
                    throw new Error(`Invalid ${param.name} provided`);
                }
                break;

            default:
                break;
        }
    }
    return true;
}

module.exports = {
    checkGithubParameters,
};
