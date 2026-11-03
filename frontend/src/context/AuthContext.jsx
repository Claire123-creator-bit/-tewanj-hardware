import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState('admin');
  const user = { name: role === 'admin' ? 'Admin' : 'Cashier', role };
  return (
    <AuthContext.Provider value={{ user, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
