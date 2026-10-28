import React from 'react';
import { Award, Shield, Coins, Skull } from './Icons';

export default function GameBottomBar({
  activeStrategy,
  setActiveStrategy,
  simResults,
  currentDay,
  totalDays,
  onSelectDay,
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
          <span className="strat-deck-badge badge-green">[RECOMENDADA]</span>
        </button>

        <button
          onClick={() => setActiveStrategy('random')}
          className={`strat-deck-btn pipboy-tape-btn strat-random ${activeStrategy === 'random' ? 'active-deck' : ''}`}
          title="Línea Base 2: Vacunación al azar (Mecánica Fear & Hunger)"
        >
          <span className="strat-deck-icon"><Coins size={18} /></span>
          <div className="strat-deck-text">
            <span className="strat-deck-title">[2. AZAR F&H]</span>
            <span className="strat-deck-sub">SORTEO ALEATORIO</span>
          </div>
          <span className="strat-deck-badge badge-amber">[AZAR F&H]</span>
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
          <span className="strat-deck-badge badge-red">[COLAPSO]</span>
        </button>
      </div>

      {/* Scrubber Temporal de Frecuencia / Día */}
      <div className="game-timeline-scrubber pipboy-timeline-dial">
        <div className="scrubber-header pipboy-dial-header">
          <span className="scrubber-label">CRONOLOGÍA // DÍA DEL BROTE</span>
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

      {/* Banner de Impacto Cuantitativo Directo */}
      <div className="game-impact-banner pipboy-impact-holotape" title="Impacto del modelo Track B">
        <Award size={15} className="pipboy-impact-icon flex-shrink-0" />
        <div className="impact-text-group">
          <span className="impact-main">
            <strong>TELEMETRÍA TRACK B:</strong> <span className="pip-highlight font-bold">+{metrics.livesSavedVsNone?.toLocaleString()} VIDAS SALVADAS</span> VS NO VACUNAR
          </span>
          <span className="impact-sub">
            +{metrics.livesSavedVsRandom?.toLocaleString()} VS AZAR · REDUCCIÓN DE PICO <span className="pip-highlight font-bold">-{metrics.peakReductionPct}%</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
