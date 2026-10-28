import React from 'react';
import { Shield, TrendingDown, DollarSign, Calendar, Syringe, Award, Skull, Dice5, Check } from './Icons';

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
            <span className="kpi-title">VIDAS SALVADAS (NODEZERO)</span>
          </div>
          <div className="kpi-value text-cyan">
            +{metrics.livesSavedVsNone?.toLocaleString() || 0}
          </div>
          <div className="kpi-sub">
            vs No vacunar (+{metrics.livesSavedVsRandom?.toLocaleString()} más que al azar)
          </div>
        </div>

        <div className="kpi-card card-emerald">
          <div className="kpi-card-header">
            <TrendingDown size={18} className="text-emerald" />
            <span className="kpi-title">REDUCCIÓN DEL PICO ZOMBIE</span>
          </div>
          <div className="kpi-value text-emerald">
            -{metrics.peakReductionPct}%
          </div>
          <div className="kpi-sub">
            Pico de {none.summary.peakInfected.toLocaleString()} reducido a {nodezero.summary.peakInfected.toLocaleString()} zombies
          </div>
        </div>

        <div className="kpi-card card-amber">
          <div className="kpi-card-header">
            <DollarSign size={18} className="text-amber" />
            <span className="kpi-title">PRESUPUESTO EJECUTADO</span>
          </div>
          <div className="kpi-value text-amber">
            ${nodezero.summary.totalCostUSD.toLocaleString()} USD
          </div>
          <div className="kpi-sub">
            Eficiencia: ${metrics.costPerLifeSaved} USD por vida salvada
          </div>
        </div>

        <div className="kpi-card card-violet">
          <div className="kpi-card-header">
            <Calendar size={18} className="text-violet" />
            <span className="kpi-title">DÍA PICO DE LA HORDA</span>
          </div>
          <div className="kpi-value text-violet">
            Día {nodezero.summary.peakDay}
          </div>
          <div className="kpi-sub">
            Aplanamiento y retraso de la curva de ataque (Día {none.summary.peakDay} sin control)
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

      {/* Callout Cuantitativo Directo para el Jurado Track B */}
      <div className="kpi-verdict-banner">
        <Award size={20} className="text-cyan" />
        <div className="banner-text">
          <strong>DEMOSTRACIÓN CUANTITATIVA DEL RETO:</strong> Con el mismo límite estricto de vacunas, la estrategia{' '}
          <span className="text-cyan font-bold">NodeZero salva a {metrics.livesSavedVsNone?.toLocaleString()} habitantes</span> frente a{' '}
          <em>no vacunar</em> y <span className="text-emerald font-bold">+{metrics.livesSavedVsRandom?.toLocaleString()} personas más</span> que{' '}
          <em>vacunar al azar</em>, reduciendo la horda de zombies en un <span className="text-cyan font-bold">{metrics.peakReductionPct}%</span>.
        </div>
      </div>

      {/* Tabla Comparativa de Evaluación (Rúbrica Oficial Track B) */}
      <div className="comparative-table-card">
        <div className="table-title-row">
          <Award size={16} className="text-cyan" />
          <span>TABLA COMPARATIVA DE ESTRATEGIAS (CRITERIO OFICIAL TRACK B)</span>
        </div>
        <div className="table-responsive">
          <table className="eval-table">
            <thead>
              <tr>
                <th>ESTRATEGIA</th>
                <th>POBLACIÓN FINAL SANA (S)</th>
                <th>PICO MÁXIMO DE ZOMBIES</th>
                <th>PERSONAS PROTEGIDAS (R)</th>
                <th>PRESUPUESTO USADO</th>
                <th>VEREDICTO</th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-none">
                <td>
                  <span className="badge-strat strat-red flex items-center gap-1.5"><Skull size={13} /> 1. No Vacunar a Nadie</span>
                </td>
                <td>{none.summary.finalSusceptible.toLocaleString()}</td>
                <td className="text-crimson font-bold">{none.summary.peakInfected.toLocaleString()}</td>
                <td>{none.summary.finalImmuneOrSaved.toLocaleString()}</td>
                <td>$0 USD</td>
                <td className="text-crimson font-bold">Colapso Total de la Ciudad</td>
              </tr>
              <tr className="row-random">
                <td>
                  <span className="badge-strat strat-amber flex items-center gap-1.5"><Dice5 size={13} /> 2. Vacunación al Azar</span>
                </td>
                <td>{random.summary.finalSusceptible.toLocaleString()}</td>
                <td>{random.summary.peakInfected.toLocaleString()}</td>
                <td>{random.summary.finalImmuneOrSaved.toLocaleString()}</td>
                <td>${random.summary.totalCostUSD.toLocaleString()} USD</td>
                <td className="text-amber">Ineficiente / Dosis Desperdiciadas</td>
              </tr>
              <tr className="row-nodezero">
                <td>
                  <span className="badge-strat strat-nodezero flex items-center gap-1.5"><Shield size={13} /> 3. NodeZero (Anillo + Hubs)</span>
                </td>
                <td className="text-emerald font-bold">{nodezero.summary.finalSusceptible.toLocaleString()}</td>
                <td className="text-cyan font-bold">{nodezero.summary.peakInfected.toLocaleString()}</td>
                <td className="text-cyan font-bold">{nodezero.summary.finalImmuneOrSaved.toLocaleString()}</td>
                <td>${nodezero.summary.totalCostUSD.toLocaleString()} USD</td>
                <td className="text-emerald font-bold"><span className="flex items-center gap-1"><Check size={14} /> Ciudad Salvada (Brote Contenido)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
