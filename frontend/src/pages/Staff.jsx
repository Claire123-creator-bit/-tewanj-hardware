import { useEffect, useState } from 'react';
import { getStaff } from '../services/staffService';

const EMPTY = { name: '', phone: '', role: 'cashier', status: 'active' };

export default function Staff() {
  const [items, setItems] = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => { getStaff().then(setItems); }, []);

  function save(form) {
    if (form.id) {
      setItems(items.map((s) => s.id === form.id ? form : s));
    } else {
      setItems([...items, { ...form, id: Date.now() }]);
    }
    setModal(null);
  }

  return (
    <>
      <div className="page-head">
        <h1>Staff</h1>
        <button className="btn" onClick={() => setModal(EMPTY)}>+ Add staff</button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Phone</th><th>Role</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td style={{ textTransform: 'capitalize' }}>{s.role}</td>
                <td>
                  <span className={`badge ${s.status === 'active' ? 'badge-green' : 'badge-red'}`}>{s.status}</span>
                </td>
                <td><button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={() => setModal(s)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && <div className="empty">No staff yet</div>}
      </div>

      {modal !== null && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{modal.id ? 'Edit Staff' : 'Add Staff'}</h2>
              <button className="btn btn-light" style={{ height: 32, padding: '0 10px' }} onClick={() => setModal(null)}>X</button>
            </div>
            <StaffForm initial={modal} onSave={save} onClose={() => setModal(null)} />
          </div>
        </div>
      )}
    </>
  );
}

function StaffForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial);

  function set(key, val) { setForm({ ...form, [key]: val }); }

  return (
    <>
      <div className="field"><label>Name</label><input value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
      <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
      <div className="field">
        <label>Role</label>
        <select value={form.role} onChange={(e) => set('role', e.target.value)}>
          <option value="admin">Admin</option>
          <option value="cashier">Cashier</option>
        </select>
      </div>
      <div className="field">
        <label>Status</label>
        <select value={form.status} onChange={(e) => set('status', e.target.value)}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="modal-actions">
        <button className="btn btn-light" onClick={onClose}>Cancel</button>
        <button className="btn" onClick={() => onSave(form)}>Save</button>
      </div>
    </>
  );
}
