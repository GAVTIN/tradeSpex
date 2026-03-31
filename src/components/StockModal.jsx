// ─── components/StockModal.jsx ─────────────────────────────────────────────────
// Controlled form for adding or editing a stock position.
// Uses local component state for form fields (React useState) —
// form state doesn't need to live in Redux because it's ephemeral UI state.
//
// Pattern: local state for UI / ephemeral → Redux for server/shared/persisted state

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addStock, updateStock } from '../features/portfolio/portfolioSlice';
import { Modal, FormField } from './ui';

export default function StockModal({ clientId, stock, onClose }) {
  const dispatch = useDispatch();
  const isEdit   = Boolean(stock);   // editing if stock is passed, adding if null

  // ── Local form state ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    sym:  stock?.sym  ?? '',
    name: stock?.name ?? '',
    qty:  stock?.qty  ?? '',
    avg:  stock?.avg  ?? '',
    ltp:  stock?.ltp  ?? '',
  });

  const update = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Submit ─────────────────────────────────────────────────────────────
  const handleSave = () => {
    const payload = {
      sym:  form.sym,
      name: form.name,
      qty:  Number(form.qty),
      avg:  Number(form.avg),
      ltp:  Number(form.ltp),
    };

    if (isEdit) {
      // Dispatch updateStock thunk → PATCH /portfolio/:id/stock/:stockId
      dispatch(updateStock({ clientId, stockId: stock.id, changes: payload }));
    } else {
      // Dispatch addStock thunk → POST /portfolio/:id/stock
      dispatch(addStock({ clientId, stockData: payload }));
    }

    onClose();
  };

  return (
    <Modal title={isEdit ? 'Edit Position' : 'Add New Position'} onClose={onClose}>
      <FormField label="Symbol"       value={form.sym}  onChange={update('sym')}  placeholder="e.g. TATAMOTORS" />
      <FormField label="Company Name" value={form.name} onChange={update('name')} placeholder="e.g. Tata Motors Ltd" />
      <FormField label="Quantity"     type="number" value={form.qty}  onChange={update('qty')}  placeholder="0" />
      <FormField label="Avg Buy Price (₹)"  type="number" value={form.avg} onChange={update('avg')} placeholder="0.00" />
      <FormField label="Last Traded Price (₹)" type="number" value={form.ltp} onChange={update('ltp')} placeholder="0.00" />

      <div className="flex gap-3 justify-end mt-5">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm border border-border-dim text-tx-muted hover:bg-bg-elevated transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-lg text-sm bg-brand-blue text-white hover:bg-blue-500 transition-colors"
        >
          {isEdit ? 'Save Changes' : 'Add Position'}
        </button>
      </div>
    </Modal>
  );
}
