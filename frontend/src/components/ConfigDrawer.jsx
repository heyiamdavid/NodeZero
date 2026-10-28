import React from 'react';
import {
  Sliders,
  MapPin,
  Syringe,
  DollarSign,
  RotateCcw,
  Zap,
  ChevronRight,
  ChevronLeft,
} from './Icons';
import { MANTA_NODES } from '../data/mantaNetwork';

export default function ConfigDrawer({
  isOpen,
  onToggle,
  onClose,
  config,
  setConfig,
  seed,
  setSeed,
  onRestoreDefaults,
  onOpenSurprise,
}) {
  const handleChange = (field, value) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyPreset = (beta, dailyVaccines, incubationDays) => {
    setConfig((prev) => ({
      ...prev,
      beta,
      dailyVaccines,
      incubationDays,
    }));
  };

  return (
    <aside
      className={`config-drawer-persistent modal-terminal-square ${isOpen ? 'drawer-expanded' : 'drawer-collapsed'}`}
      aria-label="Panel de Parámetros del Brote"
    >
      {/* Etiqueta de Flecha para Ocultar / Mostrar el Panel Persistente */}
      <button
        type="button"
        onClick={onToggle}
        className={`drawer-arrow-tab ${isOpen ? 'tab-expanded' : 'tab-collapsed'}`}
        title={isOpen ? "Ocultar panel de parámetros [ > ]" : "Mostrar panel de parámetros [ < ]"}
        aria-label={isOpen ? "Ocultar panel de parámetros" : "Mostrar panel de parámetros"}
        aria-expanded={isOpen}
      >
        <div className="drawer-arrow-icon">
          {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </div>
        <span className="drawer-tab-vertical-text">PARÁMETROS</span>
      </button>

      {/* Retículas Tácticas Cuadradas */}
      <div className="terminal-corner corner-tl" aria-hidden="true" />
      <div className="terminal-corner corner-bl" aria-hidden="true" />

      {/* Cabecera del Panel */}
      <div className="drawer-header">
        <div className="drawer-title-group">
          <div className="modal-icon-badge">
            <Sliders size={18} className="text-cyan" />
          </div>
          <div>
            <div className="drawer-title">[ PARÁMETROS DEL BROTE & RECURSOS ]</div>
            <div className="drawer-sub">AJUSTE DE VARIABLES EPIDEMIOLÓGICAS DEL SIMULADOR</div>
          </div>
        </div>
      </div>

      <div className="drawer-body">
        {/* Presets Rápidos */}
        <div className="drawer-section">
          <span className="drawer-section-title font-mono">[ PRESETS RÁPIDOS ]</span>
          <div className="preset-chips-row">
            <button
              onClick={() => handleApplyPreset(0.38, 600, 3)}
              className="preset-chip chip-normal square-btn"
            >
              [ Estándar (600 vacunas) ]
            </button>
            <button
              onClick={() => handleApplyPreset(0.72, 600, 2)}
              className="preset-chip chip-danger square-btn"
            >
              [ Horda Hipercontagiosa ]
            </button>
            <button
              onClick={() => handleApplyPreset(0.42, 200, 3)}
              className="preset-chip chip-crisis square-btn"
            >
              [ Escasez Extrema (200 vac.) ]
            </button>
            {onOpenSurprise && (
              <button
                type="button"
                onClick={onOpenSurprise}
                className="preset-chip chip-surprise-highlight square-btn"
              >
                <Zap size={14} className="text-amber shrink-0" />
                <span>[ Escenarios Brote Sorpresa (En Vivo) ]</span>
              </button>
            )}
          </div>
        </div>

        {/* Epicentro del Brote */}
        <div className="drawer-group">
          <label className="drawer-label">
            <MapPin size={14} className="text-crimson" />
            <span>EPICENTRO DEL BROTE (PACIENTE CERO)</span>
          </label>
          <select
            value={config.patientZeroNode}
            onChange={(e) => handleChange('patientZeroNode', e.target.value)}
            className="drawer-select square-box"
          >
            {MANTA_NODES.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name} ({node.population.toLocaleString()} habs)
              </option>
            ))}
          </select>
          <div className="drawer-hint font-mono">
            {MANTA_NODES.find((n) => n.id === config.patientZeroNode)?.description}
          </div>
        </div>

        {/* Dosis de Vacunas K (El recurso escaso) */}
        <div className="drawer-group">
          <div className="drawer-header-flex">
            <label className="drawer-label">
              <Syringe size={14} className="text-cyan" />
              <span>VACUNAS DISPONIBLES / DÍA (K)</span>
            </label>
            <span className="drawer-badge text-cyan">{config.dailyVaccines} dosis</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="50"
            value={config.dailyVaccines}
            onChange={(e) => handleChange('dailyVaccines', parseInt(e.target.value))}
            className="drawer-range range-cyan"
          />
          <div className="drawer-minmax font-mono">
            <span>100 (Muy escaso)</span>
            <span>600 (Recomendado)</span>
            <span>2,000 (Abundante)</span>
          </div>
        </div>

        {/* Tasa de Transmisión Beta */}
        <div className="drawer-group">
          <div className="drawer-header-flex">
            <label className="drawer-label">TASA DE MORDEDURA / CONTAGIO (β)</label>
            <span className="drawer-badge text-crimson">{config.beta}</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="0.80"
            step="0.02"
            value={config.beta}
            onChange={(e) => handleChange('beta', parseFloat(e.target.value))}
            className="drawer-range range-crimson"
          />
          <div className="drawer-minmax font-mono">
            <span>0.10 (Baja)</span>
            <span>0.38 (Brote Típico)</span>
            <span>0.80 (Invasión)</span>
          </div>
        </div>

        {/* Incubación */}
        <div className="drawer-group">
          <div className="drawer-header-flex">
            <label className="drawer-label">INCUBACIÓN DE MORDEDURA (ESTADO E - EXPUESTO)</label>
            <span className="drawer-badge text-amber">{config.incubationDays} días</span>
          </div>
          <input
            type="range"
            min="1"
            max="7"
            step="1"
            value={config.incubationDays}
            onChange={(e) => handleChange('incubationDays', parseInt(e.target.value))}
            className="drawer-range range-amber"
          />
        </div>

        {/* Semilla Determinista */}
        <div className="drawer-group">
          <label className="drawer-label">SEMILLA DETERMINISTA (REPRODUCIBILIDAD)</label>
          <div className="seed-input-row">
            <input
              type="number"
              value={seed}
              onChange={(e) => setSeed(Number(e.target.value) || 1)}
              className="drawer-input-seed square-box font-mono"
            />
            <button
              onClick={() => setSeed(Math.floor(Math.random() * 90000) + 1000)}
              className="btn-drawer-random-seed square-btn"
              title="Generar nueva semilla"
            >
              [ Aleatoria ]
            </button>
          </div>
          <span className="drawer-hint font-mono">
            Misma semilla = exactamente el mismo resultado matemático.
          </span>
        </div>

        {/* Presupuesto */}
        <div className="drawer-group">
          <div className="drawer-header-flex">
            <label className="drawer-label">
              <DollarSign size={14} className="text-emerald" />
              <span>PRESUPUESTO TOPE MUNICIPAL</span>
            </label>
            <span className="drawer-badge text-emerald">${(config.budgetLimit / 1000).toFixed(0)}k USD</span>
          </div>
          <input
            type="range"
            min="50000"
            max="500000"
            step="25000"
            value={config.budgetLimit}
            onChange={(e) => handleChange('budgetLimit', parseInt(e.target.value))}
            className="drawer-range range-emerald"
          />
        </div>
      </div>

      <div className="drawer-footer">
        {onRestoreDefaults && (
          <button
            type="button"
            onClick={onRestoreDefaults}
            className="btn-reset-drawer square-btn"
            title="Restablecer todos los parámetros guardados en caché a la configuración oficial del Reto Track B"
          >
            <RotateCcw size={13} />
            <span>[ RESTABLECER PARÁMETROS OFICIALES TRACK B ]</span>
          </button>
        )}
        <button onClick={onClose} className="btn-done-drawer square-btn">
          [ OCULTAR PANEL // CONTINUAR ]
        </button>
      </div>
    </aside>
  );
}
