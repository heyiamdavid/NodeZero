import React from 'react';

// Iconos tácticos vectoriales optimizados e independientes de dependencias
const defaultProps = (size = 18, className = '') => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  className,
});

export const ShieldAlert = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const Zap = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const FileText = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const Dice5 = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <circle cx="16" cy="8" r="1.5" fill="currentColor" />
    <circle cx="8" cy="16" r="1.5" fill="currentColor" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export const Cloud = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

export const Activity = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

export const Play = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
  </svg>
);

export const Pause = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <rect x="6" y="4" width="4" height="16" fill="currentColor" />
    <rect x="14" y="4" width="4" height="16" fill="currentColor" />
  </svg>
);

export const RotateCcw = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

export const StepForward = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="5 4 15 12 5 20 5 4" fill="currentColor" />
    <line x1="19" y1="5" x2="19" y2="19" />
  </svg>
);

export const FastForward = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="13 19 22 12 13 5 13 19" fill="currentColor" />
    <polygon points="2 19 11 12 2 5 2 19" fill="currentColor" />
  </svg>
);

export const Sliders = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

export const MapPin = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

export const Syringe = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="m18 2 4 4" />
    <path d="m17 7 3-3" />
    <path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
    <path d="m9 11 4 4" />
    <path d="m5 19-3 3" />
    <path d="m14 4 6 6" />
  </svg>
);

export const DollarSign = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export const ShieldCheck = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const Skull = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
    <path d="M10 20v-4" />
    <path d="M14 20v-4" />
    <circle cx="12" cy="12" r="8" />
  </svg>
);

export const AlertTriangle = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const HeartPulse = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M3.22 12H9.5l1.5-3 2 6.5 1.5-3.5h6.28" />
  </svg>
);

export const Navigation = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="3 11 22 2 13 21 11 13 3 11" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const TrendingUp = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export const TrendingDown = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
    <polyline points="17 18 23 18 23 12" />
  </svg>
);

export const Layers = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

export const CheckCircle2 = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const Shield = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const Calendar = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export const Award = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="8" r="7" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
  </svg>
);

export const X = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ArrowRight = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export const Flame = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

export const Check = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const Printer = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

export const Copy = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const AlertCircle = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const Search = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const Thermometer = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
  </svg>
);

export const Info = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export const Maximize2 = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

export const Minimize2 = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="4 14 10 14 10 20" />
    <polyline points="20 10 14 10 14 4" />
    <line x1="14" y1="10" x2="21" y2="3" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

export const BookOpen = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const ZoomIn = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="11" y1="8" x2="11" y2="14" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

export const ZoomOut = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    <line x1="8" y1="11" x2="14" y2="11" />
  </svg>
);

export const Move = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polyline points="5 9 2 12 5 15" />
    <polyline points="9 5 12 2 15 5" />
    <polyline points="15 19 12 22 9 19" />
    <polyline points="19 9 22 12 19 15" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
);

export const Dna = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="m8 8 8 8" />
    <path d="m9 5 6 6" />
    <path d="m5 9 6 6" />
    <path d="m4 12 4-4a5.66 5.66 0 0 1 8 0l4 4" />
    <path d="m4 12 4 4a5.66 5.66 0 0 0 8 0l4-4" />
  </svg>
);

export const Volume2 = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

export const VolumeX = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <line x1="22" y1="9" x2="16" y2="15" />
    <line x1="16" y1="9" x2="22" y2="15" />
  </svg>
);

export const Radio = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="2" />
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
  </svg>
);

export const Biohazard = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="11.9" r="2" fill="currentColor" fillOpacity="0.2" />
    <path d="M6.7 6.7a6.8 6.8 0 0 1 10.6 0" />
    <path d="M7.4 17.6A6.8 6.8 0 0 1 5.3 7.2" />
    <path d="M16.6 17.6a6.8 6.8 0 0 0 2.1-10.4" />
    <circle cx="12" cy="17" r="3" />
    <circle cx="7.7" cy="9.5" r="3" />
    <circle cx="16.3" cy="9.5" r="3" />
  </svg>
);

