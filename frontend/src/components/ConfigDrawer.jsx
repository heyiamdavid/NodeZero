import React from 'react';
import { X, Sliders, MapPin, Syringe, DollarSign, RotateCcw, Zap } from './Icons';
import { MANTA_NODES } from '../data/mantaNetwork';

export default function ConfigDrawer({
  isOpen,
  onClose,
  config,
  setConfig,
  seed,
  setSeed,
  onRestoreDefaults,
  onOpenSurprise,
}) {
  if (!isOpen) return null;

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
    <div className="drawer-overlay" onClick={onClose}>
      <aside className="config-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-group">
            <Sliders size={18} className="text-cyan" />
            <div>
              <div className="drawer-title">PARÁMETROS DEL BROTE & RECURSOS</div>
              <div className="drawer-sub">Ajuste de variables epidemiológicas del simulador</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-drawer">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          {/* Presets Rápidos */}
          <div className="drawer-section">
            <span className="drawer-section-title">PRESETS RÁPIDOS:</span>
            <div className="preset-chips-row">
              <button
                onClick={() => handleApplyPreset(0.38, 600, 3)}
                className="preset-chip chip-normal"
              >
                Estándar (600 vacunas)
              </button>
              <button
                onClick={() => handleApplyPreset(0.72, 600, 2)}
                className="preset-chip chip-danger"
              >
                Horda Hipercontagiosa
              </button>
              <button
                onClick={() => handleApplyPreset(0.42, 200, 3)}
                className="preset-chip chip-crisis"
              >
                Escasez Extrema (200 vac.)
              </button>
              {onOpenSurprise && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSurprise();
                  }}
                  className="preset-chip chip-surprise-highlight"
                >
                  <Zap size={14} className="text-amber shrink-0" />
                  <span>Escenarios Brote Sorpresa (En Vivo)</span>
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
              className="drawer-select"
            >
              {MANTA_NODES.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.name} ({node.population.toLocaleString()} habs)
                </option>
              ))}
            </select>
            <div className="drawer-hint">
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
            <div className="drawer-minmax">
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
            <div className="drawer-minmax">
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
                className="drawer-input-seed"
              />
              <button
                onClick={() => setSeed(Math.floor(Math.random() * 90000) + 1000)}
                className="btn-drawer-random-seed"
                title="Generar nueva semilla"
              >
                Aleatoria
              </button>
            </div>
            <span className="drawer-hint">Misma semilla = exactamente el mismo resultado para el usuario.</span>
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
              className="btn-reset-drawer"
              title="Restablecer todos los parámetros guardados en caché a la configuración oficial del Reto Track B"
            >
              <RotateCcw size={13} />
              <span>RESTABLECER PARÁMETROS OFICIALES TRACK B</span>
            </button>
          )}
          <button onClick={onClose} className="btn-done-drawer">
            Listo · Continuar Simulación
          </button>
        </div>
      </aside>
    </div>
  );
}
