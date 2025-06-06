import { notifyError, notifyInfo, notifySuccess, notifyWarning, getSelectedFolderId, getSelectedUserId } from "./utils.js";
import { httpClient } from "./api.js";
import { deleteFolderWithServer } from "./folders/delete.js";
import { deleteUserWithServer } from "./users/delete.js";
import { createUserWithServer } from "./users/create.js";
import { updateUserWithServer } from "./users/update.js";
import { balanceUserWithServer } from "./users/balance.js"


function initTopPanelButtons() {
    initFolder();
    initDelete();
    initUser();
}

function initUser() {
    const addUserBtn = document.getElementById("add-user-btn");
    const updateBtn = document.getElementById("change-btn")
    const balanceBtn = document.getElementById("balance-btn")

    balanceBtn.addEventListener("click", async () => {
        const selectUser = getSelectedUserId();
        if (selectUser) {
            await balanceUserWithServer();
        } else {
            notifyWarning("Выберите пользователя")
        }
    });

    addUserBtn.addEventListener("click", async () => {
        const selectFolder = getSelectedFolderId();
        if (selectFolder) {
            await createUserWithServer();
        } else {
            notifyWarning("Выберите папку, в которой хотите создать пользователя.")
        }
    });
    
    updateBtn.addEventListener("click", async () => {
        const selectUser = getSelectedUserId();
        if (selectUser) {
            await updateUserWithServer();
        } else {
            notifyWarning("Выберите пользователя")
        }
    })
}

function initDelete() {
    const removeBtn = document.getElementById("delete-btn");
    removeBtn.addEventListener("click", async () => {
        const selUser = getSelectedUserId();
        const selFolder = getSelectedFolderId();
        if (selUser) {
            await deleteUserWithServer(selUser);
        } else if (selFolder) {
            await deleteFolderWithServer(selFolder);
        } else {
            notifyWarning("Объект не выбран")
        }
    })
}


function initFolder() {
    const openWinAddFolder = document.getElementById("add-folder-btn")
    const closeWinAddFolder = document.querySelector(".close-folder-window")
    const actionButtonAddFolder = document.querySelector(".add-folder-action")
    const window = document.querySelector('.create-folder-window');

    openWinAddFolder.addEventListener("click", () => {
        if (getSelectedFolderId()) {
            window.show();
        } else { 
            notifyWarning("Для создания новой папки, выберите корневую для неё")
        }
    })

    closeWinAddFolder.addEventListener("click", () => {
        window.hide();
    })

    openWinAddFolder.addEventListener("click", () => {
        
    })
    actionButtonAddFolder.addEventListener("click", async () => {
        const nameFolder = document.querySelector('.add-folder-name').value;
        const parentId = getSelectedFolderId();
        console.log(nameFolder);
        
        await createFolderWithServer(parentId, nameFolder);
    })
}

async function createFolderWithServer(parent, name) {
    const window = document.querySelector('.create-folder-window');
    const response = await httpClient.createFolder(name, parent);
    if (response.status == 201) {
        notifySuccess(response.description);
        window.hide();
    }
    notifyWarning(response.description);
    
}

export { initTopPanelButtons };
