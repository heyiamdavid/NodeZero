import React, { useState, useRef } from 'react';
import { MANTA_NODES, MANTA_EDGES } from '../data/mantaNetwork';
import { soundFx } from '../utils/soundFx';
import {
  ShieldCheck,
  Skull,
  AlertTriangle,
  HeartPulse,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  MapPin,
  Move,
  X,
  Store,
  Anchor,
  Microscope,
  Bus,
  Sailboat,
  Factory,
  Home,
  Biohazard,
  Syringe,
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

  // Manejadores de Arrastre (Pan) de Alto Rendimiento con rAF
  const rafRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Solo clic izquierdo
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX;
    const clientY = e.clientY;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPan({
        x: clientX - dragStart.x,
        y: clientY - dragStart.y,
      });
    });
  };

  const handleMouseUp = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setIsDragging(false);
  };

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
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            willChange: 'transform',
          }}
        >
          <defs>
            {/* Patrón de radar táctico con rejilla */}
            <pattern id="manta-grid-dense" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" strokeWidth="1" />
            </pattern>

            {/* Gradientes oceánicos y continentales */}
            <radialGradient id="deep-ocean" cx="30%" cy="10%" r="90%">
              <stop offset="0%" stopColor="#08140c" />
              <stop offset="50%" stopColor="#040b06" />
              <stop offset="100%" stopColor="#020603" />
            </radialGradient>

            <linearGradient id="manta-land" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0b2413" />
              <stop offset="100%" stopColor="#06160b" />
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
            <filter id="glow-radar-green" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Océano Pacífico (Fondo Radar) */}
          <rect width="100%" height="100%" fill="url(#deep-ocean)" />
          <rect width="100%" height="100%" fill="url(#manta-grid-dense)" />

          {/* Olas y batimetría marina */}
          <path
            d="M 0,220 C 130,170 230,120 370,110 C 520,80 670,90 1000,130"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
          />
          <path
            d="M 0,150 C 160,100 340,50 580,45 C 780,35 880,65 1000,75"
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="1.5"
          />

          <text x="70" y="65" fill="var(--text-secondary)" fontSize="13" letterSpacing="3" fontFamily="VT323" fontWeight="700">
            BAHÍA DE MANTA · RADAR EPIDEMIOLÓGICO // COE CANTONAL
          </text>
          <text x="70" y="88" fill="var(--text-muted)" fontSize="10" fontFamily="Share Tech Mono">
            COORD 00° 57′ S, 80° 43′ W · PROTOCOLO CONTENCIÓN EPIDEMIOLÓGICA
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
            stroke="var(--primary-color)"
            strokeWidth="2.5"
          />

          {/* Espigón del Puerto Marítimo de Manta (TPM) */}
          <path
            d="M 385,190 L 412,145 L 452,140 L 458,162"
            fill="none"
            stroke="rgba(245, 158, 11, 0.7)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <g transform="translate(460, 137)">
            <circle cx="6" cy="3" r="1.8" fill="none" stroke="rgba(245, 158, 11, 0.9)" strokeWidth="1.2" />
            <line x1="6" y1="5" x2="6" y2="12" stroke="rgba(245, 158, 11, 0.9)" strokeWidth="1.2" />
            <path d="M2 8.5 H1 a5 5 0 0 0 10 0 h-1" fill="none" stroke="rgba(245, 158, 11, 0.9)" strokeWidth="1.2" />
          </g>
          <text x="475" y="148" fill="rgba(245, 158, 11, 0.85)" fontSize="10" fontFamily="JetBrains Mono" fontWeight="700">
            PUERTO INTERNACIONAL TPM
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
                    stroke={isHighRisk ? 'var(--pip-red, #ff3333)' : 'var(--primary-glow, rgba(26, 255, 116, 0.35))'}
                    strokeWidth={edge.flow * (isHighRisk ? 4 : 2.5)}
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

            let nodeFill = 'var(--primary-color)';
            let filterGlow = 'url(#glow-radar-green)';

            if (state.I > 80) {
              nodeFill = '#ff3333';
              filterGlow = 'url(#glow-zombie-intense)';
            } else if (state.I > 10) {
              nodeFill = '#ff7733';
            } else if (state.E > 15) {
              nodeFill = '#ffb020';
            } else if (state.R > node.population * 0.35) {
              nodeFill = '#00f0ff';
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
                {/* Alerta perimetral fija si hay foco infeccioso */}
                {state.I > 30 && !isSelected && (
                  <circle
                    r={radius + 5}
                    fill="none"
                    stroke="var(--pip-red, #ff3333)"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    opacity="0.85"
                    pointerEvents="none"
                  />
                )}

                {/* OUTLINE TÁCTICO DEL NODO SELECCIONADO */}
                {isSelected && (
                  <>
                    {/* Contorno exterior continuo con resplandor táctico */}
                    <circle
                      r={radius + 7}
                      fill="none"
                      stroke="var(--primary-bright)"
                      strokeWidth="2.5"
                      className="node-selected-outline"
                      pointerEvents="none"
                    />
                    {/* Anillo interior punteado ajustado */}
                    <circle
                      r={radius + 3.5}
                      fill="none"
                      stroke="var(--primary-color)"
                      strokeWidth="1.5"
                      strokeDasharray="5 2.5"
                      pointerEvents="none"
                    />
                    {/* Retículas angulares de encuadre en las esquinas */}
                    <g className="tactical-reticle-corners" stroke="var(--primary-bright)" strokeWidth="2.5" fill="none" pointerEvents="none">
                      <path d={`M ${-(radius + 12)} ${-(radius + 5)} L ${-(radius + 12)} ${-(radius + 12)} L ${-(radius + 5)} ${-(radius + 12)}`} />
                      <path d={`M ${radius + 5} ${-(radius + 12)} L ${radius + 12} ${-(radius + 12)} L ${radius + 12} ${-(radius + 5)}`} />
                      <path d={`M ${radius + 12} ${radius + 5} L ${radius + 12} ${radius + 12} L ${radius + 5} ${radius + 12}`} />
                      <path d={`M ${-(radius + 5)} ${radius + 12} L ${-(radius + 12)} ${radius + 12} L ${-(radius + 12)} ${radius + 5}`} />
                    </g>
                  </>
                )}

                {/* Outline sutil para hover cuando no está seleccionado */}
                {isHovered && !isSelected && (
                  <circle
                    r={radius + 5}
                    fill="none"
                    stroke="var(--primary-color)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    opacity="0.8"
                    pointerEvents="none"
                  />
                )}

                {/* Círculo Principal de la Parroquia */}
                <circle
                  r={radius}
                  fill={nodeFill}
                  fillOpacity="0.92"
                  stroke={isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.45)'}
                  strokeWidth={isSelected ? 3.5 : 2}
                  filter={filterGlow}
                />

                {/* Ícono táctico representativo de la zona (Microscopio para ULEAM, Ancla para Centro) */}
                <g transform="translate(-7, -18)" stroke="#ffffff" fill="none" opacity="0.95" pointerEvents="none">
                  {node.id === 'tarqui' ? <Store size={14} /> :
                   node.id === 'manta_centro' ? <Anchor size={14} /> :
                   node.id === 'uleam' ? <Microscope size={14} /> :
                   node.id === 'el_palmar' ? <Bus size={14} /> :
                   node.id === 'san_mateo' ? <Sailboat size={14} /> :
                   node.id === 'los_esteros' ? <Factory size={14} /> : <Home size={14} />}
                </g>

                {/* Conteo de Infectados / Zombies */}
                <text
                  textAnchor="middle"
                  dy="1.15em"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="800"
                  fontFamily="Share Tech Mono"
                  pointerEvents="none"
                >
                  {state.I > 999 ? `${(state.I / 1000).toFixed(1)}k` : state.I}
                </text>

                {/* Burbuja Biohazard Roja (Ojo/Alerta) con contenedor desacoplado anti-jitter */}
                {state.I > 5 && (
                  <g transform={`translate(${radius * 0.75}, ${-radius * 0.75})`}>
                    <g
                      className="plague-bubble-group plague-bubble-red"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playBubblePop();
                        setSelectedNodeId(node.id);
                      }}
                    >
                      {/* Área de impacto generosa invisible para estabilidad de hover */}
                      <circle r="15" fill="transparent" />
                      <circle r="10" className="bubble-circle" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
                      <g transform="translate(-5.5, -5.5)" pointerEvents="none">
                        <Biohazard size={11} className="text-white" />
                      </g>
                    </g>
                  </g>
                )}

                {/* Burbuja Azul de Vacuna / Inmunizados con contenedor desacoplado */}
                {state.R > 200 && (
                  <g transform={`translate(${-radius * 0.75}, ${-radius * 0.75})`}>
                    <g
                      className="plague-bubble-group plague-bubble-blue"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playCureChime();
                        setSelectedNodeId(node.id);
                      }}
                    >
                      {/* Área de impacto generosa invisible para estabilidad de hover */}
                      <circle r="13" fill="transparent" />
                      <circle r="8.5" className="bubble-circle" fill="#0891b2" stroke="#ffffff" strokeWidth="1.5" />
                      <g transform="translate(-5, -5)" pointerEvents="none">
                        <Syringe size={10} className="text-white" />
                      </g>
                    </g>
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
                  pointerEvents="none"
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
            <span className="badge-reopen flex items-center gap-1">
              <span>{nodeStats.I.toLocaleString()}</span>
              <Skull size={11} className="text-red inline-block" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
