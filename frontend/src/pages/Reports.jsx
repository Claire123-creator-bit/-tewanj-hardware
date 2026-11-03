import { useEffect, useState } from 'react';
import { getSales } from '../services/saleService';
import { getProducts } from '../services/productService';
import { formatKES } from '../utils/formatKES';

export default function Reports() {
  const [sales, setSales] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getSales().then(setSales);
    getProducts().then(setProducts);
  }, []);

  const today = new Date().toISOString().slice(0, 10);
  const todaySales = sales.filter((s) => s.date === today);

  let revenue = 0, cash = 0, mpesa = 0, bank = 0, profit = 0, unpaid = 0;

  for (let i = 0; i < sales.length; i++) {
    revenue  += sales[i].paid;
    unpaid   += sales[i].balance;
    if (sales[i].method === 'Cash')   cash  += sales[i].paid;
    if (sales[i].method === 'M-Pesa') mpesa += sales[i].paid;
    if (sales[i].method === 'Bank')   bank  += sales[i].paid;
    for (let j = 0; j < sales[i].items.length; j++) {
      const item = sales[i].items[j];
      const product = products.find((p) => p.name === item.name);
      if (product) profit += (item.price - product.costPrice) * item.qty;
    }
  }

  const lowStock = products.filter((p) => p.stock <= p.minStock);

  return (
    <>
      <div className="page-head"><h1>Reports</h1></div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="stat-label">Total sales</div>
          <div className="stat-value">{sales.length}</div>
        </div>
        <div className="card">
          <div className="stat-label">Total revenue</div>
          <div className="stat-value">{formatKES(revenue)}</div>
        </div>
        <div className="card">
          <div className="stat-label">Gross profit</div>
          <div className="stat-value" style={{ color: '#1E9E5A' }}>{formatKES(profit)}</div>
        </div>
        <div className="card">
          <div className="stat-label">Outstanding balance</div>
          <div className="stat-value" style={{ color: '#DC2626' }}>{formatKES(unpaid)}</div>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <h2 style={{ marginBottom: 12 }}>By payment method</h2>
          <table>
            <thead><tr><th>Method</th><th>Amount</th></tr></thead>
            <tbody>
              <tr><td>Cash</td><td>{formatKES(cash)}</td></tr>
              <tr><td>M-Pesa</td><td>{formatKES(mpesa)}</td></tr>
              <tr><td>Bank</td><td>{formatKES(bank)}</td></tr>
            </tbody>
          </table>
        </div>

        {lowStock.length > 0 && (
          <div className="card">
            <h2 style={{ marginBottom: 12 }}>Low stock</h2>
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
    </>
  );
}
