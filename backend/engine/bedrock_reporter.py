"""
Módulo Generador de Informe Ejecutivo para la Alcaldía de Manta.
Conexión nativa con Amazon Bedrock (us-east-1) con fallback dinámico inteligente.
"""

import os
import json
from typing import Dict, Any
from datetime import datetime


def generate_mayor_report(sim_results: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
    metrics = sim_results.get("metrics", {})
    none_sum = sim_results.get("none", {}).get("summary", {})
    nodezero_sum = sim_results.get("nodezero", {}).get("summary", {})
    patient_zero = config.get("patient_zero_node", "tarqui").replace("_", " ").title()

    lives_saved = metrics.get("livesSavedVsNone", 0)
    peak_reduction = metrics.get("peakReductionPct", 0)
    total_cost = nodezero_sum.get("totalCostUSD", 0)
    peak_infected_none = none_sum.get("peakInfected", 0)
    daily_vaccines = config.get("daily_vaccines", 600)

    # Intentar invocar Amazon Bedrock si las credenciales de AWS están presentes
    bedrock_model_used = None
    generated_text = None

    try:
        import boto3
        # Solo intentar si hay variables de AWS configuradas o rol IAM
        if os.getenv("AWS_ACCESS_KEY_ID") or os.getenv("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI"):
            client = boto3.client("bedrock-runtime", region_name="us-east-1")
            prompt = f"""
Eres el Asesor Epidemiológico del Cantón Manta. Redacta un informe ejecutivo urgente para el Alcalde de Manta
en lenguaje simple, directo y sin tecnicismos complejos:
- Brote detectado en: {patient_zero}
- Vidas salvadas con estrategia NodeZero: {lives_saved:,}
- Aplanamiento de pico de zombies: {peak_reduction}%
- Pico evitado sin intervención: {peak_infected_none:,} zombies
- Vacunas recomendadas hoy: {daily_vaccines:,} dosis
- Inversión total estimada: ${total_cost:,.2f} USD
Estructura en 3 puntos: 1. Diagnóstico claro, 2. Dónde desplegar brigadas hoy (Tarqui, El Palmar, Eloy Alfaro), 3. Resultados esperados.
            """.strip()

            payload = {
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 800,
                "messages": [{"role": "user", "content": prompt}],
            }

            response = client.invoke_model(
                modelId="anthropic.claude-3-haiku-20240307-v1:0",
                contentType="application/json",
                accept="application/json",
                body=json.dumps(payload),
            )
            resp_body = json.loads(response["body"].read())
            generated_text = resp_body["content"][0]["text"]
            bedrock_model_used = "anthropic.claude-3-haiku-20240307-v1:0"
    except Exception:
        # Fallback inteligente si no hay conexión a AWS Bedrock o en entorno local
        bedrock_model_used = "Dynamic Heuristic Executive Generator (Offline Safe)"

    if not generated_text:
        date_str = datetime.now().strftime("%d de %B de %Y")
        generated_text = f"""
MEMORANDO EJECUTIVO DE EMERGENCIA EPIDEMIOLÓGICA
PARA: Despacho de la Alcaldía de Manta & COE Cantonal
DE: Comité de Contención NodeZero (ULEAM - Track B)
FECHA: {date_str}
ASUNTO: Recomendación Urgente de Intervención y Contención de Brote

1. DIAGNÓSTICO EN LENGUAJE SIMPLE (¿Qué está ocurriendo?)
Señor(a) Alcalde(sa): Se ha confirmado un foco de propagación que inició en {patient_zero}.
Si la ciudad no actúa de forma planificada y coordinada, la plaga se desbordará por los buses y centros comerciales,
alcanzando un pico crítico de {peak_infected_none:,} personas afectadas simultáneamente, lo que colapsaría hospitales y mercados de Manta.

2. ¿DÓNDE DEBEMOS INTERVENIR HOY? (Estrategia de Anillo y Contención)
Vacunar a ciegas o al azar NO es efectivo: agota las dosis y no frena las rutas de contagio.
Recomendamos concentrar las {daily_vaccines:,} vacunas diarias disponibles en:
- Mercado Nuevo Tarqui y Parroquia Eloy Alfaro: Brigadas móviles matutinas en puntos de comercio.
- Terminal Terrestre El Palmar: Filtros sanitarios en salidas intercantonales hacia Portoviejo y Montecristi.
- Campus ULEAM y Eje Malecón: Puntos de vacunación preventiva en corredores peatonales.
Regla de oro: No malgastar vacunas en personas que ya presentan síntomas activos.

3. RESULTADOS PROYECTADOS PARA EL CANTÓN MANTA:
- Vidas estimadas protegidas: +{lives_saved:,} habitantes de Manta.
- Reducción del pico epidémico: {peak_reduction}% de aplanamiento de la curva.
- Inversión presupuestaria total: ${total_cost:,.2f} USD (costo muy bajo por vida salvada).
        """.strip()

    return {
        "modelUsed": bedrock_model_used,
        "region": "us-east-1",
        "timestamp": datetime.now().isoformat(),
        "reportText": generated_text,
    }
