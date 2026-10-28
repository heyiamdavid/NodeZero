import React from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sliders, Award, Dice5 } from './Icons';

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
  isMuted,
  onToggleSound,
}) {
  const totalS = currentDayData?.totalS || totalPopulation;
  const totalE = currentDayData?.totalE || 0;
  const totalI = currentDayData?.totalI || 0;
  const totalR = currentDayData?.totalR || 0;

  return (
    <header className="game-top-bar">
      {/* Brand & Day Player */}
      <div className="game-top-left">
        <div className="game-brand">
          <span className="game-brand-icon">☣️</span>
          <span className="game-brand-title">MANTA ZERO</span>
        </div>

        {/* Control del Tiempo / Día */}
        <div className="game-day-badge">
          <span className="game-day-lbl">DÍA</span>
          <span className="game-day-number">{currentDay}</span>
          <span className="game-day-total">/ {totalDays}</span>
        </div>

        <div className="game-player-controls">
          <button
            onClick={onReset}
            className="game-btn-icon"
            title="Reiniciar Simulación al Día 0"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={onTogglePlay}
            className={`game-btn-play ${isPlaying ? 'is-playing' : ''}`}
            title={isPlaying ? 'Pausar' : 'Iniciar Simulación'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'PAUSA' : 'SIMULAR'}</span>
          </button>
          <div className="game-speed-group">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`game-speed-btn ${playbackSpeed === spd ? 'active-speed' : ''}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Live Population Telemetry */}
      <div className="game-top-center">
        <div className="pop-capsule pop-green" title="Sanos Susceptibles">
          <span className="capsule-dot dot-green"></span>
          <span className="capsule-lbl">Sanos</span>
          <span className="capsule-val">{(totalS / 1000).toFixed(1)}k</span>
        </div>

        <div className="pop-capsule pop-amber" title="Mordidos en incubación">
          <span className="capsule-dot dot-amber"></span>
          <span className="capsule-lbl">Mordidos</span>
          <span className="capsule-val">{(totalE / 1000).toFixed(1)}k</span>
        </div>

        <div className="pop-capsule pop-red" title="Zombies activos">
          <span className="capsule-dot dot-red pulse-red"></span>
          <span className="capsule-lbl">Zombies</span>
          <span className="capsule-val">{(totalI / 1000).toFixed(1)}k</span>
        </div>

        <div className="pop-capsule pop-cyan" title="Inmunizados / Vacunados">
          <span className="capsule-dot dot-cyan"></span>
          <span className="capsule-lbl">Inmunes</span>
          <span className="capsule-val">{(totalR / 1000).toFixed(1)}k</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="game-top-right">
        {/* Fear & Hunger Coin Toss */}
        <button
          onClick={onOpenCoinModal}
          className="game-action-btn btn-coin"
          title="Lanzar la Moneda del Destino (Mecánica Fear & Hunger)"
        >
          <span className="btn-coin-icon">🪙</span>
          <span>Tirar Moneda</span>
        </button>

        {/* Track B Comparison */}
        <button
          onClick={onOpenComparisonModal}
          className="game-action-btn btn-eval"
          title="Ver comparativa de las 3 estrategias con números de vidas salvadas"
        >
          <Award size={14} className="text-cyan" />
          <span>Comparativa</span>
        </button>

        {/* Parameters Drawer */}
        <button
          onClick={onOpenConfigDrawer}
          className="game-action-btn btn-settings"
          title="Modificar parámetros del brote y vacunas"
        >
          <Sliders size={14} />
          <span>Parámetros</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={onToggleSound}
          className={`game-btn-icon ${isMuted ? 'muted' : 'unmuted'}`}
          title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-cyan" />}
        </button>
      </div>
    </header>
  );
}
