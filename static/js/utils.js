function showLoading() {
    document.querySelector('.loading-pass').style.display = 'flex';
}

function hideLoading() {
    document.querySelector('.loading-pass').style.display = 'none';
}

function escapeHtml(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

function notify(message, variant, icon, duration) {
    const alert = Object.assign(document.createElement('sl-alert'), {
        variant,
        closable: true,
        duration: duration,
        innerHTML: `
        <sl-icon name="${icon}" slot="icon"></sl-icon>
        ${escapeHtml(message)}
        `
    });

    document.body.append(alert);
    try {
        alert.toast();
    } catch {
        alert.toast();
    }
    
}

function notifyWarning(message) {
    notify(message, 'warning', 'exclamation-triangle', 4000)
}

function notifyError(message) {
    notify(message, 'danger', 'exclamation-octagon', 4000)
}

function notifySuccess(message) {
    notify(message, 'success', 'check2-circle', 3000)
}

function notifyInfo(message) {
    notify(message, 'primary', 'info-circle', 4000)
}


function getSelectedFolderId() {
    const usersTree = $.fn.zTree.getZTreeObj("treeDemo");
    const selectedNodes = usersTree.getSelectedNodes();
    if (selectedNodes.length < 1) {
        return false;
    }
    const nodeId = selectedNodes[0].id
    if (typeof nodeId == "string" && nodeId[0] == "f") {
        return Number(nodeId.slice(1));
    }
}

function getSelectedUserId() {
    const usersTree = $.fn.zTree.getZTreeObj("treeDemo");
    const selectedNodes = usersTree.getSelectedNodes();
    if (selectedNodes.length < 1) {
        return false;
    }
    const nodeId = selectedNodes[0].id
    if (typeof nodeId == "string" && nodeId[0] == "f") {
        return false;
    }
    return Number(nodeId);

}

function getNodeTreeview() {
    const usersTree = $.fn.zTree.getZTreeObj("treeDemo");
    const selectedNodes = usersTree.getSelectedNodes();
    if (selectedNodes.length < 1) {
        return false;
    };
    return selectedNodes[0]
}


function formatTimeDiff(startISO) {
  const start = new Date(startISO);
  const end = new Date();
  let diff = end - start;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  return `${days} дн. ${hours} ч. ${minutes} мин.`;
}

export { notify,
    notifyError,
    notifyInfo,
    notifySuccess,
    notifyWarning,
    getSelectedFolderId,
    getSelectedUserId, 
    getNodeTreeview,
    formatTimeDiff,
    showLoading,
    hideLoading
};