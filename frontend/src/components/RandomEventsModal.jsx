import React, { useState } from 'react';
import {
  X,
  Dice5,
  Shield,
  Anchor,
  Waves,
  Store,
  AlertTriangle,
  GraduationCap,
  Syringe,
} from './Icons';
import { RANDOM_EVENTS_CATALOG } from '../data/randomEvents';

export default function RandomEventsModal({
  isOpen,
  onClose,
  config,
  setConfig,
  simResults,
  activeStrategy = 'nodezero',
}) {
  const [activeTab, setActiveTab] = useState('simulation'); // 'simulation' | 'catalog'

  if (!isOpen) return null;

  const currentEvents = simResults?.[activeStrategy]?.events || [];
  const probPercent = Math.round((config?.randomEventProb ?? 0.25) * 100);

  const getEventIcon = (iconName) => {
    switch (iconName) {
      case 'Anchor': return <Anchor size={16} className="text-cyan" />;
      case 'Syringe': return <Syringe size={16} className="text-emerald" />;
      case 'Waves': return <Waves size={16} className="text-cyan" />;
      case 'Store': return <Store size={16} className="text-crimson" />;
      case 'AlertTriangle': return <AlertTriangle size={16} className="text-amber" />;
      case 'GraduationCap': return <GraduationCap size={16} className="text-emerald" />;
      case 'Shield': return <Shield size={16} className="text-cyan" />;
      default: return <Dice5 size={16} style={{ color: 'var(--primary-color)' }} />;
    }
  };

  const handleProbChange = (val) => {
    if (setConfig) {
      setConfig((prev) => ({
        ...prev,
        randomEventProb: val,
      }));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window modal-events modal-terminal-square"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Eventos Aleatorios de Probabilidad"
      >
        {/* Retículas Tácticas Cuadradas */}
        <div className="terminal-corner corner-tl" aria-hidden="true" />
        <div className="terminal-corner corner-tr" aria-hidden="true" />
        <div className="terminal-corner corner-bl" aria-hidden="true" />
        <div className="terminal-corner corner-br" aria-hidden="true" />

        {/* Cabecera del Terminal */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Dice5 size={22} style={{ color: 'var(--primary-color)' }} />
            </div>
            <div>
              <div className="modal-title">[ PROTOCOLO DE CONTINGENCIAS // EVENTOS ALEATORIOS ]</div>
              <div className="modal-sub">
                SISTEMA PROBABILÍSTICO DE CRISIS Y EVENTOS DE CAMPO · MANTA TRACK B
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal font-mono" title="Cerrar ventana">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body events-modal-body">
          {/* Panel de Control de Probabilidad Adaptable al Tema */}
          <div className="events-prob-card square-box">
            <div className="prob-card-header">
              <div className="prob-header-left">
                <Dice5 size={16} className="shrink-0" style={{ color: 'var(--primary-color)' }} />
                <span className="prob-card-label font-mono font-bold">
                  [ PROBABILIDAD DE EVENTOS ]:
                </span>
                <span className="prob-display-badge font-mono">
                  {probPercent}% / DÍA
                </span>
              </div>
              <span className="prob-status-indicator font-mono">
                {probPercent === 0
                  ? '[ DESACTIVADO · CERO CONTINGENCIAS ]'
                  : probPercent <= 30
                  ? '[ MODERADO · 1 CADA 3-5 DÍAS ]'
                  : probPercent <= 60
                  ? '[ ALTA FRECUENCIA · 1 CADA 2 DÍAS ]'
                  : '[ MODO CRISIS EXTREMA · DIARIO ]'}
              </span>
            </div>

            <div className="prob-card-slider-bay">
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config?.randomEventProb ?? 0.25}
                onChange={(e) => handleProbChange(parseFloat(e.target.value))}
                className="tactical-range-theme"
                aria-label="Probabilidad diaria de eventos aleatorios"
              />
              <div className="prob-scale-labels font-mono">
                <span className="scale-min">[ 0% DESACTIVADO ]</span>
                <span className="scale-mid font-bold" style={{ color: 'var(--primary-bright)' }}>
                  [ {probPercent}% SELECCIONADO ]
                </span>
                <span className="scale-max">[ 100% DIARIO ]</span>
              </div>
            </div>
          </div>

          {/* Navegación por pestañas del modal */}
          <div className="events-tabs-row">
            <button
              onClick={() => setActiveTab('simulation')}
              className={`events-tab-btn font-mono square-btn ${activeTab === 'simulation' ? 'active-tab' : ''}`}
            >
              [ EVENTOS EN ESTA SIMULACIÓN ({currentEvents.length}) ]
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`events-tab-btn font-mono square-btn ${activeTab === 'catalog' ? 'active-tab' : ''}`}
            >
              [ CATÁLOGO DE CONTINGENCIAS ({RANDOM_EVENTS_CATALOG.length}) ]
            </button>
          </div>

          {/* Pestaña 1: Registro de eventos de la simulación actual */}
          {activeTab === 'simulation' && (
            <div className="simulation-events-container">
              {currentEvents.length === 0 ? (
                <div className="empty-events-box square-box font-mono">
                  <AlertTriangle size={24} className="mb-2" style={{ color: 'var(--primary-color)' }} />
                  <div className="font-bold" style={{ color: 'var(--primary-bright)' }}>
                    [ NO HAY CONTINGENCIAS REGISTRADAS ]
                  </div>
                  <div className="text-muted text-xs mt-1">
                    {probPercent === 0
                      ? 'La probabilidad está en 0%. Mueve el control superior para habilitar contingencias.'
                      : 'La semilla actual no ha detonado eventos en los días simulados. Puedes aumentar la probabilidad en el control superior o avanzar más días en la simulación.'}
                  </div>
                </div>
              ) : (
                <div className="events-timeline-list">
                  {currentEvents.map((evt, idx) => (
                    <div
                      key={evt.id || idx}
                      className={`event-timeline-card square-box ${evt.type === 'positive' ? 'card-pos' : 'card-neg'}`}
                    >
                      <div className="event-card-left">
                        <span className="event-day-pill font-mono">
                          DÍA {String(evt.day).padStart(2, '0')}
                        </span>
                        <div className="event-icon-circle">
                          {getEventIcon(evt.icon)}
                        </div>
                      </div>

                      <div className="event-card-center">
                        <div className="event-title font-display">{evt.title}</div>
                        <div className="event-desc font-mono">{evt.description}</div>
                        <div className="event-meta font-mono">
                          <span>Sector: <strong>{evt.nodeName}</strong></span>
                          {evt.impactSummary && (
                            <span className="impact-detail"> · {evt.impactSummary}</span>
                          )}
                        </div>
                      </div>

                      <div className="event-card-right">
                        <span className={`event-badge-impact font-mono ${evt.type === 'positive' ? 'badge-green' : 'badge-red'}`}>
                          [ {evt.badge} ]
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pestaña 2: Catálogo de todas las contingencias posibles en Manta */}
          {activeTab === 'catalog' && (
            <div className="events-catalog-grid">
              {RANDOM_EVENTS_CATALOG.map((item) => (
                <div
                  key={item.id}
                  className={`catalog-event-card square-box ${item.type === 'positive' ? 'catalog-pos' : 'catalog-neg'}`}
                >
                  <div className="catalog-header flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-display text-sm font-bold">
                      {getEventIcon(item.icon)}
                      <span>{item.title}</span>
                    </div>
                    <span className={`preset-badge font-mono text-xs ${item.type === 'positive' ? 'badge-green' : 'badge-red'}`}>
                      [ {item.badge} ]
                    </span>
                  </div>
                  <div className="catalog-desc font-mono text-xs text-muted mb-2">
                    {item.description}
                  </div>
                  <div className="catalog-footer font-mono text-xs flex justify-between text-muted border-t border-subtle pt-1">
                    <span>Nodo: {item.nodeName}</span>
                    <span className={item.type === 'positive' ? 'text-emerald' : 'text-crimson'}>
                      {item.type === 'positive' ? 'Beneficio Sanitario' : 'Amenaza Epidemiológica'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pie del Modal */}
        <div className="modal-footer">
          <div className="footer-hint font-mono text-xs">
            <Dice5 size={13} className="shrink-0" style={{ color: 'var(--primary-color)' }} />
            <span>
              Aleatoriedad por semilla: cada valor genera una secuencia única y reproducible de eventos (Mulberry32).
            </span>
          </div>
          <button onClick={onClose} className="btn-secondary font-mono square-btn">
            [ CERRAR ]
          </button>
        </div>
      </div>
    </div>
  );
}
