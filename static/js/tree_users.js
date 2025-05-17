import { httpClient as client } from "./api.js";
import { apiFoldersUrl } from "./config.js";


async function fetchData() {
    try {
        const rootFolders = await client.getRoot();
        console.log(rootFolders);
    } catch (error) {
        console.error('API Error:', error);
    }
}

function onlick(event, treeId, treeNode) {
    console.log(treeNode);
}
function onexpand(event, treeId, treeNode) {
    console.log(treeNode);
    
    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
    let result = client.getFolder(prepareFolderId(treeNode.id))
    treeObj.removeChildNodes(treeNode);
    result.then(result => {
        const data = result.payload
        let folders = [];
        let users = [];
        for (let folder in data.folders) {
            console.log(data.folders[folder])
            folders.push({
                    id: `f${data.folders[folder].id}`,
                    name: data.folders[folder].name,
                    isParent: true,
                }
            )
        }
        for (let user in data.users) {
            console.log(data.users[user])
            let status = data.users[user].status == 'online' ? 'online16.png' : 'user16.png'
            let name = `${data.users[user].name} <${data.users[user].login}>`
            users.push({
                    id: data.users[user].id,
                    name: name,
                    icon: '/gui_billing/static/img/' + status
                }
            )
            
        }
        treeObj.addNodes(treeNode, -1, folders)
        treeObj.addNodes(treeNode, -1, users)
    })
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

export { initTree };