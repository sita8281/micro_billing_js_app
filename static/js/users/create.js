import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, getNodeTreeview } from "../utils.js";
import { windowAsk } from "../windows/ask_delete.js";


async function createUserWithServer(folderId) {
    const folderNode = getNodeTreeview(folderId);
    const response = await httpClient.createUser(userId);
    if (response.status == 200) {
        notifyInfo(response.description);
    }
    
}

export { createUserWithServer };