// ─── store.js ──────────────────────────────────────────────────────────────────
//
// configureStore() is Redux Toolkit's enhanced version of createStore().
// It automatically:
//   - Adds redux-thunk middleware (so async thunks work out of the box)
//   - Enables Redux DevTools Extension in development
//   - Enables immer for "mutatable" reducers in slices
//
// To use Redux DevTools: install the Chrome/Firefox extension and open the panel.
// You'll see every dispatched action and the exact state change it caused.
// This is invaluable for debugging and L3 support.

import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import portfolioReducer from '../features/portfolio/portfolioSlice';

const store = configureStore({
  reducer: {
    // Key names here become the top-level keys in state:
    //   state.auth.user
    //   state.portfolio.cache
    auth:      authReducer,
    portfolio: portfolioReducer,
  },

  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(myCustomMiddleware),
  // ↑ Uncomment to add custom middleware, e.g. a WebSocket price-tick listener
});

export default store;
