// ─── components/PortfolioTable.jsx ────────────────────────────────────────────
// Renders the stock holdings table.
// Props determine whether edit/delete buttons are shown.
//
// The same component is used in:
//   - AdminDashboard → readonly=true  (no action buttons)
//   - ClientDashboard → readonly=false (edit + delete buttons visible)
//
// This is the "Single Responsibility" principle in action:
// RBAC is enforced at both the UI layer (here) and the API layer (Node middleware).

import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  selectStocksForClient,
  selectIsLoading,
  selectLoadingClientId,
  deleteStock,
} from '../features/portfolio/portfolioSlice';
import { calcPortfolioStats, fc } from '../utils';
import { StockRow, LoadingDots, Badge } from './ui';
import { CLIENTS } from '../data/mockData';
import StockModal from './StockModal';

export default function PortfolioTable({ clientId, readonly = false, cacheSource }) {
  const dispatch  = useDispatch();
  const stocks    = useSelector(selectStocksForClient(clientId));
  const isLoading = useSelector(selectIsLoading);
  const loadingId = useSelector(selectLoadingClientId);

  // Local UI state — modal visibility and which stock is being edited
  const [modal, setModal] = useState(null); // null | 'add' | { stock }

  // Still loading for THIS specific client
  if (isLoading && loadingId === clientId) {
    return <LoadingDots label="Fetching portfolio from API..." />;
  }

  const client = CLIENTS[clientId];
  const stats  = calcPortfolioStats(stocks);

  const handleEdit   = (stock) => setModal({ stock });
  const handleDelete = (stockId) => dispatch(deleteStock({ clientId, stockId }));

  return (
    <div>
      {/* ── Profile header ─────────────────────────────────────────── */}
      <div className="bg-bg-secondary border border-border-subtle rounded-xl p-5 mb-4 flex flex-wrap items-center gap-4">
        {/* Avatar */}
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: '#2563eb' }}
        >
          {client?.initials}
        </div>

        {/* Name / meta */}
        <div>
          <p className="text-base font-semibold">{client?.name}</p>
          <p className="text-[11px] font-mono text-tx-muted">{client?.email}</p>
          <div className="flex gap-2 mt-1.5">
            <Badge>{client?.risk}</Badge>
            {cacheSource === 'localStorage' && <Badge variant="cached">⚡ Cache Hit — localStorage</Badge>}
            {cacheSource === 'api'          && <Badge>🌐 API Fetch</Badge>}
            {readonly && <Badge variant="readonly">🔒 Read Only</Badge>}
          </div>
        </div>

        {/* Stats */}
        <div className="ml-auto flex gap-6 text-right">
          <div>
            <p className="text-[9px] uppercase tracking-widest text-tx-muted">Portfolio Value</p>
            <p className="text-lg font-bold font-mono mt-0.5">{fc(stats.currentValue)}</p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-tx-muted">Total P&L</p>
            <p className={`text-lg font-bold font-mono mt-0.5 ${stats.totalPnL >= 0 ? 'text-status-green' : 'text-status-red'}`}>
              {stats.totalPnL >= 0 ? '+' : '-'}{fc(Math.abs(stats.totalPnL))}
            </p>
          </div>
        </div>
      </div>

      {/* ── Read-only notice ────────────────────────────────────────── */}
      {readonly && (
        <div className="bg-status-amber/5 border border-status-amber/15 rounded-lg px-4 py-2.5 text-[11px] text-status-amber mb-4 flex items-center gap-2">
          🔒 Read-only — Administrators cannot modify client positions. Changes must be made by the client or via back-office system.
        </div>
      )}

      {/* ── Add Position button (client view only) ──────────────────── */}
      {!readonly && (
        <button
          onClick={() => setModal('add')}
          className="mb-4 px-4 py-2 bg-brand-blue text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          + Add Position
        </button>
      )}

      {/* ── Holdings label ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[10px] uppercase tracking-widest text-tx-muted">
          Holdings ({stocks.length} positions)
        </span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      {/* ── Table ────────────────────────────────────────────────────── */}
      {stocks.length === 0 ? (
        <p className="text-sm text-tx-faint text-center py-10">No positions found.</p>
      ) : (
        <>
          <div className="rounded-xl overflow-hidden border border-border-subtle">
            <table className="w-full border-collapse bg-bg-secondary">
              <thead>
                <tr className="bg-bg-tertiary border-b border-border-subtle">
                  <th className="px-4 py-2.5 text-left text-[9px] uppercase tracking-widest text-tx-muted font-semibold">Instrument</th>
                  <th className="px-4 py-2.5 text-right text-[9px] uppercase tracking-widest text-tx-muted font-semibold">Qty</th>
                  <th className="px-4 py-2.5 text-right text-[9px] uppercase tracking-widest text-tx-muted font-semibold">Avg Price</th>
                  <th className="px-4 py-2.5 text-right text-[9px] uppercase tracking-widest text-tx-muted font-semibold">LTP</th>
                  <th className="px-4 py-2.5 text-right text-[9px] uppercase tracking-widest text-tx-muted font-semibold">P&L</th>
                  {!readonly && (
                    <th className="px-4 py-2.5 text-right text-[9px] uppercase tracking-widest text-tx-muted font-semibold">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {stocks.map((stock) => (
                  <StockRow
                    key={stock.id}
                    stock={stock}
                    onEdit={!readonly ? handleEdit : undefined}
                    onDelete={!readonly ? handleDelete : undefined}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Footer totals ─────────────────────────────────────── */}
          <div className="mt-3 bg-bg-secondary border border-border-subtle rounded-lg px-4 py-3 flex justify-end gap-8">
            {[
              { label: 'Invested',      val: fc(stats.invested),     color: '' },
              { label: 'Current Value', val: fc(stats.currentValue), color: '' },
              { label: 'Total P&L',     val: `${stats.totalPnL >= 0 ? '+' : '-'}${fc(Math.abs(stats.totalPnL))}`,
                color: stats.totalPnL >= 0 ? 'text-status-green' : 'text-status-red' },
            ].map((item) => (
              <div key={item.label} className="text-right">
                <p className="text-[9px] uppercase tracking-widest text-tx-muted">{item.label}</p>
                <p className={`text-sm font-bold font-mono mt-0.5 ${item.color}`}>{item.val}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Modal ────────────────────────────────────────────────────── */}
      {modal && (
        <StockModal
          clientId={clientId}
          stock={modal === 'add' ? null : modal.stock}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
