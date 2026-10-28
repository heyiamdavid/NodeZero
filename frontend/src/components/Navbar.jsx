import React from 'react';
import { ShieldAlert, Zap, FileText, Dice5, Cloud, Activity, BookOpen, Thermometer, Dna, Volume2, VolumeX } from './Icons';

export default function Navbar({
  seed,
  setSeed,
  onRandomSeed,
  onOpenSurprise,
  onOpenMayorReport,
  onOpenCatalog,
  onOpenDna,
  isMuted,
  onToggleSound,
  activeDisease,
  isSimulating,
  isBackendConnected,
}) {
  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="logo-badge">
          <ShieldAlert className="logo-icon pulse-crimson" size={26} />
        </div>
        <div>
          <div className="brand-title">
            <span className="brand-primary">NODE</span>
            <span className="brand-accent">ZERO</span>
            <span className="brand-tag">MANTA</span>
          </div>
          <div className="brand-sub">Simulador de Plaga Zombie · Reto Track B AWS</div>
        </div>
      </div>

      <div className="navbar-center">
        {/* Patógeno Activo */}
        {activeDisease && (
          <button
            onClick={onOpenCatalog}
            className="active-disease-badge"
            title="Haga clic para cambiar de patógeno en el Catálogo"
          >
            <span className="disease-badge-icon">{activeDisease.icon}</span>
            <div className="disease-badge-info">
              <span className="badge-micro-lbl">PATÓGENO ACTIVO:</span>
              <span className="badge-name-val">{activeDisease.name.split(' (')[0]}</span>
            </div>
            <span className={`badge-danger-pill danger-${activeDisease.dangerLevel}`}>
              {activeDisease.dangerLevel.toUpperCase()}
            </span>
          </button>
        )}

        {/* AWS Status Telemetry */}
        <div className="aws-telemetry-badge" title="Entorno verificado AWS us-east-1 con AWS Budget de $5">
          <Cloud size={14} className="text-cyan" />
          <span className="aws-pill">AWS us-east-1</span>
          <span className="aws-dot"></span>
          <span className="aws-budget">Budget: $5.00 Activo</span>
        </div>

        {/* Backend Python Status */}
        <div
          className={`backend-status-badge ${isBackendConnected ? 'connected' : 'offline'}`}
          title={isBackendConnected ? 'Conectado a la API FastAPI en Python (AWS Lambda Ready)' : 'Operando con motor client-side'}
        >
          <span className="backend-dot"></span>
          <span className="backend-text">{isBackendConnected ? 'Python API: Activa' : 'Motor Local'}</span>
        </div>

        {/* Control de Semilla Reproducible */}
        <div className="seed-controller" title="Semilla determinista: misma semilla = mismo resultado exacto">
          <span className="seed-label">SEMILLA:</span>
          <input
            type="number"
            value={seed}
            onChange={(e) => setSeed(Number(e.target.value) || 1)}
            disabled={isSimulating}
            className="seed-input"
          />
          <button
            onClick={onRandomSeed}
            disabled={isSimulating}
            className="btn-seed-random"
            title="Generar nueva semilla aleatoria"
          >
            <Dice5 size={14} />
          </button>
        </div>
      </div>

      <div className="navbar-right">
        {/* Toggle Sonido SFX Plague Inc. */}
        <button
          onClick={onToggleSound}
          className={`btn-action btn-sound ${isMuted ? 'btn-sound-muted' : ''}`}
          title={isMuted ? 'Activar sonido táctico Plague Inc.' : 'Silenciar efectos'}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-cyan" />}
          <span>{isMuted ? 'Mute' : 'SFX'}</span>
        </button>

        {/* Laboratorio de Mutaciones & Cerco estilo Plague Inc. */}
        <button
          onClick={onOpenDna}
          className="btn-action btn-dna"
          title="Ver árbol genético de transmisión y contramedidas (Plague Inc.)"
        >
          <Dna size={16} className="text-crimson pulse-crimson" />
          <span>🧬 Laboratorio</span>
        </button>

        {/* Catálogo de Enfermedades */}
        <button
          onClick={onOpenCatalog}
          className="btn-action btn-catalog"
          title="Ver catálogo de patógenos (Dengue, COVID, Sarampión, Cólera, Zombie)"
        >
          <BookOpen size={16} />
          <span>Patógenos</span>
        </button>

        {/* Botón Brote Sorpresa */}
        <button
          onClick={onOpenSurprise}
          className="btn-action btn-surprise"
          title="Prueba de Fuego: Responder al brote sorpresa del jurado en 5 minutos"
        >
          <Zap size={16} className="zap-icon" />
          <span>🎃 Brote Sorpresa</span>
        </button>

        {/* Botón Informe Alcalde */}
        <button
          onClick={onOpenMayorReport}
          className="btn-action btn-mayor"
          title="Generar informe en lenguaje simple para las autoridades"
        >
          <FileText size={16} />
          <span>Informe Alcalde</span>
        </button>
      </div>
    </header>
  );
}
