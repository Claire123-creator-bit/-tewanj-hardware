import { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function Settings() {
  const { shop, setShop } = useShop();
  const [form, setForm] = useState(shop);
  const [saved, setSaved] = useState(false);

  function set(key, val) { setForm({ ...form, [key]: val }); }

  function save(e) {
    e.preventDefault();
    setShop(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <div className="page-head"><h1>Settings</h1></div>
      <div className="card" style={{ maxWidth: 480 }}>
        <h2 style={{ marginBottom: 16 }}>Shop details</h2>
        <form onSubmit={save}>
          <div className="field"><label>Shop name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
          <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
          <div className="field"><label>Address</label><input value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
          <div className="field">
            <label>Invoice footer message</label>
            <textarea style={{ height: 72 }} value={form.footer} onChange={(e) => set('footer', e.target.value)} />
          </div>
          <button className="btn" type="submit">{saved ? 'Saved!' : 'Save'}</button>
        </form>
      </div>
    </>
  );
}
