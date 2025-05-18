import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, notifySuccess } from "../utils.js";
import { windowUpdateUser, windowUpdatedUserGetData, windowWait } from "../windows/update_user.js";


async function updateUserWithServer() { 
    const window = await windowUpdateUser();
    
    while (true) {
        const state = await windowWait();
        if (!state) {
            window.hide();
            return;
        }
    }
    // const response = await httpClient.createUser();
    // if (response.status == 200) {
    //     notifyInfo(response.description);
    // }
    
}

export { updateUserWithServer };