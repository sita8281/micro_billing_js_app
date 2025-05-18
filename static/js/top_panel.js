import { notifyError, notifyInfo, notifySuccess, notifyWarning, getSelectedFolderId, getSelectedUserId } from "./utils.js";
import { httpClient } from "./api.js";
import { deleteFolderWithServer } from "./folders/delete.js";
import { deleteUserWithServer } from "./users/delete.js";
import { windowCreateUser } from "./users/delete.js"

function initTopPanelButtons() {
    const updateBtn = document.getElementById("update-btn")

    initFolder();
    initDelete();
}

function initUser() {
    const addUserBtn = document.getElementById("add-user-btn");
    addUserBtn.addEventListener("click", async () => {
        const selectFolder = getSelectedFolderId();
        if (selectFolder) {
            await windowCreateUser();
        } else {
            notifyWarning("Выберите папку, в которой хотите создать пользователя.")
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
