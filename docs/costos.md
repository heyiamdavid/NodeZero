# Declaración de Costos · NodeZero Manta
**Track B: Comité de Contención Epidemiológica · Hackathon AWS ULEAM**

---

## 1. Resumen Ejecutivo de Costos

| Rubro | Costo Estimado Mensual | Costo Real Durante el Evento |
| :--- | :---: | :---: |
| **AWS Lambda** (Cómputo Serverless) | $0.00 USD (Free Tier) | $0.00 USD |
| **Amazon S3** (Hosting Estático Frontend) | $0.00 USD (Free Tier) | $0.00 USD |
| **Amazon CloudFront** (Distribución Global CDN) | $0.00 USD (Free Tier) | $0.00 USD |
| **Amazon API Gateway** (Enrutamiento HTTP) | $0.00 USD (Free Tier) | $0.00 USD |
| **Amazon Bedrock** (LLM Informe Alcalde - Claude 3 Haiku) | $0.02 USD (por 100 reportes) | < $0.05 USD |
| **AWS Budgets & CloudWatch** (Alarmas de Costo) | $0.00 USD (2 presupuestos gratis) | $0.00 USD |
| **TOTAL ESTIMADO:** | **$0.02 USD / mes** | **< $0.05 USD** |

---

## 2. Desglose Detallado por Servicio AWS

### A. AWS Lambda (Motor Epidemiológico Python)
* **Memoria asignada:** 512 MB
* **Duración promedio por simulación (NumPy/NetworkX):** 85 ms
* **Free Tier de AWS:** 1,000,000 de invocaciones gratuitas al mes y 3,200,000 segundos de cómputo gratis.
* **Cálculo:**
  $$\text{Consumo por corrida} = 0.512\text{ GB} \times 0.085\text{ s} = 0.0435\text{ GB-s}$$
  Para 50,000 simulaciones durante el evento:
  $$50,000 \times 0.0435 = 2,176\text{ GB-s} \ll 3,200,000\text{ GB-s (Free Tier)}$$
  **Costo: $0.00 USD**.

### B. Amazon S3 & Amazon CloudFront (Frontend React)
* **Almacenamiento del bundle Vite (`dist/`):** ~1.2 MB
* **Free Tier S3:** 5 GB de almacenamiento estándar gratis.
* **Free Tier CloudFront:** 1 TB de transferencia de datos de salida mensual y 10,000,000 de peticiones HTTPS gratuitas.
* **Costo: $0.00 USD**.

### C. Amazon API Gateway (HTTP API v2)
* **Free Tier:** 1,000,000 de llamadas a API Gateway HTTP gratuitas durante 12 meses.
* Alternativa de costo cero absoluto: **Lambda Function URLs** (HTTPS directa sin costo de API Gateway).
* **Costo: $0.00 USD**.

### D. Amazon Bedrock (Informe para el Alcalde - Claude 3 Haiku)
* **Modelo:** `anthropic.claude-3-haiku-20240307-v1:0`
* **Tokens de entrada:** ~350 tokens ($0.00025 por 1k tokens) = $0.0000875
* **Tokens de salida:** ~450 tokens ($0.00125 por 1k tokens) = $0.0005625
* **Costo por informe generado:** ~$0.00065 USD.
* Para 30 consultas del jurado: **$0.0195 USD**.

---

## 3. Configuración de AWS Budget & Alerta de Gasto

* **Presupuesto Máximo Establecido:** **$5.00 USD**
* **Umbral de Alerta Temprana:** Notificación por correo electrónico al alcanzar el **80% ($4.00 USD)**.
* **Política de Seguridad:** Principio de menor privilegio (IAM Least Privilege) en el rol de ejecución de Lambda.
