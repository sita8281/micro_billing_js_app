import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, notifySuccess, getSelectedUserId } from "../utils.js";
import { windowUpdateUser, windowUserData, windowWait } from "../windows/update_user.js";


async function updateUserWithServer() { 
    const window = await windowUpdateUser();
    let userData = windowUserData();
    
    
    while (true) {
        console.log('ожидание ввода...');
        
        const state = await windowWait();

        console.log('получено сообщение от окна ' + state)

        if (!state) {
            window.hide();
            return;
        }
        const updates = compareData(userData, windowUserData());

        if (Object.keys(updates).length === 0) {
            notifyInfo('Не найдено изменений, сохранять нечего')
            continue;
        }
        const response = await httpClient.updateUser(getSelectedUserId(), updates);
        
        if (response.status == 200) {
            notifySuccess(response.description);
            userData = windowUserData();
            continue;
        }
        if (response.status != 200) {
            notifyWarning(response.description);
            continue;
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