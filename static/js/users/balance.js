import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, getNodeTreeview, notifySuccess } from "../utils.js";
import { windowCreateUser, windowCreateUserGetData, windowWait } from "../windows/balance_operations.js";


async function balanceUserWithServer() { 
    const window = await windowCreateUser();
    

    while (true) {
        const state = await windowWait();
        if (!state) {
            return;
        }
        const data = windowCreateUserGetData();
        
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
        } else {
            notifyWarning(response.description)
        }
        
    }
    // const response = await httpClient.createUser();
    // if (response.status == 200) {
    //     notifyInfo(response.description);
    // }
    
}

export { balanceUserWithServer };