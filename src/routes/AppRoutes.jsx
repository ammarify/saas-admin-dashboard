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
import LoginPage from '../features/auth/pages/LoginPage';
import { isAuthenticated } from '../shared/config/auth';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to={APP_PATHS.login} replace />;
  }
  return children;
}

function PublicOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to={APP_PATHS.dashboard} replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path={APP_PATHS.login}
        element={(
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        )}
      />
      <Route
        element={(
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        )}
      >
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
      <Route path="*" element={<Navigate to={isAuthenticated() ? APP_PATHS.dashboard : APP_PATHS.login} replace />} />
    </Routes>
  );
}

export default AppRoutes;
