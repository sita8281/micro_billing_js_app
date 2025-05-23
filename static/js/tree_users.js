import { httpClient as client } from "./api.js";
import { apiFoldersUrl } from "./config.js";
import { notifyError, notifyWarning, showLoading, hideLoading } from "./utils.js";

function getHtmlName(user) {
    let status = user.status == 'online' ? '▶' : '';
    let statusColor = user.status == 'online' ? '#0b7f00' : '#333';
    let name = `${status} ${user.name} <${user.login}>`;
    return `<label style="color: ${statusColor}; cursor: pointer;">${name}</label>`
}

async function fetchData() {
    try {
        const rootFolders = await client.getRoot();
        if (rootFolders.status != 200) {
            notifyError(`Не не удалось получить список папок: ${rootFolders.description}`);
        }
    } catch (error) {
        notifyError('Возникла ошибка при подключении к серверу');
    }
}

async function onlick(event, treeId, treeNode) {
    if (typeof treeNode.id == 'number') {
        const response = await client.getUser(treeNode.id)
        if (response.status != 200) {
            notifyWarning(`Не удалось получить данные пользователя: ${response.description}`);
            return;
        }
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        treeNode.name = getHtmlName(response.payload);
        treeObj.refresh();
        treeObj.selectNode(treeNode);
    }
}

async function updateSelectedUser() {
    const usersTree = $.fn.zTree.getZTreeObj("treeDemo");
    const selectedNodes = usersTree.getSelectedNodes();
    
    if (selectedNodes.length < 1) {
        return;
    }
    const nodeId = selectedNodes[0].id
    if (typeof nodeId == "string" && nodeId[0] == "f") {
        return;
    }
    await onlick(null, null, selectedNodes[0]);
    
}

async function onexpand(event, treeId, treeNode) {
    try {
        showLoading();
        await updateBranch(treeNode);
    } finally {
        hideLoading();
    }
}

async function updateBranch(treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    treeObj.removeChildNodes(treeNode);
    let result = await client.getFolder(prepareFolderId(treeNode.id))

    if (result.status != 200) {
        return;
    }
    const data = result.payload
    let folders = [];
    let users = [];
    for (let folder in data.folders) {
        folders.push({
                id: `f${data.folders[folder].id}`,
                name: data.folders[folder].name,
                isParent: true,
            }
        )
    }
    for (let user in data.users) {
        users.push({
                id: data.users[user].id,
                name: getHtmlName(data.users[user]),
                icon: '/gui_billing/static/img/user16.png'
            }
        )
        
    }
    treeObj.addNodes(treeNode, -1, folders)
    treeObj.addNodes(treeNode, -1, users)

}
function prepareFolderId(id) {
    if (id.includes('f')) {
        return id.slice(1);
    };
}

var setting = {
    data: {
        simpleData: {enable: true}
    },
    view: {
        expandSpeed: "",
        selectedMulti: false,
        nameIsHTML: true,
    },
    callback: {
        onClick: onlick,
        onExpand: onexpand,
    }
};
var zNodes =[
    {name:"ALL", id:"f2", isParent:true},
];

async function initTree() {
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    await fetchData()
}

export { initTree, updateBranch, updateSelectedUser };