export const Coins = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.7 13.9.7-.7-2.8-2.8" />
  </svg>
);

export const Coin = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6" strokeDasharray="2 2" />
    <path d="M12 9v6" />
  </svg>
);

export const Microscope = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M6 18h8" />
    <path d="M3 22h18" />
    <path d="M14 22a7 7 0 1 0 0-14h-1" />
    <path d="M9 14h2" />
    <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
    <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
  </svg>
);

export const Anchor = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="5" r="3" />
    <line x1="12" y1="22" x2="12" y2="8" />
    <path d="M5 12H2a10 10 0 0 0 20 0h-3" />
  </svg>
);

export const Siren = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M7 12a5 5 0 0 1 10 0v6H7v-6z" />
    <path d="M5 20a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1H5v-1z" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="4" y1="6" x2="6" y2="7.5" />
    <line x1="20" y1="6" x2="18" y2="7.5" />
  </svg>
);

export const Sparkles = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export const Pin = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <line x1="12" y1="17" x2="12" y2="22" />
    <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z" />
  </svg>
);

export const Lightbulb = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export const Store = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
    <path d="M2 7h20" />
    <path d="M22 7a2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0 2.5 2.5 0 0 1-5 0" />
  </svg>
);

export const Palmtree = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h11Z" />
    <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-9Z" />
    <path d="M5.8 21a10.2 10.2 0 0 1 5.9-10.2" />
    <path d="M13 14c-.6.9-1 2-1 3.5 0 2 .5 3.5 1 3.5" />
  </svg>
);

export const GraduationCap = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

export const Bus = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M8 6v6" />
    <path d="M16 6v6" />
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <rect x="4" y="3" width="16" height="16" rx="2" />
    <path d="M6 19v2" />
    <path d="M18 19v2" />
    <circle cx="7.5" cy="15.5" r="1.5" />
    <circle cx="16.5" cy="15.5" r="1.5" />
  </svg>
);

export const Sailboat = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M22 18H2l3 4h14l3-4Z" />
    <path d="M10 2v16" />
    <path d="M10 4l9 9h-9" />
    <path d="M10 7L4 13h6" />
  </svg>
);

export const Factory = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4H2v16z" />
    <path d="M17 18h1" />
    <path d="M12 18h1" />
    <path d="M7 18h1" />
  </svg>
);

export const Home = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const Bug = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <rect width="8" height="14" x="8" y="6" rx="4" />
    <path d="m19 7-3 2" />
    <path d="m5 7 3 2" />
    <path d="m19 19-3-2" />
    <path d="m5 19 3-2" />
    <path d="M20 13h-4" />
    <path d="M4 13h4" />
    <path d="m10 4 1 2" />
    <path d="m14 4-1 2" />
  </svg>
);

export const Lungs = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M12 3v8" />
    <path d="m12 11-4-2c-2.5 0-4.5 2-4.5 4.5 0 3 1.5 6.5 4.5 7.5 2.5.8 4-.5 4-2.5V11" />
    <path d="m12 11 4-2c2.5 0 4.5 2 4.5 4.5 0 3-1.5 6.5-4.5 7.5-2.5.8-4-.5-4-2.5V11" />
  </svg>
);

export const Droplet = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const Bird = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M16 7h.01" />
    <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 14" />
    <path d="m20 7 2 .5-2 .5" />
    <path d="M10 18v3" />
    <path d="M14 17.75V21" />
    <path d="M7 18a6 6 0 0 0 3.84-10.61" />
  </svg>
);

export const Target = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const StopCircle = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

export const Waves = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
);

export const Box = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

export const Radiation = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="2" />
    <path d="M4.93 4.93l4.24 4.24" />
    <path d="M14.83 9.17l4.24-4.24" />
    <path d="M14.83 14.83l4.24 4.24" />
    <path d="M9.17 14.83L4.93 19.07" />
    <circle cx="12" cy="12" r="9" />
  </svg>
);

export const CircleDot = ({ size = 18, className = '' }) => (
  <svg {...defaultProps(size, className)}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);


