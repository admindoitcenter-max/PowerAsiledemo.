import React, { createContext, useContext, useState, ReactNode } from 'react';

export type LocationType = 'end-cap' | 'side-kick' | 'queue' | 't-de-caja';
export type WorkMode = 'solo' | 'casado';

export type ArticlePosition = 'end-cap' | 'side-kick';

export interface Article {
  id: string;
  name: string;
  image: string;
  sku: string;
  position: ArticlePosition;
  capacity: number;
}

export interface QueueArticle {
  id: string;
  name: string;
  sku: string;
  image: string;
  category: string;
  subcategory: string;
  price: number;
  quantitySold: number;
  capacity: number;
}

export interface ImpulseMotif {
  id: string;
  name: string;
  category: string;
  articles: QueueArticle[];
  image: string;
}

export interface History {
  id: string;
  name: string;
  locationType: LocationType;
  workMode: WorkMode;
  articles: Article[];
  image: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor' | 'tienda';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  selectedLocation: LocationType | null;
  setSelectedLocation: (location: LocationType | null) => void;
  selectedWorkMode: WorkMode | null;
  setSelectedWorkMode: (mode: WorkMode | null) => void;
  selectedHistory: History | null;
  setSelectedHistory: (history: History | null) => void;
  currentLocationNumber: number;
  setCurrentLocationNumber: (num: number) => void;
  histories: History[];
  setHistories: (histories: History[]) => void;
  queueArticles: QueueArticle[];
  setQueueArticles: (articles: QueueArticle[]) => void;
  impulseMotifs: ImpulseMotif[];
  setImpulseMotifs: (motifs: ImpulseMotif[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationType | null>(null);
  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<History | null>(null);
  const [currentLocationNumber, setCurrentLocationNumber] = useState<number>(1);
  
  // Mock Queue articles data
  const [queueArticles, setQueueArticles] = useState<QueueArticle[]>([
    { id: 'q1', name: 'WD-40 08OZ ACEITE PENETRANTE SPRAY', sku: '1902004', image: '', category: 'AUTO', subcategory: 'ACEITE PENETRANTE', price: 5.99, quantitySold: 1228, capacity: 12 },
    { id: 'q2', name: 'LIMPIADOR PARA TODO USO 32 OZ. #29-235', sku: '11029235', image: '', category: 'AUTO', subcategory: 'DESENGRASANTES', price: 5.99, quantitySold: 600, capacity: 8 },
    { id: 'q3', name: 'PANOS DE MICROFIBRAS 14" 3PZ', sku: '11028314', image: '', category: 'AUTO', subcategory: 'CHAMOIS Y TOALLONES', price: 5.99, quantitySold: 390, capacity: 10 },
    { id: 'q4', name: 'SPRAY LIMPIADOR PARA ASIENTO DE AUTO', sku: '7584924', image: '', category: 'AUTO', subcategory: 'LIMPIADORES P/TAPIZ', price: 5.99, quantitySold: 335, capacity: 8 },
    { id: 'q5', name: 'PAÑOS MICROFIBRA 4 PK', sku: '155PAMFB07', image: '', category: 'AUTO', subcategory: 'CHAMOIS Y TOALLONES', price: 5.99, quantitySold: 127, capacity: 6 },
    { id: 'q6', name: 'LIMPIADOR P/CARBURADOR STP #578-231', sku: '7578231', image: '', category: 'AUTO', subcategory: 'ACEITE PENETRANTE', price: 5.99, quantitySold: 120, capacity: 6 },
    { id: 'q7', name: 'SPRAY LIMPIADOR Y PROTECTOR TAPIZ 10OZ', sku: '4721008', image: '', category: 'AUTO', subcategory: 'LIMPIADORES P/TAPIZ', price: 5.99, quantitySold: 113, capacity: 6 },
    { id: 'q8', name: 'WIPES LIMPIEZA INTERIOR', sku: '194A70612', image: '', category: 'AUTO', subcategory: 'LIMPIADORES P/TAPIZ', price: 5.99, quantitySold: 110, capacity: 8 },
    { id: 'q9', name: 'CHAMOIS PARA LIMPIEZA', sku: '155PACHM01', image: '', category: 'AUTO', subcategory: 'CHAMOIS Y TOALLONES', price: 5.99, quantitySold: 76, capacity: 4 },
    { id: 'q10', name: 'TIRA VELCRO CONT.ADHESIVO EXTREMA PK2', sku: '92191373', image: '', category: 'AUTO', subcategory: 'VELCRO', price: 5.99, quantitySold: 69, capacity: 6 },
    { id: 'q11', name: 'LIMPIADOR D/PARABRISAS GL', sku: '206G90W01', image: '', category: 'AUTO', subcategory: 'LIQUIDO D/PARABRISAS', price: 5.99, quantitySold: 56, capacity: 4 },
    { id: 'q12', name: 'LUBRICANTE D/CADENA SPRAY ABRO', sku: '430CL100', image: '', category: 'AUTO', subcategory: 'GRASAS', price: 5.99, quantitySold: 47, capacity: 4 },
    { id: 'q13', name: 'GUANTE PORTA OLLAS 4PC PH4PC-4', sku: '867SLPH4PC4', image: '', category: 'BATERIA DE COCINA', subcategory: 'GUANTES PARA COCINA', price: 5.99, quantitySold: 200, capacity: 10 },
    { id: 'q14', name: 'COLADOR DE ALUMINIO D/8"', sku: '136BS24989', image: '', category: 'BATERIA DE COCINA', subcategory: 'EMBUDOS Y COLADORES', price: 5.99, quantitySold: 81, capacity: 6 },
    { id: 'q15', name: 'SET 6 PORTAVASOS DE ACACIA 10CM', sku: '920JJ0666', image: '', category: 'BATERIA DE COCINA', subcategory: 'PORTA VASOS', price: 5.99, quantitySold: 58, capacity: 4 },
    { id: 'q16', name: 'ORGANIZADOR P/COLGAR COPAS Y TAZAS', sku: '937R6291', image: '', category: 'BATERIA DE COCINA', subcategory: 'ORGANIZ. VARIADOS', price: 5.99, quantitySold: 54, capacity: 4 },
    { id: 'q17', name: 'CLIP MAGNETICO PARA BOLSAS', sku: '15VB71558', image: '', category: 'BATERIA DE COCINA', subcategory: 'UTENSIL. PARA COCINA', price: 5.99, quantitySold: 53, capacity: 6 },
    { id: 'q18', name: 'JGO.DE GUANTE Y AGARRA OLLA DORADO 2PZ', sku: '102C1997', image: '', category: 'BATERIA DE COCINA', subcategory: 'TOALLAS PARA COCINA', price: 5.99, quantitySold: 35, capacity: 4 },
    { id: 'q19', name: 'TOALLA DE COCINA CREMA 20X28IN', sku: '102C1994', image: '', category: 'BATERIA DE COCINA', subcategory: 'TOALLAS PARA COCINA', price: 5.99, quantitySold: 26, capacity: 4 },
    { id: 'q20', name: 'JGO.DE GUANTE Y AGARRA OLLA VERDE 2PZ', sku: '102C1995', image: '', category: 'BATERIA DE COCINA', subcategory: 'TOALLAS PARA COCINA', price: 5.99, quantitySold: 26, capacity: 4 },
    { id: 'q21', name: 'REPOSADOR P/CUCHARAS D/SILICONA', sku: '1367480', image: '', category: 'BATERIA DE COCINA', subcategory: 'UTENSIL. PARA COCINA', price: 5.99, quantitySold: 22, capacity: 4 },
    { id: 'q22', name: 'CUCHARON D/SILICONA P/COCINA', sku: '603CDU972', image: '', category: 'BATERIA DE COCINA', subcategory: 'UTENSIL. PARA COCINA', price: 5.99, quantitySold: 20, capacity: 4 },
  ]);

  // Mock Impulse Motifs (grouped by subcategory)
  const [impulseMotifs, setImpulseMotifs] = useState<ImpulseMotif[]>(() => {
    // Auto-generate motifs from queueArticles grouped by subcategory
    const groups: Record<string, { category: string; articles: QueueArticle[] }> = {};
    const initialArticles = [
      { id: 'q1', name: 'WD-40 08OZ ACEITE PENETRANTE SPRAY', sku: '1902004', image: '', category: 'AUTO', subcategory: 'ACEITE PENETRANTE', price: 5.99, quantitySold: 1228, capacity: 12 },
      { id: 'q2', name: 'LIMPIADOR PARA TODO USO 32 OZ. #29-235', sku: '11029235', image: '', category: 'AUTO', subcategory: 'DESENGRASANTES', price: 5.99, quantitySold: 600, capacity: 8 },
      { id: 'q3', name: 'PANOS DE MICROFIBRAS 14" 3PZ', sku: '11028314', image: '', category: 'AUTO', subcategory: 'CHAMOIS Y TOALLONES', price: 5.99, quantitySold: 390, capacity: 10 },
      { id: 'q4', name: 'SPRAY LIMPIADOR PARA ASIENTO DE AUTO', sku: '7584924', image: '', category: 'AUTO', subcategory: 'LIMPIADORES P/TAPIZ', price: 5.99, quantitySold: 335, capacity: 8 },
      { id: 'q5', name: 'PAÑOS MICROFIBRA 4 PK', sku: '155PAMFB07', image: '', category: 'AUTO', subcategory: 'CHAMOIS Y TOALLONES', price: 5.99, quantitySold: 127, capacity: 6 },
      { id: 'q6', name: 'LIMPIADOR P/CARBURADOR STP #578-231', sku: '7578231', image: '', category: 'AUTO', subcategory: 'ACEITE PENETRANTE', price: 5.99, quantitySold: 120, capacity: 6 },
      { id: 'q7', name: 'SPRAY LIMPIADOR Y PROTECTOR TAPIZ 10OZ', sku: '4721008', image: '', category: 'AUTO', subcategory: 'LIMPIADORES P/TAPIZ', price: 5.99, quantitySold: 113, capacity: 6 },
      { id: 'q8', name: 'WIPES LIMPIEZA INTERIOR', sku: '194A70612', image: '', category: 'AUTO', subcategory: 'LIMPIADORES P/TAPIZ', price: 5.99, quantitySold: 110, capacity: 8 },
      { id: 'q9', name: 'CHAMOIS PARA LIMPIEZA', sku: '155PACHM01', image: '', category: 'AUTO', subcategory: 'CHAMOIS Y TOALLONES', price: 5.99, quantitySold: 76, capacity: 4 },
      { id: 'q10', name: 'TIRA VELCRO CONT.ADHESIVO EXTREMA PK2', sku: '92191373', image: '', category: 'AUTO', subcategory: 'VELCRO', price: 5.99, quantitySold: 69, capacity: 6 },
      { id: 'q11', name: 'LIMPIADOR D/PARABRISAS GL', sku: '206G90W01', image: '', category: 'AUTO', subcategory: 'LIQUIDO D/PARABRISAS', price: 5.99, quantitySold: 56, capacity: 4 },
      { id: 'q12', name: 'LUBRICANTE D/CADENA SPRAY ABRO', sku: '430CL100', image: '', category: 'AUTO', subcategory: 'GRASAS', price: 5.99, quantitySold: 47, capacity: 4 },
      { id: 'q13', name: 'GUANTE PORTA OLLAS 4PC PH4PC-4', sku: '867SLPH4PC4', image: '', category: 'BATERIA DE COCINA', subcategory: 'GUANTES PARA COCINA', price: 5.99, quantitySold: 200, capacity: 10 },
      { id: 'q14', name: 'COLADOR DE ALUMINIO D/8"', sku: '136BS24989', image: '', category: 'BATERIA DE COCINA', subcategory: 'EMBUDOS Y COLADORES', price: 5.99, quantitySold: 81, capacity: 6 },
      { id: 'q15', name: 'SET 6 PORTAVASOS DE ACACIA 10CM', sku: '920JJ0666', image: '', category: 'BATERIA DE COCINA', subcategory: 'PORTA VASOS', price: 5.99, quantitySold: 58, capacity: 4 },
      { id: 'q16', name: 'ORGANIZADOR P/COLGAR COPAS Y TAZAS', sku: '937R6291', image: '', category: 'BATERIA DE COCINA', subcategory: 'ORGANIZ. VARIADOS', price: 5.99, quantitySold: 54, capacity: 4 },
      { id: 'q17', name: 'CLIP MAGNETICO PARA BOLSAS', sku: '15VB71558', image: '', category: 'BATERIA DE COCINA', subcategory: 'UTENSIL. PARA COCINA', price: 5.99, quantitySold: 53, capacity: 6 },
      { id: 'q18', name: 'JGO.DE GUANTE Y AGARRA OLLA DORADO 2PZ', sku: '102C1997', image: '', category: 'BATERIA DE COCINA', subcategory: 'TOALLAS PARA COCINA', price: 5.99, quantitySold: 35, capacity: 4 },
      { id: 'q19', name: 'TOALLA DE COCINA CREMA 20X28IN', sku: '102C1994', image: '', category: 'BATERIA DE COCINA', subcategory: 'TOALLAS PARA COCINA', price: 5.99, quantitySold: 26, capacity: 4 },
      { id: 'q20', name: 'JGO.DE GUANTE Y AGARRA OLLA VERDE 2PZ', sku: '102C1995', image: '', category: 'BATERIA DE COCINA', subcategory: 'TOALLAS PARA COCINA', price: 5.99, quantitySold: 26, capacity: 4 },
      { id: 'q21', name: 'REPOSADOR P/CUCHARAS D/SILICONA', sku: '1367480', image: '', category: 'BATERIA DE COCINA', subcategory: 'UTENSIL. PARA COCINA', price: 5.99, quantitySold: 22, capacity: 4 },
      { id: 'q22', name: 'CUCHARON D/SILICONA P/COCINA', sku: '603CDU972', image: '', category: 'BATERIA DE COCINA', subcategory: 'UTENSIL. PARA COCINA', price: 5.99, quantitySold: 20, capacity: 4 },
    ];
    for (const a of initialArticles) {
      if (!groups[a.subcategory]) groups[a.subcategory] = { category: a.category, articles: [] };
      groups[a.subcategory].articles.push(a);
    }
    return Object.entries(groups).map(([sub, data], i) => ({
      id: `motif-${i + 1}`,
      name: sub,
      category: data.category,
      articles: data.articles,
      image: '',
    }));
  });

  // Mock histories data
  const [histories, setHistories] = useState<History[]>([
    {
      id: '1',
      name: '🚗 LAVAR EL CARRO',
      locationType: 'end-cap',
      workMode: 'solo',
      articles: [
        { id: '1', name: 'DESENGRASANTE FORMULA 83 32OZ', image: '', sku: '4371117', position: 'end-cap', capacity: 8 },
        { id: '2', name: 'DESENGRASANTE FORMULA 83 GALON', image: '', sku: '4371118', position: 'end-cap', capacity: 6 },
        { id: '3', name: 'ESPONJA P/LAVAR AUTOS', image: '', sku: '110E1005', position: 'end-cap', capacity: 12 },
        { id: '4', name: 'HIDROLAVADORA ELECTRICA 1885PSI 1600W', image: '', sku: '159JT1885', position: 'end-cap', capacity: 2 },
        { id: '5', name: 'CHAMOIS SINTETICO 17"X13"', image: '', sku: '110E1000', position: 'end-cap', capacity: 10 },
        { id: '6', name: 'GEL LIMPIADOR TAPIZ INTERIOR DE AUTO', image: '', sku: '11012325D', position: 'end-cap', capacity: 8 },
        { id: '7', name: 'HIDROLAVADORA ELECTRICA 2000 PSI 1600W', image: '', sku: '159Y1885', position: 'end-cap', capacity: 2 },
        { id: '8', name: 'DESODORANTE AROMA BLACK ICE', image: '', sku: '11010155', position: 'end-cap', capacity: 15 },
        { id: '9', name: 'CHAMOIS SINTETICO 26"X17"', image: '', sku: '110E1001', position: 'end-cap', capacity: 8 },
        { id: '10', name: 'DESODORANTE AROMA NEW CAR', image: '', sku: '7577655', position: 'end-cap', capacity: 15 },
        { id: '11', name: 'CONCENTRADO D/LIMPIA PARABRISA 2oz', image: '', sku: '11029602', position: 'end-cap', capacity: 10 },
        { id: '12', name: 'JABON PARA AUTO 1GL', image: '', sku: '437B605004', position: 'end-cap', capacity: 6 },
        { id: '13', name: 'DESODORANTE EN ACEITE BERRY CHERRY', image: '', sku: '11005624', position: 'end-cap', capacity: 12 },
        { id: '14', name: 'DESODORANTE AROMA CEREZA', image: '', sku: '11010312', position: 'end-cap', capacity: 15 },
        { id: '15', name: 'SPRAY DESODORANTE CHERRY 2OZ', image: '', sku: '11005501', position: 'end-cap', capacity: 10 },
      ],
      image: '',
    },
    {
      id: '2',
      name: '🔧 MANTENIMIENTO AUTO',
      locationType: 'end-cap',
      workMode: 'casado',
      articles: [
        { id: '16', name: 'COOLANT VERDE PARA AUTO 1 gl.', image: '', sku: '1102940128', position: 'end-cap', capacity: 6 },
        { id: '17', name: 'LUBRICANTES 5.5 OZ. 155GR.', image: '', sku: '1902002', position: 'end-cap', capacity: 10 },
        { id: '18', name: 'COOLANT ROJO 1 GAL.', image: '', sku: '11029831', position: 'end-cap', capacity: 6 },
        { id: '19', name: 'WD-40 08OZ ACEITE PENETRANTE SPRAY', image: '', sku: '1902004', position: 'end-cap', capacity: 12 },
        { id: '20', name: 'LUBRICANTES 11 OZ', image: '', sku: '1902005', position: 'end-cap', capacity: 8 },
        { id: '21', name: 'MINI COMPRESOR DE AIRE P/AUTO 12V/250PSI', image: '', sku: '3361004', position: 'end-cap', capacity: 3 },
        { id: '22', name: 'ACEITE GTX SEMI SYN 10W30 1QT', image: '', sku: '4780031', position: 'end-cap', capacity: 8 },
        { id: '23', name: 'ACEITE TRIPLE LUBRICANTE 30 ML', image: '', sku: '1902MED21001', position: 'side-kick', capacity: 10 },
        { id: '24', name: 'MEDIDOR MET.CR.D/AIRE 10-50Lb.P/BOLSILLO', image: '', sku: '3361015', position: 'side-kick', capacity: 6 },
        { id: '25', name: 'MEDIDOR PROF.D/PRESION DE AIRE 10-150Lb.', image: '', sku: '3361014', position: 'side-kick', capacity: 6 },
        { id: '26', name: 'COOLANT PEAK TROPICALIZADO', image: '', sku: '439PKAOB8', position: 'side-kick', capacity: 4 },
        { id: '27', name: 'ACEITE 3-EN-1 3 OZ.', image: '', sku: '1902010', position: 'side-kick', capacity: 12 },
        { id: '28', name: 'ACEITE MOBIL SPECIAL 10W30 1QT', image: '', sku: '47810W30', position: 'side-kick', capacity: 8 },
        { id: '29', name: 'ACEITE 3 EN 1 1.05 OZ', image: '', sku: '1902018', position: 'side-kick', capacity: 15 },
        { id: '30', name: 'SILICONE 3-EN-1 7 OZ.', image: '', sku: '1902013', position: 'side-kick', capacity: 8 },
      ],
      image: '',
    },
    {
      id: '3',
      name: '🛁 ORGANIZAR EL BAÑO',
      locationType: 'side-kick',
      workMode: 'solo',
      articles: [
        { id: '31', name: 'TOALLA DE BAÑO TERRY AMARILLO 28X58', image: '', sku: '920SF0245', position: 'side-kick', capacity: 6 },
        { id: '32', name: 'TOALLA DE BAÑO TERRY NARANJA 28X58', image: '', sku: '920SF0243', position: 'side-kick', capacity: 6 },
        { id: '33', name: 'TOALLA DE BAÑO TERRY ROJO VINO 28X58', image: '', sku: '920SF0244', position: 'side-kick', capacity: 6 },
        { id: '34', name: 'TOALLA DE BAÑO TERRY CELESTE 28X58', image: '', sku: '920SF0242', position: 'side-kick', capacity: 6 },
        { id: '35', name: 'TOALLA DE BAÑO TRENDS GRIS 27"X54"', image: '', sku: '804GE1001', position: 'side-kick', capacity: 4 },
        { id: '36', name: 'BARRA P/CORTINA D/BA-O BLANCA', image: '', sku: '149Q1001', position: 'side-kick', capacity: 3 },
        { id: '37', name: 'PAPELERA 7.5L COLORES SURTIDOS', image: '', sku: '15SB0086', position: 'side-kick', capacity: 4 },
        { id: '38', name: 'TOALLA DE BAÑO TRENDS VERDE 27"X54"', image: '', sku: '804GE1006', position: 'side-kick', capacity: 4 },
        { id: '39', name: 'TOALLA DE BAÑO CONTEMPO AZUL', image: '', sku: '804K1194', position: 'side-kick', capacity: 4 },
        { id: '40', name: 'ESPEJO P/BANO SIN LAMPARA 17-3/4x23-1/2"', image: '', sku: '1081206', position: 'side-kick', capacity: 2 },
        { id: '41', name: 'TOALLA DE BAÑO TRENDS BEIGE 27"X54"', image: '', sku: '804GE1004', position: 'side-kick', capacity: 4 },
        { id: '42', name: 'TOALLA DE BAÑO TRENDS ROJA 27"X54"', image: '', sku: '804GE1005', position: 'side-kick', capacity: 4 },
        { id: '43', name: 'TOALLA DE BAÑO TRENDS AZUL 27"X54"', image: '', sku: '804GE1003', position: 'side-kick', capacity: 4 },
        { id: '44', name: 'TOALLA DE BAÑO TRENDS TURQUESA 27"X54"', image: '', sku: '804GE1002', position: 'side-kick', capacity: 4 },
        { id: '45', name: 'TOALLA DE MANO CANNON BLANCA', image: '', sku: '804DH1054', position: 'side-kick', capacity: 8 },
      ],
      image: '',
    },
  ]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedLocation,
        setSelectedLocation,
        selectedWorkMode,
        setSelectedWorkMode,
        selectedHistory,
        setSelectedHistory,
        currentLocationNumber,
        setCurrentLocationNumber,
        histories,
        setHistories,
        queueArticles,
        setQueueArticles,
        impulseMotifs,
        setImpulseMotifs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}