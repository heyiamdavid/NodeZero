import React, { useState, useEffect, useRef, useMemo } from 'react';
import GameTopBar from './components/GameTopBar';
import NewsTicker from './components/NewsTicker';
import MantaMap from './components/MantaMap';
import GameBottomBar from './components/GameBottomBar';
import RandomEventsModal from './components/RandomEventsModal';
import EventNotificationToast from './components/EventNotificationToast';
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
  randomEventProb: 0.25,
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
  const [isEventsOpen, setIsEventsOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_config_drawer_open');
      if (saved !== null) return JSON.parse(saved);
    } catch {}
    return true; // Ventana persistente por defecto
  });
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isSurpriseOpen, setIsSurpriseOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_config_drawer_open', JSON.stringify(isConfigOpen));
    } catch {}
  }, [isConfigOpen]);

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

  // Carga de escenarios imprevistos en vivo (Prueba del Usuario)
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

  // Notificaciones de contingencias en la interfaz (máximo 2 eventos FIFO)
  const [activeNotifications, setActiveNotifications] = useState([]);
  const notifiedEventIdsRef = useRef(new Set());

  const pushEventNotification = (evt) => {
    if (!evt) return;
    soundFx.playEventTrigger(evt.type === 'positive');
    setActiveNotifications((prev) => {
      const newNotification = {
        ...evt,
        uniqueKey: `${evt.id}_${Date.now()}_${Math.random()}`,
      };
      const next = [...prev, newNotification];
      // Mantiene máximo 2 eventos: si ocurre otro, se borra el más antiguo
      return next.slice(-2);
    });
  };

  const handleDismissNotification = (key) => {
    setActiveNotifications((prev) => prev.filter((n) => n.uniqueKey !== key && n.id !== key));
  };

  // Monitorear y notificar eventos generados por la simulación
  useEffect(() => {
    if (currentDay === 0) {
      notifiedEventIdsRef.current.clear();
      setActiveNotifications([]);
      return;
    }

    const dayEvents = currentDayData?.events || [];
    if (dayEvents.length > 0) {
      dayEvents.forEach((evt) => {
        const eventKey = `${evt.id}_d${currentDay}`;
        if (!notifiedEventIdsRef.current.has(eventKey)) {
          notifiedEventIdsRef.current.add(eventKey);
          pushEventNotification(evt);
        }
      });
    }
  }, [currentDay, currentDayData]);

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
        currentDayData={currentDayData}
        totalPopulation={248000}
        onOpenEventsModal={() => setIsEventsOpen(true)}
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
        currentDayData={currentDayData}
      />

      {/* 3. Escenario Central: El Mapa Táctico de Manta con Capa CRT y Panel Persistente */}
      <main className="game-map-stage">
        <MantaMap
          currentDayData={currentDayData}
          selectedNodeId={selectedNodeId}
          setSelectedNodeId={setSelectedNodeId}
          isDrawerOpen={isConfigOpen}
        />

        {/* Notificaciones flotantes tácticas de contingencias (máximo 2 en pantalla) */}
        <EventNotificationToast
          notifications={activeNotifications}
          onDismiss={handleDismissNotification}
        />

        {/* Efecto CRT posicionado exclusivamente encima del mapa y detrás del resto de la interfaz */}
        {crtEnabled && (
          <div className="crt-map-overlay-layer" aria-hidden="true">
            <div className="pipboy-scanlines" />
            <div className="pipboy-crt-roll" />
            <div className="pipboy-crt-vignette" />
          </div>
        )}

        {/* Ventana Persistente de Parámetros con Etiqueta de Flecha Ocultable */}
        <ConfigDrawer
          isOpen={isConfigOpen}
          onToggle={() => setIsConfigOpen((prev) => !prev)}
          onClose={() => setIsConfigOpen(false)}
          config={config}
          setConfig={setConfig}
          seed={seed}
          setSeed={setSeed}
          onRestoreDefaults={handleRestoreDefaults}
          onOpenSurprise={() => setIsSurpriseOpen(true)}
        />
      </main>

      {/* 4. Command Deck Inferior: Las 3 Estrategias, Controles de Reproducción y Cronología */}
      <GameBottomBar
        activeStrategy={activeStrategy}
        setActiveStrategy={setActiveStrategy}
        simResults={simResults}
        currentDay={currentDay}
        totalDays={config.days}
        onSelectDay={(day) => setCurrentDay(day)}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onReset={handleReset}
        playbackSpeed={playbackSpeed}
        setPlaybackSpeed={setPlaybackSpeed}
      />

      {/* Modales Desacoplados (Cero Sobrecarga en Pantalla) */}
      <RandomEventsModal
        isOpen={isEventsOpen}
        onClose={() => setIsEventsOpen(false)}
        config={config}
        setConfig={setConfig}
        simResults={simResults}
        activeStrategy={activeStrategy}
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
