import React from 'react';
import { Shield, Skull, Award } from './Icons';

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
    <footer className="game-bottom-bar">
      {/* Selector de las 3 Estrategias del Reto */}
      <div className="game-strategy-deck">
        <button
          onClick={() => setActiveStrategy('nodezero')}
          className={`strat-deck-btn strat-nodezero ${activeStrategy === 'nodezero' ? 'active-deck' : ''}`}
          title="Estrategia inteligente con cerco en anillo y hubs de transporte"
        >
          <span className="strat-deck-icon">🛡️</span>
          <div className="strat-deck-text">
            <span className="strat-deck-title">1. NodeZero</span>
            <span className="strat-deck-sub">Anillo + Hubs</span>
          </div>
          <span className="strat-deck-badge badge-green">Recomendada</span>
        </button>

        <button
          onClick={() => setActiveStrategy('random')}
          className={`strat-deck-btn strat-random ${activeStrategy === 'random' ? 'active-deck' : ''}`}
          title="Línea Base 2: Vacunación al azar (Mecánica Fear & Hunger)"
        >
          <span className="strat-deck-icon">🪙</span>
          <div className="strat-deck-text">
            <span className="strat-deck-title">2. Azar Moneda</span>
            <span className="strat-deck-sub">Fear & Hunger</span>
          </div>
          <span className="strat-deck-badge badge-amber">Azar F&H</span>
        </button>

        <button
          onClick={() => setActiveStrategy('none')}
          className={`strat-deck-btn strat-none ${activeStrategy === 'none' ? 'active-deck' : ''}`}
          title="Línea Base 1: Sin intervención ni vacunas"
        >
          <span className="strat-deck-icon">💀</span>
          <div className="strat-deck-text">
            <span className="strat-deck-title">3. Sin Control</span>
            <span className="strat-deck-sub">Propagación Libre</span>
          </div>
          <span className="strat-deck-badge badge-red">Colapso</span>
        </button>
      </div>

      {/* Scrubber Temporal de la Simulación */}
      <div className="game-timeline-scrubber">
        <div className="scrubber-header">
          <span className="scrubber-label">Día del Brote</span>
          <span className="scrubber-day">{currentDay} / {totalDays}</span>
        </div>
        <input
          type="range"
          min="0"
          max={totalDays}
          value={currentDay}
          onChange={(e) => onSelectDay(parseInt(e.target.value))}
          className="scrubber-slider"
        />
      </div>

      {/* Banner de Impacto Cuantitativo Directo */}
      <div className="game-impact-banner" title="Impacto del modelo Track B">
        <Award size={15} className="text-cyan flex-shrink-0" />
        <div className="impact-text-group">
          <span className="impact-main">
            <strong>Track B:</strong> <span className="text-cyan font-bold">+{metrics.livesSavedVsNone?.toLocaleString()} vidas salvadas</span> vs no vacunar
          </span>
          <span className="impact-sub">
            <span className="text-emerald font-bold">+{metrics.livesSavedVsRandom?.toLocaleString()}</span> vs azar · Pico <span className="text-cyan font-bold">-{metrics.peakReductionPct}%</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
