// Servicio de integración con el Backend Python (FastAPI / AWS Lambda)
// Con fallback automático al motor local si la API está desconectada.

import { runComparativeSimulation, runMonteCarlo } from '../simulation/engine';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { connected: false };
    const data = await res.json();
    return { connected: true, data };
  } catch (err) {
    return { connected: false };
  }
}

export async function fetchSimulation(config) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const payload = {
      seed: Number(config.seed) || 42,
      days: Number(config.days) || 40,
      beta: Number(config.beta) || 0.38,
      incubation_days: Number(config.incubationDays) || 3,
      recovery_days: Number(config.recoveryDays) || 14,
      daily_vaccines: Number(config.dailyVaccines) || 600,
      vaccine_efficacy: Number(config.vaccineEfficacy) || 0.95,
      patient_zero_node: String(config.patientZeroNode || 'tarqui'),
      initial_zombies: Number(config.initialZombies) || 5,
      budget_limit: Number(config.budgetLimit) || 250000.0,
      cost_per_dose: Number(config.costPerDose) || 12.0,
    };

    const res = await fetch(`${API_BASE_URL}/api/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { ...data, source: 'python_api' };
    }
  } catch (err) {
    // Fallback silencioso al motor local en JavaScript
  }

  const localResult = runComparativeSimulation(config);
  return { ...localResult, source: 'client_engine' };
}

export async function fetchMonteCarlo(config, iterations = 20) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const payload = {
      config: {
        seed: Number(config.seed) || 42,
        days: Number(config.days) || 40,
        beta: Number(config.beta) || 0.38,
        incubation_days: Number(config.incubationDays) || 3,
        recovery_days: Number(config.recoveryDays) || 14,
        daily_vaccines: Number(config.dailyVaccines) || 600,
        vaccine_efficacy: Number(config.vaccineEfficacy) || 0.95,
        patient_zero_node: String(config.patientZeroNode || 'tarqui'),
        initial_zombies: Number(config.initialZombies) || 5,
        budget_limit: Number(config.budgetLimit) || 250000.0,
        cost_per_dose: Number(config.costPerDose) || 12.0,
      },
      iterations: iterations,
    };

    const res = await fetch(`${API_BASE_URL}/api/monte-carlo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { ...data, source: 'python_api' };
    }
  } catch (err) {
    // Fallback local
  }

  return runMonteCarlo(config, iterations);
}
