// ─── authSlice.js ──────────────────────────────────────────────────────────────
// This slice manages the authenticated user.
//
// Redux Toolkit's createSlice() bundles:
//   - the initial state
//   - the reducer (state mutations via immer — you can "mutate" state directly)
//   - the action creators (auto-generated from the reducers object)
//
// Auth state shape:
//   user: null | { id, name, initials, role: 'admin'|'client', clientIds?, email?, risk? }

import { createSlice } from '@reduxjs/toolkit';

// ── Constants ──────────────────────────────────────────────────────────────
const LS_USER_KEY = 'tradespex_user';   // localStorage key for session persistence

// ── Helpers ────────────────────────────────────────────────────────────────
// Rehydrate user from localStorage so a page refresh doesn't log you out.
const loadUserFromStorage = () => {
  try {
    const raw = localStorage.getItem(LS_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ── Slice ──────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: loadUserFromStorage(),   // rehydrate on app boot
  },

  reducers: {
    // ── login ──────────────────────────────────────────────────────────────
    // Payload: the full user object (from mock data or real API response)
    // In production: after a real /auth/login call, store the JWT here too.
    login(state, action) {
      state.user = action.payload;
      localStorage.setItem(LS_USER_KEY, JSON.stringify(action.payload));

      // In production: also store the JWT
      // localStorage.setItem('tradespex_jwt', action.payload.token);
      // Note: NEVER store JWTs in localStorage for high-security apps.
      // For BFSI: use HttpOnly cookies so JavaScript can't touch the token.
    },

    // ── logout ─────────────────────────────────────────────────────────────
    logout(state) {
      state.user = null;
      localStorage.removeItem(LS_USER_KEY);
      localStorage.removeItem('tradespex_jwt');
      // The portfolio cache in localStorage is intentionally kept across logout
      // so the next admin session benefits from it. Clear it if you need strict isolation.
    },
  },
});

// ── Exports ────────────────────────────────────────────────────────────────
// Action creators  →  dispatch(login(userObj))  /  dispatch(logout())
export const { login, logout } = authSlice.actions;

// Selectors — co-located here so components don't hardcode state paths
export const selectUser     = (state) => state.auth.user;
export const selectIsAdmin  = (state) => state.auth.user?.role === 'admin';
export const selectIsClient = (state) => state.auth.user?.role === 'client';

export default authSlice.reducer;
