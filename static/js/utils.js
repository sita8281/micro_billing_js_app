function alertHandlerResponses(response) {
    
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
    return alert.toast();
}

function notifyWarning(message) {
    notify(message, 'warning', 'exclamation-triangle', 3000)
}

function notifyError(message) {
    notify(message, 'danger', 'exclamation-triangle', 3000)
}

function notifySuccess(message) {
    notify(message, 'success', 'check2-circle', 3000)
}

function notifyInfo(message) {
    notify(message, 'primary', 'info-circle', 3000)
}


export { notify, notifyError, notifyInfo, notifySuccess, notifyWarning };