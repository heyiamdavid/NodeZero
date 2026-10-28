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
      title: '🎃 Horda Hipercontagiosa (Mordedura Doble)',
      description: 'La cepa zombie muta y duplica la transmisibilidad (β: 0.72). ¿Puede el cerco perimetral de NodeZero contener la avalancha?',
      patch: { beta: 0.72, incubationDays: 2 },
      badge: 'Mordedura x2',
      color: 'crimson',
    },
    {
      id: 'supply_crisis',
      title: '📦 Escasez Crítica de Vacunas (Solo 250 dosis/día)',
      description: 'Recursos extremadamente limitados: solo 250 vacunas al día. El algoritmo focaliza las dosis estrictamente en los cuellos de botella de transporte.',
      patch: { dailyVaccines: 250 },
      badge: 'Vacunas -60%',
      color: 'amber',
    },
    {
      id: 'market_epicenter',
      title: '🏬 Epicentro en Mercado Nuevo Tarqui (20 Zombies)',
      description: 'El brote inicia un domingo en el centro de abasto más transitado de Manta con 20 zombies activos simultáneos.',
      patch: { patientZeroNode: 'tarqui', initialZombies: 20 },
      badge: 'Epicentro Tarqui',
      color: 'violet',
    },
    {
      id: 'variant_evasion',
      title: '🧬 Resistencia Viral (Vacuna al 50% de Eficacia)',
      description: 'Una mutación reduce la efectividad de la dosis a la mitad (50%). Demuestra si el cortafuegos de NodeZero aún salva la ciudad.',
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
              <div className="modal-title">🎃 SIMULADOR DE BROTE SORPRESA (PRUEBA EN VIVO)</div>
              <div className="modal-sub">
                Reto Track B: Demostración en vivo ante el jurado en 5 minutos para evaluar resiliencia
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
