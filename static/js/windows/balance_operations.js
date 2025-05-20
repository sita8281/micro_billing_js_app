import { httpClient } from "../api.js";
import { notifyError, getSelectedUserId } from "../utils.js";


const window = document.querySelector('.balance-user-window');


async function windowBalanceUser() {
    const response = await httpClient.getUser();
    if (response.status != 200) {
        notifyError("Не удалось загрузить данные о балансе пользователя");
    };
    const pools = response.payload.pools;
    let htmlSelectPools = '';

    pools.map((item) => {
        htmlSelectPools += `<sl-option value="${item.id}">${item.name}</sl-option>`
    })
    selectPools.innerHTML = htmlSelectPools;
    selectPools.value = '';

    window.show();
    return window;
}

async function windowWait() {
    const createBtn = document.querySelector('.window-create-user');
    const closeBtn = document.querySelector('.close-user-window');

    return new Promise((resolve) => {
        closeBtn.addEventListener("click", () => {
            window.hide();
            resolve(false);
        })
        createBtn.addEventListener("click", () => {
            resolve(true);
        })
    })
}

function windowHide() {
    window.hide();
}

function windowShow() {
    window.show();
}

export { windowCreateUser, windowCreateUserGetData, windowHide, windowShow, windowWait };