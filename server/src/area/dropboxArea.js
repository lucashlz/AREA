const { Dropbox } = require("dropbox");
const User = require("../models/userModels");

let fetch;

(async () => {
    const nodeFetch = await import("node-fetch");
    fetch = nodeFetch.default;
})();

async function getDropboxClientForUser(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.get("dropbox")) {
        const accessToken = user.connectServices.get("dropbox").access_token;
        return new Dropbox({ accessToken: accessToken, fetch: fetch });
    } else {
        throw new Error("Failed to get Dropbox client for user.");
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

async function getAllSharedLinks(dbxClient) {
    let allLinks = [];
    let hasMore = true;
    let cursor = null;

    while (hasMore) {
        let response;
        if (cursor) {
            response = await dbxClient.sharingListSharedLinks({ cursor: cursor });
        } else {
            response = await dbxClient.sharingListSharedLinks();
        }
        allLinks = allLinks.concat(response.result.links);
        hasMore = response.result.has_more;
        cursor = response.result.cursor;
    }

    return allLinks;
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

async function newFileInFolder(areaEntry) {
    const dbxClient = await getDropboxClientForUser(areaEntry.userId);
    const folderPath = areaEntry.trigger.parameters[0].input;
    const filesListResponse = await dbxClient.filesListFolder({ path: folderPath });
    const entries = filesListResponse.result.entries;
    if (entries.length === 0) {
        await processTriggerData(areaEntry, "newFileInFolder", "");
        return false;
    }
    const recentFile = entries[0];
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "file_name", value: recentFile.name });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "folder_path", value: folderPath });
    return await processTriggerData(areaEntry, "newFileInFolder", recentFile.id);
}

async function newSharedFileLink(areaEntry) {
    const dbxClient = await getDropboxClientForUser(areaEntry.userId);
    const allLinks = await getAllSharedLinks(dbxClient);
    if (!allLinks || allLinks.length === 0) {
        await processTriggerData(areaEntry, "newSharedFileLink", "");
        return false;
    }
    const fileLinks = allLinks.filter((link) => link[".tag"] === "file");
    const recentFileLink = fileLinks[0];
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "file_url", value: recentFileLink.url });
    updateOrPushIngredient(areaEntry.trigger.ingredients, { name: "file_name", value: recentFileLink.name });
    return await processTriggerData(areaEntry, "newSharedFileLink", recentFileLink.id);
}

async function moveFileOrFolder(userId, originalPath, destinationPath) {
    if (destinationPath == "/")
        destinationPath = "";
    const dbxClient = await getDropboxClientForUser(userId);
    await dbxClient.filesMoveV2({ from_path: originalPath, to_path: destinationPath });
}

async function addFileFromURL(userId, fileUrl, fileName, dropboxFolderPath) {
    if (dropboxFolderPath == "/")
        dropboxFolderPath = "";
    const dbxClient = await getDropboxClientForUser(userId);
    const response = await fetch(fileUrl);
    const fileData = await response.buffer();
    await dbxClient.filesUpload({ path: `${dropboxFolderPath}/${fileName}`, contents: fileData });
}

module.exports = {
    newFileInFolder,
    newSharedFileLink,
    moveFileOrFolder,
    addFileFromURL,
};
