import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard/DashboardLayout';
import { APP_PATHS } from './paths';
import DashboardPage from '../features/dashboard/pages/EcommerceDashboardPage';
import OrdersPage from '../features/orders/pages/OrdersPage';
import MenuPage from '../features/menu/pages/MenuPage';
import CustomersPage from '../features/customers/pages/CustomersPage';
import ReviewsPage from '../features/reviews/pages/ReviewsPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import PaymentsPage from '../features/payments/pages/PaymentsPage';
import AccountsPage from '../features/accounts/pages/AccountsPage';
import HelpPage from '../features/help/pages/HelpPage';
import PageNotFound from '../shared/components/common/PageNotFound';

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path={APP_PATHS.dashboard} element={<DashboardPage />} />
        <Route path={APP_PATHS.orders} element={<OrdersPage />} />
        <Route path={APP_PATHS.menu} element={<MenuPage />} />
        <Route path={APP_PATHS.customers} element={<CustomersPage />} />
        <Route path={APP_PATHS.reviews} element={<ReviewsPage />} />
        <Route path={APP_PATHS.settings} element={<SettingsPage />} />
        <Route path={APP_PATHS.payments} element={<PaymentsPage />} />
        <Route path={APP_PATHS.accounts} element={<AccountsPage />} />
        <Route path={APP_PATHS.help} element={<HelpPage />} />
      </Route>
      <Route path="/404" element={<PageNotFound />} />
      <Route path="*" element={<Navigate to={APP_PATHS.dashboard} replace />} />
    </Routes>
  );
}

export default AppRoutes;
