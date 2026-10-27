// Datos y topología geográfica real de Manta, Manabí
// Nodos clave: Parroquias urbanas, zonas comerciales y hubs de transporte

export const MANTA_NODES = [
  {
    id: 'tarqui',
    name: 'Tarqui (Mercado Nuevo Tarqui)',
    category: 'Mercado / Comercio',
    population: 48000,
    density: 'Muy Alta',
    x: 420, // Coordenadas para render táctico SVG
    y: 220,
    mobilityWeight: 1.0, // Hub de máxima afluencia
    description: 'Principal centro de comercio y abasto. Gran flujo diario de comerciantes y compradores.',
  },
  {
    id: 'manta_centro',
    name: 'Manta Centro / Malecón',
    category: 'Comercial / Turístico',
    population: 36000,
    density: 'Alta',
    x: 290,
    y: 160,
    mobilityWeight: 0.85,
    description: 'Zona bancaria, hoteles, Playa El Murciélago y puerto marítimo.',
  },
  {
    id: 'los_esteros',
    name: 'Los Esteros',
    category: 'Industrial / Residencial',
    population: 34000,
    density: 'Media-Alta',
    x: 540,
    y: 190,
    mobilityWeight: 0.75,
    description: 'Zona de empacadoras pesqueras y conexión con la vía a Rocafuerte.',
  },
  {
    id: 'eloy_alfaro',
    name: 'Eloy Alfaro',
    category: 'Residencial Densamente Poblado',
    population: 52000,
    density: 'Muy Alta',
    x: 370,
    y: 340,
    mobilityWeight: 0.9,
    description: 'Mayor densidad residencial de la ciudad. Alto uso de transporte público hacia Tarqui y Centro.',
  },
  {
    id: 'el_palmar',
    name: 'El Palmar (Terminal Terrestre)',
    category: 'Hub de Transporte',
    population: 18000,
    density: 'Media',
    x: 620,
    y: 260,
    mobilityWeight: 0.95,
    description: 'Terminal terrestre intercantonal y proximidad al Aeropuerto Eloy Alfaro.',
  },
  {
    id: 'uleam',
    name: 'Ciudadela Universitaria (ULEAM)',
    category: 'Educación / Juventud',
    population: 26000,
    density: 'Alta',
    x: 200,
    y: 260,
    mobilityWeight: 0.8,
    description: 'Campus matriz ULEAM. Alto tránsito de estudiantes de todo Manabí.',
  },
  {
    id: 'san_mateo',
    name: 'San Mateo',
    category: 'Pesquera / Costera',
    population: 12000,
    density: 'Baja-Media',
    x: 110,
    y: 350,
    mobilityWeight: 0.45,
    description: 'Caleta pesquera tradicional al suroeste, conectada por la Ruta del Spondylus.',
  },
  {
    id: 'san_patricio',
    name: 'San Juan / 24 de Mayo',
    category: 'Residencial Periférico',
    population: 22000,
    density: 'Media',
    x: 490,
    y: 390,
    mobilityWeight: 0.6,
    description: 'Sectores periféricos del suroriente con conexiones hacia Montecristi.',
  }
];

// Enlaces de movilidad y transporte entre sectores
export const MANTA_EDGES = [
  { source: 'tarqui', target: 'manta_centro', flow: 0.9, name: 'Av. 4 de Noviembre / Malecón' },
  { source: 'tarqui', target: 'eloy_alfaro', flow: 0.95, name: 'Eje Comercial - Residencial' },
  { source: 'tarqui', target: 'los_esteros', flow: 0.85, name: 'Vía Interbarrial' },
  { source: 'tarqui', target: 'el_palmar', flow: 0.8, name: 'Corredor Terminal' },
  { source: 'manta_centro', target: 'uleam', flow: 0.75, name: 'Av. Circunvalación Tramo 1' },
  { source: 'uleam', target: 'san_mateo', flow: 0.5, name: 'Ruta del Spondylus Sur' },
  { source: 'eloy_alfaro', target: 'san_patricio', flow: 0.7, name: 'Vía Interbarrial Sur' },
  { source: 'los_esteros', target: 'el_palmar', flow: 0.8, name: 'Vía Puerto - Aeropuerto' },
  { source: 'el_palmar', target: 'san_patricio', flow: 0.55, name: 'Anillo Periférico' },
  { source: 'uleam', target: 'eloy_alfaro', flow: 0.6, name: 'Av. de la Cultura' },
];

export const TOTAL_MANTA_POPULATION = MANTA_NODES.reduce((acc, n) => acc + n.population, 0);
