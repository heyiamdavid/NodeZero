import React, { useState } from 'react';
import { X, Award, Skull, Shield, AlertTriangle } from './Icons';
import { soundFx } from '../utils/soundFx';

export default function FearAndHungerCoin({ isOpen, onClose, onCoinResult }) {
  const [userChoice, setUserChoice] = useState('cara'); // 'cara' | 'cruz'
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState(null); // 'cara' | 'cruz'
  const [history, setHistory] = useState([]);
  const [luckScore, setLuckScore] = useState({ won: 0, total: 0 });

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
      <div className="modal-window modal-fh-coin" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera Fear & Hunger */}
        <div className="modal-header fh-header">
          <div className="modal-title-group">
            <span className="fh-skull-icon">🪙</span>
            <div>
              <div className="modal-title fh-title">LA MONEDA DEL DESTINO · FEAR & HUNGER</div>
              <div className="modal-sub fh-sub">
                Mecánica de azar implacable: ¿Dejarías la supervivencia de Manta a la suerte de una moneda?
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn-close-modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body fh-body">
          {/* Advertencia filosófica estilo F&H */}
          <div className="fh-lore-box">
            <p>
              <em>«En la desesperación del brote, quienes no tienen un plan confían en el azar. Si la moneda cae a tu favor, el cargamento de vacunas llega a tiempo; si falla, el patógeno avanza sin piedad.»</em>
            </p>
          </div>

          {/* Escena 3D de la Moneda */}
          <div className="coin-stage">
            <div
              className={`coin-3d ${isFlipping ? 'flipping-anim' : ''} ${coinResult ? `show-${coinResult}` : ''}`}
            >
              <div className="coin-face coin-heads">
                <span className="coin-emblem">🛡️</span>
                <span className="coin-label">CARA</span>
                <span className="coin-sub">ESPERANZA</span>
              </div>
              <div className="coin-face coin-tails">
                <span className="coin-emblem">💀</span>
                <span className="coin-label">CRUZ</span>
                <span className="coin-sub">DESESPERACIÓN</span>
              </div>
            </div>
          </div>

          {/* Selector de Cara o Cruz */}
          <div className="fh-choice-container">
            <span className="fh-choice-title">ELIGE TU APUESTA ANTES DE LANZAR:</span>
            <div className="fh-choice-pills">
              <button
                onClick={() => setUserChoice('cara')}
                disabled={isFlipping}
                className={`fh-pill ${userChoice === 'cara' ? 'selected-cara' : ''}`}
              >
                🛡️ ELEGIR CARA (Cargamento a salvo)
              </button>
              <button
                onClick={() => setUserChoice('cruz')}
                disabled={isFlipping}
                className={`fh-pill ${userChoice === 'cruz' ? 'selected-cruz' : ''}`}
              >
                💀 ELEGIR CRUZ (Ruptura del cerco)
              </button>
            </div>
          </div>

          {/* Botón de Lanzamiento */}
          <div className="fh-action-row">
            <button
              onClick={handleFlip}
              disabled={isFlipping}
              className={`btn-flip-coin ${isFlipping ? 'disabled-flip' : ''}`}
            >
              <span>{isFlipping ? 'LANZANDO AL DESTINO...' : '🪙 LANZAR LA MONEDA'}</span>
            </button>
          </div>

          {/* Resultado del Lanzamiento */}
          {coinResult && !isFlipping && (
            <div
              className={`fh-verdict-box ${coinResult === userChoice ? 'verdict-success' : 'verdict-doom'}`}
            >
              <div className="verdict-icon">
                {coinResult === userChoice ? '✨' : '☠️'}
              </div>
              <div className="verdict-text">
                <strong>
                  {coinResult === userChoice ? '¡EL DESTINO TE FAVORECE!' : '¡EL DESTINO TE CONDENA!'}
                </strong>
                <p>
                  Cayó <strong>{coinResult.toUpperCase()}</strong>. {coinResult === userChoice
                    ? 'La brigada logró vacunar a un sector clave por pura casualidad.'
                    : 'Las dosis cayeron en una zona evacuada o con pacientes ya infectados. Vacunas desperdiciadas.'}
                </p>
              </div>
            </div>
          )}

          {/* Contraste Educativo para el Reto Track B */}
          <div className="fh-track-b-note">
            <Shield size={16} className="text-cyan" />
            <div>
              <strong>Por qué NodeZero supera al azar:</strong> En este simulador, la Línea Base 2 representa
              este lanzamiento de monedas constante. El Protocolo NodeZero elimina la suerte usando{' '}
              <span className="text-cyan font-bold">Centralidad de Grafos y Vacunación en Anillo</span>, garantizando salvar
              decenas de miles de vidas sin depender del azar.
            </div>
          </div>
        </div>

        <div className="modal-footer fh-footer">
          <div className="fh-score-text">
            Historial de suerte: {luckScore.won} éxitos / {luckScore.total} lanzamientos
          </div>
          <button onClick={onClose} className="btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
