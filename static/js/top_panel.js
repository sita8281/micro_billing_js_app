import { notifyError, notifyInfo, notifySuccess, notifyWarning } from "./utils.js";

function initTopPanelButtons() {
    const addUserBtn = document.getElementById("add-user-btn")
    const removeBtn = document.getElementById("delete-btn")
    const updateBtn = document.getElementById("update-btn")

    initFolder();
}


function initFolder() {
    const openWinAddFolder = document.getElementById("add-folder-btn")
    const closeWinAddFolder = document.querySelector(".close-folder-window")
    const actionButtonAddFolder = document.querySelector(".add-folder-action")
    const window = document.querySelector('.create-folder-window');
    const usersTree = $.fn.zTree.getZTreeObj("treeDemo");
    const alertNotSelectFolder = document.querySelector(".alert-folder-not-select")

    openWinAddFolder.addEventListener("click", () => {
        const selectedNodes = usersTree.getSelectedNodes();

        if (selectedNodes.length > 0) {
            const nodeId = selectedNodes[0].id
            if (typeof nodeId == "string" && nodeId[0] == "f") {
                console.log(selectedNodes[0]);  
                window.show();
            } else {
                notifyWarning("Выберите корневую папку");
            }
        } else {
            notifyWarning("Объект не выбран")
        }
        
        
        
        
    })

    closeWinAddFolder.addEventListener("click", () => {
        window.hide();
    })

    openWinAddFolder.addEventListener("click", () => {
        
    })


}

export { initTopPanelButtons };
