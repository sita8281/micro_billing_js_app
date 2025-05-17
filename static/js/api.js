import { notifyError, notifyWarning } from "./utils.js";


class HttpClient {
  constructor() {
    this.host = null;
    this.port = null;
    this.login = null;
    this.password = null;
    this.timeout = 10000;
    this.baseUrl = '';
    this.headers = {
      'Accept-Encoding': 'identity',
      'Content-Type': 'application/json',
    };
    this.authToken = null;
  }

  setAuthentication(host, port, login, password) {
    this.host = host;
    this.port = port;
    this.login = login;
    this.password = password;
    this.baseUrl = `http://${this.host}:${this.port}/api/manage`;
    this.authToken = btoa(`${this.login}:${this.password}`);
    this.headers['Authorization'] = `Basic ${this.authToken}`;
  }

  setToken(token) {
    this.headers['Authorization'] = token;
  }

  setUrl(url) {
    this.baseUrl = url;
  }

  async _request(method, url, options = {}) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const config = {
        method,
        headers: this.headers,
        signal: controller.signal,
        ...options
      };

      // Add body for POST/PUT requests if not already provided
      if (['POST', 'PUT'].includes(method) && !config.body && options.json) {
        config.body = JSON.stringify(options.json);
      }

      const response = await fetch(`${this.baseUrl}${url}`, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await this._parseResponse(response);
        return errorData;
      }

