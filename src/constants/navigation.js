import { APP_PATHS } from '../routes/paths';

export const NAV_SECTIONS = [
  {
    titleKey: 'sidebar.menu',
    items: [
      { labelKey: 'sidebar.dashboard', to: APP_PATHS.dashboard, icon: 'layout' },
      { labelKey: 'sidebar.orders', to: APP_PATHS.orders, icon: 'cart' },
      { labelKey: 'sidebar.products', to: APP_PATHS.menu, icon: 'book' },
      { labelKey: 'sidebar.customers', to: APP_PATHS.customers, icon: 'user' },
      { labelKey: 'sidebar.reviews', to: APP_PATHS.reviews, icon: 'message' },
    ],
  },
  {
    titleKey: 'sidebar.others',
    items: [
      { labelKey: 'sidebar.analytics', to: APP_PATHS.settings, icon: 'settings' },
      { labelKey: 'sidebar.payments', to: APP_PATHS.payments, icon: 'wallet' },
      { labelKey: 'sidebar.accounts', to: APP_PATHS.accounts, icon: 'user' },
      { labelKey: 'sidebar.support', to: APP_PATHS.help, icon: 'help' },
    ],
  },
];
