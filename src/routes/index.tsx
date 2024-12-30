import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Dashboard from '../pages/Dashboard';
import BusinessManagement from '../pages/admin/BusinessManagement';
import BusinessEdit from '../pages/admin/BusinessEdit';
import UserManagement from '../pages/admin/UserManagement';
import ReputationManagement from '../pages/admin/ReputationManagement';
import Login from 'pages/Login';
import { ProtectedRoute } from 'components/auth/ProtectedRoute';

export const AppRoutes = () => (
  <Routes>
    {/* Rutas públicas */}
    <Route path="/login" element={<Login />} />

    {/* Rutas protegidas base (requiere user) */}
    <Route element={<ProtectedRoute requiredRole="user" />}>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rutas protegidas de admin */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route path="/businesses">
            <Route index element={<BusinessManagement />} />
            <Route path="new" element={<BusinessEdit />} />
            <Route path=":id" element={<BusinessEdit />} />
          </Route>
          <Route path="/reputation" element={<ReputationManagement />} />
        </Route>

        {/* Rutas protegidas de superAdmin */}
        <Route element={<ProtectedRoute requiredRole="superAdmin" />}>
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Route>
    </Route>

    {/* Ruta por defecto */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);