// ─── pages/ClientDashboard.jsx ────────────────────────────────────────────────
// Client's own portfolio view.
// Clients can ADD, EDIT, and DELETE their own positions.
// Data is loaded via the cache-first loadPortfolio thunk on login.
//
// Contrast with AdminDashboard where readonly=true.
// The same <PortfolioTable> component is used — the `readonly` prop controls RBAC.

import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';
import { selectStocksForClient, selectIsLoading } from '../features/portfolio/portfolioSlice';
import { calcPortfolioStats, fc } from '../utils';
import { StatCard, LoadingDots } from '../components/ui';
import PortfolioTable from '../components/PortfolioTable';
import Topbar from '../components/layout/Topbar';

export default function ClientDashboard() {
  const user      = useSelector(selectUser);
  const stocks    = useSelector(selectStocksForClient(user.id));
  const isLoading = useSelector(selectIsLoading);

  const stats = calcPortfolioStats(stocks);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Topbar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-5">

          {isLoading ? (
            <LoadingDots label="Loading your portfolio..." />
          ) : (
            <>
              {/* ── Summary stat cards ────────────────────────────── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <StatCard
                  label="Invested"
                  value={fc(stats.invested)}
                  sub={`${stocks.length} positions`}
                />
                <StatCard
                  label="Market Value"
                  value={fc(stats.currentValue)}
                  sub="mark-to-market"
                />
                <StatCard
                  label="Total P&L"
                  value={`${stats.totalPnL >= 0 ? '+' : '-'}${fc(Math.abs(stats.totalPnL))}`}
                  sub={`${stats.totalPnL >= 0 ? '▲' : '▼'} ${Math.abs(stats.pnlPct)}%`}
                  valueColor={stats.totalPnL >= 0 ? 'text-status-green' : 'text-status-red'}
                />
                <StatCard
                  label="Risk Profile"
                  value={user.risk}
                  sub={user.email}
                  valueColor="text-brand-gold"
                />
              </div>

              {/* ── Portfolio table — editable for client ─────────── */}
              {/* readonly=false → edit + delete + add buttons visible */}
              <PortfolioTable
                clientId={user.id}
                readonly={false}
              />
            </>
          )}

        </div>
      </main>
    </div>
  );
}
