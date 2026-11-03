import { useEffect, useState } from 'react';
import { getSales } from '../services/saleService';
import { getProducts } from '../services/productService';
import { formatKES } from '../utils/formatKES';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getSales().then(setSales);
    getProducts().then(setProducts);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter((s) => s.date === today);
  const todayRevenue = todaySales.reduce((a, s) => a + s.paid, 0);

  let cashToday = 0;
  let mpesaToday = 0;
  let bankToday = 0;
  for (let i = 0; i < todaySales.length; i++) {
    if (todaySales[i].method === 'Cash')  cashToday  += todaySales[i].paid;
    if (todaySales[i].method === 'M-Pesa') mpesaToday += todaySales[i].paid;
    if (todaySales[i].method === 'Bank')  bankToday  += todaySales[i].paid;
  }

  let todayProfit = 0;
  for (let i = 0; i < todaySales.length; i++) {
    for (let j = 0; j < todaySales[i].items.length; j++) {
      const item = todaySales[i].items[j];
      const product = products.find((p) => p.name === item.name);
      if (product) todayProfit += (item.price - product.costPrice) * item.qty;
    }
  }

  const lowStock = products.filter((p) => p.stock <= p.minStock);

  return (
    <>
      <div className="page-head"><h1>Dashboard</h1></div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="stat-label">Sales today</div>
          <div className="stat-value">{todaySales.length}</div>
        </div>
        <div className="card">
          <div className="stat-label">Revenue today</div>
          <div className="stat-value">{formatKES(todayRevenue)}</div>
        </div>
        {user.role === 'admin' && (
          <div className="card">
            <div className="stat-label">Profit today</div>
            <div className="stat-value" style={{ color: '#1E9E5A' }}>{formatKES(todayProfit)}</div>
          </div>
        )}
        <div className="card">
          <div className="stat-label">Low stock items</div>
          <div className="stat-value" style={{ color: lowStock.length > 0 ? '#F59E0B' : '#1B2437' }}>{lowStock.length}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h2 style={{ marginBottom: 12 }}>Today by payment method</h2>
          <table>
            <thead><tr><th>Method</th><th>Amount</th></tr></thead>
            <tbody>
              <tr><td>Cash</td><td>{formatKES(cashToday)}</td></tr>
              <tr><td>M-Pesa</td><td>{formatKES(mpesaToday)}</td></tr>
              <tr><td>Bank</td><td>{formatKES(bankToday)}</td></tr>
            </tbody>
          </table>
        </div>

        {lowStock.length > 0 && (
          <div className="card">
            <h2 style={{ marginBottom: 12 }}>Low stock warning</h2>
            <table>
              <thead><tr><th>Product</th><th>Stock</th><th>Min</th></tr></thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.stock} {p.unit}</td>
                    <td>{p.minStock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 12 }}>Recent sales</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Invoice</th><th>Customer</th><th>Total</th><th>Paid</th><th>Balance</th><th>Method</th><th>Status</th></tr></thead>
            <tbody>
              {sales.slice(0, 8).map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.customer}</td>
                  <td>{formatKES(s.total)}</td>
                  <td>{formatKES(s.paid)}</td>
                  <td>{formatKES(s.balance)}</td>
                  <td>{s.method || '—'}</td>
                  <td>
                    <span className={`badge ${s.status === 'paid' ? 'badge-green' : s.status === 'partial' ? 'badge-orange' : 'badge-red'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sales.length === 0 && <div className="empty">No sales yet</div>}
        </div>
      </div>
    </>
  );
}
