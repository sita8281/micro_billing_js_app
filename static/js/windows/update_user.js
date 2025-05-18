import { httpClient } from "../api.js";
import { notifyError, getSelectedUserId } from "../utils.js";


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

    if (!await updateData()) {
        notifyError("Не удалось получить данные пользователя с сервера")
        return;
    }

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


async function updateData() {
    const userData = await httpClient.getUser(getSelectedUserId());
    const tariffs = await httpClient.getTariffs();
    const pools = await httpClient.getIpPools();

    if ((userData.status != 200) || (tariffs.status != 200) || (pools.status != 200)) {
        return false;
    }
    // вставка данных в inputs
    const name = document.querySelector('.input-update-name');
    const login = document.querySelector('.input-update-login');
    const password = document.querySelector('.input-update-password');
    const tariffSum = document.querySelector('.input-update-tariff-sum');
    const tariffUpload = document.querySelector('.input-update-tariff-upload');
    const tariffDownload = document.querySelector('.input-update-tariff-download');

    name.value = userData.payload.name;
    login.value = userData.payload.login;
    password.value = userData.payload.password;
    tariffSum.value = userData.payload.tariff_sum;
    tariffUpload.value = userData.payload.tariff_upload;
    tariffDownload.value = userData.payload.tariff_download;

    // вставка данных в selects
    const poolSelector = document.querySelector('.select-update-pool');
    const tariffSelector = document.querySelector('.select-update-tariff');

    let htmlSelectPools = '';
    let htmlSelectTariffs = '';

    pools.payload.pools.map((item) => {
        htmlSelectPools += `<sl-option value="${item.id}">${item.name}</sl-option>`
    })
    tariffs.payload.tariffs.map((item) => {
        htmlSelectTariffs += `<sl-option value="${item.id}">${item.name}</sl-option>`
    })

    poolSelector.innerHTML = htmlSelectPools;
    poolSelector.value = String(userData.payload.pool_id);
    tariffSelector.innerHTML = htmlSelectTariffs;
    tariffSelector.value = String(userData.payload.tariff_id);

    // вставка данных в switches
    const unlim = document.querySelector('.switch-update-unlim');
    const individualTariff = document.querySelector('.switch-update-individual-tariff');
    const selfBlock = document.querySelector('.switch-update-self-block');
    const disableAuth = document.querySelector('.switch-update-disable-auth');
    const disableCabinet = document.querySelector('.switch-update-disable-lk');
    const disableCabServices = document.querySelector('.switch-update-disable-lk-services');

    changeStateSwitch(userData.payload.unlimited, unlim);
    changeStateSwitch(userData.payload.individual_tariff, individualTariff);
    changeStateSwitch(userData.payload.self_blocked, selfBlock);
    changeStateSwitch(userData.payload.blocked, disableAuth);
    changeStateSwitch(userData.payload.disable_cabinet, disableCabinet);
    changeStateSwitch(userData.payload.disable_cabinet_tariffs, disableCabServices);

    // вставка информационных полей
    const userInfoContainer = document.querySelector('.user-information-container');

    let htmlInfoContainer = '';

    userData.payload.user_info.map((item) => {
        if (item.value.length > 0) {
            htmlInfoContainer += `<sl-input label="${item.key}" size="small" value="${item.value}" readonly>
			    <sl-icon name="info-circle-fill" slot="prefix"></sl-icon>
            </sl-input> <br>`
        }
    })
    userInfoContainer.innerHTML = htmlInfoContainer;

    // вставка полей статуса пользователя
    const userStatusContainer = document.querySelector('.user-status-container');

    let htmlStatusContainer = '';
    const connectStatus = userData.payload.status == 'online' ? ["в сети", "--sl-color-success-500"] : ["не в сети", "--sl-color-danger-500"]
    
    htmlStatusContainer += `<sl-input label="Состояние сессии" size="small" value="${connectStatus[0]}" style="background-color:${connectStatus[1]}" readonly>
		<sl-icon name="info-circle-fill" slot="prefix"></sl-icon>
    </sl-input> <br>`
    
    userStatusContainer.innerHTML = htmlStatusContainer;

    return true;
}

function changeStateSwitch(state, switchElement) {
    if (!state) {
        switchElement.removeAttribute('checked');
        return;
    } else {
        switchElement.setAttribute('checked', true);
    }
}

function getStateSwitch(switchElement) {
    if (switchElement) {
        return true;
    }
    return false;
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