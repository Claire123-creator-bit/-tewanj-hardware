import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ShopProvider } from './context/ShopContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pos from './pages/Pos';
import Products from './pages/Products';
import Invoices from './pages/Invoices';
import Returns from './pages/Returns';
import Reports from './pages/Reports';
import Staff from './pages/Staff';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ShopProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<Pos />} />
              <Route path="/products" element={<Products />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ShopProvider>
  );
}
