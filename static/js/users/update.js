import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, notifySuccess, getSelectedUserId, showLoading, hideLoading } from "../utils.js";
import { windowUpdateUser, windowUserData, windowWait, updateData } from "../windows/update_user.js";
import { updateSelectedUser } from "../tree_users.js";


async function updateUserWithServer() { 
    const window = await windowUpdateUser();
    if (!window) {
        return;
    }
    let userData = windowUserData();
    
    
    while (true) {
        
        const state = await windowWait();

        if (!state) {
            window.hide();
            return;
        }
        const updates = compareData(userData, windowUserData());

        if (Object.keys(updates).length === 0) {
            notifyInfo('Не найдено изменений, сохранять нечего')
            continue;
        }
        try {
            showLoading();
            const response = await httpClient.updateUser(getSelectedUserId(), updates);
            
            if (response.status == 200) {
                notifySuccess(response.description);
                userData = windowUserData();
                if (!await updateData()) {
                    notifyWarning('Не удалось подгрузить обновленные данные с сервера');
                }
                await updateSelectedUser();
                continue;
            }
            if (response.status != 200) {
                notifyWarning(response.description);
                continue;
            }
        } finally {
            hideLoading();
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