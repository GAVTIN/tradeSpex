// ─── pages/AdminDashboard.jsx ─────────────────────────────────────────────────
// Admin view: two-panel layout.
//   Left  → sidebar with all assigned clients
//   Right → read-only portfolio of the selected client
//
// Cache strategy:
//   - selectPortfolioCache is checked to show the "cached" badge in the sidebar.
//   - loadPortfolio thunk (cache-first) is dispatched when a client row is clicked.
//   - localStorage badge shows "⚡ Cache Hit" on subsequent visits.

import { useDispatch, useSelector } from 'react-redux';
import {
  loadPortfolio,
  setActiveClient,
  selectActiveClientId,
  selectPortfolioCache,
} from '../features/portfolio/portfolioSlice';
import { selectUser } from '../features/auth/authSlice';
import { CLIENTS } from '../data/mockData';
import { avatarColor } from '../utils';
import PortfolioTable from '../components/PortfolioTable';
import Topbar from '../components/layout/Topbar';

export default function AdminDashboard() {
  const dispatch       = useDispatch();
  const currentAdmin   = useSelector(selectUser);
  const activeClientId = useSelector(selectActiveClientId);
  const cache          = useSelector(selectPortfolioCache);

  // Only show clients assigned to this admin
  const assignedClients = currentAdmin.clientIds.map((id) => CLIENTS[id]);

  const handleClientClick = (clientId) => {
    dispatch(setActiveClient(clientId));
    // loadPortfolio is cache-first:
    //   → If cache[clientId] exists: returns immediately, no API call
    //   → If not: fires the API, shows loading spinner, then caches to localStorage
    dispatch(loadPortfolio(clientId));
  };

  // Determine where data came from for the badge
  // We track this simply: if it's in cache and we just set it active,
  // first visit in session = API, subsequent = localStorage
  const getCacheSource = (clientId) => {
    // If data is in Redux cache, it means it was either already in localStorage
    // or was fetched this session. For simplicity, we just show "cached" if present.
    return cache[clientId] ? 'localStorage' : null;
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ─────────────────────────────────────────────── */}
        <aside className="w-64 flex-shrink-0 bg-bg-secondary border-r border-border-subtle overflow-y-auto">
          <div className="px-4 py-3 border-b border-border-subtle">
            <p className="text-[10px] uppercase tracking-widest text-tx-muted font-semibold">
              Assigned Clients
            </p>
            <p className="text-[10px] font-mono text-tx-faint mt-0.5">
              {assignedClients.length} accounts
            </p>
          </div>

          {assignedClients.map((client) => {
            const isActive = activeClientId === client.id;
            const isCached = Boolean(cache[client.id]);

            return (
              <div
                key={client.id}
                onClick={() => handleClientClick(client.id)}
                className={`relative flex items-center gap-3 px-4 py-3 border-b border-white/[0.03] cursor-pointer transition-colors
                  ${isActive ? 'bg-brand-blueBg border-l-2 border-l-brand-blue' : 'hover:bg-brand-blueBg/40'}`}
              >
                {/* Avatar */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                  style={{ background: avatarColor(client.id) }}
                >
                  {client.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{client.name}</p>
                  <p className="text-[10px] text-tx-muted truncate">{client.email}</p>
                </div>

                {/* Cached badge */}
                {isCached && (
                  <span className="text-[8px] font-bold uppercase text-status-green bg-status-green/10 border border-status-green/20 px-1.5 py-0.5 rounded">
                    cached
                  </span>
                )}
              </div>
            );
          })}
        </aside>

        {/* ── Main panel ──────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-5">
          {!activeClientId ? (
            // Empty state
            <div className="h-full flex flex-col items-center justify-center text-tx-faint gap-3">
              <span className="text-4xl opacity-20">◈</span>
              <p className="text-[10px] uppercase tracking-widest">Select a client to view portfolio</p>
            </div>
          ) : (
            <PortfolioTable
              clientId={activeClientId}
              readonly={true}   // ← ADMIN IS READ-ONLY
              cacheSource={getCacheSource(activeClientId)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
