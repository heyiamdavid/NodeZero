import React, { useState, useEffect, useRef, useMemo } from 'react';
import GameTopBar from './components/GameTopBar';
import NewsTicker from './components/NewsTicker';
import MantaMap from './components/MantaMap';
import GameBottomBar from './components/GameBottomBar';
import FearAndHungerCoin from './components/FearAndHungerCoin';
import ConfigDrawer from './components/ConfigDrawer';
import ComparisonModal from './components/ComparisonModal';
import { runComparativeSimulation } from './simulation/engine';
import { soundFx } from './utils/soundFx';
import './App.css';

export default function App() {
  const [seed, setSeed] = useState(42);
  const [config, setConfig] = useState({
    seed: 42,
    days: 40,
    beta: 0.38,
    incubationDays: 3,
    recoveryDays: 14,
    dailyVaccines: 600,
    vaccineEfficacy: 0.95,
    patientZeroNode: 'tarqui',
    initialZombies: 5,
    budgetLimit: 250000,
    costPerDose: 12,
  });

  const [currentDay, setCurrentDay] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeStrategy, setActiveStrategy] = useState('nodezero');
  const [selectedNodeId, setSelectedNodeId] = useState('tarqui');

  // Modales y Drawers no sobrecargados
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Sincronizar semilla con la configuración
  useEffect(() => {
    setConfig((prev) => ({ ...prev, seed }));
  }, [seed]);

  // Ejecución determinista del modelo epidemiológico
  const simResults = useMemo(() => {
    return runComparativeSimulation(config);
  }, [config]);

  // Snapshot del día actual para la estrategia seleccionada
  const activeHistory = simResults[activeStrategy]?.history || [];
  const currentDayData = activeHistory[currentDay] || activeHistory[0];

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
          const nextDay = prev + 1;
          if (nextDay % 8 === 0) {
            soundFx.playHeartbeat();
          }
          return nextDay;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, config.days]);

  const handleTogglePlay = () => {
    if (currentDay >= config.days) {
      setCurrentDay(0);
    }
    if (!isPlaying) {
      soundFx.playBiohazardAlert();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentDay(0);
  };

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="game-app-container">
      {/* 1. HUD Superior del Juego */}
      <GameTopBar
        currentDay={currentDay}
        totalDays={config.days}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
        currentDayData={currentDayData}
        totalPopulation={248000}
        onOpenCoinModal={() => setIsCoinOpen(true)}
        onOpenConfigDrawer={() => setIsConfigOpen(true)}
        onOpenComparisonModal={() => setIsComparisonOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* 2. Ticker de Noticias de Manta estilo Plague Inc. */}
      <NewsTicker
        currentDay={currentDay}
        activeStrategy={activeStrategy}
        simResults={simResults}
      />

      {/* 3. Escenario Central: El Mapa Táctico de Manta */}
      <main className="game-map-stage">
        <MantaMap
          currentDayData={currentDayData}
          activeStrategy={activeStrategy}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
        />
      </main>

      {/* 4. Command Deck Inferior: Las 3 Estrategias y Resultados */}
      <GameBottomBar
        activeStrategy={activeStrategy}
        setActiveStrategy={setActiveStrategy}
        simResults={simResults}
        currentDay={currentDay}
        totalDays={config.days}
        onSelectDay={(day) => setCurrentDay(day)}
      />

      {/* Modales Desacoplados (Cero Sobrecarga en Pantalla) */}
      <FearAndHungerCoin
        isOpen={isCoinOpen}
        onClose={() => setIsCoinOpen(false)}
      />

      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        setConfig={setConfig}
        seed={seed}
        setSeed={setSeed}
      />

      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        simResults={simResults}
        currentDay={currentDay}
        onSelectDay={(day) => setCurrentDay(day)}
      />
    </div>
  );
}
