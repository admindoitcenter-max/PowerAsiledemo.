import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Package, Plus, Sparkles } from 'lucide-react';

export default function HistorySelection() {
  const navigate = useNavigate();
  const { user, selectedLocation, selectedWorkMode, histories, setSelectedHistory } = useApp();

  if (!user || !selectedLocation || !selectedWorkMode) {
    navigate('/dashboard');
    return null;
  }

  const filteredHistories = histories.filter(
    (h) => h.locationType === selectedLocation && h.workMode === selectedWorkMode
  );

  const handleHistorySelect = (historyId: string) => {
    const history = histories.find((h) => h.id === historyId);
    if (history) {
      setSelectedHistory(history);
      navigate('/location-work');
    }
  };

  const handleCreateCustom = () => {
    // Para crear historia personalizada
    setSelectedHistory(null);
    navigate('/location-work');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/location-selection')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Selección de Historia</h1>
              <p className="text-sm text-gray-600">
                {selectedLocation === 'end-cap' ? 'End Cap' : 'Side Kick'} - Modo {selectedWorkMode === 'solo' ? 'Solo' : 'Casado'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Historias Sugeridas</h2>
          <p className="text-gray-600">
            Selecciona una historia predefinida o crea tu propia configuración personalizada
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Crear Historia Personalizada */}
          <button
            onClick={handleCreateCustom}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all text-left group"
          >
            <div className="bg-white/20 p-4 rounded-lg inline-block mb-4 group-hover:bg-white/30 transition-colors">
              <Plus className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Crear Personalizada</h3>
            <p className="text-purple-100">
              Crea tu propia historia con artículos personalizados
            </p>
          </button>

          {/* Historias Predefinidas */}
          {filteredHistories.map((history) => (
            <button
              key={history.id}
              onClick={() => handleHistorySelect(history.id)}
              className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-600 transition-colors">
                  <Sparkles className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Sugerida
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{history.name}</h3>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>{history.articles.length}</strong> artículos incluidos:
                </p>
                <div className="flex flex-wrap gap-2">
                  {history.articles.slice(0, 3).map((article) => (
                    <span
                      key={article.id}
                      className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {article.name}
                    </span>
                  ))}
                  {history.articles.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{history.articles.length - 3} más
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {history.locationType === 'end-cap' ? 'End Cap' : 'Side Kick'} • {history.workMode === 'solo' ? 'Solo' : 'Casado'}
                </span>
              </div>
            </button>
          ))}
        </div>

        {filteredHistories.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay historias disponibles
            </h3>
            <p className="text-gray-600 mb-4">
              No se encontraron historias sugeridas para esta configuración
            </p>
            <button
              onClick={handleCreateCustom}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Crear Historia Personalizada
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
