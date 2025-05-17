import { httpClient as client } from './api.js';
import { showAuthForm, checkAuth, initAuth, getAuthToken } from './auth.js';
import { initTree } from './tree_users.js';
import { apiHost, apiPort, apiUrl } from './config.js';
import { initTopPanelButtons } from './top_panel.js';

document.addEventListener("DOMContentLoaded", async function() {
    const authSuccess = await initAuth();
    if (authSuccess) {
        await initApp();
    }
  
});

async function initApp() {
    console.log('Init app...');
    client.setAuthentication(apiHost, apiPort, '1', '1')
    client.setToken(getAuthToken());
    client.setUrl(apiUrl);
    await initTree();
    initTopPanelButtons();
}

//getFolder();

