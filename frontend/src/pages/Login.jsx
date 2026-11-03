import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { setRole } = useAuth();
  const navigate = useNavigate();
  const [role, setSelected] = useState('admin');

  function handleLogin(e) {
    e.preventDefault();
    setRole(role);
    navigate('/');
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F5F9' }}>
      <div className="card" style={{ width: 340 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#0B2545' }}>TEWANJ HARDWARE</div>
          <div style={{ fontSize: 12, color: '#6B7690', marginTop: 4 }}>Shop Management System</div>
        </div>
        <form onSubmit={handleLogin}>
          <div className="field">
            <label>Username</label>
            <input placeholder="Enter username" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" placeholder="Enter password" />
          </div>
          <div className="field">
            <label>Sign in as</label>
            <select value={role} onChange={(e) => setSelected(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="cashier">Cashier</option>
            </select>
          </div>
          <button className="btn" style={{ width: '100%' }} type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
