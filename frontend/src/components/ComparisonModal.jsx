import React from 'react';
import { X, Award, Shield, TrendingDown, DollarSign, Calendar, Syringe } from './Icons';
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
      <div className="modal-window modal-comparison" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge badge-cyan">
              <Award size={22} className="text-cyan" />
            </div>
            <div>
              <div className="modal-title">EVALUACIÓN OFICIAL TRACK B · COMPARATIVA TRIPLE</div>
              <div className="modal-sub">
                NodeZero (Anillo + Hubs) vs. Azar de la Moneda vs. No Vacunar a Nadie
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body comparison-modal-body">
          {/* Tarjetas Principales de Impacto Cuantitativo */}
          <div className="comp-cards-grid">
            <div className="comp-card card-cyan">
              <div className="comp-card-label">
                <Shield size={16} className="text-cyan" />
                <span>VIDAS SALVADAS</span>
              </div>
              <div className="comp-card-val text-cyan">
                +{metrics.livesSavedVsNone?.toLocaleString()}
              </div>
              <div className="comp-card-sub">
                vs No vacunar a nadie (+{metrics.livesSavedVsRandom?.toLocaleString()} más que al azar)
              </div>
            </div>

            <div className="comp-card card-emerald">
              <div className="comp-card-label">
                <TrendingDown size={16} className="text-emerald" />
                <span>REDUCCIÓN DEL PICO</span>
              </div>
              <div className="comp-card-val text-emerald">
                -{metrics.peakReductionPct}%
              </div>
              <div className="comp-card-sub">
                De {none.summary.peakInfected.toLocaleString()} zombies a solo {nodezero.summary.peakInfected.toLocaleString()}
              </div>
            </div>

            <div className="comp-card card-amber">
              <div className="comp-card-label">
                <DollarSign size={16} className="text-amber" />
                <span>COSTO / EFICIENCIA</span>
              </div>
              <div className="comp-card-val text-amber">
                ${metrics.costPerLifeSaved} USD
              </div>
              <div className="comp-card-sub">
                Costo por habitante salvado (${nodezero.summary.totalCostUSD.toLocaleString()} total)
              </div>
            </div>
          </div>

          {/* Gráfica de Curvas SEIR Superpuestas */}
          <div className="comp-chart-wrapper">
            <CurvesChart
              simResults={simResults}
              currentDay={currentDay}
              onSelectDay={onSelectDay}
            />
          </div>

          {/* Tabla Comparativa Oficial */}
          <div className="comp-table-card">
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
                    <span className="badge-strat strat-red">💀 1. No Vacunar a Nadie</span>
                  </td>
                  <td>{none.summary.finalSusceptible.toLocaleString()}</td>
                  <td className="text-crimson font-bold">{none.summary.peakInfected.toLocaleString()}</td>
                  <td>{none.summary.finalImmuneOrSaved.toLocaleString()}</td>
                  <td>$0 USD</td>
                  <td className="text-crimson font-bold">Colapso de Manta</td>
                </tr>
                <tr className="row-random">
                  <td>
                    <span className="badge-strat strat-amber">🪙 2. Azar de la Moneda</span>
                  </td>
                  <td>{random.summary.finalSusceptible.toLocaleString()}</td>
                  <td>{random.summary.peakInfected.toLocaleString()}</td>
                  <td>{random.summary.finalImmuneOrSaved.toLocaleString()}</td>
                  <td>${random.summary.totalCostUSD.toLocaleString()} USD</td>
                  <td className="text-amber">Ineficiente / Desperdicio</td>
                </tr>
                <tr className="row-nodezero">
                  <td>
                    <span className="badge-strat strat-nodezero">🛡️ 3. NodeZero (Anillo + Hubs)</span>
                  </td>
                  <td className="text-emerald font-bold">{nodezero.summary.finalSusceptible.toLocaleString()}</td>
                  <td className="text-cyan font-bold">{nodezero.summary.peakInfected.toLocaleString()}</td>
                  <td className="text-cyan font-bold">{nodezero.summary.finalImmuneOrSaved.toLocaleString()}</td>
                  <td>${nodezero.summary.totalCostUSD.toLocaleString()} USD</td>
                  <td className="text-emerald font-bold">✓ Brote Contenido con Éxito</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <div className="comp-footer-note">
            📌 <em>Criterio Track B:</em> Muestra exactamente con números el impacto de la estrategia ganadora.
          </div>
          <button onClick={onClose} className="btn-done-drawer">
            Cerrar Comparativa
          </button>
        </div>
      </div>
    </div>
  );
}
