import React, { useState, useEffect, useRef, useMemo } from 'react';
import GameTopBar from './components/GameTopBar';
import NewsTicker from './components/NewsTicker';
import MantaMap from './components/MantaMap';
import GameBottomBar from './components/GameBottomBar';
import FearAndHungerCoin from './components/FearAndHungerCoin';
import ConfigDrawer from './components/ConfigDrawer';
import ComparisonModal from './components/ComparisonModal';
import SurpriseOutbreakModal from './components/SurpriseOutbreakModal';
import { runComparativeSimulation } from './simulation/engine';
import { soundFx } from './utils/soundFx';
import './App.css';
import './styles/responsive.css';

// Configuración por defecto oficial del Reto Track B AWS Hackathon
const DEFAULT_CONFIG = {
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
};

export default function App() {
  // 1. Estado persistido de configuración epidemiológica
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONFIG, ...parsed };
      }
    } catch (err) {
      console.warn('Error al leer configuración en caché:', err);
    }
    return DEFAULT_CONFIG;
  });

  const seed = config.seed;
  const setSeed = (newSeed) => {
    setConfig((prev) => ({
      ...prev,
      seed: typeof newSeed === 'function' ? newSeed(prev.seed) : newSeed,
    }));
  };

  // 2. Estado persistido del reproductor y día actual
  const [currentDay, setCurrentDay] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_current_day');
      if (saved !== null) {
        const num = Number(saved);
        if (!isNaN(num) && num >= 0 && num <= 40) return num;
      }
    } catch {}
    return 0;
  });

  const [isPlaying, setIsPlaying] = useState(false);

  const [playbackSpeed, setPlaybackSpeed] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_playback_speed');
      if (saved) {
        const num = Number(saved);
        if ([1, 2, 5].includes(num)) return num;
      }
    } catch {}
    return 1;
  });

  // 3. Estrategia activa y nodo seleccionado (persistidos en caché)
  const [activeStrategy, setActiveStrategy] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_strategy');
      if (saved && ['nodezero', 'none', 'random'].includes(saved)) {
        return saved;
      }
    } catch {}
    return 'nodezero';
  });

  const [selectedNodeId, setSelectedNodeId] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_selected_node');
      if (saved) return saved;
    } catch {}
    return 'tarqui';
  });

  // 4. Modales y menús tácticos
  const [isCoinOpen, setIsCoinOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);

  // 5. Preferencias audiovisuales persistidas
  const [isMuted, setIsMuted] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_sound_muted');
      const muted = saved === 'true';
      soundFx.setMuted(muted);
      return muted;
    } catch {}
    return false;
  });

  const [crtEnabled, setCrtEnabled] = useState(() => {
    const saved = localStorage.getItem('nodezero_crt');
    return saved !== null ? saved === 'true' : true;
  });

  const [pipTheme, setPipTheme] = useState(() => {
    return localStorage.getItem('nodezero_theme') || 'green';
  });

  // Efectos de sincronización automática con la caché del navegador (localStorage)
  useEffect(() => {
    try {
      localStorage.setItem('nodezero_config', JSON.stringify(config));
    } catch {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_current_day', String(currentDay));
    } catch {}
  }, [currentDay]);

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_playback_speed', String(playbackSpeed));
    } catch {}
  }, [playbackSpeed]);

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_strategy', activeStrategy);
    } catch {}
  }, [activeStrategy]);

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_selected_node', selectedNodeId);
    } catch {}
  }, [selectedNodeId]);

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_sound_muted', String(isMuted));
    } catch {}
  }, [isMuted]);

  const handleToggleCrt = () => {
    setCrtEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('nodezero_crt', String(next));
      return next;
    });
  };

  const handleCycleTheme = () => {
    setPipTheme((prev) => {
      const themes = ['green', 'amber', 'cyan'];
      const nextIndex = (themes.indexOf(prev) + 1) % themes.length;
      const next = themes[nextIndex];
      localStorage.setItem('nodezero_theme', next);
      return next;
    });
  };

  // Restablecer parámetros a los valores oficiales de Track B y limpiar caché
  const handleRestoreDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setActiveStrategy('nodezero');
    setCurrentDay(0);
    setPlaybackSpeed(1);
    setSelectedNodeId('tarqui');
    try {
      localStorage.removeItem('nodezero_config');
      localStorage.removeItem('nodezero_strategy');
      localStorage.removeItem('nodezero_current_day');
      localStorage.removeItem('nodezero_playback_speed');
      localStorage.removeItem('nodezero_selected_node');
    } catch {}
    soundFx.playBiohazardAlert();
  };

  // Carga de escenarios imprevistos en vivo (Prueba del Jurado)
  const handleApplySurprisePreset = (patch) => {
    setConfig((prev) => ({
      ...prev,
      ...patch,
    }));
    soundFx.playBiohazardAlert();
  };

  // Ejecución determinista del modelo epidemiológico local
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
    <div className={`game-app-container terminal-screen ${crtEnabled ? 'crt-active' : ''}`} data-pip-theme={pipTheme}>
      {/* 1. HUD Superior del Sistema */}
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
        onOpenSurpriseModal={() => setIsSurpriseOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        crtEnabled={crtEnabled}
        onToggleCrt={handleToggleCrt}
        pipTheme={pipTheme}
        onCycleTheme={handleCycleTheme}
      />

      {/* 2. Ticker de Noticias de Manta */}
      <NewsTicker
        currentDay={currentDay}
        activeStrategy={activeStrategy}
        simResults={simResults}
      />

      {/* 3. Escenario Central: El Mapa Táctico de Manta con Capa CRT */}
      <main className="game-map-stage">
        <MantaMap
          currentDayData={currentDayData}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
        />

        {/* Efecto CRT posicionado exclusivamente encima del mapa y detrás del resto de la interfaz */}
        {crtEnabled && (
          <div className="crt-map-overlay-layer" aria-hidden="true">
            <div className="pipboy-scanlines" />
            <div className="pipboy-crt-roll" />
            <div className="pipboy-crt-vignette" />
          </div>
        )}
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
        onRestoreDefaults={handleRestoreDefaults}
        onOpenSurprise={() => setIsSurpriseOpen(true)}
      />

      <ComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        simResults={simResults}
        currentDay={currentDay}
        onSelectDay={(day) => setCurrentDay(day)}
      />

      <SurpriseOutbreakModal
        isOpen={isSurpriseOpen}
        onClose={() => setIsSurpriseOpen(false)}
        onApplyPreset={handleApplySurprisePreset}
      />
    </div>
  );
}
