const axios = require("axios");
const User = require("../models/userModels");

async function getRepositoryCount(userId) {
    const user = await User.findById(userId);
    const response = await axios.get(`https://api.github.com/users/${user.githubUsername}/repos`, {
        headers: {
            Authorization: `Bearer ${user.githubToken}`,
        },
    });
    return response.data.length;
}

async function getFollowerCount(userId) {
    const user = await User.findById(userId);
    const response = await axios.get(
        `https://api.github.com/users/${user.githubUsername}/followers`,
        {
            headers: {
                Authorization: `Bearer ${user.githubToken}`,
            },
        }
    );
    return response.data.length;
}

exports.newRepositoryTrigger = async (userId, lastCount) => {
    const currentCount = await getRepositoryCount(userId);
    return currentCount > lastCount;
};

exports.newFollowerTrigger = async (userId, lastCount) => {
    const currentCount = await getFollowerCount(userId);
    return currentCount > lastCount;
};

exports.createRepository = async (userId, repoName, description = "", isPrivate = true) => {
    const user = await User.findById(userId);
    const response = await axios.post(
        `https://api.github.com/user/repos`,
        {
            name: repoName,
            description: description,
            private: isPrivate,
        },
        {
            headers: {
                Authorization: `Bearer ${user.githubToken}`,
            },
        }
    );
    return response.data;
};

exports.createIssue = async (userId, repoName, issueTitle, issueBody) => {
    const user = await User.findById(userId);
    const response = await axios.post(
        `https://api.github.com/repos/${user.githubUsername}/${repoName}/issues`,
        {
            title: issueTitle,
            body: issueBody,
        },
        {
            headers: {
                Authorization: `Bearer ${user.githubToken}`,
            },
        }
    );
    return response.data;
};

