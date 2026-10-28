import React, { useState, useRef } from 'react';
import { MANTA_NODES, MANTA_EDGES } from '../data/mantaNetwork';
import { soundFx } from '../utils/soundFx';
import {
  ShieldCheck,
  Skull,
  AlertTriangle,
  HeartPulse,
  Navigation,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  MapPin,
  Move,
  X,
} from './Icons';

export default function MantaMap({
  currentDayData,
  activeStrategy,
  selectedNodeId,
  setSelectedNodeId,
  activeDisease,
}) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const [isCardDismissed, setIsCardDismissed] = useState(false);

  // Estados de control de tamaño interactivo ("ajustar tamaño a voluntad")
  const [mapHeight, setMapHeight] = useState(480); // Altura en píxeles
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Estados de Zoom & Pan interactivo
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Capas visuales activables
  const [showEdges, setShowEdges] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);

  const wrapperRef = useRef(null);

  const activeNode =
    MANTA_NODES.find((n) => n.id === (selectedNodeId || hoveredNodeId)) || MANTA_NODES[0];
  const nodeStats = currentDayData?.nodes?.[activeNode.id] || {
    S: activeNode.population,
    E: 0,
    I: 0,
    R: 0,
  };

  // Manejadores de Zoom
  const handleZoomIn = () => setZoom((prev) => Math.min(2.5, +(prev + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((prev) => Math.max(0.75, +(prev - 0.25).toFixed(2)));
  const handleResetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Manejadores de Arrastre (Pan)
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Solo clic izquierdo
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e) => {
    // Zoom suave con la rueda del ratón
    if (e.ctrlKey || e.metaKey || zoom > 1) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.15 : -0.15;
      setZoom((prev) => Math.min(2.5, Math.max(0.75, +(prev + delta).toFixed(2))));
    }
  };

  return (
    <div className={`map-view-container ${isFullscreen ? 'map-fullscreen' : ''}`}>
      {/* Contenedor del Canvas SVG con Zoom y Paneo Flexible */}
      <div
        ref={wrapperRef}
        className="map-canvas-wrapper"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* Herramientas de Zoom Flotantes en la Esquina Superior Derecha */}
        <div className="map-floating-tools">
          <button onClick={handleZoomOut} className="map-glass-btn" title="Alejar mapa">
            <ZoomOut size={13} />
          </button>
          <span className="map-zoom-label">{(zoom * 100).toFixed(0)}%</span>
          <button onClick={handleZoomIn} className="map-glass-btn" title="Acercar mapa">
            <ZoomIn size={13} />
          </button>
          <button onClick={handleResetZoomPan} className="map-glass-btn" title="Centrar mapa">
            <RotateCcw size={12} />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`map-glass-btn ${isFullscreen ? 'active-fs' : ''}`}
            title={isFullscreen ? 'Salir' : 'Pantalla Completa'}
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>

        {/* Badge Flotante Discreto de Ubicación */}
        <div className="map-floating-badge">
          <MapPin size={11} className="text-cyan" />
          <span>MANTA, ECUADOR · SECTOR COSTA DEL PACÍFICO</span>
        </div>

        {/* Indicador de ayuda al usuario */}
        {zoom > 1 && (
          <div className="map-zoom-indicator">
            <Move size={12} />
            <span>Arrastra para desplazarte</span>
          </div>
        )}

        <svg
          viewBox="0 0 1000 560"
          className="manta-tactical-svg"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
          <defs>
            {/* Patrón de radar táctico con rejilla */}
            <pattern id="manta-grid-dense" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.035)" strokeWidth="1" />
            </pattern>

            {/* Gradientes oceánicos y continentales */}
            <radialGradient id="deep-ocean" cx="30%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#0b172e" />
              <stop offset="50%" stopColor="#070c1a" />
              <stop offset="100%" stopColor="#050811" />
            </radialGradient>

            <linearGradient id="manta-land" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f1a2e" />
              <stop offset="100%" stopColor="#091020" />
            </linearGradient>

            {/* Filtros de resplandor */}
            <filter id="glow-zombie-intense" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-immune-intense" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Océano Pacífico */}
          <rect width="100%" height="100%" fill="url(#deep-ocean)" />
          <rect width="100%" height="100%" fill="url(#manta-grid-dense)" />

          {/* Olas y batimetría marina */}
          <path
            d="M 0,220 C 130,170 230,120 370,110 C 520,80 670,90 1000,130"
            fill="none"
            stroke="rgba(56, 189, 248, 0.12)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <path
            d="M 0,150 C 160,100 340,50 580,45 C 780,35 880,65 1000,75"
            fill="none"
            stroke="rgba(56, 189, 248, 0.08)"
            strokeWidth="1.5"
          />

          <text x="70" y="65" fill="rgba(56, 189, 248, 0.4)" fontSize="13" letterSpacing="4" fontFamily="JetBrains Mono" fontWeight="700">
            BAHÍA DE MANTA · OCÉANO PACÍFICO
          </text>
          <text x="70" y="88" fill="rgba(148, 163, 184, 0.35)" fontSize="10" fontFamily="JetBrains Mono">
            ZONA MARÍTIMA 00° 57′ S, 80° 43′ W · PUERTO DE AGUAS PROFUNDAS
          </text>

          {/* LÍNEA DE COSTA REAL DE MANTA */}
          <path
            d="M 0,450 
               C 60,420 120,410 160,380 
               C 200,350 230,305 270,260 
               C 300,220 330,195 385,190 
               C 435,185 470,205 505,200 
               C 545,195 580,175 630,178 
               C 680,182 730,210 790,205 
               C 850,200 920,220 1000,240 
               L 1000,560 L 0,560 Z"
            fill="url(#manta-land)"
            stroke="rgba(56, 189, 248, 0.45)"
            strokeWidth="3"
          />

          {/* Espigón del Puerto Marítimo de Manta (TPM) */}
          <path
            d="M 385,190 L 412,145 L 452,140 L 458,162"
            fill="none"
            stroke="rgba(245, 158, 11, 0.7)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="465" y="148" fill="rgba(245, 158, 11, 0.85)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">
            ⚓ PUERTO INTERNACIONAL TPM
          </text>

          {/* Desembocadura de Ríos Urbanos en Tarqui */}
          <path
            d="M 495,320 Q 515,245 530,202"
            fill="none"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="2.5"
            strokeDasharray="5 3"
          />
          <text x="540" y="222" fill="rgba(56, 189, 248, 0.55)" fontSize="9" fontFamily="JetBrains Mono">
            Río Burro / Río Muerto
          </text>

          {/* EJES VIALES PRINCIPALES */}
          {/* Malecón de Manta a Tarqui */}
          <path
            d="M 330,230 Q 410,202 525,202 T 690,215"
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="4.5"
          />
          {/* Av. 4 de Noviembre (Eje Centro -> Tarqui -> Eloy Alfaro) */}
          <path
            d="M 385,205 L 535,270 L 475,410"
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="4"
          />
          {/* Vía Circunvalación */}
          <path
            d="M 190,380 Q 295,335 345,305 Q 455,325 640,450"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3.5"
            strokeDasharray="9 4"
          />
          {/* Vía Puerto - Aeropuerto */}
          <path
            d="M 535,202 L 700,215 L 805,295"
            fill="none"
            stroke="rgba(255, 255, 255, 0.13)"
            strokeWidth="4"
          />

          {/* LÍNEAS DE FLUJO DE MOVILIDAD ENTRE PARROQUIAS */}
          {showEdges &&
            MANTA_EDGES.map((edge, idx) => {
              const sNode = MANTA_NODES.find((n) => n.id === edge.source);
              const tNode = MANTA_NODES.find((n) => n.id === edge.target);
              if (!sNode || !tNode) return null;

              const sx = (sNode.x / 760) * 1000;
              const sy = (sNode.y / 480) * 560;
              const tx = (tNode.x / 760) * 1000;
              const ty = (tNode.y / 480) * 560;

              const sInfected = currentDayData?.nodes?.[sNode.id]?.I || 0;
              const tInfected = currentDayData?.nodes?.[tNode.id]?.I || 0;
              const isHighRisk = sInfected > 20 || tInfected > 20;

              return (
                <g key={`edge-${idx}`}>
                  <line
                    x1={sx}
                    y1={sy}
                    x2={tx}
                    y2={ty}
                    stroke={isHighRisk ? 'rgba(239, 68, 68, 0.7)' : 'rgba(56, 189, 248, 0.25)'}
                    strokeWidth={edge.flow * (isHighRisk ? 4.5 : 3)}
                    strokeDasharray={isHighRisk ? '8 4' : 'none'}
                    className={isHighRisk ? 'animated-edge-risk' : ''}
                  />
                </g>
              );
            })}

          {/* RENDERIZADO DE LAS 8 PARROQUIAS / NODOS DE MANTA */}
          {MANTA_NODES.map((node) => {
            const state = currentDayData?.nodes?.[node.id] || {
              S: node.population,
              E: 0,
              I: 0,
              R: 0,
            };

            const nx = (node.x / 760) * 1000;
            const ny = (node.y / 480) * 560;

            const isHovered = hoveredNodeId === node.id;
            const isSelected = selectedNodeId === node.id;

            // Tamaño proporcional
            const radius = Math.max(24, Math.min(42, Math.sqrt(node.population) / 5.8));

            let nodeFill = '#10b981'; // Sano
            let filterGlow = 'none';

            if (state.I > 80) {
              nodeFill = '#ef4444';
              filterGlow = 'url(#glow-zombie-intense)';
            } else if (state.I > 10) {
              nodeFill = '#f97316';
            } else if (state.E > 15) {
              nodeFill = '#f59e0b';
            } else if (state.R > node.population * 0.35) {
              nodeFill = '#06b6d4';
              filterGlow = 'url(#glow-immune-intense)';
            }

            return (
              <g
                key={node.id}
                transform={`translate(${nx}, ${ny})`}
                onClick={() => {
                  setSelectedNodeId(node.id);
                  setIsCardDismissed(false);
                  soundFx.playBubblePop();
                }}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="svg-node-group"
                style={{ cursor: 'pointer' }}
              >
                {/* Onda expansiva animada si hay brote activo */}
                {state.I > 30 && (
                  <circle
                    r={radius + 18}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    opacity="0.8"
                    className="pulse-circle"
                  />
                )}

                {/* Aro de selección / foco */}
                {(isSelected || isHovered) && (
                  <circle
                    r={radius + 11}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                    className="rotate-ring"
                  />
                )}

                {/* Círculo Principal de la Parroquia */}
                <circle
                  r={radius}
                  fill={nodeFill}
                  fillOpacity="0.92"
                  stroke={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.45)'}
                  strokeWidth={isSelected ? 4 : 2}
                  filter={filterGlow}
                />

                {/* Ícono representativo de la zona */}
                <text textAnchor="middle" dy="-0.35em" fontSize="13">
                  {node.id === 'tarqui' ? '🏬' :
                   node.id === 'manta_centro' ? '🏖️' :
                   node.id === 'uleam' ? '🎓' :
                   node.id === 'el_palmar' ? '🚌' :
                   node.id === 'san_mateo' ? '⛵' :
                   node.id === 'los_esteros' ? '🏭' : '🏘️'}
                </text>

                {/* Conteo de Infectados / Zombies */}
                <text
                  textAnchor="middle"
                  dy="1.15em"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="JetBrains Mono"
                >
                  {state.I > 999 ? `${(state.I / 1000).toFixed(1)}k` : state.I}
                </text>

                {/* Burbuja Biohazard Roja estilo Plague Inc. */}
                {state.I > 5 && (
                  <g
                    className="plague-bubble-group plague-bubble-red"
                    transform={`translate(${radius * 0.75}, ${-radius * 0.75})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playBubblePop();
                      setSelectedNodeId(node.id);
                    }}
                  >
                    <circle r="13" fill="#ef4444" className="biohazard-pulse-ring" />
                    <circle r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                    <text textAnchor="middle" dy="0.32em" fontSize="8" fill="#ffffff" fontWeight="bold">☣️</text>
                  </g>
                )}

                {/* Burbuja Azul de Vacuna / Cura estilo Plague Inc. */}
                {state.R > 200 && (
                  <g
                    className="plague-bubble-group plague-bubble-blue"
                    transform={`translate(${-radius * 0.75}, ${-radius * 0.75})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playCureChime();
                      setSelectedNodeId(node.id);
                    }}
                  >
                    <circle r="11" fill="#06b6d4" className="cure-pulse-ring" />
                    <circle r="8.5" fill="#0891b2" stroke="#ffffff" strokeWidth="1.5" />
                    <text textAnchor="middle" dy="0.34em" fontSize="7" fill="#ffffff">💉</text>
                  </g>
                )}

                {/* Nombre de la Parroquia */}
                <text
                  y={radius + 20}
                  textAnchor="middle"
                  fill="#f8fafc"
                  fontSize="12"
                  fontWeight="700"
                  letterSpacing="0.4"
                  className="node-svg-label"
                >
                  {node.name.split(' (')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Panel Táctico Flotante Compacto de la Parroquia Seleccionada */}
        {!isCardDismissed ? (
          <div className="node-detail-card compact-card">
            <div className="card-header-badge">
              <div className="header-left-info">
                <span className="sector-tag">PARROQUIA SELECCIONADA</span>
                <span className="sector-name">{activeNode.name}</span>
                <span className="sector-type">
                  {activeNode.category} · {activeNode.population.toLocaleString()} habs
                </span>
              </div>
              <button
                onClick={() => setIsCardDismissed(true)}
                className="btn-close-card"
                title="Minimizar panel táctico"
              >
                <X size={14} />
              </button>
            </div>

            <div className="stats-mini-grid">
              <div className="stat-pill green" title="Sanos Susceptibles">
                <ShieldCheck size={13} />
                <div className="stat-info">
                  <span className="lbl">Sanos</span>
                  <span className="val">{nodeStats.S.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-pill amber" title="Mordidos en incubación">
                <AlertTriangle size={13} />
                <div className="stat-info">
                  <span className="lbl">Mordidos</span>
                  <span className="val">{nodeStats.E.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-pill red" title="Zombies activos">
                <Skull size={13} />
                <div className="stat-info">
                  <span className="lbl">Zombies</span>
                  <span className="val">{nodeStats.I.toLocaleString()}</span>
                </div>
              </div>

              <div className="stat-pill cyan" title="Vacunados / Inmunes">
                <HeartPulse size={13} />
                <div className="stat-info">
                  <span className="lbl">Inmunes</span>
                  <span className="val">{nodeStats.R.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Barra de Proporción del Sector */}
            <div className="node-pop-breakdown">
              <div className="breakdown-bar">
                <div
                  className="seg seg-s"
                  style={{ width: `${(nodeStats.S / activeNode.population) * 100}%` }}
                  title={`Sanos: ${nodeStats.S.toLocaleString()}`}
                ></div>
                <div
                  className="seg seg-e"
                  style={{ width: `${(nodeStats.E / activeNode.population) * 100}%` }}
                  title={`Mordidos: ${nodeStats.E.toLocaleString()}`}
                ></div>
                <div
                  className="seg seg-i"
                  style={{ width: `${(nodeStats.I / activeNode.population) * 100}%` }}
                  title={`Zombies: ${nodeStats.I.toLocaleString()}`}
                ></div>
                <div
                  className="seg seg-r"
                  style={{ width: `${(nodeStats.R / activeNode.population) * 100}%` }}
                  title={`Inmunes: ${nodeStats.R.toLocaleString()}`}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="btn-reopen-card"
            onClick={() => setIsCardDismissed(false)}
            title="Ver telemetría de la parroquia"
          >
            <MapPin size={12} className="text-cyan" />
            <span>{activeNode.name.split(' (')[0]}</span>
            <span className="badge-reopen">{nodeStats.I.toLocaleString()} 🧟</span>
          </button>
        )}
      </div>
    </div>
  );
}
