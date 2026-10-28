import React from 'react';
import { X, Zap, ArrowRight, Skull, Box, Store, Pill, Lightbulb } from './Icons';

export default function SurpriseOutbreakModal({
  isOpen,
  onClose,
  onApplyPreset,
}) {
  if (!isOpen) return null;

  const presets = [
    {
      id: 'double_contagion',
      title: 'Horda Hipercontagiosa (Mordedura Doble)',
      Icon: Skull,
      description: 'La cepa zombie muta y duplica la transmisibilidad (β: 0.72). ¿Puede el cerco perimetral de NodeZero contener la avalancha?',
      patch: { beta: 0.72, incubationDays: 2 },
      badge: 'MORDEDURA x2',
      color: 'crimson',
    },
    {
      id: 'supply_crisis',
      title: 'Escasez Crítica de Vacunas (Solo 250 dosis/día)',
      Icon: Box,
      description: 'Recursos extremadamente limitados: solo 250 vacunas al día. El algoritmo focaliza las dosis estrictamente en los cuellos de botella de transporte.',
      patch: { dailyVaccines: 250 },
      badge: 'VACUNAS -60%',
      color: 'amber',
    },
    {
      id: 'market_epicenter',
      title: 'Epicentro en Mercado Nuevo Tarqui (20 Zombies)',
      Icon: Store,
      description: 'El brote inicia un domingo en el centro de abasto más transitado de Manta con 20 zombies activos simultáneos.',
      patch: { patientZeroNode: 'tarqui', initialZombies: 20 },
      badge: 'EPICENTRO TARQUI',
      color: 'violet',
    },
    {
      id: 'variant_evasion',
      title: 'Resistencia Viral (Vacuna al 50% de Eficacia)',
      Icon: Pill,
      description: 'Una mutación reduce la efectividad de la dosis a la mitad (50%). Demuestra si el cortafuegos de NodeZero aún salva la ciudad.',
      patch: { vaccineEfficacy: 0.50, beta: 0.50 },
      badge: 'EFICACIA 50%',
      color: 'blue',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-surprise modal-terminal-square" onClick={(e) => e.stopPropagation()}>
        {/* Retículas tácticas cuadradas */}
        <div className="terminal-corner corner-tl" aria-hidden="true" />
        <div className="terminal-corner corner-tr" aria-hidden="true" />
        <div className="terminal-corner corner-bl" aria-hidden="true" />
        <div className="terminal-corner corner-br" aria-hidden="true" />

        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Zap size={20} className="text-amber" />
            </div>
            <div>
              <div className="modal-title">[ BROTE SORPRESA // PRUEBA DE RESILIENCIA EN VIVO ]</div>
              <div className="modal-sub">
                RETO TRACK B AWS: EVALUACIÓN EN TIEMPO REAL ANTE EL USUARIO
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal font-mono" title="Cerrar ventana">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="surprise-alert-box">
            <Zap size={15} className="text-amber shrink-0" />
            <div>
              <strong>[ ALERTA DE RESILIENCIA EN VIVO ]:</strong> En cualquier momento de la prueba,
              las condiciones del brote pueden ser alteradas para evaluar la resiliencia del sistema.
              Selecciona un escenario sorpresa para recalcular y generar la nueva recomendación óptima en menos de 3 segundos.
            </div>
          </div>

          <div className="presets-grid">
            {presets.map((preset) => {
              const PresetIcon = preset.Icon;
              return (
                <div key={preset.id} className={`preset-card square-card card-border-${preset.color}`}>
                  <div className="preset-top-row">
                    <span className={`preset-badge badge-${preset.color}`}>[ {preset.badge} ]</span>
                  </div>
                  <div className="preset-title flex items-center gap-2">
                    <PresetIcon size={16} className={`text-${preset.color}`} />
                    <span>[ {preset.title} ]</span>
                  </div>
                  <div className="preset-desc">{preset.description}</div>

                  <button
                    onClick={() => {
                      onApplyPreset(preset.patch);
                      onClose();
                    }}
                    className={`btn-apply-preset font-mono btn-${preset.color}`}
                  >
                    <span>[ CARGAR Y REOPTIMIZAR ]</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-hint">
            <Lightbulb size={14} className="text-amber shrink-0" />
            <span>Al aplicar cualquier preset sorpresa, la semilla actual se conserva para garantizar total reproducibilidad.</span>
          </div>
          <button onClick={onClose} className="btn-secondary font-mono">
            [ CERRAR ]
          </button>
        </div>
      </div>
    </div>
  );
}
