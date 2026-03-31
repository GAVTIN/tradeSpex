// ─── components/layout/Topbar.jsx ─────────────────────────────────────────────
// The sticky navigation bar shown after login.
// Reads user from Redux and dispatches logout on click.

import { useDispatch, useSelector } from 'react-redux';
import { logout, selectUser } from '../../features/auth/authSlice';
import { clearCache } from '../../features/portfolio/portfolioSlice';
import { Badge } from '../ui';

export default function Topbar() {
  const dispatch = useDispatch();
  const user     = useSelector(selectUser);

  const handleLogout = () => {
    // Clear portfolio cache on logout if you want strict data isolation.
    // Comment this out if you want the cache to persist across sessions.
    // dispatch(clearCache());
    dispatch(logout());
  };

  return (
    <header className="h-12 bg-bg-secondary border-b border-border-subtle flex items-center px-5 gap-4 sticky top-0 z-40">
      {/* Logo */}
      <span className="font-mono font-bold text-brand-gold tracking-[4px] text-[15px]">
        TRADESPEX
      </span>

      <div className="w-px h-5 bg-border-subtle" />

      {/* Context label */}
      <span className="text-[10px] uppercase tracking-widest text-tx-muted">
        {user?.role === 'admin' ? 'Admin Console' : 'Client Portal'}
      </span>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-3">
        <Badge variant={user?.role}>{user?.role}</Badge>
        <span className="text-sm text-tx-primary">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded-md text-[11px] border border-border-subtle text-tx-muted hover:border-status-red hover:text-status-red transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
