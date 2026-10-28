import React from 'react';
import { Skull, Shield, Biohazard } from './Icons';

export default function PlagueIncHudBar({ currentDayData, totalPopulation = 248000 }) {
  if (!currentDayData) return null;

  const totalS = currentDayData.totalS || 0;
  const totalE = currentDayData.totalE || 0;
  const totalI = currentDayData.totalI || 0;
  const totalR = currentDayData.totalR || 0;

  const infectedPct = ((totalI / totalPopulation) * 100).toFixed(1);
  const immunePct = ((totalR / totalPopulation) * 100).toFixed(1);

  // Nivel de amenaza estilo Plague Inc.
  let threatLevel = 'CONTROLADO';
  let threatColor = '#10b981';
  if (totalI > 25000) {
    threatLevel = 'BIOHAZARD 4 · EXTINCIÓN URBANA';
    threatColor = '#ef4444';
  } else if (totalI > 8000) {
    threatLevel = 'BIOHAZARD 3 · HORDA DESCONTROLADA';
    threatColor = '#f97316';
  } else if (totalI > 1000) {
    threatLevel = 'BIOHAZARD 2 · BROTE ACTIVO';
    threatColor = '#f59e0b';
  } else if (totalI > 0) {
    threatLevel = 'BIOHAZARD 1 · FOCO LOCALIZADO';
    threatColor = '#06b6d4';
  }

  return (
    <div className="plague-hud-bar">
      {/* Medidor de Infección Zombie (Rojo) */}
      <div className="hud-metric hud-infection">
        <div className="hud-metric-header">
          <div className="hud-label-group">
            <Skull size={15} className="text-crimson pulse-crimson" />
            <span className="hud-title">ZOMBIES ACTIVOS</span>
          </div>
          <span className="hud-percentage text-crimson">{infectedPct}%</span>
        </div>
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill fill-crimson"
            style={{ width: `${Math.min(100, Math.max(1, infectedPct))}%` }}
          ></div>
        </div>
        <div className="hud-metric-footer">
          <span>{totalI.toLocaleString()} infectados</span>
          <span className="text-amber">({totalE.toLocaleString()} mordidos)</span>
        </div>
      </div>

      {/* Centro: Nivel de Peligro Biohazard Plague Inc. */}
      <div className="hud-center-biohazard" style={{ borderColor: threatColor }}>
        <div className="biohazard-emblem flex items-center justify-center"><Biohazard size={22} style={{ color: threatColor }} /></div>
        <div className="biohazard-info">
          <span className="biohazard-tag">ESTADO EPIDEMIOLÓGICO</span>
          <span className="biohazard-status" style={{ color: threatColor }}>
            {threatLevel}
          </span>
        </div>
      </div>

      {/* Medidor de Vacunación / Cura (Azul / Cian) */}
      <div className="hud-metric hud-cure">
        <div className="hud-metric-header">
          <div className="hud-label-group">
            <Shield size={15} className="text-cyan" />
            <span className="hud-title">VACUNACIÓN & CURA</span>
          </div>
          <span className="hud-percentage text-cyan">{immunePct}%</span>
        </div>
        <div className="hud-progress-track">
          <div
            className="hud-progress-fill fill-cyan"
            style={{ width: `${Math.min(100, Math.max(0.5, immunePct))}%` }}
          ></div>
        </div>
        <div className="hud-metric-footer">
          <span>{totalR.toLocaleString()} protegidos</span>
          <span className="text-emerald">({totalS.toLocaleString()} sanos)</span>
        </div>
      </div>
    </div>
  );
}
