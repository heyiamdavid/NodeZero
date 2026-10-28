import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sliders, Award, Biohazard, Coins, Zap } from './Icons';

export default function GameTopBar({
  currentDay,
  totalDays,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  setPlaybackSpeed,
  currentDayData,
  totalPopulation = 248000,
  onOpenCoinModal,
  onOpenConfigDrawer,
  onOpenComparisonModal,
  onOpenSurpriseModal,
  isMuted,
  onToggleSound,
  crtEnabled,
  onToggleCrt,
  pipTheme = 'green',
  onCycleTheme,
}) {
  const totalS = currentDayData?.totalS || totalPopulation;
  const totalE = currentDayData?.totalE || 0;
  const totalI = currentDayData?.totalI || 0;
  const totalR = currentDayData?.totalR || 0;

  const themeLabel =
    pipTheme === 'green' ? 'VERDE' : pipTheme === 'amber' ? 'ÁMBAR' : 'CIAN';

  return (
    <header className="game-top-bar pipboy-header" role="banner">
      {/* 1. Left: Brand & Player Controls */}
      <div className="game-top-left">
        <div className="pipboy-logo-badge">
          <span className="pipboy-logo-icon"><Biohazard size={18} /></span>
          <div className="pipboy-brand-meta">
            <span className="pipboy-brand-title">MANTA ZERO</span>
            <span className="pipboy-brand-sub">COE · RETO TRACK B AWS</span>
          </div>
        </div>

        {/* Día de Simulación */}
        <div className="pipboy-day-display" title="Día actual de la simulación epidemiológica">
          <span className="pipboy-day-tag">DÍA</span>
          <span className="pipboy-day-num">{String(currentDay).padStart(2, '0')}</span>
          <span className="pipboy-day-sep">/</span>
          <span className="pipboy-day-max">{String(totalDays).padStart(2, '0')}</span>
        </div>

        {/* Controles del Reproductor */}
        <div className="game-player-controls">
          <button
            onClick={onReset}
            className="pipboy-ctrl-btn"
            title="Reiniciar simulación al Día 0"
          >
            <RotateCcw size={12} />
          </button>
          <button
            onClick={onTogglePlay}
            className={`pipboy-ctrl-btn pipboy-btn-execute ${isPlaying ? 'is-executing' : ''}`}
            title={isPlaying ? 'Pausar Simulación' : 'Ejecutar Simulación'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'PAUSA' : 'SIMULAR'}</span>
          </button>
          <div className="pipboy-speed-selector">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`pipboy-speed-pill ${playbackSpeed === spd ? 'active-speed' : ''}`}
                title={`Velocidad de simulación ${spd}x`}
              >
                {spd}X
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Center: Telemetría de Población (Sanos, Mordidos, Zombies, Inmunes) */}
      <div className="game-top-center" title="Telemetría epidemiológica de Manta en tiempo real">
        <div className="pip-capsule pip-healthy" title="Población susceptible y sana">
          <span className="pip-meter-box meter-green"></span>
          <span className="pip-capsule-lbl">SANOS:</span>
          <span className="pip-capsule-val">{(totalS / 1000).toFixed(1)}k</span>
        </div>

        <div className="pip-capsule pip-exposed" title="Población expuesta / infectada en incubación">
          <span className="pip-meter-box meter-amber"></span>
          <span className="pip-capsule-lbl">MORDIDOS:</span>
          <span className="pip-capsule-val">{(totalE / 1000).toFixed(1)}k</span>
        </div>

        <div className="pip-capsule pip-zombies" title="Zombies activos / casos infecciosos">
          <span className="pip-meter-box meter-red pulse-hazard"></span>
          <span className="pip-capsule-lbl">ZOMBIES:</span>
          <span className="pip-capsule-val">{(totalI / 1000).toFixed(1)}k</span>
        </div>

        <div className="pip-capsule pip-immune" title="Población inmunizada / recuperada por vacunas">
          <span className="pip-meter-box meter-cyan"></span>
          <span className="pip-capsule-lbl">INMUNES:</span>
          <span className="pip-capsule-val">{(totalR / 1000).toFixed(1)}k</span>
        </div>
      </div>

      {/* 3. Right: Acciones Principales y Herramientas del Terminal */}
      <div className="game-top-right">
        {/* Comparativa Oficial Track B */}
        <button
          onClick={onOpenComparisonModal}
          className="pipboy-action-btn btn-eval"
          title="Ver comparativa de las 3 estrategias con vidas salvadas"
        >
          <Award size={12} />
          <span className="btn-full-text">[ COMPARATIVA ]</span>
          <span className="btn-short-text">[ EVAL ]</span>
        </button>

        {/* Parámetros del Brote */}
        <button
          onClick={onOpenConfigDrawer}
          className="pipboy-action-btn"
          title="Modificar parámetros del brote, vacunas y presupuesto"
        >
          <Sliders size={12} />
          <span className="btn-full-text">[ PARÁMETROS ]</span>
          <span className="btn-short-text">[ CFG ]</span>
        </button>

        {/* Brote Sorpresa - Prueba en Vivo Jurado */}
        {onOpenSurpriseModal && (
          <button
            onClick={onOpenSurpriseModal}
            className="pipboy-action-btn btn-surprise"
            title="Cargar escenarios de brote sorpresa en vivo para prueba de resiliencia del jurado"
          >
            <Zap size={12} className="text-amber" />
            <span className="btn-full-text">[ BROTE EN VIVO ]</span>
            <span className="btn-short-text">[ VIVO ]</span>
          </button>
        )}

        {/* Mecánica de Azar Fear & Hunger */}
        <button
          onClick={onOpenCoinModal}
          className="pipboy-action-btn btn-luck"
          title="Lanzar la Moneda del Destino (Mecánica Fear & Hunger)"
        >
          <Coins size={14} className="text-amber" />
          <span className="btn-full-text">[ AZAR F&H ]</span>
          <span className="btn-short-text">[ AZAR ]</span>
        </button>

        {/* Toggle de Scanlines CRT en el Mapa */}
        {onToggleCrt && (
          <button
            onClick={onToggleCrt}
            className={`pipboy-action-btn ${crtEnabled ? 'pip-active' : ''}`}
            title="Activar o desactivar efecto CRT en el mapa táctico"
          >
            <span>[CRT: {crtEnabled ? 'ON' : 'OFF'}]</span>
          </button>
        )}

        {/* Toggle de Paleta de Color */}
        {onCycleTheme && (
          <button
            onClick={onCycleTheme}
            className="pipboy-action-btn"
            title="Alternar paleta de color del terminal: Verde -> Ámbar -> Cian"
          >
            <span>[COLOR: {themeLabel}]</span>
          </button>
        )}

        {/* Silenciador de Audio */}
        <button
          onClick={onToggleSound}
          className={`pipboy-ctrl-btn ${isMuted ? 'muted' : 'unmuted'}`}
          title={isMuted ? 'Activar audio terminal' : 'Silenciar audio terminal'}
        >
          {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
        </button>
      </div>
    </header>
  );
}
