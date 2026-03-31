// ─── pages/LoginPage.jsx ──────────────────────────────────────────────────────
// Entry point when no user is logged in.
// Presents Admin and Client tabs; clicking a user card dispatches login().
// For client login, also kicks off the portfolio load immediately.

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { loadPortfolio, setActiveClient } from '../features/portfolio/portfolioSlice';
import { ADMINS, CLIENTS } from '../data/mockData';
import { avatarColor } from '../utils';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [tab, setTab] = useState('admin');   // 'admin' | 'client'

  const users = tab === 'admin' ? ADMINS : Object.values(CLIENTS);

  const handleSelect = (user) => {
    // 1. Log in — saves user to Redux + localStorage
    dispatch(login(user));

    // 2. If client: immediately start loading their portfolio
    if (user.role === 'client') {
      dispatch(setActiveClient(user.id));
      dispatch(loadPortfolio(user.id));   // cache-first (see portfolioSlice.js)
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="w-[400px] bg-bg-secondary border border-border-subtle rounded-xl p-9">
        {/* Logo */}
        <p className="font-mono font-bold text-brand-gold tracking-[4px] text-xl">TRADESPEX</p>
        <p className="text-[10px] uppercase tracking-widest text-tx-muted mt-1 mb-7">
          Nomura · GES Technology · Equity Analytics
        </p>

        {/* Role tabs */}
        <div className="flex border border-border-subtle rounded-lg overflow-hidden mb-6">
          {['admin', 'client'].map((role) => (
            <button
              key={role}
              onClick={() => setTab(role)}
              className={`flex-1 py-2.5 text-xs font-medium capitalize transition-colors
                ${tab === role ? 'bg-brand-blue text-white' : 'bg-transparent text-tx-muted hover:text-tx-primary'}`}
            >
              {role === 'admin' ? 'Administrator' : 'Client'}
            </button>
          ))}
        </div>

        {/* User list */}
        <p className="text-[10px] uppercase tracking-widest text-tx-faint mb-3">Select Profile</p>
        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user)}
              className="w-full flex items-center gap-3 px-4 py-3 border border-border-subtle rounded-lg
                         text-left hover:border-brand-blue hover:bg-brand-blueBg transition-colors"
            >
              {/* Avatar */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                style={{ background: avatarColor(user.id) }}
              >
                {user.initials}
              </div>

              {/* Info */}
              <div>
                <p className="text-sm font-medium text-tx-primary">{user.name}</p>
                <p className="text-[10px] font-mono text-tx-muted mt-0.5">
                  {tab === 'admin'
                    ? `${user.clientIds.length} clients assigned`
                    : user.email}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
