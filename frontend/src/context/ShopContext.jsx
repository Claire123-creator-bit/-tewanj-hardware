import { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [shop, setShop] = useState({
    name: 'TEWANJ HARDWARE',
    phone: '0700 000 000',
    address: 'Nairobi, Kenya',
    footer: 'Thank you for your business! Goods once sold are not returnable.',
  });
  return (
    <ShopContext.Provider value={{ shop, setShop }}>
      {children}
    </ShopContext.Provider>
  );
}

export const useShop = () => useContext(ShopContext);
