import React, { useState } from 'react';
import { X, Dna, Shield, Zap, Biohazard, Skull, Droplet, Bus, CircleDot, Store, Waves, StopCircle, Target, Activity } from './Icons';

export default function PlagueIncDnaModal({
  isOpen,
  onClose,
  config,
}) {
  const [activeTab, setActiveTab] = useState('transmission'); // 'transmission' | 'symptoms' | 'countermeasures'

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-plague-dna" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Laboratorio Plague Inc. */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge badge-dna">
              <Dna size={22} className="text-crimson pulse-crimson" />
            </div>
            <div>
              <div className="modal-title">LABORATORIO DE MUTACIÓN & CONTRAMEDIDAS</div>
              <div className="modal-sub">
                Árbol Genético SEIR estilo Plague Inc. · Vías de Transmisión vs. Cerco Epidemiológico
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={20} />
          </button>
        </div>

        {/* Pestañas de Árbol de Habilidades */}
        <div className="dna-tabs-bar">
          <button
            onClick={() => setActiveTab('transmission')}
            className={`dna-tab ${activeTab === 'transmission' ? 'active-transmission' : ''}`}
          >
            <span className="flex items-center gap-1.5"><Biohazard size={15} /> Vías de Transmisión</span>
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`dna-tab ${activeTab === 'symptoms' ? 'active-symptoms' : ''}`}
          >
            <span className="flex items-center gap-1.5"><Skull size={15} /> Rasgos de la Horda</span>
          </button>
          <button
            onClick={() => setActiveTab('countermeasures')}
            className={`dna-tab ${activeTab === 'countermeasures' ? 'active-countermeasures' : ''}`}
          >
            <span className="flex items-center gap-1.5"><Shield size={15} /> Contramedidas NodeZero</span>
          </button>
        </div>

        <div className="modal-body dna-modal-body">
          {activeTab === 'transmission' && (
            <div className="dna-grid">
              <div className="dna-trait-card active-trait">
                <div className="trait-header">
                  <span className="trait-icon"><Droplet size={18} className="text-crimson" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Mordedura & Saliva</span>
                    <span className="trait-type text-crimson">Transmisión Dérmica</span>
                  </div>
                </div>
                <p className="trait-desc">
                  Inoculación directa de alta carga viral. Responsable de la tasa de contagio base (β = {config.beta}).
                </p>
                <div className="trait-stat-badge">Infectividad +38%</div>
              </div>

              <div className="dna-trait-card active-trait">
                <div className="trait-header">
                  <span className="trait-icon"><Bus size={18} className="text-amber" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Vectores de Transporte Público</span>
                    <span className="trait-type text-amber">Dispersión Urbana</span>
                  </div>
                </div>
                <p className="trait-desc">
                  Buses de Tarqui, Centro y Eloy Alfaro transportan personas expuestas (asintomáticas) entre parroquias.
                </p>
                <div className="trait-stat-badge">Flujo Inter-parroquial Activo</div>
              </div>

              <div className="dna-trait-card active-trait">
                <div className="trait-header">
                  <span className="trait-icon"><CircleDot size={18} className="text-amber" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Incubación Silenciosa</span>
                    <span className="trait-type text-amber">Periodo de Latencia (E)</span>
                  </div>
                </div>
                <p className="trait-desc">
                  La víctima tarda {config.incubationDays} días en manifestar canibalismo, facilitando el cruce de cercos sin ser detectada.
                </p>
                <div className="trait-stat-badge">Latencia: {config.incubationDays} Días</div>
              </div>

              <div className="dna-trait-card">
                <div className="trait-header">
                  <span className="trait-icon"><Store size={18} className="text-crimson" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Aglomeración en Mercados</span>
                    <span className="trait-type text-crimson">Hub Comercial</span>
                  </div>
                </div>
                <p className="trait-desc">
                  Alta densidad en Mercado Nuevo Tarqui multiplica el $R_0$ por contacto simultáneo entre comerciantes.
                </p>
                <div className="trait-stat-badge">Multiplicador x1.8 en Tarqui</div>
              </div>
            </div>
          )}

          {activeTab === 'symptoms' && (
            <div className="dna-grid">
              <div className="dna-trait-card active-trait">
                <div className="trait-header">
                  <span className="trait-icon"><Zap size={18} className="text-amber" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Fiebre Hiperpirética</span>
                    <span className="trait-type text-crimson">Síntoma Inicial</span>
                  </div>
                </div>
                <p className="trait-desc">
                  Pérdida de la conciencia y daño cerebral motor en 48 horas tras la mordedura.
                </p>
              </div>

              <div className="dna-trait-card active-trait">
                <div className="trait-header">
                  <span className="trait-icon"><Skull size={18} className="text-crimson" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Agresividad Caníbal</span>
                    <span className="trait-type text-crimson">Estado Infeccioso (I)</span>
                  </div>
                </div>
                <p className="trait-desc">
                  Ataques indiscriminados a transeúntes. Permanece infeccioso por {config.recoveryDays || 14} días antes de abatimiento.
                </p>
              </div>

              <div className="dna-trait-card">
                <div className="trait-header">
                  <span className="trait-icon"><Waves size={18} className="text-cyan" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Resistencia Salina / Marina</span>
                    <span className="trait-type text-cyan">Mutación Costera</span>
                  </div>
                </div>
                <p className="trait-desc">
                  La brisa marina de la costa del Pacífico no desactiva los aerosoles infecciosos en el malecón.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'countermeasures' && (
            <div className="dna-grid">
              <div className="dna-trait-card active-countermeasure">
                <div className="trait-header">
                  <span className="trait-icon"><Shield size={18} className="text-cyan" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Vacunación en Anillo (Ring)</span>
                    <span className="trait-type text-cyan">Estrategia NodeZero</span>
                  </div>
                </div>
                <p className="trait-desc">
                  Aplica las {config.dailyVaccines} vacunas diarias creando un cortafuegos en las parroquias vecinas al foco antes de que la infección se escape.
                </p>
                <div className="trait-stat-badge bg-cyan text-white">Eficacia Máxima: +48k Vidas</div>
              </div>

              <div className="dna-trait-card active-countermeasure">
                <div className="trait-header">
                  <span className="trait-icon"><StopCircle size={18} className="text-cyan" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Bloqueo en Terminal El Palmar</span>
                    <span className="trait-type text-cyan">Control de Movilidad</span>
                  </div>
                </div>
                <p className="trait-desc">
                  Prioriza la inmunización del personal del terminal terrestre, evitando la dispersión hacia otros cantones.
                </p>
                <div className="trait-stat-badge bg-cyan text-white">Hub Blindado</div>
              </div>

              <div className="dna-trait-card active-countermeasure">
                <div className="trait-header">
                  <span className="trait-icon"><Target size={18} className="text-emerald" /></span>
                  <div className="trait-title-box">
                    <span className="trait-name">Cero Dosis Desperdiciadas</span>
                    <span className="trait-type text-emerald">Optimización Matemática</span>
                  </div>
                </div>
                <p className="trait-desc">
                  A diferencia de la vacunación al azar, el algoritmo NUNCA gasta vacunas en individuos que ya son zombies o inmunes.
                </p>
                <div className="trait-stat-badge bg-emerald text-white">100% Eficiencia de Dosis</div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-hint-text">
            <span className="flex items-center gap-1.5"><Activity size={14} className="text-cyan shrink-0" /><em>Dinámica de Grafo:</em></span> Cada parámetro altera las ecuaciones diferenciales del grafo en tiempo real.
          </div>
          <button onClick={onClose} className="btn-action btn-surprise">
            Entendido · Volver al Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
