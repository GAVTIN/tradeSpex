// ─── portfolioSlice.js ─────────────────────────────────────────────────────────
//
// This slice manages:
//   1. The portfolio cache  (localStorage → prevents redundant API calls)
//   2. Loading / error state  (for the loading spinner)
//   3. Active client selection  (which profile is currently open)
//   4. CRUD operations on stocks  (add / edit / delete positions)
//
// KEY PATTERN — Cache-First data loading:
//   When admin visits a client profile:
//     a) Check Redux state (in-memory) first
//     b) If not in memory, check localStorage cache
//     c) If not cached, call the real API
//   This means the API is only called ONCE per client per browser session.
//
// State shape:
// {
//   cache: { [clientId]: StockItem[] },  ← persisted to localStorage
//   loading: boolean,
//   loadingClientId: string | null,      ← which client is currently loading
//   error: string | null,
//   activeClientId: string | null,       ← highlighted in sidebar
// }

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPortfolio, addStockApi, updateStockApi, deleteStockApi } from '../../services/portfolioApi';

// ── Constants ──────────────────────────────────────────────────────────────
const LS_CACHE_KEY = 'tradespex_portfolio_cache';

// ── localStorage helpers ───────────────────────────────────────────────────
const loadCache = () => {
  try {
    const raw = localStorage.getItem(LS_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveCache = (cache) => {
  try {
    localStorage.setItem(LS_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn('localStorage write failed:', e);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  ASYNC THUNKS
//  createAsyncThunk generates three action types automatically:
//    pending   → request started
//    fulfilled → request succeeded  (payload = return value)
//    rejected  → request failed     (payload = error message)
//
//  We handle these in extraReducers below.
// ─────────────────────────────────────────────────────────────────────────────

// ── loadPortfolio ─────────────────────────────────────────────────────────
// Cache-first fetch.
// The thunk checks in-memory cache before hitting the API.
// If the data is already cached, it returns early with no API call.
export const loadPortfolio = createAsyncThunk(
  'portfolio/load',
  async (clientId, { getState, rejectWithValue }) => {
    // Step 1: check in-memory Redux cache
    const cached = getState().portfolio.cache[clientId];
    if (cached) {
      // Return the sentinel so the reducer knows it was a cache hit
      return { clientId, stocks: cached, fromCache: true };
    }

    // Step 2: not in memory → call API (portfolioApi.js)
    try {
      const stocks = await fetchPortfolio(clientId);
      return { clientId, stocks, fromCache: false };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── addStock ──────────────────────────────────────────────────────────────
export const addStock = createAsyncThunk(
  'portfolio/addStock',
  async ({ clientId, stockData }, { rejectWithValue }) => {
    try {
      const saved = await addStockApi(clientId, stockData);
      return { clientId, stock: saved };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── updateStock ───────────────────────────────────────────────────────────
export const updateStock = createAsyncThunk(
  'portfolio/updateStock',
  async ({ clientId, stockId, changes }, { rejectWithValue }) => {
    try {
      await updateStockApi(clientId, stockId, changes);
      return { clientId, stockId, changes };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ── deleteStock ───────────────────────────────────────────────────────────
export const deleteStock = createAsyncThunk(
  'portfolio/deleteStock',
  async ({ clientId, stockId }, { rejectWithValue }) => {
    try {
      await deleteStockApi(clientId, stockId);
      return { clientId, stockId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
//  SLICE
// ─────────────────────────────────────────────────────────────────────────────
const portfolioSlice = createSlice({
  name: 'portfolio',

  initialState: {
    cache: loadCache(),           // pre-populate from localStorage on boot
    loading: false,
    loadingClientId: null,
    error: null,
    activeClientId: null,
  },

  // ── Synchronous reducers ────────────────────────────────────────────────
  reducers: {
    setActiveClient(state, action) {
      state.activeClientId = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    // Hard-clear the entire cache (useful for logout / stale-cache scenarios)
    clearCache(state) {
      state.cache = {};
      localStorage.removeItem(LS_CACHE_KEY);
    },
  },

  // ── Async reducer handlers ──────────────────────────────────────────────
  // extraReducers handles the auto-generated pending/fulfilled/rejected actions
  // from the createAsyncThunk calls above.
  extraReducers: (builder) => {

    // ── loadPortfolio ──────────────────────────────────────────────────────
    builder
      .addCase(loadPortfolio.pending, (state, action) => {
        // action.meta.arg is the clientId passed to the thunk
        const clientId = action.meta.arg;
        // Only show loading spinner if we're going to the network
        if (!state.cache[clientId]) {
          state.loading = true;
          state.loadingClientId = clientId;
        }
        state.error = null;
      })
      .addCase(loadPortfolio.fulfilled, (state, action) => {
        const { clientId, stocks, fromCache } = action.payload;
        state.loading = false;
        state.loadingClientId = null;

        if (!fromCache) {
          // New data from API → write to Redux state AND localStorage
          state.cache[clientId] = stocks;
          saveCache({ ...state.cache });   // persist the entire cache
        }
        // fromCache === true means data was already in state, nothing to update
      })
      .addCase(loadPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.loadingClientId = null;
        state.error = action.payload ?? 'Failed to load portfolio';
      });

    // ── addStock ───────────────────────────────────────────────────────────
    builder
      .addCase(addStock.fulfilled, (state, action) => {
        const { clientId, stock } = action.payload;
        state.cache[clientId] = [...(state.cache[clientId] ?? []), stock];
        saveCache({ ...state.cache });
      });

    // ── updateStock ────────────────────────────────────────────────────────
    builder
      .addCase(updateStock.fulfilled, (state, action) => {
        const { clientId, stockId, changes } = action.payload;
        state.cache[clientId] = state.cache[clientId].map((s) =>
          s.id === stockId ? { ...s, ...changes } : s
        );
        saveCache({ ...state.cache });
      });

    // ── deleteStock ────────────────────────────────────────────────────────
    builder
      .addCase(deleteStock.fulfilled, (state, action) => {
        const { clientId, stockId } = action.payload;
        state.cache[clientId] = state.cache[clientId].filter((s) => s.id !== stockId);
        saveCache({ ...state.cache });
      });
  },
});

// ── Exports ────────────────────────────────────────────────────────────────
export const { setActiveClient, clearError, clearCache } = portfolioSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────────────
// Memoized selectors should use createSelector (reselect) for expensive
// derived data. For simplicity we use plain functions here.
export const selectPortfolioCache       = (state) => state.portfolio.cache;
export const selectIsLoading            = (state) => state.portfolio.loading;
export const selectLoadingClientId      = (state) => state.portfolio.loadingClientId;
export const selectActiveClientId       = (state) => state.portfolio.activeClientId;
export const selectStocksForClient      = (clientId) => (state) => state.portfolio.cache[clientId] ?? [];
export const selectPortfolioError       = (state) => state.portfolio.error;

export default portfolioSlice.reducer;
