import React from 'react';
import { Award, Shield, Dice5, Skull, Play, Pause, RotateCcw } from './Icons';

export default function GameBottomBar({
  activeStrategy,
  setActiveStrategy,
  simResults,
  currentDay,
  totalDays,
  onSelectDay,
  isPlaying,
  onTogglePlay,
  onReset,
  playbackSpeed,
  setPlaybackSpeed,
}) {
  const metrics = simResults?.metrics || {};

  return (
    <footer className="game-bottom-bar pipboy-bottom-deck" role="contentinfo">
      {/* Selector de las 3 Estrategias */}
      <div className="game-strategy-deck pipboy-strategy-rack">
        <button
          onClick={() => setActiveStrategy('nodezero')}
          className={`strat-deck-btn pipboy-tape-btn strat-nodezero ${activeStrategy === 'nodezero' ? 'active-deck' : ''}`}
          title="Estrategia inteligente con cerco en anillo y hubs de transporte"
        >
          <span className="strat-deck-icon"><Shield size={18} /></span>
          <div className="strat-deck-text">
            <span className="strat-deck-title">[1. NODEZERO]</span>
            <span className="strat-deck-sub">CERCO EN ANILLO + HUBS</span>
          </div>
          <span className="strat-deck-badge badge-green">
            <span className="badge-desktop">[RECOMENDADA]</span>
            <span className="badge-mobile">[RECOM]</span>
          </span>
        </button>

        <button
          onClick={() => setActiveStrategy('random')}
          className={`strat-deck-btn pipboy-tape-btn strat-random ${activeStrategy === 'random' ? 'active-deck' : ''}`}
          title="Línea Base 2: Vacunación al azar / Sorteo no focalizado"
        >
          <span className="strat-deck-icon"><Dice5 size={18} /></span>
          <div className="strat-deck-text">
            <span className="strat-deck-title">[2. AZAR]</span>
            <span className="strat-deck-sub">SORTEO ALEATORIO</span>
          </div>
          <span className="strat-deck-badge badge-amber">
            <span className="badge-desktop">[AZAR]</span>
            <span className="badge-mobile">[AZAR]</span>
          </span>
        </button>

        <button
          onClick={() => setActiveStrategy('none')}
          className={`strat-deck-btn pipboy-tape-btn strat-none ${activeStrategy === 'none' ? 'active-deck' : ''}`}
          title="Línea Base 1: Sin intervención ni vacunas"
        >
          <span className="strat-deck-icon"><Skull size={18} /></span>
          <div className="strat-deck-text">
            <span className="strat-deck-title">[3. SIN CONTROL]</span>
            <span className="strat-deck-sub">PROPAGACIÓN LIBRE</span>
          </div>
          <span className="strat-deck-badge badge-red">
            <span className="badge-desktop">[COLAPSO]</span>
            <span className="badge-mobile">[CAOS]</span>
          </span>
        </button>
      </div>

      {/* Controles del Reproductor y Cronología de Simulación */}
      <div className="game-playback-cluster">
        <div className="game-player-controls deck-player-controls">
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
            <span className="btn-full-text">{isPlaying ? 'PAUSA' : 'SIMULAR'}</span>
            <span className="btn-short-text">{isPlaying ? 'PAUSA' : 'SIM'}</span>
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

        {/* Scrubber Temporal de Frecuencia / Día */}
        <div className="game-timeline-scrubber pipboy-timeline-dial">
          <div className="scrubber-header pipboy-dial-header">
            <span className="scrubber-label">CRONOLOGÍA // DÍA</span>
            <span className="scrubber-day">
              [{String(currentDay).padStart(2, '0')} / {String(totalDays).padStart(2, '0')}]
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={totalDays}
            value={currentDay}
            onChange={(e) => onSelectDay(parseInt(e.target.value))}
            className="scrubber-slider pipboy-range"
          />
          <div className="pipboy-dial-ticks" aria-hidden="true">
            <span>|0</span>
            <span>|10</span>
            <span>|20</span>
            <span>|30</span>
            <span>|40</span>
          </div>
        </div>
      </div>

      {/* Banner de Impacto Cuantitativo Directo */}
      <div className="game-impact-banner pipboy-impact-holotape" title="Impacto cuantitativo oficial Track B">
        <Award size={16} className="pipboy-impact-icon shrink-0" />
        <div className="impact-text-group">
          <div className="impact-main">
            <strong>TELEMETRÍA TRACK B:</strong>{' '}
            <span className="pip-highlight font-bold">+{metrics.livesSavedVsNone?.toLocaleString()} VIDAS SALVADAS</span>{' '}
            <span className="impact-vs-tag">VS NO VACUNAR</span>
          </div>
          <div className="impact-sub">
            <span className="text-cyan font-bold">+{metrics.livesSavedVsRandom?.toLocaleString()}</span> VS AZAR · REDUCCIÓN DE PICO{' '}
            <span className="pip-highlight font-bold">-{metrics.peakReductionPct}%</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
