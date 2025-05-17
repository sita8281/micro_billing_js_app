import { notifyInfo, notifyWarning, getNodeTreeview } from "../utils.js";
import { httpClient } from "../api.js";
import { windowAsk } from "../windows/ask_delete.js"


async function deleteFolderWithServer(folderId) {
    const folderNode = getNodeTreeview(`f${folderId}`);
    if (!folderNode) {
        notifyWarning("Папка на найдена");
    }
    const ask = await windowAsk('Удаление папки', `Выдействительно хотите удалить папку "${folderNode.name}" ?`);

    if (!ask) {
        return;
    }
    const response = await httpClient.deleteFolder(folderId);
    if (response.status == 200) {
        notifyInfo(response.description);
    }
    
}

export { deleteFolderWithServer };