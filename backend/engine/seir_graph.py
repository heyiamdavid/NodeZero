"""
Motor de Simulación Epidemiológica SEIR sobre Grafo de Movilidad Urbana.
Soporta tres estrategias:
1. 'none': Sin intervención (Línea Base 1)
2. 'random': Intervención al azar con recursos limitados (Línea Base 2)
3. 'nodezero': Estrategia Óptima con Vacunación en Anillo y Hubs de Movilidad (NodeZero)
Garantiza reproducibilidad determinista estricta mediante semilla pseudoaleatoria.
"""

import math
from typing import Dict, Any, List
import numpy as np
import networkx as nx

from data.manta_topology import MANTA_NODES, MANTA_EDGES


class SEIRGraphSimulator:
    def __init__(self, config: Dict[str, Any]):
        self.seed = int(config.get("seed", 42))
        self.days = int(config.get("days", 40))
        self.beta = float(config.get("beta", 0.38))
        self.incubation_days = int(config.get("incubation_days", 3))
        self.recovery_days = int(config.get("recovery_days", 14))
        self.daily_vaccines = int(config.get("daily_vaccines", 600))
        self.vaccine_efficacy = float(config.get("vaccine_efficacy", 0.95))
        self.patient_zero_node = str(config.get("patient_zero_node", "tarqui"))
        self.initial_zombies = int(config.get("initial_zombies", 5))
        self.strategy = str(config.get("strategy", "nodezero"))
        self.budget_limit = float(config.get("budget_limit", 250000.0))
        self.cost_per_dose = float(config.get("cost_per_dose", 12.0))

        # Generador pseudoaleatorio determinista de NumPy
        self.rng = np.random.default_rng(self.seed)

        # Construir Grafo de Movilidad de Manta con NetworkX
        self.graph = nx.Graph()
        for node in MANTA_NODES:
            self.graph.add_node(
                node["id"],
                name=node["name"],
                population=node["population"],
                mobility_weight=node["mobility_weight"],
            )

        for edge in MANTA_EDGES:
            self.graph.add_edge(edge["source"], edge["target"], flow=edge["flow"], weight=1.0 / edge["flow"])

        # Calcular centralidades en el grafo
        self.betweenness = nx.betweenness_centrality(self.graph, weight="weight")
        self.degree = dict(self.graph.degree())

    def run(self) -> Dict[str, Any]:
        sigma = 1.0 / max(1, self.incubation_days)
        gamma = 1.0 / max(1, self.recovery_days)

        # Inicializar compartimentos por nodo
        node_states = {}
        for node in MANTA_NODES:
            nid = node["id"]
            pop = node["population"]
            node_states[nid] = {
                "id": nid,
                "name": node["name"],
                "population": pop,
                "S": pop,
                "E": 0,
                "I": 0,
                "R": 0,
            }

        # Infectar paciente cero
        if self.patient_zero_node in node_states:
            st = node_states[self.patient_zero_node]
            init_inf = min(self.initial_zombies, st["S"])
            st["S"] -= init_inf
            st["I"] += init_inf

        daily_history: List[Dict[str, Any]] = []
        cumulative_vaccines_used = 0
        cumulative_cost = 0.0

        # Snapshot Día 0
        self._record_day(0, node_states, daily_history, cumulative_vaccines_used, cumulative_cost)

        for day in range(1, self.days + 1):
            # 1. APLICAR INTERVENCIONES DIARIAS
            if self.strategy != "none":
                cost_today = self.daily_vaccines * self.cost_per_dose
                if cumulative_cost + cost_today <= self.budget_limit:
                    doses_used = self._apply_intervention(node_states)
                    cumulative_vaccines_used += doses_used
                    cumulative_cost += doses_used * self.cost_per_dose

            # 2. PROGRESIÓN EPIDEMIOLÓGICA (SEIR SOBRE GRAFO)
            new_exposures = {}
            new_infections = {}
            new_recoveries = {}

            for node in MANTA_NODES:
                nid = node["id"]
                st = node_states[nid]
                N = st["population"]
                if N <= 0:
                    continue

                effective_infectious = float(st["I"])

                # Interacción de movilidad inter-parroquial
                for neighbor_id in self.graph.neighbors(nid):
                    edge_data = self.graph.get_edge_data(nid, neighbor_id)
                    flow = edge_data.get("flow", 0.5)
                    neighbor_st = node_states[neighbor_id]
                    effective_infectious += neighbor_st["I"] * (flow * 0.15)

                # Fuerza de infección (lambda)
                force_of_infection = (self.beta * effective_infectious) / float(N)
                prob_infection = 1.0 - math.exp(-force_of_infection)

                expected_new_e = st["S"] * prob_infection
                # Variabilidad estocástica controlada con semilla
                noise = 1.0 + (self.rng.random() - 0.5) * 0.15
                actual_new_e = min(st["S"], max(0, int(round(expected_new_e * noise))))

                expected_new_i = st["E"] * sigma
                actual_new_i = min(st["E"], int(round(expected_new_i)))

                expected_new_r = st["I"] * gamma
                actual_new_r = min(st["I"], int(round(expected_new_r)))

                new_exposures[nid] = actual_new_e
                new_infections[nid] = actual_new_i
                new_recoveries[nid] = actual_new_r

            # Actualizar compartimentos para el siguiente día
            for node in MANTA_NODES:
                nid = node["id"]
                st = node_states[nid]
                ne = new_exposures.get(nid, 0)
                ni = new_infections.get(nid, 0)
                nr = new_recoveries.get(nid, 0)

                st["S"] = max(0, st["S"] - ne)
                st["E"] = max(0, st["E"] + ne - ni)
                st["I"] = max(0, st["I"] + ni - nr)
                st["R"] = max(0, st["R"] + nr)

            self._record_day(day, node_states, daily_history, cumulative_vaccines_used, cumulative_cost)

        final_day = daily_history[-1]
        peak_infected = max(d["totalI"] for d in daily_history)
        peak_day = next((d["day"] for d in daily_history if d["totalI"] == peak_infected), 0)

        return {
            "strategy": self.strategy,
            "seed": self.seed,
            "history": daily_history,
            "summary": {
                "finalSusceptible": final_day["totalS"],
                "finalExposed": final_day["totalE"],
                "finalZombies": final_day["totalI"],
                "finalImmuneOrSaved": final_day["totalR"],
                "peakInfected": peak_infected,
                "peakDay": peak_day,
                "vaccinesUsed": cumulative_vaccines_used,
                "totalCostUSD": cumulative_cost,
            },
        }

    def _apply_intervention(self, node_states: Dict[str, Any]) -> int:
        available_doses = self.daily_vaccines
        doses_spent = 0

        if self.strategy == "random":
            # Línea Base 2: Vacunación al azar en parroquias con población susceptible
            eligible_nodes = [n for n in MANTA_NODES if node_states[n["id"]]["S"] > 0]
            if not eligible_nodes:
                return 0

            doses_per_node = available_doses // len(eligible_nodes)
            for node in eligible_nodes:
                st = node_states[node["id"]]
                doses = min(doses_per_node, st["S"])
                effective = int(round(doses * self.vaccine_efficacy))

                # NUNCA vacunar a infectados ni a inmunes
                st["S"] -= effective
                st["R"] += effective
                doses_spent += doses

        elif self.strategy == "nodezero":
            # Estrategia Óptima NodeZero: Vacunación en Anillo Focalizada + Hubs de Movilidad
            priorities = []
            for node in MANTA_NODES:
                nid = node["id"]
                st = node_states[nid]
                active_outbreak = st["I"] * 3.0 + st["E"] * 2.0

                neighbor_threat = 0.0
                for neighbor_id in self.graph.neighbors(nid):
                    edge_data = self.graph.get_edge_data(nid, neighbor_id)
                    flow = edge_data.get("flow", 0.5)
                    nb_st = node_states[neighbor_id]
                    neighbor_threat += (nb_st["I"] + nb_st["E"]) * flow * 1.5

                # Puntuación combinada: Brote local + Amenaza vecina + Centralidad de intermediación
                betweenness_val = self.betweenness.get(nid, 0.1)
                score = (active_outbreak + neighbor_threat) * (node["mobility_weight"] + betweenness_val)
                priorities.append((nid, score))

            priorities.sort(key=lambda x: x[1], reverse=True)

            for nid, score in priorities:
                if available_doses <= 0:
                    break
                st = node_states[nid]
                if st["S"] <= 0:
                    continue

                # Vacunación de contención perimetral
                target_doses = min(available_doses, min(st["S"], int(math.ceil(st["S"] * 0.35 + 200))))
                effective = int(round(target_doses * self.vaccine_efficacy))

                st["S"] -= effective
                st["R"] += effective
                available_doses -= target_doses
                doses_spent += target_doses

        return doses_spent

    def _record_day(
        self,
        day: int,
        node_states: Dict[str, Any],
        daily_history: List[Dict[str, Any]],
        vaccines_used: int,
        cost: float,
    ):
        total_s = sum(st["S"] for st in node_states.values())
        total_e = sum(st["E"] for st in node_states.values())
        total_i = sum(st["I"] for st in node_states.values())
        total_r = sum(st["R"] for st in node_states.values())

        node_snapshots = {nid: dict(st) for nid, st in node_states.items()}

        daily_history.append({
            "day": day,
            "totalS": total_s,
            "totalE": total_e,
            "totalI": total_i,
            "totalR": total_r,
            "totalInfectedOrZombie": total_e + total_i,
            "cumulativeVaccinesUsed": vaccines_used,
            "cumulativeCost": cost,
            "nodes": node_snapshots,
        })
