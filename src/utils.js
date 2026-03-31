// ─── utils.js ──────────────────────────────────────────────────────────────────
// Pure utility functions. No imports, no side effects.
// Keeping these here means the same logic is used everywhere — no duplication.

/** Format a number as Indian Rupee string: ₹1,23,456.78 */
export const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(Math.abs(n));

export const fc = (n) => `₹${formatINR(n)}`;

/** P&L in rupees for a single position */
export const calcPnL = (stock) => (stock.ltp - stock.avg) * stock.qty;

/** P&L as percentage of cost basis */
export const calcPnLPct = (stock) =>
  (((stock.ltp - stock.avg) / stock.avg) * 100).toFixed(2);

/** Aggregate stats across all positions */
export const calcPortfolioStats = (stocks) => {
  const invested     = stocks.reduce((acc, s) => acc + s.avg * s.qty, 0);
  const currentValue = stocks.reduce((acc, s) => acc + s.ltp * s.qty, 0);
  const totalPnL     = currentValue - invested;
  const pnlPct       = invested > 0 ? ((totalPnL / invested) * 100).toFixed(2) : '0.00';
  return { invested, currentValue, totalPnL, pnlPct };
};

/** Initials avatar background — deterministic color from ID string */
export const avatarColor = (id = '') => {
  const colors = ['#2563eb', '#059669', '#7c3aed', '#dc2626', '#d97706', '#0891b2'];
  const idx = id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
};
