function windowAsk(name, message) {
    const window = document.querySelector('.delete-folder-window');
    const text = document.querySelector('.delete-folder-window span');
    window.setAttribute('label', name);
    text.innerHTML = message;
    window.show();

    const noBtn = document.querySelector('.window-ask-delete-folder-no');
    const yesBtn = document.querySelector('.window-ask-delete-folder-yes');

    return new Promise((resolve) => {
        noBtn.addEventListener("click", () => {
            window.hide();
            resolve(false);
        })
        yesBtn.addEventListener("click", () => {
            window.hide();
            resolve(true);
        })
    })
    
}

export { windowAsk };