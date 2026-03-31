// ─── components/ui/index.jsx ───────────────────────────────────────────────────
// Small, reusable presentational components.
// They receive data via props and have no Redux knowledge.
// This is the "dumb component" pattern — easy to test and reuse.

import { fc, calcPnL, calcPnLPct } from '../../utils';

// ── LoadingDots ────────────────────────────────────────────────────────────
export const LoadingDots = ({ label = 'Loading...' }) => (
  <div className="flex items-center gap-3 justify-center py-16 text-tx-muted text-sm">
    <span className="w-2 h-2 rounded-full bg-brand-blue dot-1" />
    <span className="w-2 h-2 rounded-full bg-brand-blue dot-2" />
    <span className="w-2 h-2 rounded-full bg-brand-blue dot-3" />
    <span>{label}</span>
  </div>
);

// ── StatCard ───────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, valueColor }) => (
  <div className="bg-bg-secondary border border-border-subtle rounded-xl p-4">
    <p className="text-[10px] uppercase tracking-widest text-tx-muted mb-1">{label}</p>
    <p className={`text-xl font-bold font-mono ${valueColor ?? 'text-tx-primary'}`}>{value}</p>
    {sub && <p className="text-[10px] text-tx-muted font-mono mt-1">{sub}</p>}
  </div>
);

// ── Badge ──────────────────────────────────────────────────────────────────
export const Badge = ({ children, variant = 'default' }) => {
  const styles = {
    admin:    'bg-brand-blue text-white',
    client:   'bg-status-green text-black',
    cached:   'bg-status-green/20 text-status-green border border-status-green/30',
    readonly: 'bg-status-amber/10 text-status-amber border border-status-amber/20',
    default:  'bg-bg-elevated text-tx-muted border border-border-subtle',
  };
  return (
    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-[3px] rounded ${styles[variant]}`}>
      {children}
    </span>
  );
};

// ── Avatar ─────────────────────────────────────────────────────────────────
export const Avatar = ({ initials, bg = '#2563eb', size = 'md' }) => {
  const sizes = { sm: 'w-8 h-8 text-[10px]', md: 'w-10 h-10 text-xs', lg: 'w-12 h-12 text-sm' };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
};

// ── StockRow ───────────────────────────────────────────────────────────────
// One row in the holdings table.
// onEdit / onDelete are undefined for admin (read-only).
export const StockRow = ({ stock, onEdit, onDelete }) => {
  const pnl    = calcPnL(stock);
  const pct    = calcPnLPct(stock);
  const isPos  = pnl >= 0;
  const pnlCls = isPos ? 'text-status-green' : 'text-status-red';

  return (
    <tr className="border-b border-border-subtle/50 hover:bg-brand-blueBg/30 transition-colors">
      {/* Instrument */}
      <td className="px-4 py-3">
        <p className="font-mono font-bold text-white text-sm">{stock.sym}</p>
        <p className="text-[10px] text-tx-muted mt-0.5">{stock.name}</p>
      </td>
      {/* Qty */}
      <td className="px-4 py-3 text-right font-mono text-sm">
        {stock.qty.toLocaleString('en-IN')}
      </td>
      {/* Avg Price */}
      <td className="px-4 py-3 text-right font-mono text-sm">{fc(stock.avg)}</td>
      {/* LTP */}
      <td className="px-4 py-3 text-right font-mono text-sm">{fc(stock.ltp)}</td>
      {/* P&L */}
      <td className={`px-4 py-3 text-right font-mono text-sm ${pnlCls}`}>
        <p>{isPos ? '+' : '-'}{fc(Math.abs(pnl))}</p>
        <p className="text-[10px]">{isPos ? '▲' : '▼'} {Math.abs(pct)}%</p>
      </td>
      {/* Actions — only rendered for client view */}
      {(onEdit || onDelete) && (
        <td className="px-4 py-3 text-right">
          <div className="flex gap-2 justify-end">
            {onEdit && (
              <button
                onClick={() => onEdit(stock)}
                className="px-2 py-1 rounded text-[11px] bg-brand-blueBg text-blue-400 border border-brand-blue/25 hover:bg-brand-blue/20 transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(stock.id)}
                className="px-2 py-1 rounded text-[11px] bg-status-red/10 text-status-red border border-status-red/20 hover:bg-status-red/20 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

// ── Modal ──────────────────────────────────────────────────────────────────
// Generic modal overlay. onClose fires on backdrop click or cancel button.
export const Modal = ({ title, children, onClose }) => (
  <div
    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div className="bg-bg-tertiary border border-border-dim rounded-xl p-6 w-[380px] shadow-2xl">
      <h2 className="text-[15px] font-semibold mb-5">{title}</h2>
      {children}
    </div>
  </div>
);

// ── FormField ──────────────────────────────────────────────────────────────
export const FormField = ({ label, type = 'text', value, onChange, placeholder }) => (
  <div className="mb-3">
    <label className="block text-[10px] uppercase tracking-widest text-tx-muted mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-bg-primary border border-border-dim rounded-md px-3 py-2 text-sm font-mono text-tx-primary focus:border-brand-blue focus:outline-none transition-colors"
    />
  </div>
);
