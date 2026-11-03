export const sales = [
  {
    id: 'INV-001', date: '2026-11-01', customer: 'John Kamau', phone: '0712000001',
    items: [{ name: 'Cement 50kg', qty: 2, unit: 'Bag', price: 750 }],
    total: 1500, paid: 1500, balance: 0, method: 'M-Pesa', mpesaRef: 'QA12345678', status: 'paid'
  },
  {
    id: 'INV-002', date: '2026-11-01', customer: 'Walk-in', phone: '',
    items: [{ name: 'Nails 3 inch', qty: 5, unit: 'Kg', price: 220 }],
    total: 1100, paid: 1100, balance: 0, method: 'Cash', mpesaRef: '', status: 'paid'
  },
  {
    id: 'INV-003', date: '2026-11-02', customer: 'Mary Wanjiku', phone: '0712000002',
    items: [{ name: 'Roofing sheet', qty: 10, unit: 'Piece', price: 900 }],
    total: 9000, paid: 5000, balance: 4000, method: 'M-Pesa', mpesaRef: 'QB98765432', status: 'partial'
  },
  {
    id: 'INV-004', date: '2026-11-03', customer: 'Peter Otieno', phone: '0712000003',
    items: [{ name: 'Paint (white)', qty: 4, unit: 'Litre', price: 450 }],
    total: 1800, paid: 0, balance: 1800, method: '', mpesaRef: '', status: 'unpaid'
  },
];
