import { httpClient } from "../api.js";
import { notifyError } from "../utils.js";


const window = document.querySelector('.update-user-window');


async function windowUpdateUser() {
    // const response = await httpClient.getIpPools();
    // if (response.status != 200) {
    //     notifyError("Не удалось загрузить список пулов с сервера")
    // };
    // const pools = response.payload.pools;
    // let htmlSelectPools = '';

    // pools.map((item) => {
    //     htmlSelectPools += `<sl-option value="${item.id}">${item.name}</sl-option>`
    // })
    // selectPools.innerHTML = htmlSelectPools;
    // selectPools.value = '';

    window.show();
    return window;
}

async function windowWait() {
    const saveBtn = document.querySelector('.save-user-update');
    const closeBtn = document.querySelector('.close-user-update');

    return new Promise((resolve) => {
        closeBtn.addEventListener("click", () => {
            window.hide();
            resolve(false);
        })
        saveBtn.addEventListener("click", () => {
            resolve(true);
        })
    })
}

function windowUpdatedUserGetData() {
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

export { windowUpdateUser, windowUpdatedUserGetData, windowHide, windowShow, windowWait };