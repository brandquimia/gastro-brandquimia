export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold text-red-600">Acceso No Autorizado</h1>
      <p className="mt-2">No tienes permisos para acceder a esta página.</p>
    </div>
  );
} 