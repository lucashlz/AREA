import { getDropboxToken } from "../utils/token/servicesTokenUtils";
import { updateIngredients } from "../utils/ingredients/ingredientsHelper";
import { processTriggerDataTotal } from "../utils/area/areaValidation";
import { fetchUploadFile, fetchFilesInFolder, fetchAllSharedLinks } from "../utils/API/dropboxAPI";

interface AreaEntry {
    userId: string;
    trigger: {
        parameters: Array<{ input: string }>;
    };
}

interface DropboxFileLink {
    ".tag": string;
    name: string;
    id: string;
    url?: string;
}

export const newFileInFolder = async (areaEntry: AreaEntry): Promise<boolean> => {
    try {
        const folderPath = areaEntry.trigger.parameters[0].input === "/" ? "" : areaEntry.trigger.parameters[0].input;
        const accessToken = await getDropboxToken(areaEntry.userId);
        const folderList: DropboxFileLink[] = await fetchFilesInFolder(accessToken, folderPath);
        const filesInFolderList = folderList.filter((link) => link[".tag"] === "file");
        if (!folderList) return await processTriggerDataTotal(areaEntry, "newFileInFolder", "", 0);
        const recentFile = filesInFolderList[filesInFolderList.length - 1];

        if (await processTriggerDataTotal(areaEntry, "newFileInFolder", recentFile.id, filesInFolderList.length)) {
            updateIngredients(areaEntry, [
                { name: "file_name", value: recentFile.name },
                { name: "folder_path", value: folderPath === "" ? "/" : folderPath },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed in newFileInFolder function:", error);
        throw error;
    }
};

export const newSharedFileLink = async (areaEntry: AreaEntry): Promise<boolean> => {
    try {
        const accessToken = await getDropboxToken(areaEntry.userId);
        const allLinks: DropboxFileLink[] = await fetchAllSharedLinks(accessToken);
        const fileLinks = allLinks.filter((link) => link[".tag"] === "file");
        console.log(JSON.stringify(fileLinks, null, 2));
        if (fileLinks.length === 0) return await processTriggerDataTotal(areaEntry, "newSharedFileLink", "", 0);
        const recentFileLink = fileLinks[0];

        if (await processTriggerDataTotal(areaEntry, "newSharedFileLink", recentFileLink.id, fileLinks.length)) {
            updateIngredients(areaEntry, [
                { name: "file_url", value: recentFileLink.url },
                { name: "file_name", value: recentFileLink.name },
            ]);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Failed in newSharedFileLink function:", error);
        throw error;
    }
};

export const uploadFileFromURL = async (userId: string, fileUrl: string, fileName: string, filePath: string): Promise<any> => {
    try {
        const accessToken = await getDropboxToken(userId);
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error(`Failed to fetch file from URL: ${response.statusText}`);
        }
        const buffer = await response.arrayBuffer();
        const fileData = Buffer.from(buffer);
        const uploadResult = await fetchUploadFile(accessToken, fileData, fileName, filePath);
        return uploadResult;
    } catch (error) {
        console.error("Error in uploadFileFromURL function:", error);
        throw error;
    }
};
