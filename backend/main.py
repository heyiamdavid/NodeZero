"""
API Principal de NodeZero: Motor de Simulación Epidemiológica para Manta, Manabí.
Framework: FastAPI
Despliegue: AWS Lambda vía Mangum (Serverless, Costo $0.00 en reposo)
"""

from typing import Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from mangum import Mangum

from data.manta_topology import MANTA_NODES, MANTA_EDGES, TOTAL_MANTA_POPULATION
from engine.seir_graph import SEIRGraphSimulator
from engine.monte_carlo import run_monte_carlo
from engine.bedrock_reporter import generate_mayor_report

app = FastAPI(
    title="NodeZero Manta API · Comité de Contención Epidemiológica",
    description="Motor de modelado matemático SEIR sobre grafo de contactos para la contención de brotes en Manta.",
    version="1.0.0",
)

# Habilitar CORS para permitir llamadas desde el frontend en localhost y CloudFront
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Modelos Pydantic para validación y Swagger interactivo
class SimulationConfig(BaseModel):
    seed: int = Field(default=42, description="Semilla determinista para garantizar reproducibilidad estricta")
    days: int = Field(default=40, ge=5, le=100, description="Días de duración de la simulación")
    beta: float = Field(default=0.38, ge=0.05, le=1.0, description="Tasa de transmisión por contacto")
    incubation_days: int = Field(default=3, ge=1, le=21, description="Días en estado Expuesto (Mordido)")
    recovery_days: int = Field(default=14, ge=2, le=40, description="Días en estado Infeccioso")
    daily_vaccines: int = Field(default=600, ge=0, le=5000, description="Dosis de vacuna disponibles al día")
    vaccine_efficacy: float = Field(default=0.95, ge=0.1, le=1.0, description="Efectividad de la vacuna")
    patient_zero_node: str = Field(default="tarqui", description="ID de la parroquia donde inicia el brote")
    initial_zombies: int = Field(default=5, ge=1, le=100, description="Número inicial de casos")
    budget_limit: float = Field(default=250000.0, description="Presupuesto financiero límite en USD")
    cost_per_dose: float = Field(default=12.0, description="Costo logístico y unitario por dosis en USD")


class MonteCarloRequest(BaseModel):
    config: SimulationConfig
    iterations: int = Field(default=25, ge=5, le=100, description="Número de iteraciones de Monte Carlo")


class MayorReportRequest(BaseModel):
    sim_results: Dict[str, Any]
    config: Dict[str, Any]


@app.get("/")
def health_check():
    return {
        "status": "online",
        "service": "NodeZero Manta Epidemiological Engine",
        "environment": "AWS us-east-1 (Serverless Lambda Ready)",
        "docsUrl": "/docs",
        "canton": "Manta, Manabí, Ecuador",
        "population": TOTAL_MANTA_POPULATION,
    }


@app.get("/api/topology")
def get_topology():
    """Retorna la topología urbana, parroquias y red de transporte de Manta."""
    return {
        "canton": "Manta",
        "totalPopulation": TOTAL_MANTA_POPULATION,
        "nodes": MANTA_NODES,
        "edges": MANTA_EDGES,
    }


@app.post("/api/simulate")
def simulate(config: SimulationConfig):
    """
    Ejecuta la simulación comparativa de las tres estrategias exigidas por el reto:
    1. Línea Base 1: Sin Intervención
    2. Línea Base 2: Intervención al Azar
    3. Estrategia NodeZero: Anillo Focalizado y Hubs de Movilidad
    """
    cfg_dict = config.model_dump()

    sim_none = SEIRGraphSimulator({**cfg_dict, "strategy": "none"}).run()
    sim_random = SEIRGraphSimulator({**cfg_dict, "strategy": "random"}).run()
    sim_nodezero = SEIRGraphSimulator({**cfg_dict, "strategy": "nodezero"}).run()

    # Cálculo de métricas de impacto
    none_saved = sim_none["summary"]["finalSusceptible"] + sim_none["summary"]["finalImmuneOrSaved"]
    random_saved = sim_random["summary"]["finalSusceptible"] + sim_random["summary"]["finalImmuneOrSaved"]
    nodezero_saved = sim_nodezero["summary"]["finalSusceptible"] + sim_nodezero["summary"]["finalImmuneOrSaved"]

    lives_saved_vs_none = max(0, nodezero_saved - none_saved)
    lives_saved_vs_random = max(0, nodezero_saved - random_saved)

    none_peak = sim_none["summary"]["peakInfected"]
    nodezero_peak = sim_nodezero["summary"]["peakInfected"]
    peak_reduction = round(((none_peak - nodezero_peak) / max(1, none_peak)) * 100, 1)

    total_cost = sim_nodezero["summary"]["totalCostUSD"]
    cost_per_life = round(total_cost / max(1, lives_saved_vs_none), 2) if lives_saved_vs_none > 0 else 0.0

    return {
        "seed": config.seed,
        "config": cfg_dict,
        "none": sim_none,
        "random": sim_random,
        "nodezero": sim_nodezero,
        "metrics": {
            "totalPopulation": TOTAL_MANTA_POPULATION,
            "livesSavedVsNone": lives_saved_vs_none,
            "livesSavedVsRandom": lives_saved_vs_random,
            "peakReductionPct": peak_reduction,
            "nodeZeroPeakDay": sim_nodezero["summary"]["peakDay"],
            "nonePeakDay": sim_none["summary"]["peakDay"],
            "totalCostUSD": total_cost,
            "costPerLifeSaved": cost_per_life,
        },
    }


@app.post("/api/monte-carlo")
def monte_carlo(req: MonteCarloRequest):
    """Ejecuta simulaciones Monte Carlo para calcular intervalos de confianza."""
    cfg_dict = req.config.model_dump()
    return run_monte_carlo(cfg_dict, req.iterations)


@app.post("/api/mayor-report")
def mayor_report(req: MayorReportRequest):
    """Genera informe ejecutivo para el Alcalde de Manta usando Amazon Bedrock."""
    return generate_mayor_report(req.sim_results, req.config)


# Adaptador Serverless para AWS Lambda
handler = Mangum(app)
