import React, { useState } from 'react';
import { TrendingUp, Layers, CheckCircle2, AlertCircle, Skull, Dice5, Shield } from './Icons';

export default function CurvesChart({
  simResults,
  currentDay,
  onSelectDay,
  monteCarloData,
  isMonteCarloActive,
  setIsMonteCarloActive,
}) {
  const [hoverDay, setHoverDay] = useState(null);

  if (!simResults || !simResults.none || !simResults.nodezero) {
    return <div className="chart-loading">Cargando telemetría epidemiológica...</div>;
  }

  const noneHistory = simResults.none.history || [];
  const randomHistory = simResults.random.history || [];
  const nodeZeroHistory = simResults.nodezero.history || [];

  const maxDays = noneHistory.length - 1;

  // Encontrar el pico máximo entre todas las estrategias para escalar el eje Y
  let peakY = 1000;
  noneHistory.forEach((d) => {
    if (d.totalI > peakY) peakY = d.totalI;
  });
  // Margen superior
  const maxY = Math.ceil(peakY * 1.15);

  const chartWidth = 720;
  const chartHeight = 260;
  const padding = { top: 25, right: 30, bottom: 35, left: 65 };

  const innerW = chartWidth - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  // Funciones de escala
  const getX = (day) => padding.left + (day / (maxDays || 1)) * innerW;
  const getY = (val) => padding.top + innerH - (val / (maxY || 1)) * innerH;

  // Generador de path SVG suave
  const generatePath = (data, field = 'totalI') => {
    if (!data || data.length === 0) return '';
    return data.reduce((acc, pt, idx) => {
      const x = getX(pt.day);
      const y = getY(pt[field] || 0);
      return idx === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  };

  // Generador de área / banda sombreada (Monte Carlo)
  const generateArea = (bandData) => {
    if (!bandData || bandData.length === 0) return '';
    let topPath = '';
    let bottomPath = '';
    bandData.forEach((pt, idx) => {
      const x = getX(pt.day);
      const yTop = getY(pt.p75);
      const yBottom = getY(pt.p25);
      topPath += idx === 0 ? `M ${x},${yTop}` : ` L ${x},${yTop}`;
      bottomPath = ` L ${x},${yBottom}` + bottomPath;
    });
    return topPath + bottomPath + ' Z';
  };

  const pathNone = generatePath(noneHistory);
  const pathRandom = generatePath(randomHistory);
  const pathNodeZero = generatePath(nodeZeroHistory);

  const activeDay = hoverDay !== null ? hoverDay : currentDay;
  const pointNone = noneHistory[activeDay] || { totalI: 0 };
  const pointRandom = randomHistory[activeDay] || { totalI: 0 };
  const pointNodeZero = nodeZeroHistory[activeDay] || { totalI: 0 };

  return (
    <div className="curves-chart-card">
      <div className="chart-header-row">
        <div className="chart-title-group">
          <TrendingUp size={18} className="text-cyan" />
          <span className="chart-title">COMPARATIVA DE CURVAS: BROTE ZOMBIE VS ESTRATEGIAS</span>
        </div>

        <div className="chart-actions">
          {/* Toggle Monte Carlo */}
          <button
            onClick={() => setIsMonteCarloActive(!isMonteCarloActive)}
            className={`btn-mc-toggle ${isMonteCarloActive ? 'active' : ''}`}
            title="Mostrar intervalos de confianza Monte Carlo (p25 - p75)"
          >
            <Layers size={14} />
            <span>Monte Carlo {isMonteCarloActive ? '(Activo)' : '(Inactivo)'}</span>
          </button>
        </div>
      </div>

      {/* Leyenda Interactiva */}
      <div className="chart-legend-row">
        <div className="chart-legend-tag tag-none">
          <span className="line-indicator line-red"></span>
          <span className="flex items-center gap-1"><Skull size={13} /> 1. Sin Intervención (No Vacunar)</span>
          <strong className="tag-val text-crimson">{pointNone.totalI?.toLocaleString()} zombies</strong>
        </div>

        <div className="chart-legend-tag tag-random">
          <span className="line-indicator line-amber"></span>
          <span className="flex items-center gap-1"><Dice5 size={13} /> 2. Vacunación al Azar</span>
          <strong className="tag-val text-amber">{pointRandom.totalI?.toLocaleString()} zombies</strong>
        </div>

        <div className="chart-legend-tag tag-nodezero">
          <span className="line-indicator line-cyan"></span>
          <span className="flex items-center gap-1"><Shield size={13} /> 3. NodeZero (Anillo + Hubs)</span>
          <strong className="tag-val text-cyan">{pointNodeZero.totalI?.toLocaleString()} zombies</strong>
        </div>
      </div>

      <div className="svg-chart-wrapper">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="curves-svg"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const svgX = (relX / rect.width) * chartWidth;
            if (svgX >= padding.left && svgX <= chartWidth - padding.right) {
              const day = Math.round(((svgX - padding.left) / innerW) * maxDays);
              setHoverDay(Math.max(0, Math.min(maxDays, day)));
            }
          }}
          onMouseLeave={() => setHoverDay(null)}
          onClick={() => {
            if (hoverDay !== null && onSelectDay) {
              onSelectDay(hoverDay);
            }
          }}
        >
          {/* Ejes y líneas de cuadrícula horizontales */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const val = Math.round(maxY * ratio);
            const y = getY(val);
            return (
              <g key={`grid-y-${ratio}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontFamily="Share Tech Mono"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Marcas de días en el eje X */}
          {[0, 10, 20, 30, 40].filter((d) => d <= maxDays).map((day) => {
            const x = getX(day);
            return (
              <g key={`axis-x-${day}`}>
                <line
                  x1={x}
                  y1={padding.top + innerH}
                  x2={x}
                  y2={padding.top + innerH + 6}
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padding.top + innerH + 18}
                  textAnchor="middle"
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontFamily="Share Tech Mono"
                >
                  D{day}
                </text>
              </g>
            );
          })}

          {/* Bandas de Incertidumbre Monte Carlo */}
          {isMonteCarloActive && monteCarloData && (
            <>
              <path
                d={generateArea(monteCarloData.summary?.none)}
                fill="rgba(255, 51, 51, 0.12)"
              />
              <path
                d={generateArea(monteCarloData.summary?.random)}
                fill="rgba(255, 176, 32, 0.12)"
              />
              <path
                d={generateArea(monteCarloData.summary?.nodezero)}
                fill="var(--primary-faint)"
              />
            </>
          )}

          {/* Curva 1: Sin Intervención (Línea Base 1 - Rojo) */}
          <path
            d={pathNone}
            fill="none"
            stroke="var(--pip-red, #ff3333)"
            strokeWidth="2.5"
            strokeDasharray="6 3"
            opacity="0.85"
          />

          {/* Curva 2: Intervención al Azar (Línea Base 2 - Ámbar) */}
          <path
            d={pathRandom}
            fill="none"
            stroke="var(--pip-amber, #ffb020)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            opacity="0.85"
          />

          {/* Curva 3: NodeZero Estrategia Óptima (Verde Fósforo) */}
          <path
            d={pathNodeZero}
            fill="none"
            stroke="var(--primary-color)"
            strokeWidth="3.5"
            className="nodezero-curve-glow"
          />

          {/* Línea vertical indicadora del Día Activo */}
          <line
            x1={getX(activeDay)}
            y1={padding.top}
            x2={getX(activeDay)}
            y2={padding.top + innerH}
            stroke="var(--primary-color)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Puntos de datos en el día activo */}
          <circle cx={getX(activeDay)} cy={getY(pointNone.totalI || 0)} r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1" />
          <circle cx={getX(activeDay)} cy={getY(pointRandom.totalI || 0)} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
          <circle cx={getX(activeDay)} cy={getY(pointNodeZero.totalI || 0)} r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
        </svg>

        {/* Banner de Verificación de la Prueba de Fuego */}
        <div className="chart-evaluation-banner">
          <div className="banner-left">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>
              <strong>Validación Track B:</strong> La estrategia NodeZero aplana el pico zombie en un{' '}
              <strong className="text-emerald">{simResults.metrics?.peakReductionPct}%</strong>, salvando a{' '}
              <strong className="text-cyan">{simResults.metrics?.livesSavedVsNone?.toLocaleString()}</strong> personas vs. no intervenir y{' '}
              <strong className="text-emerald">+{simResults.metrics?.livesSavedVsRandom?.toLocaleString()}</strong> más que al azar.
            </span>
          </div>
          <div className="banner-right">
            <span>Día actual: <strong>Día {activeDay}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
