import { httpClient } from "../api.js";
import { notifyInfo, notifyWarning, getNodeTreeview, notifySuccess, getSelectedUserId, notifyError } from "../utils.js";
import { windowWait, windowBalanceUser, getSum, updateLabel, clearInputs} from "../windows/balance_operations.js";


async function balanceUserWithServer() { 
    const window = await windowBalanceUser();

    if (!window) {
        return;
    }

    while (true) {
        const state = await windowWait();

        try {
            if (state == 'deposit') {
                const response = await httpClient.userBalanceDeposit(getSelectedUserId(), getSum(), 'test')
                if (response.status == 200) {
                    notifySuccess(response.description);
                    clearInputs();
                    if (!await updateLabel()) {
                        notifyError('Возникла ошибка при обновлении баланса');
                    }
                } else {
                    notifyWarning(response.description)
                }
            } else if ( state == 'take') {
                const response = await httpClient.userBalanceTake(getSelectedUserId(), getSum(), 'test')
                if (response.status == 200) {
                    notifySuccess(response.description);
                    clearInputs();
                    if (!await updateLabel()) {
                        notifyError('Возникла ошибка при обновлении баланса');
                    }
                } else {
                    notifyWarning(response.description)
                }

            } else {
                return;
            }

        } catch {
            window.hide();
            return;
            
        }
        
    }
    // const response = await httpClient.createUser();
    // if (response.status == 200) {
    //     notifyInfo(response.description);
    // }
    
}

export { balanceUserWithServer };