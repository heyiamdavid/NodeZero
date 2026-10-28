import React, { useState, useEffect } from 'react';
import { X, Skull, Shield, Coins, Sparkles } from './Icons';
import { soundFx } from '../utils/soundFx';

export default function FearAndHungerCoin({ isOpen, onClose, onCoinResult }) {
  const [userChoice, setUserChoice] = useState('cara'); // 'cara' | 'cruz'
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState(null); // 'cara' | 'cruz'
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_fh_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [luckScore, setLuckScore] = useState(() => {
    try {
      const saved = localStorage.getItem('nodezero_fh_score');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { won: 0, total: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_fh_history', JSON.stringify(history));
    } catch {}
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem('nodezero_fh_score', JSON.stringify(luckScore));
    } catch {}
  }, [luckScore]);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    setCoinResult(null);
    soundFx.playCoinFlip();

    // Simular el giro tenso de Fear & Hunger (1.8 segundos)
    setTimeout(() => {
      const outcome = Math.random() < 0.5 ? 'cara' : 'cruz';
      const isSuccess = outcome === userChoice;
      setCoinResult(outcome);
      setIsFlipping(false);
      soundFx.playCoinLand(outcome === 'cruz');

      setHistory((prev) => [
        {
          id: Date.now(),
          choice: userChoice,
          outcome,
          success: isSuccess,
        },
        ...prev.slice(0, 5),
      ]);

      setLuckScore((prev) => ({
        won: prev.won + (isSuccess ? 1 : 0),
        total: prev.total + 1,
      }));

      if (onCoinResult) {
        onCoinResult({ outcome, success: isSuccess });
      }
    }, 1800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-window modal-fh-coin modal-terminal-square modal-amber-square"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tactical Corner Reticle Accents */}
        <div className="terminal-corner corner-tl" aria-hidden="true" />
        <div className="terminal-corner corner-tr" aria-hidden="true" />
        <div className="terminal-corner corner-bl" aria-hidden="true" />
        <div className="terminal-corner corner-br" aria-hidden="true" />

        {/* Cabecera Fear & Hunger */}
        <div className="modal-header fh-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge">
              <Coins size={20} className="text-amber" />
            </div>
            <div>
              <div className="modal-title fh-title">[ PROTOCOLO DE DESTINO // FEAR & HUNGER ]</div>
              <div className="modal-sub fh-sub">
                MECÁNICA DE AZAR CUADRADA: DECISIÓN BAJO INCERTIDUMBRE CRÍTICA
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal" title="Cerrar ventana">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body fh-body">
          {/* Advertencia filosófica estilo F&H */}
          <div className="fh-lore-box square-box">
            <div className="font-bold text-amber mb-1">[ TRANSMISIÓN COE // INCERTIDUMBRE ]</div>
            <p>
              <em>
                «En la desesperación del brote, quienes no tienen un plan confían en el azar. Si la moneda cae a tu favor, el cargamento de vacunas llega a tiempo; si falla, el patógeno avanza sin piedad.»
              </em>
            </p>
          </div>

          {/* Escena 3D de la Moneda en cámara cuadrada */}
          <div className="coin-stage square-stage">
            <div
              className={`coin-3d ${isFlipping ? 'flipping-anim' : ''} ${coinResult ? `show-${coinResult}` : ''}`}
            >
              <div className="coin-face coin-heads">
                <span className="coin-emblem">
                  <Shield size={34} className="text-emerald" />
                </span>
                <span className="coin-label">[ CARA ]</span>
                <span className="coin-sub">ESPERANZA</span>
              </div>
              <div className="coin-face coin-tails">
                <span className="coin-emblem">
                  <Skull size={34} className="text-red" />
                </span>
                <span className="coin-label">[ CRUZ ]</span>
                <span className="coin-sub">DESESPERACIÓN</span>
              </div>
            </div>
          </div>

          {/* Selector de Cara o Cruz */}
          <div className="fh-choice-container">
            <span className="fh-choice-title font-mono">[ ELIGE TU APUESTA ANTES DE LANZAR ]</span>
            <div className="fh-choice-pills">
              <button
                onClick={() => setUserChoice('cara')}
                disabled={isFlipping}
                className={`fh-pill square-choice-btn flex items-center justify-center gap-2 ${userChoice === 'cara' ? 'selected-cara' : ''}`}
              >
                <Shield size={15} />
                <span>[ 1. ELEGIR CARA (CARGAMENTO A SALVO) ]</span>
              </button>
              <button
                onClick={() => setUserChoice('cruz')}
                disabled={isFlipping}
                className={`fh-pill square-choice-btn flex items-center justify-center gap-2 ${userChoice === 'cruz' ? 'selected-cruz' : ''}`}
              >
                <Skull size={15} />
                <span>[ 2. ELEGIR CRUZ (RUPTURA DEL CERCO) ]</span>
              </button>
            </div>
          </div>

          {/* Botón de Lanzamiento */}
          <div className="fh-action-row w-full flex justify-center">
            <button
              onClick={handleFlip}
              disabled={isFlipping}
              className={`btn-flip-coin square-btn w-full ${isFlipping ? 'disabled-flip' : ''}`}
            >
              {isFlipping ? (
                <span>[ LANZANDO AL DESTINO... ]</span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Coins size={18} />
                  <span>[ LANZAR LA MONEDA DEL DESTINO ]</span>
                </span>
              )}
            </button>
          </div>

          {/* Resultado del Lanzamiento */}
          {coinResult && !isFlipping && (
            <div
              className={`fh-verdict-box square-box ${coinResult === userChoice ? 'verdict-success' : 'verdict-doom'}`}
            >
              <div className="verdict-icon shrink-0">
                {coinResult === userChoice ? (
                  <Sparkles size={26} className="text-emerald" />
                ) : (
                  <Skull size={26} className="text-red" />
                )}
              </div>
              <div className="verdict-text">
                <strong>
                  [ DESTINO: {coinResult === userChoice ? 'FAVORECE' : 'CONDENA'} // {coinResult.toUpperCase()} ]
                </strong>
                <p>
                  {coinResult === userChoice
                    ? 'La brigada logró vacunar a un sector clave por pura casualidad.'
                    : 'Las dosis cayeron en una zona evacuada o con pacientes ya infectados. Vacunas desperdiciadas.'}
                </p>
              </div>
            </div>
          )}

          {/* Contraste Educativo para el Reto Track B */}
          <div className="fh-track-b-note square-note">
            <Shield size={16} className="text-cyan shrink-0" />
            <div>
              <strong>[ POR QUÉ NODEZERO SUPERA AL AZAR ]</strong> En este simulador, la Línea Base 2 representa
              este lanzamiento de monedas constante. El Protocolo NodeZero elimina la suerte usando{' '}
              <span className="text-cyan font-bold">Centralidad de Grafos y Vacunación en Anillo</span>, garantizando salvar
              decenas de miles de vidas sin depender de la fortuna.
            </div>
          </div>
        </div>

        <div className="modal-footer fh-footer">
          <div className="fh-score-text font-mono">
            [ HISTORIAL: {luckScore.won} ÉXITOS / {luckScore.total} LANZAMIENTOS ]
          </div>
          <button onClick={onClose} className="btn-secondary square-btn">
            [ CERRAR ]
          </button>
        </div>
      </div>
    </div>
  );
}
