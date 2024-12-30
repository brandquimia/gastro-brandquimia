import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { User, UserRole } from '../../types/user';
import { useAuth } from '../../hooks/useAuth';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' as UserRole });
  const { userProfile } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createUser(newUser);
      setNewUser({ email: '', password: '', role: 'user' });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>

      {/* Formulario para crear usuario */}
      <form onSubmit={handleCreateUser} className="mb-6 p-4 bg-gray-50 rounded">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            placeholder="Contraseña"
            className="p-2 border rounded"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
            className="p-2 border rounded"
          >
            <option value="user">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Crear Usuario
        </button>
      </form>

      {/* Lista de usuarios */}
      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.uid}
            className="p-4 border rounded shadow flex justify-between items-center"
          >
            <div>
              <h3 className="font-bold">{user.email}</h3>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
            </div>
            <div className="flex gap-2">
              {user.role !== 'superAdmin' && userProfile?.role === 'superAdmin' && (
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                  className="border rounded p-1"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 