import { useEffect, useState } from 'react';
import { getSales } from '../services/saleService';
import { formatKES } from '../utils/formatKES';

export default function Returns() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [returns, setReturns] = useState([]);

  useEffect(() => { getSales().then(setSales); }, []);

  const shown = sales.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.customer.toLowerCase().includes(search.toLowerCase())
  );

  function saveReturn(invoiceId, reason, condition, outcome) {
    const today = new Date().toISOString().slice(0, 10);
    setReturns([...returns, { id: Date.now(), date: today, invoice: invoiceId, reason, condition, outcome }]);
    setModal(null);
  }

  return (
    <>
      <div className="page-head"><h1>Returns</h1></div>

      <div className="toolbar">
        <input placeholder="Search by invoice or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="card table-wrap" style={{ marginBottom: 24 }}>
        <table>
          <thead><tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Total</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.date}</td>
                <td>{s.customer}</td>
                <td>{formatKES(s.total)}</td>
                <td>
                  <span className={`badge ${s.status === 'paid' ? 'badge-green' : s.status === 'partial' ? 'badge-orange' : 'badge-red'}`}>
                    {s.status}
                  </span>
                </td>
                <td><button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={() => setModal(s.id)}>Return</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <div className="empty">No invoices found</div>}
      </div>

      {returns.length > 0 && (
        <div className="card table-wrap">
          <h2 style={{ marginBottom: 12 }}>Recorded returns</h2>
          <table>
            <thead><tr><th>Date</th><th>Invoice</th><th>Reason</th><th>Condition</th><th>Outcome</th></tr></thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id}>
                  <td>{r.date}</td><td>{r.invoice}</td><td>{r.reason}</td><td>{r.condition}</td><td>{r.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal !== null && (
        <ReturnForm invoiceId={modal} onSave={saveReturn} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function ReturnForm({ invoiceId, onSave, onClose }) {
  const [reason, setReason] = useState('');
  const [condition, setCondition] = useState('Good');
  const [outcome, setOutcome] = useState('Refund');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Return — {invoiceId}</h2>
          <button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={onClose}>X</button>
        </div>
        <div className="field"><label>Reason</label><input value={reason} onChange={(e) => setReason(e.target.value)} /></div>
        <div className="field">
          <label>Item condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option>Good</option>
            <option>Damaged</option>
            <option>Expired</option>
          </select>
        </div>
        <div className="field">
          <label>Outcome</label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
            <option>Refund</option>
            <option>Exchange</option>
            <option>Credit note</option>
          </select>
        </div>
        <div className="modal-actions">
          <button className="btn btn-light" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={() => onSave(invoiceId, reason, condition, outcome)}>Save return</button>
        </div>
      </div>
    </div>
  );
}
