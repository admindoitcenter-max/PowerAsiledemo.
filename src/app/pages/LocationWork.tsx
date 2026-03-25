import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApp, Article, ArticlePosition } from '../context/AppContext';
import { ArrowLeft, ChevronLeft, ChevronRight, Package, MapPin, Save, Plus, X, Camera } from 'lucide-react';

export default function LocationWork() {
  const navigate = useNavigate();
  const {
    user,
    selectedLocation,
    selectedWorkMode,
    selectedHistory,
    currentLocationNumber,
    setCurrentLocationNumber
  } = useApp();

  const [articles, setArticles] = useState<Article[]>(
    selectedHistory?.articles || []
  );
  const [showAddArticle, setShowAddArticle] = useState(false);
  const [newArticle, setNewArticle] = useState({ name: '', sku: '', position: 'end-cap' as ArticlePosition, capacity: 4 });
  const [filterPosition, setFilterPosition] = useState<'all' | ArticlePosition>('all');

  const totalLocations = 20;
  const isCasado = selectedWorkMode === 'casado';

  if (!user || !selectedLocation || !selectedWorkMode) {
    navigate('/dashboard');
    return null;
  }

  const endCapArticles = useMemo(() => articles.filter(a => a.position === 'end-cap'), [articles]);
  const sideKickArticles = useMemo(() => articles.filter(a => a.position === 'side-kick'), [articles]);
  const filteredArticles = useMemo(() => {
    if (filterPosition === 'all') return articles;
    return articles.filter(a => a.position === filterPosition);
  }, [articles, filterPosition]);

  const totalCapacity = articles.reduce((sum, a) => sum + a.capacity, 0);

  const handlePrevious = () => {
    if (currentLocationNumber > 1) setCurrentLocationNumber(currentLocationNumber - 1);
  };

  const handleNext = () => {
    if (currentLocationNumber < totalLocations) setCurrentLocationNumber(currentLocationNumber + 1);
  };

  const handleSave = () => {
    alert(
      `${selectedLocation === 'end-cap' ? 'End Cap' : 'Side Kick'} #${currentLocationNumber} guardado!\n` +
      `Artículos: ${articles.length} | Capacidad total: ${totalCapacity} uds` +
      (isCasado ? `\nEnd Cap: ${endCapArticles.length} artículos | Side Kick: ${sideKickArticles.length} artículos` : '')
    );
  };

  const handleAddArticle = () => {
    if (newArticle.name && newArticle.sku) {
      setArticles([
        ...articles,
        {
          id: Date.now().toString(),
          name: newArticle.name,
          sku: newArticle.sku,
          image: '',
          position: newArticle.position,
          capacity: newArticle.capacity,
        },
      ]);
      setNewArticle({ name: '', sku: '', position: 'end-cap', capacity: 4 });
      setShowAddArticle(false);
    }
  };

  const handleRemoveArticle = (articleId: string) => {
    setArticles(articles.filter((a) => a.id !== articleId));
  };

  const handleCapacityChange = (articleId: string, capacity: number) => {
    setArticles(articles.map(a => a.id === articleId ? { ...a, capacity: Math.max(0, capacity) } : a));
  };

  const getPositionBadge = (position: ArticlePosition) => {
    if (position === 'end-cap') {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
          <Package className="w-3 h-3" />
          End Cap
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-800">
        <MapPin className="w-3 h-3" />
        Side Kick
      </span>
    );
  };

  const getPositionColor = (position: ArticlePosition) => {
    return position === 'end-cap'
      ? 'bg-blue-50 border-blue-200 border-l-blue-500'
      : 'bg-green-50 border-green-200 border-l-green-500';
  };

  const renderArticleCard = (article: Article, index: number, showPosition: boolean) => (
    <div
      key={article.id}
      className={`flex items-center gap-3 p-3 border rounded-lg border-l-4 ${getPositionColor(article.position)} group`}
    >
      <div className={`${article.position === 'end-cap' ? 'bg-blue-600' : 'bg-green-600'} text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0`}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{article.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">SKU: {article.sku}</span>
          {showPosition && getPositionBadge(article.position)}
        </div>
      </div>
      <div className="text-right flex-shrink-0">
        <span className="text-xs text-gray-500 block">Cap.</span>
        <span className="text-sm font-bold text-gray-900">{article.capacity}</span>
      </div>
    </div>
  );

  const renderWorkArticleCard = (article: Article, index: number) => (
    <div
      key={article.id}
      className={`flex items-center gap-3 p-3 border rounded-lg border-l-4 ${getPositionColor(article.position)} group`}
    >
      <div className={`${article.position === 'end-cap' ? 'bg-blue-600' : 'bg-green-600'} text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0`}>
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm truncate">{article.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-gray-500">SKU: {article.sku}</span>
          {getPositionBadge(article.position)}
        </div>
      </div>
      {/* Capacity input */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <input
          type="number"
          min="0"
          value={article.capacity}
          onChange={(e) => handleCapacityChange(article.id, parseInt(e.target.value) || 0)}
          className="w-14 px-1 py-1 border border-gray-300 rounded text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-xs text-gray-400">uds</span>
      </div>
      <button
        onClick={() => handleRemoveArticle(article.id)}
        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/history-selection')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedLocation === 'end-cap' ? 'End Cap' : 'Side Kick'} #{currentLocationNumber}
                </h1>
                <p className="text-sm text-gray-600">
                  Modo {selectedWorkMode === 'solo' ? 'Solo' : 'Casado'}
                  {selectedHistory && ` • ${selectedHistory.name}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Position counters */}
              {isCasado && (
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded font-semibold">
                    <Package className="w-3 h-3" /> EC: {endCapArticles.length}
                  </span>
                  <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                    <MapPin className="w-3 h-3" /> SK: {sideKickArticles.length}
                  </span>
                </div>
              )}
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                {currentLocationNumber} de {totalLocations}
              </div>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-5 h-5" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Reference */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Referencia {selectedHistory ? '(Historia Sugerida)' : '(Personalizada)'}
            </h2>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Imagen de referencia</p>
                </div>
              </div>

              {/* Casado mode: group by position */}
              {isCasado && selectedHistory ? (
                <div className="space-y-4">
                  {/* End Cap articles */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <h3 className="font-semibold text-blue-900">End Cap ({selectedHistory.articles.filter(a => a.position === 'end-cap').length})</h3>
                    </div>
                    <div className="space-y-2">
                      {selectedHistory.articles.filter(a => a.position === 'end-cap').map((article, index) =>
                        renderArticleCard(article, index, false)
                      )}
                    </div>
                  </div>
                  {/* Side Kick articles */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <h3 className="font-semibold text-green-900">Side Kick ({selectedHistory.articles.filter(a => a.position === 'side-kick').length})</h3>
                    </div>
                    <div className="space-y-2">
                      {selectedHistory.articles.filter(a => a.position === 'side-kick').map((article, index) =>
                        renderArticleCard(article, index, false)
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">Artículos Sugeridos:</h3>
                  {selectedHistory?.articles.map((article, index) =>
                    renderArticleCard(article, index, isCasado)
                  )}
                  {!selectedHistory && (
                    <p className="text-gray-500 text-sm italic">
                      No hay artículos de referencia. Agrega artículos en la sección de trabajo.
                    </p>
                  )}
                </div>
              )}

              {/* Capacity summary */}
              {selectedHistory && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-sm text-gray-600">Capacidad total sugerida:</span>
                  <span className="text-lg font-bold text-gray-900">
                    {selectedHistory.articles.reduce((sum, a) => sum + a.capacity, 0)} uds
                  </span>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2">💡 Nota</h4>
              <p className="text-sm text-amber-800">
                {isCasado
                  ? 'En modo Casado, los artículos están separados por ubicación (End Cap y Side Kick). Puedes modificar la capacidad de cada uno.'
                  : 'Puedes seguir la historia sugerida o agregar tus propios artículos. Ajusta la capacidad según las necesidades de tu tienda.'}
              </p>
            </div>
          </div>

          {/* Right Column - Work Area */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Área de Trabajo</h2>
              <button
                onClick={() => setShowAddArticle(true)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Agregar Artículo
              </button>
            </div>

            {/* Position filter (casado mode) */}
            {isCasado && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilterPosition('all')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterPosition === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos ({articles.length})
                </button>
                <button
                  onClick={() => setFilterPosition('end-cap')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterPosition === 'end-cap' ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <Package className="w-3 h-3" />
                  End Cap ({endCapArticles.length})
                </button>
                <button
                  onClick={() => setFilterPosition('side-kick')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filterPosition === 'side-kick' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <MapPin className="w-3 h-3" />
                  Side Kick ({sideKickArticles.length})
                </button>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Toma una foto del trabajo realizado</p>
                  <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Subir Imagen
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Artículos Asignados:</h3>
                  <span className="text-sm text-gray-600">{filteredArticles.length} artículos • {totalCapacity} uds</span>
                </div>

                <div className="space-y-2">
                  {filteredArticles.map((article, index) => renderWorkArticleCard(article, index))}
                </div>

                {filteredArticles.length === 0 && (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">No hay artículos asignados</p>
                    <button
                      onClick={() => setShowAddArticle(true)}
                      className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Agregar primer artículo
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-3 bg-white rounded-xl shadow-sm p-4 border border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentLocationNumber === 1}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <select
                value={currentLocationNumber}
                onChange={(e) => setCurrentLocationNumber(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                {Array.from({ length: totalLocations }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Ubicación {num} de {totalLocations}
                  </option>
                ))}
              </select>

              <button
                onClick={handleNext}
                disabled={currentLocationNumber === totalLocations}
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Article Modal */}
      {showAddArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Agregar Artículo</h3>
              <button
                onClick={() => setShowAddArticle(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Artículo
                </label>
                <input
                  type="text"
                  value={newArticle.name}
                  onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Coca-Cola 2L"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  value={newArticle.sku}
                  onChange={(e) => setNewArticle({ ...newArticle, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: SKU001"
                />
              </div>

              {/* Position selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNewArticle({ ...newArticle, position: 'end-cap' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                      newArticle.position === 'end-cap'
                        ? 'border-blue-500 bg-blue-50 text-blue-800'
                        : 'border-gray-200 text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    End Cap
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewArticle({ ...newArticle, position: 'side-kick' })}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                      newArticle.position === 'side-kick'
                        ? 'border-green-500 bg-green-50 text-green-800'
                        : 'border-gray-200 text-gray-700 hover:border-green-300'
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    Side Kick
                  </button>
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidad (unidades)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newArticle.capacity}
                  onChange={(e) => setNewArticle({ ...newArticle, capacity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
