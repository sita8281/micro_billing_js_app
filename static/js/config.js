const apiHost = 'onnet.ru'
const apiPort = 80

const apiUrl = 'http://'+apiHost+':'+apiPort+'/api/manage'
const apiAuthUrl = apiUrl + '/auth/'
const apiFoldersUrl = apiUrl + '/folders'
const apiUsersUrl = apiUrl + '/users'

export { apiUrl, apiAuthUrl, apiFoldersUrl, apiUsersUrl, apiHost, apiPort };