import React from 'react';
import { Play, Pause, RotateCcw, StepForward, FastForward, Sliders, MapPin, Syringe, DollarSign, Shield, Dice5, Skull } from './Icons';
import { MANTA_NODES } from '../data/mantaNetwork';

export default function Controls({
  config,
  setConfig,
  currentDay,
  totalDays,
  isPlaying,
  onTogglePlay,
  onReset,
  onStepForward,
  playbackSpeed,
  setPlaybackSpeed,
  activeViewStrategy,
  setActiveViewStrategy,
}) {
  const handleChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <aside className="controls-sidebar">
      <div className="sidebar-section-title">
        <Sliders size={16} className="text-emerald" />
        <span>PARÁMETROS DE LA PLAGA ZOMBIE</span>
      </div>

      {/* Epicentro inicial */}
      <div className="control-group">
        <label className="control-label">
          <MapPin size={14} className="text-crimson" />
          <span>EPICENTRO DEL BROTE (PACIENTE CERO)</span>
        </label>
        <select
          value={config.patientZeroNode}
          onChange={(e) => handleChange('patientZeroNode', e.target.value)}
          className="control-select"
        >
          {MANTA_NODES.map((node) => (
            <option key={node.id} value={node.id}>
              {node.name}
            </option>
          ))}
        </select>
        <div className="control-hint">
          {MANTA_NODES.find((n) => n.id === config.patientZeroNode)?.description}
        </div>
      </div>

      {/* Tasa de Contagio Beta */}
      <div className="control-group">
        <div className="control-header-flex">
          <label className="control-label">TASA DE MORDEDURA / CONTAGIO (β)</label>
          <span className="control-value-badge text-crimson">{config.beta}</span>
        </div>
        <input
          type="range"
          min="0.10"
          max="0.80"
          step="0.02"
          value={config.beta}
          onChange={(e) => handleChange('beta', parseFloat(e.target.value))}
          className="control-range range-crimson"
        />
        <div className="control-minmax">
          <span>0.10 (Baja)</span>
          <span>0.38 (Brote Estándar)</span>
          <span>0.80 (Horda Extrema)</span>
        </div>
      </div>

      {/* Incubación (Días como Mordido) */}
      <div className="control-group">
        <div className="control-header-flex">
          <label className="control-label">INCUBACIÓN DE MORDEDURA (ESTADO E - EXPUESTO)</label>
          <span className="control-value-badge text-amber">{config.incubationDays} días</span>
        </div>
        <input
          type="range"
          min="1"
          max="7"
          step="1"
          value={config.incubationDays}
          onChange={(e) => handleChange('incubationDays', parseInt(e.target.value))}
          className="control-range range-amber"
        />
        <div className="control-minmax">
          <span>1 día (Mutación Rápida)</span>
          <span>3 días (Típico Z-Virus)</span>
          <span>7 días (Resistencia)</span>
        </div>
      </div>

      <div className="sidebar-section-title mt-4">
        <Syringe size={16} className="text-cyan" />
        <span>RECURSOS LIMITADOS & VACUNAS</span>
      </div>

      {/* Vacunas por día */}
      <div className="control-group">
        <div className="control-header-flex">
          <label className="control-label">VACUNAS DISPONIBLES / DÍA (K)</label>
          <span className="control-value-badge text-cyan">{config.dailyVaccines} dosis</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          step="50"
          value={config.dailyVaccines}
          onChange={(e) => handleChange('dailyVaccines', parseInt(e.target.value))}
          className="control-range range-cyan"
        />
        <div className="control-minmax">
          <span>100 (Muy Escaso)</span>
          <span>600 (Recomendado)</span>
          <span>2,000 (Abundante)</span>
        </div>
      </div>

      {/* Presupuesto Total */}
      <div className="control-group">
        <div className="control-header-flex">
          <label className="control-label">
            <DollarSign size={13} className="text-emerald" />
            <span>PRESUPUESTO TOPE MUNICIPAL</span>
          </label>
          <span className="control-value-badge text-emerald">
            ${(config.budgetLimit / 1000).toFixed(0)}k USD
          </span>
        </div>
        <input
          type="range"
          min="50000"
          max="500000"
          step="25000"
          value={config.budgetLimit}
          onChange={(e) => handleChange('budgetLimit', parseInt(e.target.value))}
          className="control-range range-emerald"
        />
      </div>

      {/* Selector de Estrategia a Visualizar en el Mapa */}
      <div className="control-group mt-3">
        <label className="control-label">VER EN MAPA LA ESTRATEGIA:</label>
        <div className="strategy-toggle-pills">
          <button
            onClick={() => setActiveViewStrategy('nodezero')}
            className={`pill-btn ${activeViewStrategy === 'nodezero' ? 'active-nodezero' : ''}`}
            title="Estrategia Inteligente: Anillo perimetral y cortafuegos en hubs de transporte"
          >
            <span className="flex items-center gap-1.5"><Shield size={13} /> 1. NodeZero (Anillo)</span>
          </button>
          <button
            onClick={() => setActiveViewStrategy('random')}
            className={`pill-btn ${activeViewStrategy === 'random' ? 'active-random' : ''}`}
            title="Línea Base 2: Vacunación al azar sin planificación territorial"
          >
            <span className="flex items-center gap-1.5"><Dice5 size={13} /> 2. Vacunar al Azar</span>
          </button>
          <button
            onClick={() => setActiveViewStrategy('none')}
            className={`pill-btn ${activeViewStrategy === 'none' ? 'active-none' : ''}`}
            title="Línea Base 1: Propagación libre sin vacunar a nadie"
          >
            <span className="flex items-center gap-1.5"><Skull size={13} /> 3. No Vacunar</span>
          </button>
        </div>
      </div>

      {/* Barra de Reproducción y Control Temporal */}
      <div className="timeline-controller">
        <div className="timeline-header">
          <span className="timeline-day-tag">
            DÍA <strong className="text-cyan">{currentDay}</strong> / {totalDays}
          </span>
          <div className="speed-pills">
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                onClick={() => setPlaybackSpeed(spd)}
                className={`btn-spd ${playbackSpeed === spd ? 'active-spd' : ''}`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Barra de progreso interactiva */}
        <div className="timeline-progress-bar">
          <div
            className="timeline-progress-fill"
            style={{ width: `${(currentDay / totalDays) * 100}%` }}
          ></div>
        </div>

        <div className="timeline-buttons-row">
          <button onClick={onReset} className="btn-player btn-reset" title="Reiniciar al Día 0">
            <RotateCcw size={16} />
          </button>
          <button
            onClick={onTogglePlay}
            className={`btn-player btn-play ${isPlaying ? 'playing' : ''}`}
            title={isPlaying ? 'Pausar' : 'Iniciar Simulación'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            <span>{isPlaying ? 'PAUSAR' : 'SIMULAR DÍA A DÍA'}</span>
          </button>
          <button
            onClick={onStepForward}
            className="btn-player btn-step"
            title="Avanzar 1 Día"
            disabled={isPlaying || currentDay >= totalDays}
          >
            <StepForward size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
