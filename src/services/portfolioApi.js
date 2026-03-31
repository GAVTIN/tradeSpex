// ─── portfolioApi.js ───────────────────────────────────────────────────────────
// This is the "service layer" — the only file that knows about HTTP.
// In production this talks to a Node/Express backend via Axios.
// We use axios.create() to attach a base URL and auth headers once,
// then every function just calls the configured instance.
//
// Pattern:  Component → Redux Thunk → this file → real API (or mock)
//           Component never calls axios directly.

import axios from 'axios';
import { STOCK_DB } from '../data/mockData';

// ── Axios instance ─────────────────────────────────────────────────────────
// In a real app you'd set baseURL to your Node server, e.g. http://localhost:4000
// Interceptors on this instance attach the JWT on every request automatically.
const apiClient = axios.create({
  baseURL: '/api',   // proxied to Node in dev via vite.config
  timeout: 8000,
});

// ── Request interceptor ────────────────────────────────────────────────────
// Runs BEFORE every request.
// Reads the JWT from localStorage and injects it into the Authorization header.
// This is the standard pattern; the token itself is set at login.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tradespex_jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────────────
// Runs AFTER every response.
// 401 → token expired → force logout / refresh token flow
// 403 → user lacks permission (e.g. admin trying to mutate portfolio)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // In production: dispatch(logout()) or trigger token refresh
      console.warn('[API] Unauthorized — token may have expired');
    }
    if (error.response?.status === 403) {
      console.warn('[API] Forbidden — insufficient permissions');
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  MOCK IMPLEMENTATIONS
//  Each function simulates a real HTTP call with artificial delay.
//  Replace the body with a real axios call when the backend is ready.
//  e.g.  fetchPortfolio  →  return apiClient.get(`/portfolio/${clientId}`)
// ─────────────────────────────────────────────────────────────────────────────

/** GET /portfolio/:clientId  — returns the holdings array */
export const fetchPortfolio = async (clientId) => {
  // Simulate ~800ms network latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const data = STOCK_DB[clientId];
  if (!data) throw new Error(`Portfolio not found for client: ${clientId}`);

  // Deep clone to avoid mutating the source mock object
  return JSON.parse(JSON.stringify(data));
};

/** POST /portfolio/:clientId/stock  — adds a new position */
export const addStockApi = async (clientId, stock) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  // Real: return apiClient.post(`/portfolio/${clientId}/stock`, stock)
  return { ...stock, id: `${clientId}_${Date.now()}` };
};

/** PATCH /portfolio/:clientId/stock/:stockId  — updates an existing position */
export const updateStockApi = async (clientId, stockId, changes) => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  // Real: return apiClient.patch(`/portfolio/${clientId}/stock/${stockId}`, changes)
  return changes;
};

/** DELETE /portfolio/:clientId/stock/:stockId  — removes a position */
export const deleteStockApi = async (clientId, stockId) => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Real: return apiClient.delete(`/portfolio/${clientId}/stock/${stockId}`)
  return { success: true };
};
