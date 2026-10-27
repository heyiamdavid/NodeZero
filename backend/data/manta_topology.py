"""
Topología de la red de contactos y movilidad urbana de Manta, Manabí.
Parroquias urbanas, zonas comerciales, hubs de transporte y centros educativos.
"""

from typing import List, Dict, Any

MANTA_NODES: List[Dict[str, Any]] = [
    {
        "id": "tarqui",
        "name": "Tarqui (Mercado Nuevo Tarqui)",
        "category": "Mercado / Comercio",
        "population": 48000,
        "density": "Muy Alta",
        "mobility_weight": 1.0,
        "coordinates": {"lat": -0.9535, "lon": -80.7078},
        "description": "Principal centro de comercio y abasto. Gran flujo diario de comerciantes y compradores.",
    },
    {
        "id": "manta_centro",
        "name": "Manta Centro / Malecón",
        "category": "Comercial / Turístico",
        "population": 36000,
        "density": "Alta",
        "mobility_weight": 0.85,
        "coordinates": {"lat": -0.9490, "lon": -80.7280},
        "description": "Zona bancaria, hoteles, Playa El Murciélago y puerto marítimo TPM.",
    },
    {
        "id": "los_esteros",
        "name": "Los Esteros",
        "category": "Industrial / Residencial",
        "population": 34000,
        "density": "Media-Alta",
        "mobility_weight": 0.75,
        "coordinates": {"lat": -0.9580, "lon": -80.6890},
        "description": "Zona de empacadoras pesqueras y conexión con la vía a Rocafuerte.",
    },
    {
        "id": "eloy_alfaro",
        "name": "Eloy Alfaro",
        "category": "Residencial Densamente Poblado",
        "population": 52000,
        "density": "Muy Alta",
        "mobility_weight": 0.90,
        "coordinates": {"lat": -0.9850, "lon": -80.7100},
        "description": "Mayor densidad residencial. Alto uso de transporte público hacia Tarqui y Centro.",
    },
    {
        "id": "el_palmar",
        "name": "El Palmar (Terminal Terrestre)",
        "category": "Hub de Transporte",
        "population": 18000,
        "density": "Media",
        "mobility_weight": 0.95,
        "coordinates": {"lat": -0.9650, "lon": -80.6750},
        "description": "Terminal terrestre intercantonal e interprovincial y proximidad al Aeropuerto Eloy Alfaro.",
    },
    {
        "id": "uleam",
        "name": "Ciudadela Universitaria (ULEAM)",
        "category": "Educación / Juventud",
        "population": 26000,
        "density": "Alta",
        "mobility_weight": 0.80,
        "coordinates": {"lat": -0.9720, "lon": -80.7420},
        "description": "Campus matriz ULEAM. Alto tránsito de estudiantes de toda la provincia de Manabí.",
    },
    {
        "id": "san_mateo",
        "name": "San Mateo",
        "category": "Pesquera / Costera",
        "population": 12000,
        "density": "Baja-Media",
        "mobility_weight": 0.45,
        "coordinates": {"lat": -0.9980, "lon": -80.8120},
        "description": "Caleta pesquera tradicional al suroeste, conectada por la Ruta del Spondylus.",
    },
    {
        "id": "san_patricio",
        "name": "San Juan / 24 de Mayo",
        "category": "Residencial Periférico",
        "population": 22000,
        "density": "Media",
        "mobility_weight": 0.60,
        "coordinates": {"lat": -0.9950, "lon": -80.6900},
        "description": "Sectores periféricos del suroriente con conexiones hacia Montecristi.",
    },
]

MANTA_EDGES: List[Dict[str, Any]] = [
    {"source": "tarqui", "target": "manta_centro", "flow": 0.90, "name": "Av. 4 de Noviembre / Malecón"},
    {"source": "tarqui", "target": "eloy_alfaro", "flow": 0.95, "name": "Eje Comercial - Residencial"},
    {"source": "tarqui", "target": "los_esteros", "flow": 0.85, "name": "Vía Interbarrial"},
    {"source": "tarqui", "target": "el_palmar", "flow": 0.80, "name": "Corredor Terminal"},
    {"source": "manta_centro", "target": "uleam", "flow": 0.75, "name": "Av. Circunvalación Tramo 1"},
    {"source": "uleam", "target": "san_mateo", "flow": 0.50, "name": "Ruta del Spondylus Sur"},
    {"source": "eloy_alfaro", "target": "san_patricio", "flow": 0.70, "name": "Vía Interbarrial Sur"},
    {"source": "los_esteros", "target": "el_palmar", "flow": 0.80, "name": "Vía Puerto - Aeropuerto"},
    {"source": "el_palmar", "target": "san_patricio", "flow": 0.55, "name": "Anillo Periférico"},
    {"source": "uleam", "target": "eloy_alfaro", "flow": 0.60, "name": "Av. de la Cultura"},
]

TOTAL_MANTA_POPULATION = sum(n["population"] for n in MANTA_NODES)
