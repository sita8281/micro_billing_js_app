import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, notifySuccess, getSelectedUserId } from "../utils.js";
import { windowUpdateUser, windowUserData, windowWait } from "../windows/update_user.js";


async function updateUserWithServer() { 
    const window = await windowUpdateUser();
    const userData = windowUserData();
    
    
    while (true) {
        const state = await windowWait();
        if (!state) {
            window.hide();
            return;
        }
        const updates = compareData(userData, windowUserData());

        if (Object.keys(updates).length === 0) {
            notifyInfo('Не найдено изменений, сохранять нечего')
        }
        const response = await httpClient.updateUser(getSelectedUserId(), updates);
        if (response.status == 200) {
            notifySuccess(response.description);
        }
        if (response.status != 200) {
            notifyWarning(response.description);
        }
    }
    
    
}


function compareData(oldData, newData) {
    let changes = {};
    for (const key in oldData) {
        if (oldData[key] != newData[key]) {
            changes[key] = newData[key]
        }
    }
    return changes
}

export { updateUserWithServer };