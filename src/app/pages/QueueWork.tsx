import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApp, QueueArticle, ImpulseMotif } from '../context/AppContext';
import {
  ArrowLeft, ArrowRight, ShoppingCart, Monitor, Check, Save, Plus, X, Camera,
  ChevronLeft, ChevronRight, TrendingUp, AlertTriangle, ThumbsUp, ThumbsDown,
} from 'lucide-react';

type Step = 'motif' | 'articles' | 'location';

interface WorkArticle extends QueueArticle {
  assignedCapacity: number;
}

export default function QueueWork() {
  const navigate = useNavigate();
  const { user, selectedLocation, impulseMotifs, currentLocationNumber, setCurrentLocationNumber } = useApp();

  const [step, setStep] = useState<Step>('motif');
  const [selectedMotif, setSelectedMotif] = useState<ImpulseMotif | null>(null);
  const [customMotifName, setCustomMotifName] = useState('');
  const [showCreateMotif, setShowCreateMotif] = useState(false);
  const [workArticles, setWorkArticles] = useState<WorkArticle[]>([]);
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({ name: '', sku: '', capacity: 4 });
  const [motifWorks, setMotifWorks] = useState<boolean | null>(null);
  const [totalLocations, setTotalLocations] = useState(10);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const isQueue = selectedLocation === 'queue';
  const locationLabel = isQueue ? 'Queue' : 'T de Caja';
  const accentColor = isQueue ? 'amber' : 'rose';

  if (!user) {
    navigate('/dashboard');
    return null;
  }

  const categories = useMemo(() => {
    const cats = new Set(impulseMotifs.map((m) => m.category));
    return Array.from(cats);
  }, [impulseMotifs]);

  const filteredMotifs = useMemo(() => {
    if (activeCategory === 'all') return impulseMotifs;
    return impulseMotifs.filter((m) => m.category === activeCategory);
  }, [impulseMotifs, activeCategory]);

  const handleSelectMotif = (motif: ImpulseMotif) => {
    setSelectedMotif(motif);
    setWorkArticles(motif.articles.map((a) => ({ ...a, assignedCapacity: a.capacity })));
    setStep('articles');
  };

  const handleCreateMotif = () => {
    if (customMotifName.trim()) {
      const newMotif: ImpulseMotif = {
        id: `custom-${Date.now()}`,
        name: customMotifName.trim(),
        category: 'PERSONALIZADO',
        articles: [],
        image: '',
      };
      setSelectedMotif(newMotif);
      setWorkArticles([]);
      setShowCreateMotif(false);
      setCustomMotifName('');
      setStep('articles');
    }
  };

  const handleCapacityChange = (articleId: string, capacity: number) => {
    setWorkArticles((prev) =>
      prev.map((a) => (a.id === articleId ? { ...a, assignedCapacity: Math.max(0, capacity) } : a))
    );
  };

  const handleRemoveArticle = (articleId: string) => {
    setWorkArticles((prev) => prev.filter((a) => a.id !== articleId));
  };

  const handleAddArticle = () => {
    if (newArticle.name && newArticle.sku) {
      const article: WorkArticle = {
        id: `new-${Date.now()}`,
        name: newArticle.name,
        sku: newArticle.sku,
        image: '',
        category: selectedMotif?.category || 'PERSONALIZADO',
        subcategory: selectedMotif?.name || 'PERSONALIZADO',
        price: 0,
        quantitySold: 0,
        capacity: newArticle.capacity,
        assignedCapacity: newArticle.capacity,
      };
      setWorkArticles((prev) => [...prev, article]);
      setNewArticle({ name: '', sku: '', capacity: 4 });
      setShowAddArticle(false);
    }
  };

  const handleSave = () => {
    const locType = isQueue ? 'Queue' : 'T de Caja';
    alert(
      `${locType} #${currentLocationNumber} guardado exitosamente!\n` +
      `Motivo: ${selectedMotif?.name}\n` +
      `Artículos: ${workArticles.length}\n` +
      `Capacidad total: ${workArticles.reduce((sum, a) => sum + a.assignedCapacity, 0)} unidades`
    );
  };

  const handleBack = () => {
    if (step === 'articles') {
      setStep('motif');
      setSelectedMotif(null);
      setWorkArticles([]);
    } else if (step === 'location') {
      setStep('articles');
    } else {
      navigate('/location-selection');
    }
  };

  const totalCapacity = workArticles.reduce((sum, a) => sum + a.assignedCapacity, 0);

  // Dynamic accent classes
  const accentBg = isQueue ? 'bg-amber-600' : 'bg-rose-600';
  const accentBgHover = isQueue ? 'hover:bg-amber-700' : 'hover:bg-rose-700';
  const accentBgLight = isQueue ? 'bg-amber-50' : 'bg-rose-50';
  const accentBorder = isQueue ? 'border-amber-200' : 'border-rose-200';
  const accentText = isQueue ? 'text-amber-600' : 'text-rose-600';
  const accentTextDark = isQueue ? 'text-amber-900' : 'text-rose-900';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {isQueue ? <ShoppingCart className={`w-7 h-7 ${accentText}`} /> : <Monitor className={`w-7 h-7 ${accentText}`} />}
                  {locationLabel}
                </h1>
                <p className="text-sm text-gray-600">
                  {step === 'motif' && 'Paso 1: Selecciona el motivo de impulso'}
                  {step === 'articles' && `Paso 2: Configura artículos y capacidad • ${selectedMotif?.name}`}
                  {step === 'location' && `Paso 3: Ubicación #${currentLocationNumber} • ${selectedMotif?.name}`}
                </p>
              </div>
            </div>

            {/* Step indicators */}
            <div className="hidden sm:flex items-center gap-2">
              {(['motif', 'articles', 'location'] as Step[]).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    step === s ? `${accentBg} text-white` :
                    (['motif', 'articles', 'location'].indexOf(step) > i) ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {(['motif', 'articles', 'location'].indexOf(step) > i) ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  {i < 2 && <div className="w-8 h-0.5 bg-gray-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ========== STEP 1: Motif Selection ========== */}
        {step === 'motif' && (
          <div>
            <div className={`${accentBgLight} border ${accentBorder} rounded-lg p-4 mb-6`}>
              <p className={`text-sm ${accentTextDark}`}>
                💡 Selecciona un motivo de impulso sugerido por el merchandising o crea uno nuevo personalizado.
              </p>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === 'all' ? `${accentBg} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todas ({impulseMotifs.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === cat ? `${accentBg} text-white` : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat} ({impulseMotifs.filter((m) => m.category === cat).length})
                </button>
              ))}
            </div>

            {/* Create custom motif button */}
            <button
              onClick={() => setShowCreateMotif(true)}
              className={`w-full mb-6 flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed ${accentBorder} rounded-xl ${accentText} font-medium hover:${accentBgLight} transition-colors`}
            >
              <Plus className="w-5 h-5" />
              Crear Nuevo Motivo de Impulso
            </button>

            {/* Motif cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMotifs.map((motif) => {
                const motifCapacity = motif.articles.reduce((sum, a) => sum + a.capacity, 0);
                return (
                  <button
                    key={motif.id}
                    onClick={() => handleSelectMotif(motif)}
                    className="bg-white rounded-xl shadow-sm p-5 border-2 border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all text-left group"
                  >
                    {/* Image preview */}
                    <div className="aspect-[16/9] bg-gray-100 rounded-lg flex items-center justify-center mb-3 border border-gray-200 overflow-hidden">
                      {motif.image ? (
                        <img src={motif.image} alt={motif.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Camera className="w-8 h-8 text-gray-300 mx-auto" />
                          <p className="text-[10px] text-gray-400 mt-1">Imagen del motivo</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                        motif.category === 'AUTO' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {motif.category}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{motif.name}</h3>

                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span>{motif.articles.length} artículos</span>
                      <span className="text-gray-300">|</span>
                      <span className="font-semibold">{motifCapacity} uds capacidad</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {motif.articles.slice(0, 2).map((a) => (
                        <span key={a.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded truncate max-w-[150px]">
                          {a.name}
                        </span>
                      ))}
                      {motif.articles.length > 2 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          +{motif.articles.length - 2} más
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ========== STEP 2: Articles & Capacity ========== */}
        {step === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Artículos - {selectedMotif?.name}
                </h2>
                <button
                  onClick={() => setShowAddArticle(true)}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Artículo
                </button>
              </div>

              <div className={`${accentBgLight} border ${accentBorder} rounded-lg p-4 mb-6`}>
                <p className={`text-sm ${accentTextDark}`}>
                  ⚖️ Configura la capacidad (unidades) de cada artículo en el exhibidor. Si no cumple la capacidad asignada, puedes agregar artículos adicionales.
                </p>
              </div>

              {workArticles.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 border border-gray-200 text-center">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No hay artículos. Agrega artículos para este motivo.</p>
                  <button
                    onClick={() => setShowAddArticle(true)}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Agregar primer artículo
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {workArticles.map((article, index) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 flex items-center gap-4"
                    >
                      <div className={`${accentBg} text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{article.name}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>SKU: {article.sku}</span>
                          {article.price > 0 && <span>${article.price.toFixed(2)}</span>}
                          {article.quantitySold > 0 && (
                            <span className="flex items-center gap-1 text-green-700">
                              <TrendingUp className="w-3 h-3" />
                              {article.quantitySold.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Capacity input */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <label className="text-xs text-gray-500">Capacidad:</label>
                        <input
                          type="number"
                          min="0"
                          value={article.assignedCapacity}
                          onChange={(e) => handleCapacityChange(article.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveArticle(article.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Admin Reference + Summary */}
            <div>
              <div className="sticky top-8 space-y-4">
                {/* Admin suggested reference */}
                {selectedMotif && !selectedMotif.id.startsWith('custom-') && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      📋 Referencia del Admin
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Motivo de impulso sugerido por merchandising
                    </p>

                    {/* Motif image */}
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
                      {selectedMotif.image ? (
                        <img src={selectedMotif.image} alt={selectedMotif.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="text-center">
                          <Camera className="w-10 h-10 text-gray-400 mx-auto mb-1" />
                          <p className="text-xs text-gray-400">Imagen de referencia</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        selectedMotif.category === 'AUTO' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedMotif.category}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{selectedMotif.name}</span>
                    </div>

                    {/* Suggested articles list */}
                    <div className="space-y-1.5 max-h-[40vh] overflow-y-auto">
                      {selectedMotif.articles.map((a, i) => (
                        <div key={a.id} className={`flex items-center gap-2 p-2 rounded-lg ${accentBgLight} border ${accentBorder}`}>
                          <div className={`${accentBg} text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">{a.name}</p>
                            <p className="text-[10px] text-gray-500">SKU: {a.sku}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xs font-bold text-gray-900">{a.capacity} uds</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-3 pt-3 border-t ${accentBorder} flex justify-between items-center`}>
                      <span className="text-xs text-gray-600">Capacidad sugerida:</span>
                      <span className="text-sm font-bold text-gray-900">
                        {selectedMotif.articles.reduce((sum, a) => sum + a.capacity, 0)} uds
                      </span>
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Resumen</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Motivo:</span>
                      <span className="font-medium">{selectedMotif?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Artículos:</span>
                      <span className="font-medium">{workArticles.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacidad total:</span>
                      <span className="font-bold text-lg">{totalCapacity} uds</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setStep('location')}
                      disabled={workArticles.length === 0}
                      className={`w-full flex items-center justify-center gap-2 ${accentBg} text-white py-3 rounded-lg ${accentBgHover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium`}
                    >
                      Continuar a Ubicaciones
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== STEP 3: Location Assignment ========== */}
        {step === 'location' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Location number config */}
              <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 mb-6 flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Total de ubicaciones en tu tienda:</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={totalLocations}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setTotalLocations(Math.max(1, Math.min(50, val)));
                    if (currentLocationNumber > val) setCurrentLocationNumber(val);
                  }}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Location header */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {locationLabel} #{currentLocationNumber}
                  </h2>
                  <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                    {currentLocationNumber} de {totalLocations}
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-3">Artículos asignados ({workArticles.length}):</h3>
                <div className="space-y-2">
                  {workArticles.map((article, index) => (
                    <div key={article.id} className={`flex items-center gap-3 p-3 ${accentBgLight} border ${accentBorder} rounded-lg`}>
                      <div className={`${accentBg} text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0`}>
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{article.name}</p>
                        <p className="text-xs text-gray-500">SKU: {article.sku}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">{article.assignedCapacity} uds</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`mt-4 pt-4 border-t ${accentBorder} flex justify-between items-center`}>
                  <span className="text-sm text-gray-600">Capacidad total:</span>
                  <span className="text-lg font-bold text-gray-900">{totalCapacity} unidades</span>
                </div>
              </div>

              {/* Strategy evaluation */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">¿El motivo de impulso funciona?</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => setMotifWorks(true)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                      motifWorks === true
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    Sí, mantener
                  </button>
                  <button
                    onClick={() => setMotifWorks(false)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium ${
                      motifWorks === false
                        ? 'border-red-500 bg-red-50 text-red-800'
                        : 'border-gray-200 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                    No, cambiar estrategia
                  </button>
                </div>
                {motifWorks === false && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Se recomienda cambiar la estrategia. Puedes volver al paso 1 para seleccionar otro motivo.
                  </div>
                )}
              </div>

              {/* Navigation between locations */}
              <div className="flex items-center justify-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <button
                  onClick={() => currentLocationNumber > 1 && setCurrentLocationNumber(currentLocationNumber - 1)}
                  disabled={currentLocationNumber === 1}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <select
                  value={currentLocationNumber}
                  onChange={(e) => setCurrentLocationNumber(parseInt(e.target.value))}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                >
                  {Array.from({ length: totalLocations }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Ubicación {num} de {totalLocations}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => currentLocationNumber < totalLocations && setCurrentLocationNumber(currentLocationNumber + 1)}
                  disabled={currentLocationNumber === totalLocations}
                  className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right: Save & Alerts */}
            <div>
              <div className="sticky top-8 space-y-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Guardar Ubicación</h3>
                  <button
                    onClick={handleSave}
                    className={`w-full flex items-center justify-center gap-2 ${accentBg} text-white py-3 rounded-lg ${accentBgHover} transition-colors font-medium`}
                  >
                    <Save className="w-5 h-5" />
                    Guardar {locationLabel} #{currentLocationNumber}
                  </button>
                </div>

                <div className={`${accentBgLight} border ${accentBorder} rounded-lg p-4`}>
                  <h4 className={`font-semibold ${accentTextDark} mb-2`}>🔔 Alertas de Stock</h4>
                  <p className={`text-sm ${isQueue ? 'text-amber-800' : 'text-rose-800'}`}>
                    Se enviará una alerta cuando el stock de los artículos disminuya respecto a la capacidad asignada de {totalCapacity} unidades.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">💡 Nota</h4>
                  <p className="text-sm text-blue-800">
                    Estas ubicaciones se trabajan por separado. Navega entre las ubicaciones para configurar cada una individualmente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========== MODALS ========== */}

      {/* Create Custom Motif Modal */}
      {showCreateMotif && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Nuevo Motivo de Impulso</h3>
              <button onClick={() => setShowCreateMotif(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del motivo</label>
                <input
                  type="text"
                  value={customMotifName}
                  onChange={(e) => setCustomMotifName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: Productos de Temporada"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateMotif(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateMotif}
                  className={`flex-1 px-4 py-2 ${accentBg} text-white rounded-lg ${accentBgHover} transition-colors`}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Article Modal */}
      {showAddArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Agregar Artículo</h3>
              <button onClick={() => setShowAddArticle(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Artículo</label>
                <input
                  type="text"
                  value={newArticle.name}
                  onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: Desodorante Spray 2oz"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <input
                  type="text"
                  value={newArticle.sku}
                  onChange={(e) => setNewArticle({ ...newArticle, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: SKU001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidad (unidades)</label>
                <input
                  type="number"
                  min="1"
                  value={newArticle.capacity}
                  onChange={(e) => setNewArticle({ ...newArticle, capacity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddArticle(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddArticle}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
