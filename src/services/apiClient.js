const DEFAULT_API_BASE_URL = '';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

function buildUrl(base, path, params) {
  const root = base ? base.replace(/\/$/, '') : '';
  const url = root + path;
  if (!params) return url;
  const search = new URLSearchParams(params).toString();
  return search ? `${url}?${search}` : url;
}

export function createApiClient(baseUrl = DEFAULT_API_BASE_URL) {
  const b = baseUrl || '';

  const doFetch = async (path, token, options = {}) => {
    const url = buildUrl(b, path, options.params);
    const headers = Object.assign({}, options.headers || {});
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, {
      method: options.method || 'GET',
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ApiError(text || `HTTP ${res.status}`, res.status);
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return res.json();
    }
    return null;
  };

  return {
    // Fetch the latest reading payload
    fetchCurrentReading: async (token) => {
      return doFetch('/readings/current', token).catch(() => null);
    },

    // Fetch short alert messages (for banner)
    fetchAlertMessages: async (token) => {
      return doFetch('/readings/alerts', token).catch(() => ({ alerts: [] }));
    },

    // Fetch historical alert entries
    fetchAlertHistory: async (token, opts = {}) => {
      const params = {};
      if (opts.limit) params.limit = String(opts.limit);
      return doFetch('/readings/alerts/history', token, { params }).catch(() => ({ alerts: [] }));
    },

    // Expose raw fetch for other callers if needed
    rawFetch: doFetch,
  };
}

export { DEFAULT_API_BASE_URL, ApiError };
