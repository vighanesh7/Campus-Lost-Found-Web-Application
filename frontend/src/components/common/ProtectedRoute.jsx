import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';
// Layout route: renders children only when logged in (and admin, if required).
export default function ProtectedRoute({ adminOnly = false }) {
  const { user, status } = useSelector((s) => s.auth);
  const location = useLocation();
  if (status === 'loading') return <LoadingSpinner label="Checking your session..." />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/home" replace />;
  return <Outlet />;
}
