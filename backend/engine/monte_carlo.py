"""
Módulo de Simulación Monte Carlo para cuantificar incertidumbre y demostrar
superioridad estadística de la estrategia frente a la suerte.
"""

from typing import Dict, Any, List
import numpy as np
from engine.seir_graph import SEIRGraphSimulator


def run_monte_carlo(config: Dict[str, Any], iterations: int = 25) -> Dict[str, Any]:
    base_seed = int(config.get("seed", 42))
    days = int(config.get("days", 40))

    runs_none: List[List[Dict[str, Any]]] = []
    runs_random: List[List[Dict[str, Any]]] = []
    runs_nodezero: List[List[Dict[str, Any]]] = []

    for i in range(iterations):
        run_seed = base_seed + i * 17

        cfg_none = {**config, "seed": run_seed, "strategy": "none"}
        cfg_random = {**config, "seed": run_seed, "strategy": "random"}
        cfg_nodezero = {**config, "seed": run_seed, "strategy": "nodezero"}

        sim_none = SEIRGraphSimulator(cfg_none).run()
        sim_random = SEIRGraphSimulator(cfg_random).run()
        sim_nodezero = SEIRGraphSimulator(cfg_nodezero).run()

        runs_none.append(sim_none["history"])
        runs_random.append(sim_random["history"])
        runs_nodezero.append(sim_nodezero["history"])

    return {
        "iterations": iterations,
        "baseSeed": base_seed,
        "summary": {
            "none": _calculate_bands(runs_none, days),
            "random": _calculate_bands(runs_random, days),
            "nodezero": _calculate_bands(runs_nodezero, days),
        },
    }


def _calculate_bands(histories_list: List[List[Dict[str, Any]]], days_count: int) -> List[Dict[str, Any]]:
    result = []
    for day in range(days_count + 1):
        infections = []
        for h in histories_list:
            if day < len(h):
                infections.append(h[day]["totalI"])
            else:
                infections.append(h[-1]["totalI"])

        infections.sort()
        mean = int(round(float(np.mean(infections))))
        min_val = int(infections[0])
        max_val = int(infections[-1])
        p25 = int(np.percentile(infections, 25))
        p75 = int(np.percentile(infections, 75))

        result.append({
            "day": day,
            "mean": mean,
            "min": min_val,
            "max": max_val,
            "p25": p25,
            "p75": p75,
        })

    return result
