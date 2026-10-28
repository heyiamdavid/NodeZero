import React, { useState, useMemo } from 'react';
import { X, FileText, Check, Printer, Copy, AlertCircle, MapPin, Shield } from './Icons';
import { MANTA_NODES } from '../data/mantaNetwork';

export default function MayorReportModal({
  isOpen,
  onClose,
  simResults,
  config,
}) {
  const [copied, setCopied] = useState(false);

  const reportDate = useMemo(() => {
    return new Date().toLocaleDateString('es-EC', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  if (!isOpen || !simResults || !simResults.nodezero) return null;

  const { metrics, none, nodezero } = simResults;
  const epicenter = MANTA_NODES.find((n) => n.id === config.patientZeroNode) || MANTA_NODES[0];

  const handleCopyText = () => {
    const text = `
MEMORANDO EJECUTIVO DE EMERGENCIA EPIDEMIOLÓGICA
PARA: Despacho de la Alcaldía de Manta & COE Cantonal
DE: Comité Científico de Contención (NodeZero - ULEAM)
FECHA: ${reportDate}
ASUNTO: Recomendación Urgente de Intervención y Contención de Brote

1. RESUMEN DE SITUACIÓN:
Se ha detectado el inicio de un brote de alto contagio con epicentro en ${epicenter.name}. Sin intervención municipal inmediata, el modelo epidemiológico proyecta un pico de ${none.summary.peakInfected.toLocaleString()} personas convertidas en zombies y el colapso de la red urbana.

2. IMPACTO DEL PLAN DE CONTENCIÓN INTELIGENTE (NODEZERO):
- Vidas estimadas salvadas: +${metrics.livesSavedVsNone?.toLocaleString()} habitantes de Manta.
- Reducción del pico epidémico: ${metrics.peakReductionPct}% de aplanamiento de la curva.
- Presupuesto requerido: $${nodezero.summary.totalCostUSD.toLocaleString()} USD (costo de solo $${metrics.costPerLifeSaved} USD por vida protegida).
- Dosis requeridas: ${config.dailyVaccines.toLocaleString()} vacunas diarias.

3. ACCIONES OPERATIVAS PARA LAS PRÓXIMAS 24 HORAS:
a) Establecer cerco perimetral de vacunación y brigadas móviles en los corredores de transporte de:
   - ${epicenter.name} (Foco principal)
   - Eloy Alfaro y Tarqui (Ejes de mayor tránsito peatonal y comercial)
   - Terminal Terrestre El Palmar (Control de salida intercantonal)
b) NO vacunar a ciegas ni de forma aleatoria: focalizar las dosis exclusivamente en contactos susceptibles en los anillos de movilidad.
c) Mantener operativas las actividades comerciales en sectores de bajo riesgo (San Mateo, San Juan) bajo vigilancia activa.
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window modal-mayor" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge badge-blue">
              <FileText size={22} className="text-cyan" />
            </div>
            <div>
              <div className="modal-title">INFORME EJECUTIVO PARA LA ALCALDÍA DE MANTA</div>
              <div className="modal-sub">
                Recomendación de política pública y despliegue en lenguaje claro (Nivel Pro)
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body modal-report-body">
          {/* Membrete Oficial */}
          <div className="report-paper">
            <div className="report-header-banner">
              <div className="report-emblem">GADM MANTA · COMITÉ DE CONTENCIÓN</div>
              <div className="report-meta">
                <span>DOCUMENTO OFICIAL · COE CANTONAL</span>
                <span>FECHA: {reportDate.toUpperCase()}</span>
              </div>
            </div>

            <div className="report-subject">
              <strong>ASUNTO:</strong> Estrategia Óptima de Vacunación y Control para el Cantón Manta
            </div>

            {/* Diagnóstico en lenguaje simple */}
            <div className="report-section">
              <h4 className="report-h4">
                <AlertCircle size={15} className="text-amber" />
                1. DIAGNÓSTICO EN LENGUAJE SIMPLE (¿Qué está pasando?)
              </h4>
              <p className="report-p">
                Señor(a) Alcalde(sa): Se ha confirmado un foco de propagación que inició en{' '}
                <strong className="text-cyan">{epicenter.name}</strong>. Si la ciudad no actúa de forma
                planificada, la plaga se desbordará por los buses y mercados, alcanzando un pico crítico de{' '}
                <strong className="text-crimson">{none.summary.peakInfected.toLocaleString()} zombies simultáneos</strong>,
                lo que paralizaría completamente a Manta.
              </p>
            </div>

            {/* Qué recomendamos hacer */}
            <div className="report-section">
              <h4 className="report-h4">
                <MapPin size={15} className="text-cyan" />
                2. ¿DÓNDE DEBEMOS INTERVENIR HOY? (Estrategia de Anillo)
              </h4>
              <p className="report-p">
                Vacunar a la gente al azar o repartir dosis por sorteo <strong>no funciona</strong> (nuestras
                simulaciones demuestran que apenas reduce el daño y gasta presupuesto en vano).
                Recomendamos concentrar las <strong>{config.dailyVaccines} vacunas diarias</strong> en:
              </p>
              <ul className="report-list">
                <li>
                  <strong>Mercado Nuevo Tarqui & Eloy Alfaro:</strong> Despliegue de 3 brigadas móviles para
                  cortar el flujo de compras de la mañana.
                </li>
                <li>
                  <strong>Terminal Terrestre El Palmar:</strong> Puntos de control para evitar que la plaga salga hacia
                  Portoviejo o Montecristi.
                </li>
                <li>
                  <strong>Regla de oro de salud pública:</strong> No desperdiciar vacunas en personas que ya
                  presentan síntomas avanzados.
                </li>
              </ul>
            </div>

            {/* Resultados esperados y costos */}
            <div className="report-section">
              <h4 className="report-h4">
                <Shield size={15} className="text-emerald" />
                3. RESULTADOS PROYECTADOS PARA LA CIUDAD
              </h4>
              <div className="report-stats-grid">
                <div className="report-stat-box">
                  <span className="box-val text-emerald">+{metrics.livesSavedVsNone?.toLocaleString()}</span>
                  <span className="box-lbl">Vidas salvadas en Manta</span>
                </div>
                <div className="report-stat-box">
                  <span className="box-val text-cyan">{metrics.peakReductionPct}%</span>
                  <span className="box-lbl">Aplanamiento de la curva</span>
                </div>
                <div className="report-stat-box">
                  <span className="box-val text-amber">${nodezero.summary.totalCostUSD.toLocaleString()}</span>
                  <span className="box-lbl">Inversión municipal total</span>
                </div>
                <div className="report-stat-box">
                  <span className="box-val text-violet">${metrics.costPerLifeSaved} USD</span>
                  <span className="box-lbl">Costo por vida protegida</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            <button onClick={handleCopyText} className="btn-secondary">
              {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
              <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar Texto'}</span>
            </button>
            <button onClick={() => window.print()} className="btn-action btn-mayor">
              <Printer size={16} />
              <span>Imprimir / Guardar PDF</span>
            </button>
          </div>
          <button onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
