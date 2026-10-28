import React from 'react';
import {
  X,
  Award,
  Shield,
  TrendingDown,
  DollarSign,
  Skull,
  Coins,
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
            <div className="modal-icon-badge badge-cyan">
              <Award size={20} className="text-cyan" />
            </div>
            <div>
              <div className="modal-title">[ EVALUACIÓN TRACK B // COMPARATIVA TRIPLE ]</div>
              <div className="modal-sub">
                NODEZERO (ANILLO + HUBS) VS. AZAR DE LA MONEDA VS. PROPAGACIÓN LIBRE
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal" title="Cerrar ventana">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body comparison-modal-body">
          {/* Tarjetas Principales de Impacto Cuantitativo */}
          <div className="comp-cards-grid">
            <div className="comp-card card-cyan square-card">
              <div className="comp-card-label">
                <Shield size={14} className="text-cyan" />
                <span>[ VIDAS SALVADAS ]</span>
              </div>
              <div className="comp-card-val text-cyan">
                +{metrics.livesSavedVsNone?.toLocaleString()}
              </div>
              <div className="comp-card-sub">
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
              <div className="comp-card-sub">
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
              <div className="comp-card-sub">
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
            <table className="eval-table">
              <thead>
                <tr>
                  <th>ESTRATEGIA</th>
                  <th>POBLACIÓN FINAL SANA (S)</th>
                  <th>PICO MÁXIMO ZOMBIES</th>
                  <th>INMUNIZADOS (R)</th>
                  <th>RECURSOS GASTADOS</th>
                  <th>VEREDICTO OFICIAL</th>
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
                  <td>{none.summary.finalSusceptible?.toLocaleString()}</td>
                  <td className="text-crimson font-bold">{none.summary.peakInfected?.toLocaleString()}</td>
                  <td>{none.summary.finalImmuneOrSaved?.toLocaleString()}</td>
                  <td>$0 USD</td>
                  <td className="text-crimson font-bold">Colapso Total de Manta</td>
                </tr>
                <tr className="row-random">
                  <td>
                    <span className="badge-strat strat-amber square-badge flex items-center gap-1.5">
                      <Coins size={13} />
                      <span>[ 2. AZAR DE LA MONEDA ]</span>
                    </span>
                  </td>
                  <td>{random.summary.finalSusceptible?.toLocaleString()}</td>
                  <td>{random.summary.peakInfected?.toLocaleString()}</td>
                  <td>{random.summary.finalImmuneOrSaved?.toLocaleString()}</td>
                  <td>${random.summary.totalCostUSD?.toLocaleString()} USD</td>
                  <td className="text-amber">Ineficiente / Desperdicio</td>
                </tr>
                <tr className="row-nodezero">
                  <td>
                    <span className="badge-strat strat-nodezero square-badge flex items-center gap-1.5">
                      <Shield size={13} />
                      <span>[ 3. NODEZERO (ANILLO + HUBS) ]</span>
                    </span>
                  </td>
                  <td className="text-emerald font-bold">{nodezero.summary.finalSusceptible?.toLocaleString()}</td>
                  <td className="text-cyan font-bold">{nodezero.summary.peakInfected?.toLocaleString()}</td>
                  <td className="text-cyan font-bold">{nodezero.summary.finalImmuneOrSaved?.toLocaleString()}</td>
                  <td>${nodezero.summary.totalCostUSD?.toLocaleString()} USD</td>
                  <td className="text-emerald font-bold">
                    <span className="flex items-center gap-1.5">
                      <Check size={14} />
                      <span>BROTE CONTENIDO CON ÉXITO</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <div className="comp-footer-note square-note flex items-center gap-1.5">
            <Pin size={13} className="text-cyan shrink-0" />
            <span>
              <strong>[ CRITERIO TRACK B ]</strong> Telemetría comparativa con números exactos para el jurado evaluador.
            </span>
          </div>
          <button onClick={onClose} className="btn-done-drawer square-btn">
            [ CERRAR COMPARATIVA ]
          </button>
        </div>
      </div>
    </div>
  );
}
