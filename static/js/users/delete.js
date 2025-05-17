import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, getNodeTreeview } from "../utils.js";
import { windowAsk } from "../windows/ask_delete.js";


async function deleteUserWithServer(userId) {
    const userNode = getNodeTreeview(userId);
    if (!userNode) {
        notifyWarning("Пользователь не найден");
    }
    const ask = await windowAsk('Удаление пользователя', `Выдействительно хотите удалить пользователя "${userNode.name}" ?`);

    if (!ask) {
        return;
    }
    const response = await httpClient.deleteUser(userId);
    if (response.status == 200) {
        notifyInfo(response.description);
    }
    
}

export { deleteUserWithServer };