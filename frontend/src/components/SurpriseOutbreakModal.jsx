import React from 'react';
import { X, Zap, AlertTriangle, ShieldCheck, ArrowRight, Flame } from './Icons';

export default function SurpriseOutbreakModal({
  isOpen,
  onClose,
  currentConfig,
  onApplyPreset,
}) {
  if (!isOpen) return null;

  const presets = [
    {
      id: 'double_contagion',
      title: '🎃 Variante Hipercontagiosa (Doble Contagio)',
      description: 'El virus muta y duplica su transmisibilidad (β: 0.72). El jurado busca ver si la estrategia de anillo aún resiste.',
      patch: { beta: 0.72, incubationDays: 2 },
      badge: 'Transmisión x2',
      color: 'crimson',
    },
    {
      id: 'supply_crisis',
      title: '📦 Crisis de Suministros (50% de Vacunas)',
      description: 'Retraso logístico nacional: solo se dispone de 250 dosis al día. El algoritmo debe priorizar solo los cuellos de botella más críticos.',
      patch: { dailyVaccines: 250 },
      badge: 'Vacunas -50%',
      color: 'amber',
    },
    {
      id: 'market_epicenter',
      title: '🏬 Epicentro en Mercado Nuevo Tarqui',
      description: 'El brote se desata un domingo en el mercado de mayor afluencia de Manta con 20 casos iniciales simultáneos.',
      patch: { patientZeroNode: 'tarqui', initialZombies: 20 },
      badge: 'Epicentro Tarqui',
      color: 'violet',
    },
    {
      id: 'variant_evasion',
      title: '🧬 Variante Evasiva (Eficacia al 50%)',
      description: 'Una mutación en la proteína Spike reduce la protección de la vacuna a la mitad (Eficacia: 50%).',
      patch: { vaccineEfficacy: 0.50, beta: 0.50 },
      badge: 'Eficacia 50%',
      color: 'blue',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-surprise" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Zap size={22} className="text-crimson" />
            </div>
            <div>
              <div className="modal-title">🎃 SIMULADOR DE BROTE SORPRESA</div>
              <div className="modal-sub">
                Prueba de Fuego en Vivo · 5 Minutos para reconfigurar y mostrar la nueva recomendación
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="surprise-alert-box">
            <Flame size={18} className="text-amber" />
            <span>
              <strong>Criterio del Jurado (25% de la nota):</strong> Durante la demo, el jurado cambiará
              las condiciones del brote para probar la resiliencia de su equipo. Seleccione un escenario
              sorpresa para recalcular y generar la nueva recomendación óptima en menos de 3 segundos.
            </span>
          </div>

          <div className="presets-grid">
            {presets.map((preset) => (
              <div key={preset.id} className={`preset-card card-border-${preset.color}`}>
                <div className="preset-top-row">
                  <span className={`preset-badge badge-${preset.color}`}>{preset.badge}</span>
                </div>
                <div className="preset-title">{preset.title}</div>
                <div className="preset-desc">{preset.description}</div>

                <button
                  onClick={() => {
                    onApplyPreset(preset.patch);
                    onClose();
                  }}
                  className={`btn-apply-preset btn-${preset.color}`}
                >
                  <span>Cargar y Reoptimizar</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-hint">
            💡 Al aplicar cualquier preset, la semilla actual se conserva para garantizar total reproducibilidad.
          </div>
          <button onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
