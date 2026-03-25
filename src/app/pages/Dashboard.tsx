import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Store, Package, Settings, LogOut, MapPin, TrendingUp, ShoppingCart, Monitor } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser, histories, queueArticles } = useApp();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Power Aisle</h1>
                <p className="text-sm text-gray-600">
                  Bienvenido, {user.name} ({user.role})
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">End Caps</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">20</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Side Kicks</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">20</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Queue</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{queueArticles.length}</p>
              </div>
              <div className="bg-amber-100 p-2 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">T de Caja</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{queueArticles.length}</p>
              </div>
              <div className="bg-rose-100 p-2 rounded-lg">
                <Monitor className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Historias</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{histories.length}</p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/location-selection')}
            className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg text-left group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4 group-hover:bg-blue-600 transition-colors">
                  <Package className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Trabajar Ubicaciones
                </h3>
                <p className="text-gray-600">
                  Selecciona y trabaja End Caps, Side Kicks, Queue y T de Caja
                </p>
              </div>
            </div>
          </button>

          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-lg text-left group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="bg-purple-100 p-3 rounded-lg inline-block mb-4 group-hover:bg-purple-600 transition-colors">
                    <Settings className="w-8 h-8 text-purple-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Panel de Administración
                  </h3>
                  <p className="text-gray-600">
                    Gestiona historias, artículos y configuraciones del sistema
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">End Cap #5 completado</p>
                <p className="text-xs text-gray-600">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Side Kick #3 actualizado</p>
                <p className="text-xs text-gray-600">Hace 5 horas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}