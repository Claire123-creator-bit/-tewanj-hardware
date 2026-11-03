import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { formatKES } from '../utils/formatKES';

const EMPTY = { name: '', category: '', unit: '', price: '', costPrice: '', stock: '', minStock: '' };

export default function Products() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [tab, setTab] = useState('products');
  const [stockHistory] = useState([
    { id: 1, date: '2026-11-01', product: 'Cement 50kg',     type: 'Received', qty: '+100', supplier: 'Bamburi Ltd' },
    { id: 2, date: '2026-11-02', product: 'Cement 50kg',     type: 'Sale',     qty: '-2',   supplier: '' },
    { id: 3, date: '2026-11-03', product: 'PVC pipe 4 inch', type: 'Sale',     qty: '-1',   supplier: '' },
  ]);
  const [receiveModal, setReceiveModal] = useState(false);
  const [receive, setReceive] = useState({ product: '', qty: '', costPrice: '', supplier: '' });

  useEffect(() => { getProducts().then(setItems); }, []);

  const shown = items.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  function saveProduct(form) {
    if (form.id) {
      setItems(items.map((p) => p.id === form.id ? form : p));
    } else {
      setItems([...items, { ...form, id: Date.now() }]);
    }
    setModal(null);
  }

  function setR(key, val) {
    setReceive({ ...receive, [key]: val });
  }

  function saveReceive() {
    alert('Stock received: ' + receive.qty + ' x ' + receive.product + ' from ' + (receive.supplier || 'unknown'));
    setReceiveModal(false);
    setReceive({ product: '', qty: '', costPrice: '', supplier: '' });
  }

  return (
    <>
      <div className="page-head">
        <h1>Products & Stock</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-light" onClick={() => setReceiveModal(true)}>+ Receive stock</button>
          <button className="btn" onClick={() => setModal(EMPTY)}>+ Add product</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className={`btn ${tab === 'products' ? '' : 'btn-light'}`} onClick={() => setTab('products')}>Products</button>
        <button className={`btn ${tab === 'history' ? '' : 'btn-light'}`} onClick={() => setTab('history')}>Stock history</button>
      </div>

      {tab === 'products' && (
        <>
          <div className="toolbar">
            <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="card table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Category</th><th>Unit</th><th>Price</th><th>Cost</th><th>Stock</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {shown.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.unit}</td>
                    <td>{formatKES(p.price)}</td>
                    <td>{formatKES(p.costPrice)}</td>
                    <td>{p.stock}</td>
                    <td>
                      <span className={`badge ${p.stock === 0 ? 'badge-red' : p.stock <= p.minStock ? 'badge-orange' : 'badge-green'}`}>
                        {p.stock === 0 ? 'Out of stock' : p.stock <= p.minStock ? 'Low stock' : 'In stock'}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={() => setModal(p)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {shown.length === 0 && <div className="empty">No products found</div>}
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="card table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Supplier</th></tr></thead>
            <tbody>
              {stockHistory.map((h) => (
                <tr key={h.id}>
                  <td>{h.date}</td>
                  <td>{h.product}</td>
                  <td>{h.type}</td>
                  <td style={{ color: h.qty.startsWith('+') ? '#1E9E5A' : '#DC2626', fontWeight: 600 }}>{h.qty}</td>
                  <td>{h.supplier || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal !== null && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{modal.id ? 'Edit Product' : 'Add Product'}</h2>
              <button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={() => setModal(null)}>X</button>
            </div>
            <ProductForm initial={modal} onSave={saveProduct} onClose={() => setModal(null)} />
          </div>
        </div>
      )}

      {receiveModal && (
        <div className="modal-overlay" onClick={() => setReceiveModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>Receive Stock</h2>
              <button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={() => setReceiveModal(false)}>X</button>
            </div>
            <div className="field">
              <label>Product</label>
              <select value={receive.product} onChange={(e) => setR('product', e.target.value)}>
                <option value="">Select product</option>
                {items.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="grid-2">
              <div className="field"><label>Quantity</label><input type="number" value={receive.qty} onChange={(e) => setR('qty', e.target.value)} /></div>
              <div className="field"><label>Cost price (KES)</label><input type="number" value={receive.costPrice} onChange={(e) => setR('costPrice', e.target.value)} /></div>
            </div>
            <div className="field"><label>Supplier name</label><input placeholder="Type supplier name" value={receive.supplier} onChange={(e) => setR('supplier', e.target.value)} /></div>
            <div className="modal-actions">
              <button className="btn btn-light" onClick={() => setReceiveModal(false)}>Cancel</button>
              <button className="btn" onClick={saveReceive}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);

  function set(key, val) {
    setForm({ ...form, [key]: val });
  }

  return (
    <>
      <div className="field"><label>Name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div className="grid-2">
        <div className="field"><label>Category</label><input value={form.category} onChange={(e) => set('category', e.target.value)} /></div>
        <div className="field"><label>Unit (Bag, Kg, Metre...)</label><input value={form.unit} onChange={(e) => set('unit', e.target.value)} /></div>
      </div>
      <div className="grid-2">
        <div className="field"><label>Selling price (KES)</label><input type="number" value={form.price} onChange={(e) => set('price', e.target.value)} /></div>
        <div className="field"><label>Cost price (KES)</label><input type="number" value={form.costPrice} onChange={(e) => set('costPrice', e.target.value)} /></div>
      </div>
      <div className="grid-2">
        <div className="field"><label>Current stock</label><input type="number" value={form.stock} onChange={(e) => set('stock', e.target.value)} /></div>
        <div className="field"><label>Minimum stock</label><input type="number" value={form.minStock} onChange={(e) => set('minStock', e.target.value)} /></div>
      </div>
      <div className="modal-actions">
        <button className="btn btn-light" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={() => onSave(form)}>Save</button>
      </div>
    </>
  );
}
