const { makeApiCall, makeContentApiCall } = require("./apiUtils");

exports.fetchGithubCommits = async function (accessToken, username, repoName) {
    const url = `https://api.github.com/repos/${username}/${repoName}/commits`;
    const headers = {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
    };

    try {
        return await makeApiCall(url, "GET", headers);
    } catch (error) {
        console.error("Failed to fetch GitHub commits:", error);
        throw error;
    }
};

exports.fetchGithubIssues = async function (accessToken, username) {
    const query = `author:${username}+type:issue`;
    const url = `https://api.github.com/search/issues?q=${query}&sort=created&order=desc`;
    const headers = {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
    };

    try {
        return await makeApiCall(url, "GET", headers);
    } catch (error) {
        console.error("Failed to fetch GitHub issues:", error);
        throw error;
    }
};

exports.fetchAssignedGithubIssues = async function (accessToken, username) {
    const url = `https://api.github.com/search/issues?q=assignee:${username}+is:issue+is:open&sort=created&order=desc`;
    const headers = {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
    };

    try {
        return await makeApiCall(url, "GET", headers);
    } catch (error) {
        console.error("Failed to fetch assigned GitHub issues:", error);
        throw error;
    }
};

exports.fetchGithubRepositories = async function (accessToken) {
    const urlUser = `https://api.github.com/user/repos`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
    };

    try {
        return await makeApiCall(`${urlUser}?type=all`, "GET", headers);
    } catch (error) {
        console.error("Failed to fetch GitHub repositories:", error);
        throw error;
    }
};

exports.fetchCreateGithubIssue = async function (accessToken, username, repoName, title, body) {
    const url = `https://api.github.com/repos/${username}/${repoName}/issues`;
    const headers = {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
    };
    const data = {
        title,
        body,
    };

    try {
        return await makeContentApiCall(url, "POST", headers, data);
    } catch (error) {
        console.error("Failed to create GitHub issue:", error);
        throw error;
    }
};
