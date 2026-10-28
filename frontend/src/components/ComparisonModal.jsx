import React from 'react';
import {
  X,
  Award,
  Shield,
  TrendingDown,
  DollarSign,
  Skull,
  Dice5,
  Check,
  Pin,
} from './Icons';
import CurvesChart from './CurvesChart';

export default function ComparisonModal({
  isOpen,
  onClose,
  simResults,
  currentDay,
  onSelectDay,
}) {
  if (!isOpen || !simResults || !simResults.nodezero) return null;

  const { metrics, none, random, nodezero } = simResults;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window modal-comparison modal-terminal-square"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tactical Corner Reticle Accents */}
        <div className="terminal-corner corner-tl" aria-hidden="true" />
        <div className="terminal-corner corner-tr" aria-hidden="true" />
        <div className="terminal-corner corner-bl" aria-hidden="true" />
        <div className="terminal-corner corner-br" aria-hidden="true" />

        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div
              className="modal-icon-badge"
              style={{
                background: 'var(--primary-faint)',
                borderColor: 'var(--primary-color)',
                color: 'var(--primary-bright)',
              }}
            >
              <Award size={20} />
            </div>
            <div>
              <div className="modal-title">[ EVALUACIÓN TRACK B // COMPARATIVA TRIPLE ]</div>
              <div className="modal-sub font-mono">
                NODEZERO (ANILLO + HUBS) VS. VACUNACIÓN ALEATORIA VS. PROPAGACIÓN LIBRE
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal square-btn" title="Cerrar ventana">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body comparison-modal-body">
          {/* Tarjetas Principales de Impacto Cuantitativo */}
          <div className="comp-cards-grid">
            <div className="comp-card card-nodezero square-card">
              <div className="comp-card-label">
                <Shield size={14} style={{ color: 'var(--primary-bright)' }} />
                <span>[ VIDAS SALVADAS ]</span>
              </div>
              <div className="comp-card-val" style={{ color: 'var(--primary-bright)' }}>
                +{metrics.livesSavedVsNone?.toLocaleString()}
              </div>
              <div className="comp-card-sub font-mono">
                vs No vacunar (+{metrics.livesSavedVsRandom?.toLocaleString()} más que al azar)
              </div>
            </div>

            <div className="comp-card card-emerald square-card">
              <div className="comp-card-label">
                <TrendingDown size={14} className="text-emerald" />
                <span>[ REDUCCIÓN DE PICO ]</span>
              </div>
              <div className="comp-card-val text-emerald">
                -{metrics.peakReductionPct}%
              </div>
              <div className="comp-card-sub font-mono">
                De {none.summary.peakInfected?.toLocaleString()} a {nodezero.summary.peakInfected?.toLocaleString()} casos pico
              </div>
            </div>

            <div className="comp-card card-amber square-card">
              <div className="comp-card-label">
                <DollarSign size={14} className="text-amber" />
                <span>[ COSTO / EFICIENCIA ]</span>
              </div>
              <div className="comp-card-val text-amber">
                ${metrics.costPerLifeSaved} USD
              </div>
              <div className="comp-card-sub font-mono">
                Costo por habitante salvado (${nodezero.summary.totalCostUSD?.toLocaleString()} total)
              </div>
            </div>
          </div>

          {/* Gráfica de Curvas SEIR Superpuestas */}
          <div className="comp-chart-wrapper square-card">
            <CurvesChart
              simResults={simResults}
              currentDay={currentDay}
              onSelectDay={onSelectDay}
            />
          </div>

          {/* Tabla Comparativa Oficial */}
          <div className="comp-table-card square-card">
            <div className="comp-table-header flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold" style={{ color: 'var(--primary-bright)' }}>
                <Shield size={13} />
                <span>[ MATRIZ OFICIAL DE RESULTADOS EPIDEMIOLÓGICOS · 40 DÍAS ]</span>
              </div>
              <span className="font-mono text-xs text-muted">[ BENCHMARK TRACK B ]</span>
            </div>
            <div className="comp-table-scroll">
              <table className="eval-table">
                <thead>
                  <tr>
                    <th>[ ESTRATEGIA ]</th>
                    <th>[ POBLACIÓN SANA (S) ]</th>
                    <th>[ PICO MÁXIMO ZOMBIES ]</th>
                    <th>[ INMUNIZADOS (R) ]</th>
                    <th>[ COSTO TOTAL ]</th>
                    <th>[ VEREDICTO OFICIAL ]</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="row-none">
                    <td>
                      <span className="badge-strat strat-red square-badge flex items-center gap-1.5">
                        <Skull size={13} />
                        <span>[ 1. NO VACUNAR ]</span>
                      </span>
                    </td>
                    <td className="font-mono">{none.summary.finalSusceptible?.toLocaleString()}</td>
                    <td className="font-mono text-crimson font-bold">{none.summary.peakInfected?.toLocaleString()}</td>
                    <td className="font-mono">{none.summary.finalImmuneOrSaved?.toLocaleString()}</td>
                    <td className="font-mono">$0 USD</td>
                    <td>
                      <span className="verdict-pill pill-danger square-badge font-mono">
                        [ COLAPSO TOTAL ]
                      </span>
                    </td>
                  </tr>
                  <tr className="row-random">
                    <td>
                      <span className="badge-strat strat-amber square-badge flex items-center gap-1.5">
                        <Dice5 size={13} />
                        <span>[ 2. VACUNACIÓN ALEATORIA ]</span>
                      </span>
                    </td>
                    <td className="font-mono">{random.summary.finalSusceptible?.toLocaleString()}</td>
                    <td className="font-mono text-amber font-bold">{random.summary.peakInfected?.toLocaleString()}</td>
                    <td className="font-mono">{random.summary.finalImmuneOrSaved?.toLocaleString()}</td>
                    <td className="font-mono">${random.summary.totalCostUSD?.toLocaleString()} USD</td>
                    <td>
                      <span className="verdict-pill pill-warning square-badge font-mono">
                        [ INEFICIENTE / DESPERDICIO ]
                      </span>
                    </td>
                  </tr>
                  <tr className="row-nodezero">
                    <td>
                      <span className="badge-strat strat-nodezero square-badge flex items-center gap-1.5 font-bold">
                        <Shield size={13} />
                        <span>[ 3. NODEZERO (ANILLO + HUBS) ]</span>
                      </span>
                    </td>
                    <td className="font-mono text-emerald font-bold">{nodezero.summary.finalSusceptible?.toLocaleString()}</td>
                    <td className="font-mono font-bold" style={{ color: 'var(--primary-bright)' }}>{nodezero.summary.peakInfected?.toLocaleString()}</td>
                    <td className="font-mono font-bold" style={{ color: 'var(--cyan-bright)' }}>{nodezero.summary.finalImmuneOrSaved?.toLocaleString()}</td>
                    <td className="font-mono font-bold">${nodezero.summary.totalCostUSD?.toLocaleString()} USD</td>
                    <td>
                      <span className="verdict-pill pill-success square-badge flex items-center gap-1.5 font-mono font-bold">
                        <Check size={13} />
                        <span>[ BROTE CONTENIDO CON ÉXITO ]</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="comp-footer-note square-note flex items-center gap-1.5">
            <Pin size={13} style={{ color: 'var(--primary-bright)' }} className="shrink-0" />
            <span className="font-mono text-xs">
              <strong style={{ color: 'var(--primary-bright)' }}>[ CRITERIO TRACK B ]</strong> Telemetría comparativa con números exactos para toma de decisiones tácticas.
            </span>
          </div>
          <button onClick={onClose} className="btn-comp-close square-btn">
            [ CERRAR COMPARATIVA ]
          </button>
        </div>
      </div>
    </div>
  );
}
