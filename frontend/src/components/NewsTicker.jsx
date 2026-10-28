import React, { useState, useEffect } from 'react';
import { Siren, Biohazard, Shield, Radio, Microscope, Anchor } from './Icons';

export default function NewsTicker({ currentDay, activeStrategy, simResults }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const headlines = [
    {
      type: 'breaking',
      Icon: Siren,
      tag: 'EMERGENCIA',
      text: 'COE CANTONAL DECLARA ESTADO DE EMERGENCIA BIOLÓGICA EN MANTA TRAS BROTE EN TARQUI.',
    },
    {
      type: 'news',
      Icon: Biohazard,
      tag: 'TRANSMISIÓN',
      text: 'HIPER-CONTAGIO EN TRANSPORTE PÚBLICO: LÍNEAS DE BUSES CONVERTIDAS EN VECTOR DE ALTO RIESGO.',
    },
    {
      type: 'tactical',
      Icon: Shield,
      tag: 'CONTENCIÓN',
      text:
        activeStrategy === 'nodezero'
          ? 'ESTRATEGIA NODEZERO ACTIVA CERCO EN ANILLO PERIMETRAL EN TERMINAL EL PALMAR Y AV. 4 DE NOVIEMBRE.'
          : activeStrategy === 'random'
          ? 'VACUNACIÓN AL AZAR (FEAR & HUNGER) DESPERDICIA DOSIS EN PERIFERIA MIENTRAS EL FOCO AVANZA.'
          : 'SIN INTERVENCIÓN NI VACUNAS: HOSPITALES AL BORDE DEL COLAPSO Y PROPAGACIÓN EXPONENCIAL.',
    },
    {
      type: 'satire',
      Icon: Radio,
      tag: 'RADIO MANTA',
      text: 'HABITANTES DE LOS ESTEROS Y ELOY ALFARO REFUERZAN BARRICADAS; SUSPENDEN FERIAS COMERCIALES.',
    },
    {
      type: 'science',
      Icon: Microscope,
      tag: 'ULEAM LABS',
      text: `DÍA ${currentDay}: MODELO SEIR ESTIMA QUE VACUNAR EN ANILLO PUEDE SALVAR HASTA +${simResults?.metrics?.livesSavedVsNone?.toLocaleString() || '48,000'} VIDAS.`,
    },
    {
      type: 'news',
      Icon: Anchor,
      tag: 'PUERTO TPM',
      text: 'CAPITANÍA DE PUERTO DECLARA CUARENTENA MARÍTIMA PARA SALVAGUARDAR LA FLOTA PESQUERA.',
    },
  ];

  // Rotar titulares cada 6 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [headlines.length]);

  const activeHeadline = headlines[headlineIndex];
  const ActiveIcon = activeHeadline.Icon || Biohazard;

  return (
    <div className="plague-news-ticker pipboy-news-strip" role="region" aria-label="Boletín de Emergencia">
      <div className="ticker-left-badge pipboy-ticker-badge">
        <span className="live-dot pulse-hazard"></span>
        <span className="ticker-badge-text">RADIO MANTA 87.5 FM // TRANSMISIÓN COE:</span>
      </div>

      <div className="ticker-content" key={headlineIndex}>
        <span className="ticker-headline-text pipboy-glow-text flex items-center gap-1.5">
          <ActiveIcon size={13} className="text-terminal-green flex-shrink-0" />
          <span>&gt; {activeHeadline.text}</span>
          <span className="pipboy-cursor">_</span>
        </span>
      </div>
    </div>
  );
}
