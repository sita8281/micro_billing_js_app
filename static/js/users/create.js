import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, getNodeTreeview, notifySuccess } from "../utils.js";
import { windowCreateUser, windowCreateUserGetData, windowWait } from "../windows/create_user.js";


async function createUserWithServer() { 
    const window = await windowCreateUser();
    

    while (true) {
        console.log('ожидание сигнала')
        const state = await windowWait();
        console.log('сигнал получен')
        if (!state) {
            return;
        }
        const data = windowCreateUserGetData();
        console.log('данные получены');
        
        
        const response = await httpClient.createUser({
            folderId: data.folder,
            poolId: Number(data.pool),
            role: data.right,
            login: data.login,
            password: data.password,
            name: data.name,
        })
        console.log(response);
        

        if (response.status == 201) {
            notifySuccess(response.description);
            window.hide();
            return;
        } else {
            notifyWarning(response.description)
        }
        
    }
}

export { createUserWithServer };