import { httpClient } from "../api.js";
import { notifyError, getSelectedUserId, formatTimeDiff, showLoading, hideLoading } from "../utils.js";


const window = document.querySelector('.update-user-window');


async function windowUpdateUser() {
    try {
        showLoading();
        if (!await updateData()) {
            notifyError("Не удалось получить данные пользователя с сервера")
            return;
        }

        window.show();
    } finally {
        hideLoading();
    }
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
    const balanceBlock = userData.payload.balance_blocked == true ? '<sl-tag variant="danger">финансовая блокировка</sl-tag>' : false
    const authDisable = userData.payload.blocked == true ? '<sl-tag variant="danger">авторизация запрещена</sl-tag>' : false
    const selfBlocked = userData.payload.self_blocked == true ? '<sl-tag variant="warning">добровольная блокировка</sl-tag>' : false
    const connectStatus = userData.payload.status == 'online' ? '<sl-tag variant="success">в сети</sl-tag>' : '<sl-tag variant="neutral">не в сети</sl-tag>'
    const downloadBytes = `<sl-format-bytes value="${userData.payload.download_bytes}"></sl-format-bytes>`;
    const uploadBytes = `<sl-format-bytes value="${userData.payload.upload_bytes}"></sl-format-bytes>`;
    const startSessionDate = `<sl-format-date date="${userData.payload.start_session_at}" lang="ru" hour="numeric" minute="numeric" year="numeric" month="numeric" day="numeric"></sl-format-date>`
    const dutySession = formatTimeDiff(userData.payload.start_session_at);
    const nasIp = userData.payload.nas_ip
    const callerId = userData.payload.caller_address
    const userIp = userData.payload.ip

    if (!balanceBlock && !authDisable && !selfBlocked) {
        htmlStatusContainer += getHtmlStatusLine("Статус пользователя", '<sl-tag variant="primary">активен</sl-tag>');
    } else {
        let htmlStatus = '';
        if (balanceBlock) {
            htmlStatus += balanceBlock + ' ';
        }
        if (authDisable) {
            htmlStatus += authDisable + ' ';
        }
        if (selfBlocked) {
            htmlStatus += selfBlocked + ' ';
        }

        htmlStatusContainer += getHtmlStatusLine("Статус пользователя", htmlStatus);
    }
    

    htmlStatusContainer += getHtmlStatusLine("Состояние сессии", connectStatus);
    if (userData.payload.status == 'online') {
        htmlStatusContainer += getHtmlStatusLine("Скачано", downloadBytes);
        htmlStatusContainer += getHtmlStatusLine("Отдано", uploadBytes);
        htmlStatusContainer += getHtmlStatusLine("Дата начала сессии", startSessionDate);
        htmlStatusContainer += getHtmlStatusLine("Продолжительность сессии", dutySession);
        htmlStatusContainer += getHtmlStatusLine("NAS IP", nasIp);
        htmlStatusContainer += getHtmlStatusLine("IP источника", callerId);
        htmlStatusContainer += getHtmlStatusLine("IP пользователя", userIp);
    }

    
    userStatusContainer.innerHTML = htmlStatusContainer;

    return true;
}

function getHtmlStatusLine(label, text) {
    return `<sl-card class="card-header" style="--padding: 5px;">
        <div slot="header">
            ${label}
        </div>
        ${text}
    </sl-card> <br>`
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
    if (switchElement.hasAttribute('checked')) {
        return true;
    }
    return false;
}

function windowUserData() {
    return {
        name: document.querySelector('.input-update-name').value,
        login: document.querySelector('.input-update-login').value,
        password: document.querySelector('.input-update-password').value,
        tariff_sum: Number(document.querySelector('.input-update-tariff-sum').value),
        tariff_upload: Number(document.querySelector('.input-update-tariff-upload').value),
        tariff_download: Number(document.querySelector('.input-update-tariff-download').value),
        pool_id: Number(document.querySelector('.select-update-pool').value),
        tariff_id: Number(document.querySelector('.select-update-tariff').value),
        unlimited: getStateSwitch(document.querySelector('.switch-update-unlim')),
        individual_tariff: getStateSwitch(document.querySelector('.switch-update-individual-tariff')),
        self_blocked: getStateSwitch(document.querySelector('.switch-update-self-block')),
        blocked: getStateSwitch(document.querySelector('.switch-update-disable-auth')),
        disable_cabinet: getStateSwitch(document.querySelector('.switch-update-disable-lk')),
        disable_cabinet_tariffs: getStateSwitch(document.querySelector('.switch-update-disable-lk-services'))
    }
}

function windowHide() {
    window.hide();
}

function windowShow() {
    window.show();
}

export { windowUpdateUser, windowUserData, windowHide, windowShow, windowWait };