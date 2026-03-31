// ─── App.jsx ──────────────────────────────────────────────────────────────────
// Root component — decides which page to render based on auth state.
//
// In a real app with react-router-dom you'd use <Route> with a ProtectedRoute
// wrapper that checks selectUser(). We keep it simple here with inline branching
// since the routing is trivial: 3 states → 3 views.
//
//  No user     → LoginPage
//  role=admin  → AdminDashboard
//  role=client → ClientDashboard

import { useSelector } from 'react-redux';
import { selectUser } from './features/auth/authSlice';
import LoginPage       from './pages/LoginPage';
import AdminDashboard  from './pages/AdminDashboard';
import ClientDashboard from './pages/ClientDashboard';

export default function App() {
  const user = useSelector(selectUser);

  if (!user)               return <LoginPage />;
  if (user.role === 'admin')  return <AdminDashboard />;
  if (user.role === 'client') return <ClientDashboard />;

  console.error('Unknown role:', user.role);
  return <LoginPage />;
}
