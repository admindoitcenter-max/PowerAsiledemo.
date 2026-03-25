import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp, History, Article, ArticlePosition, LocationType, QueueArticle, ImpulseMotif } from '../context/AppContext';
import { ArrowLeft, Plus, X, Save, Package, Trash2, Edit, Upload, FileSpreadsheet, Eye, Image as ImageIcon, ShoppingCart, Camera } from 'lucide-react';

type TabType = 'historias' | 'articulos' | 'subir-excel' | 'queue';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { user, histories, setHistories, queueArticles, setQueueArticles, impulseMotifs, setImpulseMotifs } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>('historias');
  const [showCreateHistory, setShowCreateHistory] = useState(false);
  const [showViewHistory, setShowViewHistory] = useState(false);
  const [editingHistory, setEditingHistory] = useState<History | null>(null);
  const [viewingHistory, setViewingHistory] = useState<History | null>(null);
  
  const [newHistory, setNewHistory] = useState({
    name: '',
    locationType: 'end-cap' as LocationType,
    workMode: 'solo' as 'solo' | 'casado',
    articles: [] as Article[],
  });

  const [newArticle, setNewArticle] = useState({ name: '', sku: '' });
  const [excelData, setExcelData] = useState('');

  // Motif management state
  const [showCreateMotif, setShowCreateMotif] = useState(false);
  const [showViewMotif, setShowViewMotif] = useState(false);
  const [viewingMotif, setViewingMotif] = useState<ImpulseMotif | null>(null);
  const [editingMotif, setEditingMotif] = useState<ImpulseMotif | null>(null);
  const [newMotif, setNewMotif] = useState({ name: '', category: 'AUTO', articles: [] as QueueArticle[] });
  const [motifArticle, setMotifArticle] = useState({ name: '', sku: '', capacity: 4 });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [motifImage, setMotifImage] = useState('');

  if (!user || user.role !== 'admin') {
    navigate('/dashboard');
    return null;
  }

  const handleCreateHistory = () => {
    if (newHistory.name && newHistory.articles.length > 0) {
      const history: History = {
        id: Date.now().toString(),
        ...newHistory,
        image: '',
      };
      setHistories([...histories, history]);
      setShowCreateHistory(false);
      resetForm();
      alert('Historia creada exitosamente!');
    } else {
      alert('Debes agregar al menos un artículo a la historia');
    }
  };

  const handleUpdateHistory = () => {
    if (editingHistory) {
      setHistories(
        histories.map((h) =>
          h.id === editingHistory.id ? { ...editingHistory, ...newHistory } : h
        )
      );
      setEditingHistory(null);
      resetForm();
      alert('Historia actualizada exitosamente!');
    }
  };

  const handleDeleteHistory = (historyId: string) => {
    if (confirm('¿Estás seguro de eliminar esta historia? Todas las tiendas perderán acceso a esta historia sugerida.')) {
      setHistories(histories.filter((h) => h.id !== historyId));
    }
  };

  const handleEditHistory = (history: History) => {
    setEditingHistory(history);
    setNewHistory({
      name: history.name,
      locationType: history.locationType,
      workMode: history.workMode,
      articles: history.articles,
    });
    setShowCreateHistory(true);
  };

  const handleViewHistory = (history: History) => {
    setViewingHistory(history);
    setShowViewHistory(true);
  };

  const resetForm = () => {
    setNewHistory({
      name: '',
      locationType: 'end-cap',
      workMode: 'solo',
      articles: [],
    });
    setNewArticle({ name: '', sku: '' });
    setShowCreateHistory(false);
    setEditingHistory(null);
  };

  const handleAddArticleToHistory = () => {
    if (newArticle.name && newArticle.sku) {
      setNewHistory({
        ...newHistory,
        articles: [
          ...newHistory.articles,
          {
            id: Date.now().toString(),
            name: newArticle.name,
            sku: newArticle.sku,
            image: '',
            position: 'end-cap' as ArticlePosition,
            capacity: 4,
          },
        ],
      });
      setNewArticle({ name: '', sku: '' });
    }
  };

  const handleRemoveArticleFromHistory = (articleId: string) => {
    setNewHistory({
      ...newHistory,
      articles: newHistory.articles.filter((a) => a.id !== articleId),
    });
  };

  const handleProcessExcel = () => {
    if (!excelData.trim()) {
      alert('Por favor pega los datos del Excel');
      return;
    }

    try {
      // Procesar datos tipo CSV/Excel pegados
      const lines = excelData.trim().split('\n');
      const articlesMap = new Map<string, Article[]>();

      // Saltar la primera línea (headers)
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const parts = line.split('\t'); // Separado por tabs
        if (parts.length >= 3) {
          const historyName = parts[0].trim();
          const sku = parts[1].trim();
          const description = parts[2].trim();

          if (!articlesMap.has(historyName)) {
            articlesMap.set(historyName, []);
          }

          articlesMap.get(historyName)!.push({
            id: `${Date.now()}-${i}`,
            name: description,
            sku: sku,
            image: '',
            position: 'end-cap' as ArticlePosition,
            capacity: 4,
          });
        }
      }

      // Crear historias desde los datos del Excel
      const newHistories: History[] = [];
      articlesMap.forEach((articles, historyName) => {
        // Determinar tipo basado en el nombre
        let locationType: 'end-cap' | 'side-kick' = 'end-cap';
        let workMode: 'solo' | 'casado' = 'solo';

        if (historyName.toLowerCase().includes('side kick')) {
          locationType = 'side-kick';
        }
        if (historyName.toLowerCase().includes('casado') || historyName.toLowerCase().includes('combo')) {
          workMode = 'casado';
        }

        newHistories.push({
          id: Date.now().toString() + Math.random(),
          name: historyName,
          locationType,
          workMode,
          articles,
          image: '',
        });
      });

      // Agregar las nuevas historias
      setHistories([...histories, ...newHistories]);
      setExcelData('');
      alert(`${newHistories.length} historias importadas exitosamente!`);
    } catch (error) {
      alert('Error al procesar los datos. Asegúrate de que el formato sea correcto.');
    }
  };

  const allArticles = histories.flatMap((h) => h.articles);
  const uniqueArticles = Array.from(new Set(allArticles.map(a => a.sku)))
    .map(sku => allArticles.find(a => a.sku === sku)!);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-600">Gestiona historias sugeridas para todas las tiendas</p>
              </div>
            </div>

            <button
              onClick={() => setShowCreateHistory(true)}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nueva Historia
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('historias')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'historias'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📚 Historias Sugeridas
            </button>
            <button
              onClick={() => setActiveTab('articulos')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'articulos'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📦 Artículos ({uniqueArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'queue'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🛒 Queue ({queueArticles.length})
            </button>
            <button
              onClick={() => setActiveTab('subir-excel')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'subir-excel'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Importar Excel
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab: Historias Sugeridas */}
        {activeTab === 'historias' && (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <p className="text-sm text-gray-600">Total Historias</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{histories.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <p className="text-sm text-gray-600">End Caps</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {histories.filter((h) => h.locationType === 'end-cap').length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <p className="text-sm text-gray-600">Side Kicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {histories.filter((h) => h.locationType === 'side-kick').length}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <p className="text-sm text-gray-600">Artículos Únicos</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{uniqueArticles.length}</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-900">
                💡 <strong>Nota:</strong> Estas historias son sugerencias que verán todas las tiendas al trabajar sus ubicaciones. Las tiendas pueden seguirlas o crear sus propias versiones.
              </p>
            </div>

            {/* Historias List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {histories.map((history) => (
                <div
                  key={history.id}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{history.name}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                          {history.locationType === 'end-cap' ? 'End Cap' : 'Side Kick'}
                        </span>
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded">
                          {history.workMode === 'solo' ? 'Solo' : 'Casado'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>{history.articles.length}</strong> artículos
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewHistory(history)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                    <button
                      onClick={() => handleEditHistory(history)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteHistory(history.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {histories.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No hay historias configuradas
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Crea tu primera historia sugerida para las tiendas
                  </p>
                  <button
                    onClick={() => setShowCreateHistory(true)}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Crear Primera Historia
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab: Artículos */}
        {activeTab === 'articulos' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Catálogo de Artículos</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Todos los artículos únicos usados en las historias sugeridas
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usado en
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {uniqueArticles.map((article) => {
                      const usedIn = histories.filter(h => 
                        h.articles.some(a => a.sku === article.sku)
                      );
                      return (
                        <tr key={article.sku} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {article.sku}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {article.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {usedIn.length} {usedIn.length === 1 ? 'historia' : 'historias'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Subir Excel */}
        {activeTab === 'subir-excel' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FileSpreadsheet className="w-8 h-8 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Importar desde Excel</h2>
                  <p className="text-gray-600">
                    Copia y pega los datos de tu Excel en el formato: HISTORIA | ITEM NUMBER | DESCRIPCIÓN
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">📋 Formato esperado:</h3>
                <div className="bg-white rounded p-3 text-sm font-mono text-gray-800 mb-2">
                  HISTORIA &nbsp;&nbsp; ITEM NUMBER &nbsp;&nbsp; DESCRIPCIÓN<br/>
                  🚗 LAVAR EL CARRO &nbsp;&nbsp; 4371117 &nbsp;&nbsp; DESENGRASANTE FORMULA 83 32OZ<br/>
                  🚗 LAVAR EL CARRO &nbsp;&nbsp; 4371118 &nbsp;&nbsp; DESENGRASANTE FORMULA 83 GALON
                </div>
                <p className="text-sm text-blue-800">
                  Copia directamente desde Excel incluyendo los headers. El sistema agrupará automáticamente los artículos por historia.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Datos del Excel
                </label>
                <textarea
                  value={excelData}
                  onChange={(e) => setExcelData(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Pega aquí los datos copiados de Excel..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setExcelData('')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar
                </button>
                <button
                  onClick={handleProcessExcel}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Procesar e Importar
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">💡 Consejos:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Incluye la primera línea con los headers (HISTORIA, ITEM NUMBER, DESCRIPCIÓN)</li>
                  <li>Asegúrate de que las columnas estén separadas por tabulaciones</li>
                  <li>Las historias con el mismo nombre se agruparán automáticamente</li>
                  <li>Usa emojis en los nombres de historias para mejor identificación</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Queue - Motivos de Impulso */}
        {activeTab === 'queue' && (
          <div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-amber-900">
                🛒 <strong>Motivos de Impulso:</strong> Crea y gestiona los motivos sugeridos para Queue y T de Caja. Cada motivo incluye imagen de referencia, artículos y capacidad asignada que verán los vendedores.
              </p>
            </div>

            {/* Motifs Grid */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Motivos de Impulso ({impulseMotifs.length})</h2>
              <button
                onClick={() => {
                  setEditingMotif(null);
                  setNewMotif({ name: '', category: 'AUTO', articles: [] });
                  setMotifImage('');
                  setShowCreateMotif(true);
                }}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Nuevo Motivo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impulseMotifs.map((motif) => {
                const motifCap = motif.articles.reduce((s, a) => s + a.capacity, 0);
                return (
                  <div key={motif.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Image */}
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      {motif.image ? (
                        <img src={motif.image} alt={motif.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Camera className="w-10 h-10 text-gray-300 mx-auto" />
                          <p className="text-xs text-gray-400 mt-1">Sin imagen</p>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                          motif.category === 'AUTO' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {motif.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{motif.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
                        <span>{motif.articles.length} artículos</span>
                        <span className="text-gray-300">|</span>
                        <span className="font-semibold">{motifCap} uds capacidad</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => { setViewingMotif(motif); setShowViewMotif(true); }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Ver
                        </button>
                        <button
                          onClick={() => {
                            setEditingMotif(motif);
                            setNewMotif({ name: motif.name, category: motif.category, articles: [...motif.articles] });
                            setMotifImage(motif.image || '');
                            setShowCreateMotif(true);
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors text-sm"
                        >
                          <Edit className="w-4 h-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar motivo "${motif.name}"?`)) {
                              setImpulseMotifs(impulseMotifs.filter((m) => m.id !== motif.id));
                            }
                          }}
                          className="flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {impulseMotifs.length === 0 && (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay motivos de impulso</h3>
                  <p className="text-gray-600 mb-4">Crea tu primer motivo sugerido para los vendedores</p>
                  <button
                    onClick={() => { setEditingMotif(null); setNewMotif({ name: '', category: 'AUTO', articles: [] }); setMotifImage(''); setShowCreateMotif(true); }}
                    className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Crear Primer Motivo
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* View History Modal */}
      {showViewHistory && viewingHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{viewingHistory.name}</h3>
              <button onClick={() => setShowViewHistory(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-6">
              <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                {viewingHistory.locationType === 'end-cap' ? 'End Cap' : 'Side Kick'}
              </span>
              <span className="bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded">
                {viewingHistory.workMode === 'solo' ? 'Solo' : 'Casado'}
              </span>
              <span className="bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded">
                {viewingHistory.articles.length} artículos
              </span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {viewingHistory.articles.map((article, index) => (
                <div
                  key={article.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="bg-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{article.name}</p>
                    <p className="text-sm text-gray-600">SKU: {article.sku}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t flex gap-3">
              <button
                onClick={() => setShowViewHistory(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  setShowViewHistory(false);
                  handleEditHistory(viewingHistory);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-5 h-5" />
                Editar Historia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit History Modal */}
      {showCreateHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingHistory ? 'Editar Historia Sugerida' : 'Crear Nueva Historia Sugerida'}
              </h3>
              <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Historia Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Historia (agrega emoji para mejor visualización)
                </label>
                <input
                  type="text"
                  value={newHistory.name}
                  onChange={(e) => setNewHistory({ ...newHistory, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: 🚗 LAVAR EL CARRO"
                />
              </div>

              {/* Location Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Ubicación
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setNewHistory({ ...newHistory, locationType: 'end-cap' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      newHistory.locationType === 'end-cap'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <p className="font-semibold text-center">End Cap</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewHistory({ ...newHistory, locationType: 'side-kick' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      newHistory.locationType === 'side-kick'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Package className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <p className="font-semibold text-center">Side Kick</p>
                  </button>
                </div>
              </div>

              {/* Work Mode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modo de Trabajo
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setNewHistory({ ...newHistory, workMode: 'solo' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      newHistory.workMode === 'solo'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-center">Solo</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewHistory({ ...newHistory, workMode: 'casado' })}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      newHistory.workMode === 'casado'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-center">Casado</p>
                  </button>
                </div>
              </div>

              {/* Articles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Artículos ({newHistory.articles.length})
                </label>
                
                {/* Add Article Form */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newArticle.sku}
                    onChange={(e) => setNewArticle({ ...newArticle, sku: e.target.value })}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="SKU"
                  />
                  <input
                    type="text"
                    value={newArticle.name}
                    onChange={(e) => setNewArticle({ ...newArticle, name: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Descripción del artículo"
                  />
                  <button
                    onClick={handleAddArticleToHistory}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Articles List */}
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {newHistory.articles.map((article, index) => (
                    <div
                      key={article.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
                    >
                      <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{article.name}</p>
                        <p className="text-xs text-gray-600">SKU: {article.sku}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveArticleFromHistory(article.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {newHistory.articles.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay artículos agregados. Agrega al menos uno para crear la historia.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingHistory ? handleUpdateHistory : handleCreateHistory}
                  disabled={newHistory.articles.length === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {editingHistory ? 'Actualizar' : 'Crear'} Historia
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Motif Modal */}
      {showViewMotif && viewingMotif && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">{viewingMotif.name}</h3>
              <button onClick={() => setShowViewMotif(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center mb-4 border border-gray-200">
              {viewingMotif.image ? (
                <img src={viewingMotif.image} alt={viewingMotif.name} className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm text-gray-400 mt-1">Sin imagen de referencia</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded ${
                viewingMotif.category === 'AUTO' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
              }`}>
                {viewingMotif.category}
              </span>
              <span className="text-sm text-gray-600">
                {viewingMotif.articles.length} artículos • {viewingMotif.articles.reduce((s, a) => s + a.capacity, 0)} uds capacidad total
              </span>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {viewingMotif.articles.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="bg-amber-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                    <p className="text-xs text-gray-500">SKU: {a.sku}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{a.capacity} uds</p>
                    {a.price > 0 && <p className="text-xs text-gray-500">${a.price.toFixed(2)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Motif Modal */}
      {showCreateMotif && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingMotif ? 'Editar Motivo de Impulso' : 'Nuevo Motivo de Impulso'}
              </h3>
              <button onClick={() => setShowCreateMotif(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Image upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Foto del Exhibidor (Referencia para Vendedores)</label>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden relative">
                  {motifImage ? (
                    <>
                      <img src={motifImage} alt="Referencia" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setMotifImage('')}
                        className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center">
                      <Camera className="w-10 h-10 text-gray-400 mx-auto mb-1" />
                      <p className="text-sm text-gray-500">Sube la foto del exhibidor armado</p>
                      <p className="text-xs text-gray-400 mt-1">Los vendedores verán esta imagen como referencia</p>
                      <span className="mt-2 bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-amber-700 inline-block">
                        Subir Imagen
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => setMotifImage(ev.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Motivo</label>
                <input
                  type="text"
                  value={newMotif.name}
                  onChange={(e) => setNewMotif({ ...newMotif, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Ej: ACEITE PENETRANTE"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <div className="flex gap-2">
                  <select
                    value={newMotif.category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setNewCategoryName('');
                      } else {
                        setNewMotif({ ...newMotif, category: e.target.value });
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    {Array.from(new Set(impulseMotifs.map((m) => m.category))).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__new__">+ Nueva categoría...</option>
                  </select>
                  {newMotif.category === '__new__' || newCategoryName ? (
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Nombre de la categoría"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCategoryName.trim()) {
                            setNewMotif({ ...newMotif, category: newCategoryName.trim() });
                            setNewCategoryName('');
                          }
                        }}
                        className="px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm"
                      >
                        Agregar
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Articles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Artículos ({newMotif.articles.length})
                  </label>
                  <span className="text-sm text-gray-500">
                    Capacidad total: {newMotif.articles.reduce((s, a) => s + a.capacity, 0)} uds
                  </span>
                </div>

                <div className="space-y-2 max-h-[30vh] overflow-y-auto mb-3">
                  {newMotif.articles.map((a, i) => (
                    <div key={a.id} className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="bg-amber-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{a.name}</p>
                        <p className="text-xs text-gray-500">SKU: {a.sku}</p>
                      </div>
                      <span className="text-sm font-bold text-gray-700 flex-shrink-0">{a.capacity} uds</span>
                      <button
                        onClick={() => setNewMotif({ ...newMotif, articles: newMotif.articles.filter((_, idx) => idx !== i) })}
                        className="p-1 text-red-600 hover:bg-red-50 rounded flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add article form */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-gray-600 mb-2">Agregar artículo:</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={motifArticle.name}
                      onChange={(e) => setMotifArticle({ ...motifArticle, name: e.target.value })}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Nombre"
                    />
                    <input
                      type="text"
                      value={motifArticle.sku}
                      onChange={(e) => setMotifArticle({ ...motifArticle, sku: e.target.value })}
                      className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="SKU"
                    />
                    <input
                      type="number"
                      min="1"
                      value={motifArticle.capacity}
                      onChange={(e) => setMotifArticle({ ...motifArticle, capacity: parseInt(e.target.value) || 1 })}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                      placeholder="Cap"
                    />
                    <button
                      onClick={() => {
                        if (motifArticle.name && motifArticle.sku) {
                          const art: QueueArticle = {
                            id: `ma-${Date.now()}`,
                            name: motifArticle.name,
                            sku: motifArticle.sku,
                            image: '',
                            category: newMotif.category,
                            subcategory: newMotif.name,
                            price: 0,
                            quantitySold: 0,
                            capacity: motifArticle.capacity,
                          };
                          setNewMotif({ ...newMotif, articles: [...newMotif.articles, art] });
                          setMotifArticle({ name: '', sku: '', capacity: 4 });
                        }
                      }}
                      className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCreateMotif(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    if (newMotif.name && newMotif.articles.length > 0) {
                      if (editingMotif) {
                        setImpulseMotifs(impulseMotifs.map((m) =>
                          m.id === editingMotif.id
                            ? { ...m, name: newMotif.name, category: newMotif.category, articles: newMotif.articles, image: motifImage }
                            : m
                        ));
                      } else {
                        const motif: ImpulseMotif = {
                          id: `motif-${Date.now()}`,
                          name: newMotif.name,
                          category: newMotif.category,
                          articles: newMotif.articles,
                          image: motifImage,
                        };
                        setImpulseMotifs([...impulseMotifs, motif]);
                      }
                      setShowCreateMotif(false);
                      setEditingMotif(null);
                      setNewMotif({ name: '', category: 'AUTO', articles: [] });
                      setMotifImage('');
                      alert(`Motivo "${newMotif.name}" ${editingMotif ? 'actualizado' : 'creado'} exitosamente!`);
                    } else {
                      alert('Agrega un nombre y al menos un artículo');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {editingMotif ? 'Actualizar' : 'Crear'} Motivo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
