import { httpClient } from "../api.js";
import { notifyError, getSelectedUserId } from "../utils.js";


const window = document.querySelector('.balance-user-window');


async function windowBalanceUser() {
    const updatedLabelStatus = await updateLabel();
    if (!updatedLabelStatus) {
        notifyError("Не удалось загрузить данные о балансе пользователя");
        return false;
    };
    clearInputs();
    window.show();
    return window;
}

async function windowWait() {
    const takeBtn = document.querySelector('.take-balance-user');
    const depositBtn = document.querySelector('.deposit-balance-user');
    const closeBtn = document.querySelector('.close-balance-window');

    return new Promise((resolve) => {
        closeBtn.addEventListener("click", () => {
            window.hide();
            resolve('close');
        })
        window.addEventListener("sl-hide", (e) => {
            if (e.target === window) {resolve(false)};
        })
        depositBtn.addEventListener("click", () => {
            resolve('deposit');
        })
        takeBtn.addEventListener("click", () => {
            resolve('take');
        })
    })
}

async function updateLabel() {
    const label = document.querySelector('.balance-user-label');
    const response = await httpClient.getUser(getSelectedUserId());
    if (response.status == 200) {
        label.innerHTML = `Текущий баланс пользователя: ${response.payload.balance} Руб`
        return true;
    };
    return false;
}

function clearInputs() {
    document.querySelector('.input-balance-sum').value = '';
    document.querySelector('.input-balance-comment').value = '';
}

function getSum() {
    return Number(document.querySelector('.input-balance-sum').value);
}

function windowHide() {
    window.hide();
}

function windowShow() {
    window.show();
}

export { windowHide, windowShow, windowWait, windowBalanceUser, getSum, updateLabel, clearInputs };