import { apiAuthUrl } from "./config.js";
import { notifyError } from "./utils.js";


async function initAuth() {
    const token = getAuthToken()
    if (!token) {
        showAuthForm();
        return;
    }

    if (!await verifyToken(token)) {
        showAuthForm();
        return;
    }
    return true;
}


function showAuthForm() {
    let authForm = document.getElementsByClassName('auth-background')[0]
    let authBtn = document.getElementsByClassName('auth-button')[0]
    authForm.style.display = 'block';
    authBtn.addEventListener('click', () => {
        const login = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        checkAuth(login, password);

    })
    authForm.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const login = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            checkAuth(login, password);
        }
    })
}

function checkAuth(login, password) {
    fetch(apiAuthUrl, {headers: {'Authorization': buildAuthToken(login, password)}})
    .then(response => {

        switch (response.status) {
            case 401:
                alert('Неверный логи или пароль');
                break;
            case 403:
                alert('Доступ запрещён');
                break;
            case 200:
                setAuthToken(login, password);
                window.location.reload();
        }
    })
}

async function verifyToken(token) {
    try {
        let response = await fetch(apiAuthUrl, {headers: {'Authorization': token}})
        console.log(response);
        
        if (response.status == 200) {
            return true;
        }
    } catch {
        notifyError("Неудалось авторизоваться на сервере, из за ошибки соединения")
        throw (err);
    }
    
}

function setAuthToken(login, password) {
    localStorage.setItem('auth_token', buildAuthToken(login, password))
}

function buildAuthToken(login, password) {
    const encodedToken = btoa(`${login}:${password}`)
    return `Basic ${encodedToken}`
}

function getAuthToken() {
    return localStorage.getItem('auth_token')
}

export { showAuthForm, checkAuth, initAuth, getAuthToken };