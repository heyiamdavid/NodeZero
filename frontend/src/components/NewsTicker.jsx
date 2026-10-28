import React, { useState, useEffect } from 'react';
import { AlertCircle, Radio, Shield, Skull } from './Icons';

export default function NewsTicker({ currentDay, activeStrategy, simResults }) {
  const [headlineIndex, setHeadlineIndex] = useState(0);

  const headlines = [
    {
      type: 'breaking',
      icon: '🚨',
      tag: 'ÚLTIMA HORA',
      text: 'COE Cantonal declara estado de emergencia biológica en Manta tras brote infeccioso en Tarqui.',
    },
    {
      type: 'news',
      icon: '🧟',
      tag: 'TRANSMISIÓN',
      text: 'Se reporta hiper-contagio en el transporte público: buses urbanos se convierten en vector crítico.',
    },
    {
      type: 'tactical',
      icon: '🛡️',
      tag: 'CONTENCIÓN',
      text: activeStrategy === 'nodezero'
        ? 'Estrategia NodeZero activa cerco perimetral de vacunas en Terminal El Palmar y Av. 4 de Noviembre.'
        : activeStrategy === 'random'
        ? 'Vacunación al azar desperdicia dosis en zonas sin riesgo mientras el foco infeccioso avanza.'
        : 'Propagación libre sin vacunas: hospitales reportan saturación inminente de camas UCI.',
    },
    {
      type: 'satire',
      icon: '📻',
      tag: 'RADIO MANTA',
      text: 'Habitantes de Los Esteros y Eloy Alfaro refuerzan puertas; suspenden ferias comerciales en la bahía.',
    },
    {
      type: 'science',
      icon: '🔬',
      tag: 'ULEAM LABS',
      text: `Día ${currentDay}: Modelo SEIR proyecta que la vacunación en anillo puede salvar hasta +${simResults?.metrics?.livesSavedVsNone?.toLocaleString() || '48,000'} vidas.`,
    },
    {
      type: 'news',
      icon: '⚓',
      tag: 'PUERTO TPM',
      text: 'Capitanía de Puerto restringe desembarques pesqueros para proteger a la tripulación marítima.',
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

  return (
    <div className="plague-news-ticker">
      <div className="ticker-left-badge">
        <span className="live-dot pulse-red"></span>
        <span className="ticker-badge-text">ALERTAS MANTA:</span>
      </div>

      <div className="ticker-content" key={headlineIndex}>
        <span className="ticker-headline-text">
          {activeHeadline.icon} {activeHeadline.text}
        </span>
      </div>
    </div>
  );
}
