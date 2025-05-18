function windowCreateUser() {
    const window = document.querySelector('.create-user-window');
    window.show();
    const createBtn = document.querySelector('.window-create-user');
    const closeBtn = document.querySelector('.close-user-window');

    return new Promise((resolve) => {
        closeBtn.addEventListener("click", () => {
            window.hide();
            resolve(false);
        })
        createBtn.addEventListener("click", () => {
            resolve(true);
        })
    })
    
}

export { windowCreateUser };