export const formatKES = (n) =>
  new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n);
