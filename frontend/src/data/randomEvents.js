// Catálogo de Contingencias y Eventos Aleatorios de Probabilidad para Manta (Track B)
// Eventos epidemiológicos, climáticos y logísticos con impacto estocástico reproducible

export const RANDOM_EVENTS_CATALOG = [
  {
    id: 'buque_ultramar',
    title: 'Buque Clandestino en Puerto TPM',
    nodeId: 'manta_centro',
    nodeName: 'Manta Centro / Malecón',
    type: 'negative',
    icon: 'Anchor',
    badge: '+40 Mordidos',
    badgeClass: 'badge-red',
    probabilityWeight: 1.0,
    description: 'Un buque mercante foráneo atraca de madrugada sin inspección sanitaria. Tripulantes infectados se dispersan por el sector portuario.',
    applyEffect: (nodeState) => {
      const node = nodeState['manta_centro'];
      if (!node) return { affected: 0, text: 'Sin impacto local' };
      const toInfect = Math.min(40, node.S);
      node.S -= toInfect;
      node.E += toInfect;
      return { affected: toInfect, text: `+${toInfect} expuestos en Puerto TPM` };
    },
  },
  {
    id: 'donacion_aerea_oms',
    title: 'Puente Aéreo de Vacunas (OMS / AWS)',
    nodeId: 'el_palmar',
    nodeName: 'El Palmar / Terminal',
    type: 'positive',
    icon: 'Syringe',
    badge: '+250 Inmunes',
    badgeClass: 'badge-green',
    probabilityWeight: 1.0,
    description: 'Un vuelo de asistencia humanitaria aterriza con un lote suplementario de vacunas de alta efectividad para el personal de primera línea.',
    applyEffect: (nodeState) => {
      const node = nodeState['el_palmar'] || nodeState['tarqui'];
      if (!node) return { affected: 0, text: 'Sin impacto local' };
      const toProtect = Math.min(250, node.S);
      node.S -= toProtect;
      node.R += toProtect;
      return { affected: toProtect, text: `+${toProtect} vacunados directos en el terminal` };
    },
  },
  {
    id: 'desborde_rio_muerto',
    title: 'Inundación y Corte en Río Muerto',
    nodeId: 'los_esteros',
    nodeName: 'Los Esteros',
    type: 'positive',
    icon: 'Waves',
    badge: 'Barrera Natural',
    badgeClass: 'badge-cyan',
    probabilityWeight: 0.9,
    description: 'Lluvias torrenciales provocan el desborde del Río Muerto, bloqueando el tráfico entre Tarqui y Los Esteros y frenando el contagio entre parroquias.',
    applyEffect: (nodeState) => {
      const node = nodeState['los_esteros'];
      if (!node) return { affected: 0, text: 'Sin impacto local' };
      // Protege 120 susceptibles al aislarlos de la horda
      const safe = Math.min(120, node.S);
      node.S -= safe;
      node.R += safe; // Sanitizados / protegidos
      return { affected: safe, text: `+${safe} habitantes protegidos por corte fluvial` };
    },
  },
  {
    id: 'feria_libre_tarqui',
    title: 'Foco Masivo en Feria Libre Tarqui',
    nodeId: 'tarqui',
    nodeName: 'Mercado Nuevo Tarqui',
    type: 'negative',
    icon: 'Store',
    badge: '+50 Mordidos',
    badgeClass: 'badge-red',
    probabilityWeight: 1.2,
    description: 'Aglomeración masiva de compradores informales en los callejones del mercado acelera la propagación del patógeno.',
    applyEffect: (nodeState) => {
      const node = nodeState['tarqui'];
      if (!node) return { affected: 0, text: 'Sin impacto local' };
      const toInfect = Math.min(50, node.S);
      node.S -= toInfect;
      node.E += toInfect;
      return { affected: toInfect, text: `+${toInfect} mordidos en pasillos del mercado` };
    },
  },
  {
    id: 'falla_cadena_frio',
    title: 'Corte Eléctrico en Cadena de Frío',
    nodeId: 'eloy_alfaro',
    nodeName: 'Eloy Alfaro',
    type: 'negative',
    icon: 'AlertTriangle',
    badge: '-150 Dosis Perdidas',
    badgeClass: 'badge-amber',
    probabilityWeight: 0.8,
    description: 'Una sobrecarga en la subestación deja sin refrigeración el centro de acopio de Eloy Alfaro, comprometiendo 150 dosis preparadas.',
    applyEffect: (nodeState) => {
      const node = nodeState['eloy_alfaro'];
      if (!node) return { affected: 0, text: 'Sin impacto local' };
      const revert = Math.min(60, node.R);
      node.R -= revert;
      node.S += revert;
      return { affected: 150, text: `Pérdida de lote biológico en Eloy Alfaro` };
    },
  },
  {
    id: 'brigada_estudiantil_uleam',
    title: 'Brigada Médica ULEAM en Campo',
    nodeId: 'uleam',
    nodeName: 'Ciudadela Universitaria',
    type: 'positive',
    icon: 'GraduationCap',
    badge: '+180 Inmunizados',
    badgeClass: 'badge-green',
    probabilityWeight: 1.0,
    description: 'Voluntarios y docentes de la Facultad de Ciencias Médicas de la ULEAM salen con equipos móviles a inmunizar barrios colindantes.',
    applyEffect: (nodeState) => {
      const node = nodeState['uleam'];
      if (!node) return { affected: 0, text: 'Sin impacto local' };
      const toProtect = Math.min(180, node.S);
      node.S -= toProtect;
      node.R += toProtect;
      return { affected: toProtect, text: `+${toProtect} vacunados por brigadistas ULEAM` };
    },
  },
  {
    id: 'toque_queda_san_mateo',
    title: 'Retén Comunitario en San Mateo',
    nodeId: 'san_mateo',
    nodeName: 'San Mateo (Caleta Pesquera)',
    type: 'positive',
    icon: 'Shield',
    badge: 'Aislamiento Eficaz',
    badgeClass: 'badge-cyan',
    probabilityWeight: 0.7,
    description: 'Pescadores de San Mateo imponen cerco estricto sobre la Ruta del Spondylus, bloqueando el acceso a vehículos foráneos infectados.',
    applyEffect: (nodeState) => {
      const node = nodeState['san_mateo'];
      if (!node) return { affected: 0, text: 'Sin impacto local' };
      const safe = Math.min(100, node.S);
      node.S -= safe;
      node.R += safe;
      return { affected: safe, text: `+${safe} pobladores resguardados en perímetro costero` };
    },
  },
];

/**
 * Dispara un evento aleatorio de contingencia con la semilla del simulador
 */
export function triggerRandomEvent(day, nodeState, rng) {
  if (!RANDOM_EVENTS_CATALOG.length) return null;
  const index = Math.floor(rng() * RANDOM_EVENTS_CATALOG.length);
  const template = RANDOM_EVENTS_CATALOG[index];
  const effectResult = template.applyEffect(nodeState);

  return {
    id: `${template.id}_d${day}`,
    eventId: template.id,
    day,
    title: template.title,
    nodeId: template.nodeId,
    nodeName: template.nodeName,
    type: template.type,
    icon: template.icon,
    badge: template.badge,
    badgeClass: template.badgeClass,
    description: template.description,
    impactSummary: effectResult.text,
  };
}

