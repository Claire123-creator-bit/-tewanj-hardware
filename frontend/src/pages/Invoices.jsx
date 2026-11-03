import { useEffect, useState } from 'react';
import { getSales } from '../services/saleService';
import { formatKES } from '../utils/formatKES';
import { useShop } from '../context/ShopContext';

export default function Invoices() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => { getSales().then(setSales); }, []);

  const shown = sales.filter((s) =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.customer.toLowerCase().includes(search.toLowerCase())
  );

  if (selected) {
    return <InvoiceView sale={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <>
      <div className="page-head"><h1>Invoices</h1></div>
      <div className="toolbar">
        <input placeholder="Search by invoice or customer..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>Invoice</th><th>Date</th><th>Customer</th><th>Total</th><th>Paid</th><th>Balance</th><th>Method</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {shown.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.date}</td>
                <td>{s.customer}</td>
                <td>{formatKES(s.total)}</td>
                <td>{formatKES(s.paid)}</td>
                <td style={{ color: s.balance > 0 ? '#F59E0B' : 'inherit' }}>{formatKES(s.balance)}</td>
                <td>{s.method || '—'}</td>
                <td>
                  <span className={`badge ${s.status === 'paid' ? 'badge-green' : s.status === 'partial' ? 'badge-orange' : 'badge-red'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={() => setSelected(s)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <div className="empty">No invoices found</div>}
      </div>
    </>
  );
}

function InvoiceView({ sale, onBack }) {
  const { shop } = useShop();

  const subtotal = sale.items.reduce((a, i) => a + i.price * i.qty, 0);
  const discountAmt = subtotal - sale.total;

  const stampColor = sale.status === 'paid' ? '#1E9E5A' : sale.status === 'partial' ? '#F59E0B' : '#DC2626';
  const stampLabel = sale.status === 'paid' ? 'PAID' : sale.status === 'partial' ? 'PARTIAL' : 'UNPAID';

  return (
    <div>
      <div className="no-print" style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
        <button className="btn btn-light" onClick={onBack}>← Back</button>
        <button className="btn" onClick={() => window.print()}>Print / Save PDF</button>
      </div>

      <div className="invoice-paper" style={{
        background: '#fff',
        maxWidth: 720,
        padding: '40px 48px',
        border: '1px solid #E2E6EE',
        borderRadius: 10,
        boxShadow: '0 2px 12px rgba(0,0,0,.08)',
        fontFamily: "'Inter', system-ui, sans-serif",
        fontSize: 14,
        color: '#1B2437',
        position: 'relative',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, borderBottom: '3px solid #0B2545', paddingBottom: 24 }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#0B2545', letterSpacing: 1 }}>{shop.name}</div>
            <div style={{ color: '#6B7690', fontSize: 13, marginTop: 4 }}>{shop.address}</div>
            <div style={{ color: '#6B7690', fontSize: 13 }}>Tel: {shop.phone}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#0B2545', letterSpacing: 2 }}>INVOICE</div>
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 13, color: '#6B7690' }}>Invoice No.</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{sale.id}</div>
            </div>
            <div style={{ marginTop: 6 }}>
              <div style={{ fontSize: 13, color: '#6B7690' }}>Date</div>
              <div style={{ fontWeight: 600 }}>{sale.date}</div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
          <div style={{ background: '#F3F5F9', borderRadius: 8, padding: '14px 20px', minWidth: 220 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7690', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Bill To</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{sale.customer || 'Walk-in Customer'}</div>
            {sale.phone && <div style={{ color: '#6B7690', fontSize: 13, marginTop: 4 }}>{sale.phone}</div>}
          </div>
          <div style={{ background: '#F3F5F9', borderRadius: 8, padding: '14px 20px', minWidth: 180, textAlign: 'right' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7690', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>Payment</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{sale.method || 'N/A'}</div>
            {sale.mpesaRef && <div style={{ color: '#6B7690', fontSize: 13, marginTop: 4 }}>Ref: {sale.mpesaRef}</div>}
          </div>
        </div>

        {/* Items table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 24 }}>
          <thead>
            <tr style={{ background: '#0B2545' }}>
              <th style={{ color: '#fff', padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>#</th>
              <th style={{ color: '#fff', padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>Description</th>
              <th style={{ color: '#fff', padding: '10px 14px', textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>Qty</th>
              <th style={{ color: '#fff', padding: '10px 14px', textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>Unit</th>
              <th style={{ color: '#fff', padding: '10px 14px', textAlign: 'right', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>Unit Price</th>
              <th style={{ color: '#fff', padding: '10px 14px', textAlign: 'right', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#F8F9FC' }}>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #E2E6EE', color: '#6B7690', fontSize: 13 }}>{i + 1}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #E2E6EE', fontWeight: 500 }}>{item.name}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #E2E6EE', textAlign: 'center' }}>{item.qty}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #E2E6EE', textAlign: 'center', color: '#6B7690' }}>{item.unit}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #E2E6EE', textAlign: 'right' }}>{formatKES(item.price)}</td>
                <td style={{ padding: '11px 14px', borderBottom: '1px solid #E2E6EE', textAlign: 'right', fontWeight: 600 }}>{formatKES(item.price * item.qty)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 32 }}>
          <div style={{ minWidth: 280 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E6EE', color: '#6B7690', fontSize: 13 }}>
              <span>Subtotal</span><span>{formatKES(subtotal)}</span>
            </div>
            {discountAmt > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E2E6EE', color: '#6B7690', fontSize: 13 }}>
                <span>Discount</span><span>- {formatKES(discountAmt)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: '#0B2545', borderRadius: 6, marginTop: 8, color: '#fff', fontWeight: 700, fontSize: 16 }}>
              <span>TOTAL</span><span>{formatKES(sale.total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', marginTop: 8, color: '#6B7690', fontSize: 13 }}>
              <span>Amount paid</span><span>{formatKES(sale.paid)}</span>
            </div>
            {sale.balance > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', color: '#F59E0B', fontWeight: 700, fontSize: 14 }}>
                <span>Balance due</span><span>{formatKES(sale.balance)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Payment stamp */}
        <div className="invoice-stamp" style={{
          position: 'absolute',
          top: 200,
          right: 48,
          border: `3px solid ${stampColor}`,
          color: stampColor,
          borderRadius: 6,
          padding: '6px 18px',
          fontSize: 22,
          fontWeight: 900,
          letterSpacing: 4,
          opacity: 0.25,
          transform: 'rotate(-18deg)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}>
          {stampLabel}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #E2E6EE', paddingTop: 16, marginTop: 8 }}>
          <div style={{ color: '#6B7690', fontSize: 12, textAlign: 'center' }}>{shop.footer}</div>
          <div style={{ color: '#C0C8D8', fontSize: 11, textAlign: 'center', marginTop: 6 }}>
            {shop.name} · {shop.address} · {shop.phone}
          </div>
        </div>

      </div>
    </div>
  );
}
