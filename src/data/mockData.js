// ─── mockData.js ───────────────────────────────────────────────────────────────
// In a real app this data lives in the database.
// We mock it here so the app works end-to-end without a backend.
// The Axios service layer (portfolioApi.js) wraps these with simulated latency.

// ── Admin users ──────────────────────────────────────────────────────────────
export const ADMINS = [
  {
    id: 'adm1',
    name: 'Rajesh Kumar',
    initials: 'RK',
    role: 'admin',
    clientIds: ['cli1', 'cli2', 'cli3', 'cli4', 'cli5'], // clients assigned to this RM
  },
  {
    id: 'adm2',
    name: 'Priya Sharma',
    initials: 'PS',
    role: 'admin',
    clientIds: ['cli3', 'cli6', 'cli7'],
  },
];

// ── Client users ──────────────────────────────────────────────────────────────
export const CLIENTS = {
  cli1: { id: 'cli1', name: 'Arjun Mehta',     initials: 'AM', email: 'arjun@ts.com',   risk: 'Aggressive',   role: 'client' },
  cli2: { id: 'cli2', name: 'Sunita Patel',    initials: 'SP', email: 'sunita@ts.com',  risk: 'Conservative', role: 'client' },
  cli3: { id: 'cli3', name: 'Vikram Singh',    initials: 'VS', email: 'vikram@ts.com',  risk: 'Moderate',     role: 'client' },
  cli4: { id: 'cli4', name: 'Deepa Nair',      initials: 'DN', email: 'deepa@ts.com',   risk: 'Moderate',     role: 'client' },
  cli5: { id: 'cli5', name: 'Rohan Joshi',     initials: 'RJ', email: 'rohan@ts.com',   risk: 'Aggressive',   role: 'client' },
  cli6: { id: 'cli6', name: 'Anita Gupta',     initials: 'AG', email: 'anita@ts.com',   risk: 'Conservative', role: 'client' },
  cli7: { id: 'cli7', name: 'Karan Malhotra',  initials: 'KM', email: 'karan@ts.com',   risk: 'Aggressive',   role: 'client' },
};

// ── Portfolio holdings per client ────────────────────────────────────────────
// qty  = number of shares held
// avg  = average buy price (cost basis)
// ltp  = last traded price (mark-to-market)
export const STOCK_DB = {
  cli1: [
    { id: 's1', sym: 'RELIANCE',  name: 'Reliance Industries',        qty: 150, avg: 2450.50, ltp: 2580.75 },
    { id: 's2', sym: 'TCS',       name: 'Tata Consultancy Services',   qty: 80,  avg: 3820.00, ltp: 3950.25 },
    { id: 's3', sym: 'INFY',      name: 'Infosys Ltd',                 qty: 200, avg: 1480.00, ltp: 1425.50 },
    { id: 's4', sym: 'HDFCBANK',  name: 'HDFC Bank Ltd',               qty: 100, avg: 1650.00, ltp: 1720.30 },
  ],
  cli2: [
    { id: 's5', sym: 'WIPRO',      name: 'Wipro Ltd',         qty: 300, avg: 420.00,  ltp: 415.80  },
    { id: 's6', sym: 'BAJFINANCE', name: 'Bajaj Finance Ltd', qty: 25,  avg: 6800.00, ltp: 6540.00 },
  ],
  cli3: [
    { id: 's7', sym: 'NIFTYBEES', name: 'Nippon India Nifty BeES', qty: 500, avg: 195.50,  ltp: 198.20  },
    { id: 's8', sym: 'AXISBANK',  name: 'Axis Bank Ltd',           qty: 120, avg: 1050.00, ltp: 1085.40 },
  ],
  cli4: [
    { id: 's9',  sym: 'ICICIBANK', name: 'ICICI Bank Ltd',          qty: 180, avg: 920.00,   ltp: 945.60  },
    { id: 's10', sym: 'LT',        name: 'Larsen & Toubro',          qty: 60,  avg: 3200.00,  ltp: 3380.00 },
    { id: 's11', sym: 'MARUTI',    name: 'Maruti Suzuki India',      qty: 20,  avg: 10500.00, ltp: 10800.00 },
  ],
  cli5: [
    { id: 's12', sym: 'TITAN', name: 'Titan Company Ltd', qty: 90, avg: 3100.00, ltp: 2980.00 },
  ],
  cli6: [
    { id: 's13', sym: 'SBIN',      name: 'State Bank of India', qty: 400, avg: 580.00, ltp: 632.50 },
    { id: 's14', sym: 'COALINDIA', name: 'Coal India Ltd',       qty: 250, avg: 380.00, ltp: 395.00 },
  ],
  cli7: [
    { id: 's15', sym: 'BHARTIARTL', name: 'Bharti Airtel Ltd',      qty: 150, avg: 1200.00, ltp: 1285.00 },
    { id: 's16', sym: 'HINDALCO',   name: 'Hindalco Industries Ltd', qty: 300, avg: 560.00,  ltp: 578.40  },
  ],
};
