const axios = require("axios");
const User = require("../models/userModels");
const { Dropbox } = require("dropbox");
let fetch;
(async () => {
    const nodeFetch = await import("node-fetch");
    fetch = nodeFetch.default;
})();

const allowedExtensions = [
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.ico', '.webp', '.heic',
    '.txt', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.odt', '.ods', '.odp',
    '.csv', '.rtf', '.tex', '.md',
    '.mp3', '.wav', '.ogg', '.m4a', '.flac',
    '.mp4', '.avi', '.mkv', '.mov', '.flv', '.wmv', '.webm',
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
    '.html', '.htm', '.xml', '.css', '.js', '.php', '.py', '.java', '.c', '.cpp', '.h', '.hpp', '.sh', '.go', '.swift',
    '.sql', '.db', '.dbf', '.mdb',
    '.ttf', '.otf', '.fon', '.woff',
    '.json', '.yml', '.yaml', '.svg', '.eps', '.ai', '.psd', '.indd', '.acsm',
];


async function getDropboxClientForUser(userId) {
    const user = await User.findById(userId);
    if (user && user.connectServices && user.connectServices.get("dropbox")) {
        const accessToken = user.connectServices.get("dropbox").access_token;
        return new Dropbox({ accessToken: accessToken, fetch: fetch });
    } else {
        throw new Error("Failed to get Dropbox client for user.");
    }
}

async function checkPathExists(userId, path, isMoveDestination = false) {
    if (path === "/") return true;
    const dbx = await getDropboxClientForUser(userId);
    try {
        await dbx.filesGetMetadata({ path: path });
        return true;
    } catch (error) {
        if (error.status === 400 && error.error && error.error.includes("did not match pattern")) {
            throw new Error(`Invalid path format provided: ${path}`);
        } else if (error.status === 409) {
            if (isMoveDestination) {
                return false;
            }
            throw new Error(`Path does not exist: ${path}`);
        }
        throw error;
    }
}

async function isValidURL(url) {
    try {
        const extension = (url.match(/\.([a-zA-Z0-9]+)(?:[\?\#]|$)/) || [])[1];
        if(!extension || !allowedExtensions.includes('.' + extension.toLowerCase())) {
            throw new Error(`Invalid file extension: ${extension}`);
        }
        const response = await axios.head(url);
        return response.status === 200;
    } catch {
        return false;
    }
}
async function checkDropboxParameters(userId, parameters, actionName) {
    for (let param of parameters) {
        if (param.name === "destination_path" || param.name === "dropbox_folder_path" || param.name === "original_path") {
            let pathToCheck;
            pathToCheck = param.input.substring(0, param.input.lastIndexOf("/"));
            if (pathToCheck === "") pathToCheck = "/";
            if (!(await checkPathExists(userId, pathToCheck, true))) {
                throw new Error(`Invalid destination provided: ${pathToCheck}`);
            }
        }
        if (param.name === "file_url" && !(await isValidURL(param.input))) {
            throw new Error(`Invalid file URL provided: ${param.input}`);
        }
        if (param.name === "file_name") {
            const invalidFileNameChars = ["<", ">", ":", '"', "/", "\\", "|", "?", "*"];
            if (invalidFileNameChars.some((char) => param.input.includes(char))) {
                throw new Error(`Invalid filename provided: ${param.input}. The filename contains illegal characters.`);
            }
        }
    }
    return true;
}

module.exports = {
    checkDropboxParameters,
};