      return await this._parseResponse(response);
    } catch (error) {
      if (error.name === 'AbortError') {
        
        notifyWarning("Превышено время ожидания ответа от сервера")
        throw {
          status: 408,
          detail: 'Timeout request',
          description: 'Превышено время ожидания ответа от сервера'
        };
      }
      
      // If it's our own error object, rethrow it
      if (error.status) {
        notifyError("Неудалось установить соединение с сервером");
        throw error;
      }
      
      notifyError("Неудалось установить соединение с сервером");
      throw {
        status: 600,
        detail: error.message,
        description: 'Ошибка соединения',
        payload: {}
      };
    }
  }

  async _parseResponse(response) {
    try {
      const text = await response.text();
      return text ? JSON.parse(text) : {};
    } catch (e) {
      return {
        status: 600,
        detail: 'Invalid response format',
        description: 'Server returned non-JSON response',
        payload: await response.text()
      };
    }
  }

  async _get(url, params = {}) {
    const query = new URLSearchParams(params).toString();
    const fullUrl = query ? `${url}?${query}` : url;
    return this._request('GET', fullUrl);
  }

  async _post(url, json = {}) {
    return this._request('POST', url, { json });
  }

  async _put(url, json = {}) {
    return this._request('PUT', url, { json });
  }

  async _delete(url, json = {}) {
    return this._request('DELETE', url, { json });
  }

  // Authentication
  async auth() {
    const oldTimeout = this.timeout;
    this.timeout = 5000;
    try {
      const response = await this._get('/auth');
      return response;
    } finally {
      this.timeout = oldTimeout;
    }
  }

  // Folders
  async getRoot() {
    return this._get('/folders/1');
  }

  async getFolder(folderId) {
    return this._get(`/folders/${folderId}`);
  }

  async createFolder(name, parentId) {
    return this._post('/folders/', { name, parent_id: parentId });
  }

  async updateFolder(folderId, { name, parentId }) {
    return this._put(`/folders/${folderId}`, { name, parent_id: parentId });
  }

  async deleteFolder(folderId) {
    return this._delete(`/folders/${folderId}`);
  }

  async addTariffFolder(folderId, tariffId) {
    return this._post(`/folders/${folderId}/tariff`, { tariff_id: tariffId });
  }

  async removeTariffFolder(folderId, tariffViewId) {
    return this._delete(`/folders/${folderId}/tariff`, { tariff_id: tariffViewId });
  }

  // Users
  async createUser({ name, poolId, folderId, password, login, role }) {
    return this._post('/users', {
      name,
      pool_id: poolId,
      folder_id: folderId,
      password,
      login,
      role
    });
  }

  async updateUser(userId, data) {
    return this._put(`/users/${userId}`, data);
  }

  async getUser(userId) {
    return this._get(`/users/${userId}`);
  }

  async getFreeUserIpAddress(userId) {
    return this._get(`/users/${userId}/free_ip_address`);
  }

  async deleteUser(userId) {
    return this._delete(`/users/${userId}`);
  }

  async updateAdvancedInfoUser(fieldId, data) {
    return this._put(`/users_info/${fieldId}`, data);
  }

  // IP Pools
  async getIpPools() {
    return this._get('/ip_pools');
  }

  async createIpPool(name, start, end, isDefault = false) {
    return this._post('/ip_pools', {
      name,
      start,
      end,
      default: isDefault
    });
  }

  async deleteIpPool(ipPoolId) {
    return this._delete(`/ip_pools/${ipPoolId}`);
  }

  // NAS Servers
  async createNasServer({ name, login, password, ip, port, vendor }) {
    return this._post('/nas_servers', {
      name,
      login,
      password,
      ip,
      port,
      vendor
    });
  }

  async updateNasServer(nasId, { name, login, password, ip, port, vendor }) {
    return this._put(`/nas_servers/${nasId}`, {
      name,
      login,
      password,
      ip,
      port,
      vendor
    });
  }

  async getNasServers() {
    return this._get('/nas_servers');
  }

  async getNasServer(nasId) {
    return this._get(`/nas_servers/${nasId}`);
  }

  async deleteNasServer(nasServerId) {
    return this._delete(`/nas_servers/${nasServerId}`);
  }

  // Tariffs
  async getTariff(tariffId) {
    return this._get(`/tariffs/${tariffId}`);
  }

  async getTariffs() {
    return this._get('/tariffs');
  }

  async deleteTariff(tariffId) {
    return this._delete(`/tariffs/${tariffId}`);
  }

  async updateTariff(tariffId, { name, downloadMbps, uploadMbps, price, isDefault }) {
    return this._put(`/tariffs/${tariffId}`, {
      name,
      download_mbps: downloadMbps,
      upload_mbps: uploadMbps,
      price,
      default: isDefault
    });
  }

  async createTariff({ name, download, upload, price, isDefault = false }) {
    return this._post('/tariffs', {
      name,
      download_mbps: download,
      upload_mbps: upload,
      price,
      default: isDefault
    });
  }

  // Sessions and payments
  async getUserSessions(userId, startDate, endDate) {
    return this._get(`/radius_sessions/${userId}`, {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });
  }

  async getUserPaymentHistory(userId, startDate, endDate) {
    return this._get(`/payments_history/${userId}`, {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });
  }

  async getUserPaymentActs(userId, startDate, endDate) {
    return this._get(`/payment_acts/${userId}`, {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    });
  }

  // Audit logs
  async getAuditLogs(startDate, endDate, sortBy = null) {
    const params = {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    };
    if (sortBy) params.sort_by = sortBy;
    return this._get('/audit', params);
  }

  // Balance operations
  async userBalanceDeposit(userId, depositSum, comment = null) {
    return this._post('/balance/deposit', {
      user_id: userId,
      amount: depositSum,
      comment
    });
  }

  async userBalanceTake(userId, takeSum, comment = null) {
    return this._post('/balance/take', {
      user_id: userId,
      amount: takeSum,
      comment
    });
  }

  // Settings
  async getSettingsValues() {
    return this._get('/sys_values');
  }

  async getSettingsValue(valueId) {
    return this._get(`/sys_values/${valueId}`);
  }

  async createSettingsValue(key, value, comment) {
    return this._post('/sys_values', {
      value,
      comment,
      key
    });
  }

  async updateSettingsValue(valueId, data) {
    return this._put(`/sys_values/${valueId}`, data);
  }

  async deleteSettingsValue(valueId) {
    return this._delete(`/sys_values/${valueId}`);
  }

  // User actions
  async disconnectUser(userId) {
    return this._post(`/users/${userId}/disconnect`);
  }

  async finalizePromisePayUser(userId, takeSum) {
    return this._post(`/users/${userId}/finalize_promise_pay`, {
      take_sum: takeSum
    });
  }
}

// Singleton implementation
const httpClient = new HttpClient();
export { httpClient };