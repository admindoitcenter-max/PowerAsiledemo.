import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, LocationType, WorkMode } from '../context/AppContext';
import { ArrowLeft, Package, MapPin, Check, ShoppingCart, Monitor } from 'lucide-react';

export default function LocationSelection() {
  const navigate = useNavigate();
  const { user, selectedLocation, setSelectedLocation, selectedWorkMode, setSelectedWorkMode } = useApp();
  const [step, setStep] = useState<'location' | 'mode'>('location');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLocationSelect = (location: LocationType) => {
    setSelectedLocation(location);
    if (location === 'queue' || location === 't-de-caja') {
      navigate('/queue-work');
    } else {
      setStep('mode');
    }
  };

  const handleModeSelect = (mode: WorkMode) => {
    setSelectedWorkMode(mode);
    navigate('/history-selection');
  };

  const handleBack = () => {
    if (step === 'mode') {
      setStep('location');
      setSelectedLocation(null);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Selección de Ubicación</h1>
              <p className="text-sm text-gray-600">
                {step === 'location' ? 'Paso 1: Elige el tipo de ubicación' : 'Paso 2: Elige el modo de trabajo'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'location' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => handleLocationSelect('end-cap')}
              className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-blue-500 transition-all hover:shadow-lg text-left group"
            >
              <div className="bg-blue-100 p-3 rounded-lg inline-block mb-4 group-hover:bg-blue-600 transition-colors">
                <Package className="w-10 h-10 text-blue-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">End Cap</h3>
              <p className="text-gray-600 text-sm mb-3">
                Ubicación al final del pasillo, ideal para promociones destacadas
              </p>
              <span className="bg-blue-50 px-3 py-1 rounded-full text-xs text-gray-500">20 ubicaciones</span>
            </button>

            <button
              onClick={() => handleLocationSelect('side-kick')}
              className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-lg text-left group"
            >
              <div className="bg-green-100 p-3 rounded-lg inline-block mb-4 group-hover:bg-green-600 transition-colors">
                <MapPin className="w-10 h-10 text-green-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Side Kick</h3>
              <p className="text-gray-600 text-sm mb-3">
                Ubicación lateral complementaria, perfecta para productos adicionales
              </p>
              <span className="bg-green-50 px-3 py-1 rounded-full text-xs text-gray-500">20 ubicaciones</span>
            </button>

            <button
              onClick={() => handleLocationSelect('queue')}
              className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-amber-500 transition-all hover:shadow-lg text-left group"
            >
              <div className="bg-amber-100 p-3 rounded-lg inline-block mb-4 group-hover:bg-amber-600 transition-colors">
                <ShoppingCart className="w-10 h-10 text-amber-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Queue</h3>
              <p className="text-gray-600 text-sm mb-3">
                Fila de cajas, venta por impulso con artículos sugeridos
              </p>
              <span className="bg-amber-50 px-3 py-1 rounded-full text-xs text-gray-500">Variable por tienda</span>
            </button>

            <button
              onClick={() => handleLocationSelect('t-de-caja')}
              className="bg-white rounded-xl shadow-sm p-6 border-2 border-gray-200 hover:border-rose-500 transition-all hover:shadow-lg text-left group"
            >
              <div className="bg-rose-100 p-3 rounded-lg inline-block mb-4 group-hover:bg-rose-600 transition-colors">
                <Monitor className="w-10 h-10 text-rose-600 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">T de Caja</h3>
              <p className="text-gray-600 text-sm mb-3">
                Exhibidor en caja registradora, artículos de impulso
              </p>
              <span className="bg-rose-50 px-3 py-1 rounded-full text-xs text-gray-500">Variable por tienda</span>
            </button>
          </div>
        )}

        {step === 'mode' && (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center gap-3">
              <Check className="w-5 h-5 text-blue-600" />
              <span className="text-blue-900">
                Has seleccionado: <strong>{selectedLocation === 'end-cap' ? 'End Cap' : 'Side Kick'}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => handleModeSelect('solo')}
                className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200 hover:border-purple-500 transition-all hover:shadow-lg text-left group"
              >
                <div className="bg-purple-100 p-4 rounded-lg inline-block mb-4 group-hover:bg-purple-600 transition-colors">
                  <Package className="w-12 h-12 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Solo</h3>
                <p className="text-gray-600">
                  Trabajar solo la ubicación {selectedLocation === 'end-cap' ? 'End Cap' : 'Side Kick'}
                </p>
              </button>

              <button
                onClick={() => handleModeSelect('casado')}
                className="bg-white rounded-xl shadow-sm p-8 border-2 border-gray-200 hover:border-orange-500 transition-all hover:shadow-lg text-left group"
              >
                <div className="bg-orange-100 p-4 rounded-lg inline-block mb-4 group-hover:bg-orange-600 transition-colors">
                  <div className="flex gap-1">
                    <Package className="w-10 h-10 text-orange-600 group-hover:text-white" />
                    <MapPin className="w-10 h-10 text-orange-600 group-hover:text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Casado</h3>
                <p className="text-gray-600">
                  Trabajar {selectedLocation === 'end-cap' ? 'End Cap con Side Kick' : 'Side Kick con End Cap'}
                </p>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
