import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { menu } from '../utils/menu';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, setRole } = useAuth();
  const items = menu.filter((m) => m.roles.includes(user.role));

  return (
    <div className="app">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">TEWANJ<span>HARDWARE</span></div>
        {items.map((m) => (
          <NavLink key={m.path} to={m.path} end={m.path === '/'} onClick={() => setOpen(false)}>
            {m.label}
          </NavLink>
        ))}
      </aside>

      <div className="main">
        <header className="header">
          <button className="menu-btn" onClick={() => setOpen(!open)}>☰</button>
          <strong>TEWANJ HARDWARE</strong>
          <div className="header-right">
            <select value={user.role} onChange={(e) => setRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
