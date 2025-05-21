import { httpClient } from "../api.js";
import { notifyError, getSelectedFolderId } from "../utils.js";


const window = document.querySelector('.create-user-window');
const selectPools = document.querySelector('.create-user-window div .select-ip-pool');
const nameInput = document.querySelector('.create-user-window div .input-name');
const loginInput = document.querySelector('.create-user-window div .input-login');
const passwordInput = document.querySelector('.create-user-window div .input-password');
const selectRights = document.querySelector('.create-user-window div .select-rights');


async function windowCreateUser() {
    const response = await httpClient.getIpPools();
    if (response.status != 200) {
        notifyError("Не удалось загрузить список пулов с сервера")
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
        window.addEventListener("sl-hide", () => {
            resolve(false);
        })
        createBtn.addEventListener("click", () => {
            resolve(true);
        })
    })
}

function windowCreateUserGetData() {
    return {
        name: nameInput.value,
        login: loginInput.value,
        password: passwordInput.value,
        right: selectRights.value,
        pool: selectPools.value,
        folder: getSelectedFolderId()
    }
}

function windowHide() {
    window.hide();
}

function windowShow() {
    window.show();
}

export { windowCreateUser, windowCreateUserGetData, windowHide, windowShow, windowWait };