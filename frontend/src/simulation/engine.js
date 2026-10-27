// Motor de Simulación Epidemiológica SEIR sobre Grafo de Movilidad
// Basado en principios epidemiológicos reproducibles con semilla pseudoaleatoria

import { MANTA_NODES, MANTA_EDGES } from '../data/mantaNetwork';

// Generador pseudoaleatorio Mulberry32 reproducible
export function createRNG(seed) {
  let s = Math.abs(Math.floor(seed)) || 42;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Corre una simulación SEIR día a día sobre el grafo de Manta
 * @param {Object} config - Configuración de parámetros
 */
export function runSimulation(config) {
  const {
    seed = 42,
    days = 40,
    beta = 0.38, // Probabilidad de transmisión por contacto
    incubationDays = 3, // Días en estado E (Mordido/Expuesto)
    recoveryDays = 14, // Duración del estado infeccioso
    dailyVaccines = 600, // Dosis disponibles por día
    vaccineEfficacy = 0.95, // Efectividad de la dosis
    patientZeroNode = 'tarqui',
    initialZombies = 5,
    strategy = 'nodezero', // 'none' | 'random' | 'nodezero'
    budgetLimit = 250000,
    costPerDose = 12, // Dólares por dosis
  } = config;

  const rng = createRNG(seed);
  const sigma = 1 / incubationDays; // Tasa de paso E -> I
  const gamma = 1 / recoveryDays; // Tasa de resolución

  // Inicializar estado de cada nodo
  const nodeState = {};
  MANTA_NODES.forEach((node) => {
    nodeState[node.id] = {
      id: node.id,
      name: node.name,
      population: node.population,
      S: node.population,
      E: 0,
      I: 0,
      R: 0,
    };
  });

  // Infectar paciente cero en el nodo inicial
  if (nodeState[patientZeroNode]) {
    const initInfected = Math.min(initialZombies, nodeState[patientZeroNode].S);
    nodeState[patientZeroNode].S -= initInfected;
    nodeState[patientZeroNode].I += initInfected;
  }

  // Mapa de adyacencias
  const adjacency = {};
  MANTA_NODES.forEach((n) => {
    adjacency[n.id] = [];
  });
  MANTA_EDGES.forEach((edge) => {
    adjacency[edge.source].push({ target: edge.target, flow: edge.flow });
    adjacency[edge.target].push({ target: edge.source, flow: edge.flow });
  });

  const dailyHistory = [];
  let cumulativeVaccinesUsed = 0;
  let cumulativeCost = 0;

  // Registrar estado inicial (Día 0)
  recordDayHistory(0);

  // Simulación día por día
  for (let day = 1; day <= days; day++) {
    // 1. APLICAR INTERVENCIONES DEL DÍA
    if (strategy !== 'none' && cumulativeCost + dailyVaccines * costPerDose <= budgetLimit) {
      applyIntervention(day);
    }

    // 2. TRANSMISIÓN Y PROGRESIÓN EPIDEMIOLÓGICA (SEIR)
    const newExposures = {};
    const newInfections = {};
    const newRecoveries = {};

    MANTA_NODES.forEach((node) => {
      const state = nodeState[node.id];
      const N = state.population;
      if (N <= 0) return;

      // Infección interna en la parroquia
      let effectiveInfectious = state.I;

      // Infección por movilidad inter-parroquial (viajes diarios en buses/mercados)
      const neighbors = adjacency[node.id] || [];
      neighbors.forEach((nb) => {
        const neighborState = nodeState[nb.target];
        // Flujo proporcional de infectados vecinos que transitan
        const crossInfectious = neighborState.I * (nb.flow * 0.15);
        effectiveInfectious += crossInfectious;
      });

      // Fuerza de infección local (lambda)
      const forceOfInfection = (beta * effectiveInfectious) / N;
      // Probabilidad de contagio binomial aproximada
      const probInfection = 1 - Math.exp(-forceOfInfection);

      // Nuevos mordidos (S -> E)
      const expectedNewE = state.S * probInfection;
      // Añadir fluctuación estocástica según semilla
      const noise = 1 + (rng() - 0.5) * 0.15;
      const actualNewE = Math.min(state.S, Math.max(0, Math.round(expectedNewE * noise)));

      // Nuevos zombies activos (E -> I)
      const expectedNewI = state.E * sigma;
      const actualNewI = Math.min(state.E, Math.round(expectedNewI));

      // Nuevas recuperaciones / exorcismos naturales (I -> R)
      const expectedNewR = state.I * gamma;
      const actualNewR = Math.min(state.I, Math.round(expectedNewR));

      newExposures[node.id] = actualNewE;
      newInfections[node.id] = actualNewI;
      newRecoveries[node.id] = actualNewR;
    });

    // Actualizar estados para el siguiente día
    MANTA_NODES.forEach((node) => {
      const state = nodeState[node.id];
      const nE = newExposures[node.id] || 0;
      const nI = newInfections[node.id] || 0;
      const nR = newRecoveries[node.id] || 0;

      state.S -= nE;
      state.E += nE - nI;
      state.I += nI - nR;
      state.R += nR;

      // Sanitizar valores numéricos
      state.S = Math.max(0, state.S);
      state.E = Math.max(0, state.E);
      state.I = Math.max(0, state.I);
      state.R = Math.max(0, state.R);
    });

    recordDayHistory(day);
  }

  function applyIntervention(day) {
    let availableDoses = dailyVaccines;

    if (strategy === 'random') {
      // Línea Base 2: Vacunación al azar en cualquier parroquia
      const eligibleNodes = MANTA_NODES.filter((n) => nodeState[n.id].S > 0);
      if (eligibleNodes.length === 0) return;

      const dosesPerNode = Math.floor(availableDoses / eligibleNodes.length);
      eligibleNodes.forEach((node) => {
        const state = nodeState[node.id];
        const doses = Math.min(dosesPerNode, state.S);
        const effectiveVaccinated = Math.round(doses * vaccineEfficacy);

        state.S -= effectiveVaccinated;
        state.R += effectiveVaccinated; // Pasan a Inmunes / Exorcizados
        cumulativeVaccinesUsed += doses;
        cumulativeCost += doses * costPerDose;
      });
    } else if (strategy === 'nodezero') {
      // Estrategia Óptima NodeZero: Vacunación Focalizada en Anillo y Hubs de Movilidad
      // 1. Priorizar nodos con presencia activa de Expuestos (E) e Infecciosos (I)
      // 2. Priorizar vecinos directos con alto flujo de transporte (Cortafuegos)
      const priorities = MANTA_NODES.map((node) => {
        const state = nodeState[node.id];
        const activeOutbreak = state.I * 3.0 + state.E * 2.0;

        // Riesgo vecino
        let neighborThreat = 0;
        const neighbors = adjacency[node.id] || [];
        neighbors.forEach((nb) => {
          const nbState = nodeState[nb.target];
          neighborThreat += (nbState.I + nbState.E) * nb.flow * 1.5;
        });

        // Puntuación de prioridad por riesgo de propagación
        const priorityScore = (activeOutbreak + neighborThreat) * node.mobilityWeight;
        return { id: node.id, state, score: priorityScore };
      });

      // Ordenar por mayor prioridad
      priorities.sort((a, b) => b.score - a.score);

      for (const item of priorities) {
        if (availableDoses <= 0) break;
        const state = item.state;
        if (state.S <= 0) continue;

        // Proteger hasta el 40% del remanente susceptible o el cupo de dosis
        const targetDoses = Math.min(availableDoses, Math.min(state.S, Math.ceil(state.S * 0.35 + 200)));
        const effectiveVaccinated = Math.round(targetDoses * vaccineEfficacy);

        state.S -= effectiveVaccinated;
        state.R += effectiveVaccinated;
        availableDoses -= targetDoses;
        cumulativeVaccinesUsed += targetDoses;
        cumulativeCost += targetDoses * costPerDose;
      }
    }
  }

  function recordDayHistory(day) {
    let totalS = 0;
    let totalE = 0;
    let totalI = 0;
    let totalR = 0;
    const nodeSnapshots = {};

    MANTA_NODES.forEach((n) => {
      const st = nodeState[n.id];
      totalS += st.S;
      totalE += st.E;
      totalI += st.I;
      totalR += st.R;
      nodeSnapshots[n.id] = { ...st };
    });

    dailyHistory.push({
      day,
      totalS,
      totalE,
      totalI,
      totalR,
      totalInfectedOrZombie: totalE + totalI,
      cumulativeVaccinesUsed,
      cumulativeCost,
      nodes: nodeSnapshots,
    });
  }

  const finalDay = dailyHistory[dailyHistory.length - 1];
  const peakInfected = Math.max(...dailyHistory.map((d) => d.totalI));
  const peakDay = dailyHistory.find((d) => d.totalI === peakInfected)?.day || 0;

  return {
    strategy,
    config,
    history: dailyHistory,
    summary: {
      finalSusceptible: finalDay.totalS,
      finalExposed: finalDay.totalE,
      finalZombies: finalDay.totalI,
      finalImmuneOrSaved: finalDay.totalR,
      peakInfected,
      peakDay,
      vaccinesUsed: cumulativeVaccinesUsed,
      totalCostUSD: cumulativeCost,
    },
  };
}

/**
 * Corre la comparativa completa de las 3 estrategias exigidas por el reto:
 * 1. Sin intervención
 * 2. Intervención Aleatoria
 * 3. Estrategia NodeZero
 */
export function runComparativeSimulation(baseConfig) {
  const seed = baseConfig.seed || 42;

  const noneResult = runSimulation({ ...baseConfig, seed, strategy: 'none' });
  const randomResult = runSimulation({ ...baseConfig, seed, strategy: 'random' });
  const nodeZeroResult = runSimulation({ ...baseConfig, seed, strategy: 'nodezero' });

  // Calcular métricas de comparación clave
  const totalPop = noneResult.summary.finalSusceptible + noneResult.summary.finalExposed + noneResult.summary.finalZombies + noneResult.summary.finalImmuneOrSaved;
  const livesSavedVsNone = nodeZeroResult.summary.finalSusceptible + nodeZeroResult.summary.finalImmuneOrSaved - (noneResult.summary.finalSusceptible + noneResult.summary.finalImmuneOrSaved);
  const livesSavedVsRandom = nodeZeroResult.summary.finalSusceptible + nodeZeroResult.summary.finalImmuneOrSaved - (randomResult.summary.finalSusceptible + randomResult.summary.finalImmuneOrSaved);
  
  const peakReductionPct = Math.round(((noneResult.summary.peakInfected - nodeZeroResult.summary.peakInfected) / (noneResult.summary.peakInfected || 1)) * 100);

  return {
    none: noneResult,
    random: randomResult,
    nodezero: nodeZeroResult,
    metrics: {
      totalPopulation: totalPop,
      livesSavedVsNone: Math.max(0, livesSavedVsNone),
      livesSavedVsRandom: Math.max(0, livesSavedVsRandom),
      peakReductionPct: Math.max(0, peakReductionPct),
      nodeZeroPeakDay: nodeZeroResult.summary.peakDay,
      nonePeakDay: noneResult.summary.peakDay,
      totalCostUSD: nodeZeroResult.summary.totalCostUSD,
      costPerLifeSaved: livesSavedVsNone > 0 ? (nodeZeroResult.summary.totalCostUSD / livesSavedVsNone).toFixed(2) : 'N/A',
    },
  };
}

/**
 * Monte Carlo: Repite la simulación N veces para dar rangos e intervalos de confianza
 */
export function runMonteCarlo(baseConfig, iterations = 25) {
  const runs = [];
  const baseSeed = Number(baseConfig.seed) || 42;

  for (let i = 0; i < iterations; i++) {
    const runResult = runComparativeSimulation({
      ...baseConfig,
      seed: baseSeed + i * 17,
    });
    runs.push(runResult);
  }

  // Agrupar curvas promedio día por día
  const daysCount = baseConfig.days || 40;
  const monteCarloSummary = {
    none: calculateBands(runs.map((r) => r.none.history), daysCount),
    random: calculateBands(runs.map((r) => r.random.history), daysCount),
    nodezero: calculateBands(runs.map((r) => r.nodezero.history), daysCount),
  };

  return {
    iterations,
    summary: monteCarloSummary,
  };
}

function calculateBands(historiesList, daysCount) {
  const result = [];
  for (let day = 0; day <= daysCount; day++) {
    const infections = historiesList.map((h) => (h[day] ? h[day].totalI : 0)).sort((a, b) => a - b);
    const mean = Math.round(infections.reduce((a, b) => a + b, 0) / infections.length);
    const min = infections[0];
    const max = infections[infections.length - 1];
    const p25 = infections[Math.floor(infections.length * 0.25)] || min;
    const p75 = infections[Math.floor(infections.length * 0.75)] || max;

    result.push({ day, mean, min, max, p25, p75 });
  }
  return result;
}
