const ALL = ['admin', 'cashier'];
const ADMIN = ['admin'];

export const menu = [
  { path: '/',          label: 'Dashboard', roles: ALL   },
  { path: '/pos',       label: 'POS',       roles: ALL   },
  { path: '/products',  label: 'Products',  roles: ADMIN },
  { path: '/invoices',  label: 'Invoices',  roles: ALL   },
  { path: '/returns',   label: 'Returns',   roles: ALL   },
  { path: '/reports',   label: 'Reports',   roles: ADMIN },
  { path: '/staff',     label: 'Staff',     roles: ADMIN },
  { path: '/settings',  label: 'Settings',  roles: ADMIN },
];
