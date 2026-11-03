import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { formatKES } from '../utils/formatKES';

export default function Pos() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState('Cash');
  const [mpesaRef, setMpesaRef] = useState('');
  const [amountPaid, setAmountPaid] = useState('');

  useEffect(() => { getProducts().then(setProducts); }, []);

  const shown = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
  );

  function addToCart(product) {
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      setCart(cart.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  }

  function updateQty(id, val) {
    const qty = parseFloat(val);
    if (!qty || qty <= 0) {
      setCart(cart.filter((i) => i.id !== id));
    } else {
      setCart(cart.map((i) => i.id === id ? { ...i, qty } : i));
    }
  }

  const subtotal = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const discountAmt = (subtotal * Number(discount)) / 100;
  const total = subtotal - discountAmt;
  const paid = parseFloat(amountPaid) || 0;
  const balance = total - paid;

  function completeSale() {
    if (cart.length === 0) return;
    const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
    alert(
      'Sale saved!\n' +
      'Invoice: INV-' + Date.now() + '\n' +
      'Total: ' + formatKES(total) + '\n' +
      'Paid: ' + formatKES(paid) + '\n' +
      'Balance: ' + formatKES(balance < 0 ? 0 : balance) + '\n' +
      'Status: ' + status
    );
    setCart([]);
    setCustomer('');
    setPhone('');
    setDiscount(0);
    setAmountPaid('');
    setMpesaRef('');
    setMethod('Cash');
  }

  return (
    <>
      <div className="page-head"><h1>Point of Sale</h1></div>
      <div className="grid-2" style={{ alignItems: 'start' }}>

        <div>
          <div className="toolbar">
            <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
            {shown.map((p) => (
              <button key={p.id} onClick={() => addToCart(p)}
                style={{ background: '#fff', border: '1px solid #E2E6EE', borderRadius: 10, padding: 12, cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: '#6B7690', fontSize: 13 }}>{p.unit}</div>
                <div style={{ color: '#1D6FE8', fontWeight: 700, marginTop: 4 }}>{formatKES(p.price)}</div>
              </button>
            ))}
            {shown.length === 0 && <div className="empty">No products found</div>}
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 12 }}>Cart</h2>

          <div className="grid-2">
            <div className="field">
              <label>Customer name</label>
              <input placeholder="Walk-in" value={customer} onChange={(e) => setCustomer(e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input placeholder="07xx..." value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          {cart.length === 0 && <div className="empty">Click a product to add it</div>}

          {cart.map((item) => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ color: '#6B7690', fontSize: 13 }}>{formatKES(item.price)} / {item.unit}</div>
              </div>
              <input type="number" style={{ width: 70 }} value={item.qty} min="0.01" step="0.01"
                onChange={(e) => updateQty(item.id, e.target.value)} />
              <button className="btn btn-light" style={{ height: 32, padding: '0 10px' }}
                onClick={() => setCart(cart.filter((i) => i.id !== item.id))}>X</button>
            </div>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid #E2E6EE', margin: '12px 0' }} />

          <div className="grid-2">
            <div className="field">
              <label>Discount (%)</label>
              <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} />
            </div>
            <div className="field">
              <label>Payment method</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>Cash</option>
                <option>M-Pesa</option>
                <option>Bank</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {method === 'M-Pesa' && (
            <div className="field">
              <label>M-Pesa reference (optional)</label>
              <input placeholder="e.g. QA12345678" value={mpesaRef} onChange={(e) => setMpesaRef(e.target.value)} />
            </div>
          )}

          <div className="field">
            <label>Amount paid (KES)</label>
            <input type="number" min="0" value={amountPaid} onChange={(e) => setAmountPaid(e.target.value)} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7690', fontSize: 13 }}>
              <span>Subtotal</span><span>{formatKES(subtotal)}</span>
            </div>
            {Number(discount) > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6B7690', fontSize: 13 }}>
                <span>Discount ({discount}%)</span><span>- {formatKES(discountAmt)}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 18, marginTop: 8 }}>
              <span>Total</span><span>{formatKES(total)}</span>
            </div>
            {paid > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: balance > 0 ? '#F59E0B' : '#1E9E5A', fontWeight: 600, marginTop: 4 }}>
                <span>Balance</span><span>{formatKES(balance < 0 ? 0 : balance)}</span>
              </div>
            )}
          </div>

          <button className="btn btn-success" style={{ width: '100%' }} disabled={cart.length === 0} onClick={completeSale}>
            Complete Sale
          </button>
        </div>

      </div>
    </>
  );
}
