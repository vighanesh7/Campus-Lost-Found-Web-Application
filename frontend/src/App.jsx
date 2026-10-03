import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './redux/authSlice';
import ProtectedRoute from './components/common/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import SearchItems from './pages/SearchItems';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import ReportItem from './pages/ReportItem';
import ItemDetails from './pages/ItemDetails';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import MyItems from './pages/MyItems';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminItems from './pages/admin/AdminItems';
import AdminReports from './pages/admin/AdminReports';
import AdminCategories from './pages/admin/AdminCategories';

export default function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);
  // On page refresh we only have the token: ask the server who the user is (GET /api/auth/me).
  useEffect(() => { if (token && !user) dispatch(fetchCurrentUser()); }, [dispatch, token, user]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/search" element={<SearchItems />} />
          <Route path="/lost" element={<LostItems />} />
          <Route path="/found" element={<FoundItems />} />
          <Route path="/report" element={<ReportItem />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:conversationId" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/my/:type" element={<MyItems />} />
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/items" element={<AdminItems />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
