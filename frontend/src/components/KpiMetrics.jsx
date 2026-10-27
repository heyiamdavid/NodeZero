import React from 'react';
import { Shield, TrendingDown, DollarSign, Calendar, Syringe, Award } from './Icons';

export default function KpiMetrics({ simResults }) {
  if (!simResults || !simResults.nodezero) return null;

  const { metrics, none, random, nodezero } = simResults;

  return (
    <div className="kpi-metrics-container">
      {/* Tarjetas Superiores de Impacto Estratégico */}
      <div className="kpi-cards-grid">
        <div className="kpi-card card-cyan">
          <div className="kpi-card-header">
            <Shield size={18} className="text-cyan" />
            <span className="kpi-title">VIDAS SALVADAS</span>
          </div>
          <div className="kpi-value text-cyan">
            +{metrics.livesSavedVsNone?.toLocaleString() || 0}
          </div>
          <div className="kpi-sub">
            vs Línea Base Sin Intervención ({metrics.livesSavedVsRandom?.toLocaleString()} más que al azar)
          </div>
        </div>

        <div className="kpi-card card-emerald">
          <div className="kpi-card-header">
            <TrendingDown size={18} className="text-emerald" />
            <span className="kpi-title">REDUCCIÓN DEL PICO</span>
          </div>
          <div className="kpi-value text-emerald">
            -{metrics.peakReductionPct}%
          </div>
          <div className="kpi-sub">
            Pico de {none.summary.peakInfected.toLocaleString()} reducido a {nodezero.summary.peakInfected.toLocaleString()}
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-card-header">
            <DollarSign size={18} className="text-amber" />
            <span className="kpi-title">COSTO TOTAL EJECUTADO</span>
          </div>
          <div className="kpi-value text-amber">
            ${nodezero.summary.totalCostUSD.toLocaleString()} USD
          </div>
          <div className="kpi-sub">
            Costo unitario: ${metrics.costPerLifeSaved} USD por vida salvada
          </div>
        </div>

        <div className="kpi-card card-violet">
          <div className="kpi-card-header">
            <Calendar size={18} className="text-violet" />
            <span className="kpi-title">DÍA PICO DE CONTAGIO</span>
          </div>
          <div className="kpi-value text-violet">
            Día {nodezero.summary.peakDay}
          </div>
          <div className="kpi-sub">
            Retraso y aplanamiento de la curva para dar tiempo a los hospitales
          </div>
        </div>

        <div className="kpi-card card-blue">
          <div className="kpi-card-header">
            <Syringe size={18} className="text-blue" />
            <span className="kpi-title">VACUNAS DESPLEGADAS</span>
          </div>
          <div className="kpi-value text-blue">
            {nodezero.summary.vaccinesUsed.toLocaleString()}
          </div>
          <div className="kpi-sub">
            0% desperdiciadas en infectados o ya inmunes
          </div>
        </div>
      </div>

      {/* Tabla Comparativa de Evaluación (Rúbrica Oficial) */}
      <div className="comparative-table-card">
        <div className="table-title-row">
          <Award size={16} className="text-cyan" />
          <span>TABLA COMPARATIVA DE ESTRATEGIAS (CRITERIO EVALUACIÓN)</span>
        </div>
        <div className="table-responsive">
          <table className="eval-table">
            <thead>
              <tr>
                <th>ESTRATEGIA</th>
                <th>POBLACIÓN FINAL SANA (S)</th>
                <th>ZOMBIES EN EL PICO</th>
                <th>PERSONAS INMUNIZADAS (R)</th>
                <th>RECURSOS GASTADOS</th>
                <th>VEREDICTO</th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-none">
                <td>
                  <span className="badge-strat strat-red">1. Sin Intervención</span>
                </td>
                <td>{none.summary.finalSusceptible.toLocaleString()}</td>
                <td className="text-crimson font-bold">{none.summary.peakInfected.toLocaleString()}</td>
                <td>{none.summary.finalImmuneOrSaved.toLocaleString()}</td>
                <td>$0 USD</td>
                <td className="text-crimson">Colapso de Manta</td>
              </tr>
              <tr className="row-random">
                <td>
                  <span className="badge-strat strat-amber">2. Intervención al Azar</span>
                </td>
                <td>{random.summary.finalSusceptible.toLocaleString()}</td>
                <td>{random.summary.peakInfected.toLocaleString()}</td>
                <td>{random.summary.finalImmuneOrSaved.toLocaleString()}</td>
                <td>${random.summary.totalCostUSD.toLocaleString()} USD</td>
                <td className="text-amber">Ineficiente / Tardío</td>
              </tr>
              <tr className="row-nodezero">
                <td>
                  <span className="badge-strat strat-nodezero">3. NodeZero (Anillo + Hubs)</span>
                </td>
                <td className="text-emerald font-bold">{nodezero.summary.finalSusceptible.toLocaleString()}</td>
                <td className="text-cyan font-bold">{nodezero.summary.peakInfected.toLocaleString()}</td>
                <td className="text-cyan">{nodezero.summary.finalImmuneOrSaved.toLocaleString()}</td>
                <td>${nodezero.summary.totalCostUSD.toLocaleString()} USD</td>
                <td className="text-emerald font-bold">✓ Brote Contenido</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
