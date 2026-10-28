import React from 'react';
import {
  X,
  Siren,
  Anchor,
  Syringe,
  Waves,
  Store,
  AlertTriangle,
  GraduationCap,
  Shield,
} from './Icons';

function EventNotificationToast({ notifications = [], onDismiss }) {
  if (!notifications.length) return null;

  const getEventIcon = (iconName, type) => {
    const className = type === 'positive' ? 'text-emerald' : 'text-crimson';
    switch (iconName) {
      case 'Anchor': return <Anchor size={15} className="text-cyan" />;
      case 'Syringe': return <Syringe size={15} className="text-emerald" />;
      case 'Waves': return <Waves size={15} className="text-cyan" />;
      case 'Store': return <Store size={15} className="text-crimson" />;
      case 'AlertTriangle': return <AlertTriangle size={15} className="text-amber" />;
      case 'GraduationCap': return <GraduationCap size={15} className="text-emerald" />;
      case 'Shield': return <Shield size={15} className="text-cyan" />;
      default: return <Siren size={15} className={className} />;
    }
  };

  return (
    <div className="event-notifications-stack" role="region" aria-label="Notificaciones de Contingencias">
      {notifications.map((item) => {
        const isPos = item.type === 'positive';
        return (
          <div
            key={item.uniqueKey || item.id}
            className={`event-toast-card modal-terminal-square ${isPos ? 'toast-positive' : 'toast-negative'}`}
          >
            {/* Retículas Tácticas Cuadradas */}
            <div className="terminal-corner corner-tl" aria-hidden="true" />
            <div className="terminal-corner corner-tr" aria-hidden="true" />
            <div className="terminal-corner corner-bl" aria-hidden="true" />
            <div className="terminal-corner corner-br" aria-hidden="true" />

            <div className="toast-header">
              <div className="toast-tag-group flex items-center gap-1.5 font-mono">
                {getEventIcon(item.icon, item.type)}
                <span className="toast-day-badge">
                  [ DÍA {String(item.day || 0).padStart(2, '0')} ]
                </span>
                <span className={`toast-impact-badge ${isPos ? 'badge-green' : 'badge-red'}`}>
                  [ {item.badge} ]
                </span>
              </div>
              <button
                onClick={() => onDismiss(item.uniqueKey || item.id)}
                className="btn-toast-close font-mono"
                title="Descartar notificación"
                aria-label="Cerrar notificación"
              >
                <X size={12} />
              </button>
            </div>

            <div className="toast-body">
              <div className="toast-title font-display">{item.title}</div>
              <div className="toast-desc font-mono">{item.impactSummary || item.description}</div>
            </div>

            {/* Línea de escaneo táctico inferior */}
            <div className={`toast-scan-bar ${isPos ? 'bar-pos' : 'bar-neg'}`} />
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(EventNotificationToast);

