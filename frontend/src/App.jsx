import React, { useState, useEffect, useRef, useMemo } from 'react';
import Navbar from './components/Navbar';
import Controls from './components/Controls';
import MantaMap from './components/MantaMap';
import CurvesChart from './components/CurvesChart';
import KpiMetrics from './components/KpiMetrics';
import SurpriseOutbreakModal from './components/SurpriseOutbreakModal';
import MayorReportModal from './components/MayorReportModal';
import DiseaseCatalogModal from './components/DiseaseCatalogModal';
import { runComparativeSimulation, runMonteCarlo } from './simulation/engine';
import { DISEASES_CATALOG } from './data/diseasesCatalog';
import { checkBackendHealth } from './services/api';
import './App.css';

export default function App() {
  const [seed, setSeed] = useState(42);
  const [activeDisease, setActiveDisease] = useState(DISEASES_CATALOG[0]);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [layoutMode, setLayoutMode] = useState('split'); // 'split' | 'map_only' | 'curves_only'
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Verificar conexión con el backend de Python
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setIsBackendConnected(res.connected);
    });
  }, []);

  const [config, setConfig] = useState({
    seed: 42,
    days: 40,
    beta: DISEASES_CATALOG[0].beta,
    incubationDays: DISEASES_CATALOG[0].incubationDays,
    recoveryDays: DISEASES_CATALOG[0].recoveryDays,
    dailyVaccines: 600,
    vaccineEfficacy: DISEASES_CATALOG[0].vaccineEfficacy,
    patientZeroNode: 'tarqui',
    initialZombies: 5,
    budgetLimit: 250000,
    costPerDose: 12,
  });

  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeViewStrategy, setActiveViewStrategy] = useState('nodezero');
  const [selectedNodeId, setSelectedNodeId] = useState('tarqui');

  const [isMonteCarloActive, setIsMonteCarloActive] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);
  const [isMayorReportOpen, setIsMayorReportOpen] = useState(false);

  // Sincronizar semilla con la configuración
  useEffect(() => {
    setConfig((prev) => ({ ...prev, seed }));
  }, [seed]);

  // Ejecución determinista del modelo epidemiológico
  const simResults = useMemo(() => {
    return runComparativeSimulation(config);
  }, [config]);

  // Cálculo de Monte Carlo bajo demanda
  const monteCarloData = useMemo(() => {
    if (!isMonteCarloActive) return null;
    return runMonteCarlo(config, 20);
  }, [config, isMonteCarloActive]);

  // Bucle de reproducción temporal
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(100, Math.round(500 / playbackSpeed));
      timerRef.current = setInterval(() => {
        setCurrentDay((prev) => {
          if (prev >= config.days) {
            setIsPlaying(false);
            return config.days;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, config.days]);

  // Controles de reproducción
  const handleTogglePlay = () => {
    if (currentDay >= config.days) {
      setCurrentDay(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentDay(0);
  };

  const handleStepForward = () => {
    if (currentDay < config.days) {
      setCurrentDay((prev) => prev + 1);
    }
  };

  const handleRandomSeed = () => {
    const newSeed = Math.floor(Math.random() * 90000) + 1000;
    setSeed(newSeed);
    setCurrentDay(0);
    setIsPlaying(false);
  };

  const handleSelectDisease = (disease) => {
    setActiveDisease(disease);
    setConfig((prev) => ({
      ...prev,
      beta: disease.beta,
      incubationDays: disease.incubationDays,
      recoveryDays: disease.recoveryDays,
      vaccineEfficacy: disease.vaccineEfficacy,
    }));
    setCurrentDay(0);
    setIsPlaying(false);
  };

  const handleApplySurprisePreset = (patch) => {
    setConfig((prev) => ({
      ...prev,
      ...patch,
    }));
    setCurrentDay(0);
    setIsPlaying(true);
  };

  // Extraer el snapshot del día actual según la estrategia activa seleccionada
  const activeHistory = simResults[activeViewStrategy]?.history || [];
  const currentDayData = activeHistory[currentDay] || activeHistory[0];

  return (
    <div className="app-container">
      {/* Barra de Navegación Táctica */}
      <Navbar
        seed={seed}
        setSeed={setSeed}
        onRandomSeed={handleRandomSeed}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
        onOpenMayorReport={() => setIsMayorReportOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        activeDisease={activeDisease}
        isSimulating={isPlaying}
        isBackendConnected={isBackendConnected}
      />

      {/* Cuerpo Principal del War Room */}
      <main className="main-layout">
        {/* Barra Lateral de Parámetros y Controles */}
        <Controls
          config={config}
          setConfig={setConfig}
          currentDay={currentDay}
          totalDays={config.days}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
          onStepForward={handleStepForward}
          playbackSpeed={playbackSpeed}
          setPlaybackSpeed={setPlaybackSpeed}
          activeViewStrategy={activeViewStrategy}
          setActiveViewStrategy={setActiveViewStrategy}
        />

        {/* Área Central de Visualización y Análisis */}
        <section className="visualization-area">
          {/* Barra de Modos de Vista */}
          <div className="layout-modes-bar">
            <div className="modes-tab-group">
              <button
                onClick={() => setLayoutMode('split')}
                className={`mode-tab-btn ${layoutMode === 'split' ? 'active' : ''}`}
                title="Ver Mapa de Manta y Curvas SEIR lado a lado"
              >
                📊 Vista Dual (Mapa + Curvas)
              </button>
              <button
                onClick={() => setLayoutMode('map_only')}
                className={`mode-tab-btn ${layoutMode === 'map_only' ? 'active' : ''}`}
                title="Maximizar el Mapa de Manta al 100% del ancho para análisis territorial"
              >
                🗺️ Centro Cartográfico Táctico (Solo Mapa)
              </button>
              <button
                onClick={() => setLayoutMode('curves_only')}
                className={`mode-tab-btn ${layoutMode === 'curves_only' ? 'active' : ''}`}
                title="Maximizar las Curvas SEIR y datos epidemiológicos"
              >
                📈 Análisis Epidemiológico (Solo Curvas)
              </button>
            </div>
          </div>

          <div className={`grid-split-view ${layoutMode === 'map_only' || layoutMode === 'curves_only' ? 'grid-full-view' : ''}`}>
            {/* Mapa de Manta */}
            {layoutMode !== 'curves_only' && (
              <div className={`grid-pane ${layoutMode === 'map_only' ? 'pane-full-width' : ''}`}>
                <MantaMap
                  currentDayData={currentDayData}
                  activeStrategy={activeViewStrategy}
                  selectedNodeId={selectedNodeId}
                  setSelectedNodeId={setSelectedNodeId}
                  activeDisease={activeDisease}
                />
              </div>
            )}

            {/* Curvas Epidémicas vs Líneas Base */}
            {layoutMode !== 'map_only' && (
              <div className={`grid-pane ${layoutMode === 'curves_only' ? 'pane-full-width' : ''}`}>
                <CurvesChart
                  simResults={simResults}
                  currentDay={currentDay}
                  onSelectDay={(d) => setCurrentDay(d)}
                  monteCarloData={monteCarloData}
                  isMonteCarloActive={isMonteCarloActive}
                  setIsMonteCarloActive={setIsMonteCarloActive}
                />
              </div>
            )}
          </div>

          {/* Tarjetas KPI y Tabla de Rúbrica */}
          <KpiMetrics simResults={simResults} />
        </section>
      </main>

      {/* Modales de Emergencia y Catálogo */}
      <DiseaseCatalogModal
        isOpen={isCatalogOpen}
        onClose={() => setIsCatalogOpen(false)}
        activeDiseaseId={activeDisease?.id}
        onSelectDisease={handleSelectDisease}
      />

      <SurpriseOutbreakModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        currentConfig={config}
        onApplyPreset={handleApplySurprisePreset}
      />

      <MayorReportModal
        isOpen={isMayorReportOpen}
        onClose={() => setIsMayorReportOpen(false)}
        simResults={simResults}
        config={config}
      />
    </div>
  );
}
