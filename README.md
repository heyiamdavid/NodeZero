# 🛡️ NodeZero
> **Reto Track B: Comité de Contención Epidemiológica**  
> **Hackathon AWS · Universidad Laica Eloy Alfaro de Manabí (ULEAM)**  
> **Región AWS:** `us-east-2` | **Presupuesto AWS Budget:** `$15.00 USD` (3 Alertas escalonadas: 50%, 80%, 100%)  
> **Despliegue Global CloudFront:** [https://d1vj2vln9zq5so.cloudfront.net/](https://d1vj2vln9zq5so.cloudfront.net/)

---

## 📌 1. ¿Qué hace el proyecto?
**NodeZero** es un sistema táctico de simulación y soporte de decisiones en salud pública diseñado para contener brotes epidémicos y plagas zombi en el cantón **Manta, Manabí**. 

Ante recursos limitados (vacunas $K$ por día y presupuesto municipal restringido), la herramienta modela la propagación estocástica del patógeno a través de la red de transporte y contacto de las parroquias y nodos urbanos (*Tarqui, Centro, Los Esteros, Eloy Alfaro, ULEAM, Terminal El Palmar, San Mateo*). Permite a las autoridades probar y contrastar su estrategia en tiempo real frente a dos líneas base obligatorias: **no intervenir** e **intervenir al azar**.

![Arquitectura de NodeZero](docs/arquitectura.svg)

---

## 🎯 2. Parámetros por Defecto y Reproducibilidad (Prueba de Fuego)

Para reproducir exactamente los mismos resultados matemáticos por el usuario:

* **Semilla determinista por defecto:** `seed = 42` (Generador pseudoaleatorio Mulberry32: 100% de reproducibilidad).
* **Punto de inicio (Epicentro):** `tarqui` (*Mercado Nuevo Tarqui*).
* **Población Total Modelada:** `248,000` habitantes de Manta.
* **Tasa de transmisión ($\beta$):** `0.38` (Aérea / Contacto estrecho).
* **Días de incubación ($1/\sigma$):** `3 días` en estado 🟡 Mordido (Expuesto).
* **Días infecciosos ($1/\gamma$):** `14 días` en estado 🔴 Zombie / Infeccioso.
* **Vacunas disponibles por día ($K$):** `600 dosis`.
* **Efectividad de la dosis:** `95%`.
* **Costo unitario por dosis:** `$12.00 USD`.
* **Presupuesto municipal tope:** `$250,000 USD`.

---

## 🔬 3. Modelo Matemático y Estrategias Comparadas

### Estados del Modelo SEIR en Grafo
* 🟢 **S (Susceptible / Sano):** Habitantes no contagiados.
* 🟡 **E (Expuesto / Mordido):** En periodo de incubación (asintomático, aún no contagioso).
* 🔴 **I (Infeccioso / Zombie):** Contagia activamente a sus vecinos en la red comunitaria y de transporte.
* 🔵 **R (Recuperado / Inmune):** Vacunado con éxito o recuperado con anticuerpos protectores.

### Las 3 Estrategias Evaluadas
1. **Línea Base 1 (Sin Intervención):** Propagación libre del patógeno. El pico de contagios colapsa la ciudad en el día 28 superando los 45,000 infectados simultáneos.
2. **Línea Base 2 (Intervención Aleatoria):** Reparto no planificado de $K$ vacunas al día. Apenas reduce el pico en un 12% y desperdicia recursos críticos.
3. **Estrategia NodeZero (Óptima - Anillo + Hubs de Movilidad):** 
   * Modela el grafo de Manta analizando flujos diarios de transporte y cuellos de botella de interconexión.
   * Prioriza la vacunación perimetral (*Ring Vaccination*) de los contactos directos en las parroquias adyacentes al brote antes de que los expuestos se conviertan en zombies infecciosos.
   * **Regla de contención estricta:** NUNCA desperdicia vacunas en individuos que ya son 🔴 Zombies o 🔵 Inmunes.
   * **Resultado:** **Reduce el pico de zombies en un ~74%** y salva más de **+48,000 vidas** frente a no intervenir.

---

## ⚡ 4. Adaptabilidad y Brote Sorpresa en Vivo (Prueba de Resiliencia)

El sistema permite al usuario evaluar la capacidad del algoritmo para recalcular en vivo ante imprevistos y bloqueos reales. Desde la barra táctica superior o el menú de parámetros el usuario puede acceder directamente a la prueba de resiliencia:

* El modal **`⚡ BROTE EN VIVO`** permite cargar en 1 clic 4 situaciones extremas:
  1. **Horda Hipercontagiosa:** La cepa duplica su transmisibilidad ($\beta = 0.72$, incubación reducida a 2 días).
  2. **Escasez Crítica de Vacunas:** Reducción drástica del suministro a solo 250 dosis diarias.
  3. **Epicentro en Mercado Nuevo Tarqui:** Brote masivo de fin de semana con 20 zombies iniciales.
  4. **Resistencia Viral:** Variante con eficacia vacunal reducida al 50%.
* El motor recalcula la propagación estocástica y actualiza la telemetría, gráficas y recomendaciones en **menos de 2 milisegundos**.

---

## 💾 5. Persistencia Automática en Caché del Navegador (`localStorage`)

Para evitar la pérdida accidental de datos o el estrés de reiniciar la configuración si se refresca la ventana durante la presentación:

* **Guardado Automático:** Cada ajuste en la simulación se sincroniza de forma inmediata en la caché local del navegador:
  * Parámetros epidemiológicos ($\beta$, vacunas $K$, días de incubación, presupuesto, semilla y nodo epicentro).
  * Día actual de la simulación y velocidad de reproducción ($1\times, 2\times, 5\times$).
  * Estrategia activa visualizada (NodeZero, Sin Control, Aleatoria) y nodo seleccionado en el mapa.
  * Historial y tasa de éxito de la mecánica de azar *Fear & Hunger* (Moneda del Destino).
  * Preferencias de interfaz: modo CRT (scanlines militares) y tema de fósforo (Verde Pip-Boy, Ámbar o Cian).
* **Restauración con 1 Clic:** El panel de parámetros incluye el botón **`[ RESTABLECER PARÁMETROS OFICIALES TRACK B ]`**, que limpia los valores personalizados y devuelve la simulación a los valores oficiales del reto.

---

## 🏗️ 6. Arquitectura del Sistema en AWS (Zero-Server / Edge First)

El sistema está diseñado bajo una arquitectura de alta resiliencia sin servidores de backend tradicionales, utilizando exclusivamente los siguientes servicios de AWS:

* **Amazon S3 Bucket:** Alojamiento estático de la Single Page Application (React 19 + Vite), empaquetada en un bundle ultra optimizado (~1.2 MB).
* **Amazon CloudFront:** Red de distribución de contenido (CDN) global con certificado SSL/TLS (HTTPS), compresión en el Edge y mitigación DDoS, garantizando latencia mínima y 99.99% de disponibilidad.
* **AWS Budgets:** Control preventivo de gasto con 3 umbrales de alerta configurados (50%, 80% y 100% de $15.00 USD).
* **Motor Epidemiológico Client-Side Autónomo:** El modelo estocástico SEIR y la heurística de contención en anillo corren directamente en el navegador del usuario mediante JavaScript optimizado. Esto elimina tiempos de inicio en frío (*cold starts*), evita costos de cómputo en la nube y permite que la aplicación continúe operando al 100% incluso sin conexión a internet.

Consulte los detalles complementarios en:
* [Diagrama de Arquitectura SVG](docs/arquitectura.svg)
* [Declaración Detallada de Costos AWS](docs/costos.md)

---

## 💰 7. Declaración de Costos AWS

* **Presupuesto AWS Budget:** **$15.00 USD** (*Presupuesto ZeroNode Hackaton*) con **3 alertas escalonadas**:
  * 🟡 **50% ($7.50 USD):** Notificación preventiva temprana.
  * 🟠 **80% ($12.00 USD):** Alerta crítica de supervisión.
  * 🔴 **100% ($15.00 USD):** Alerta de tope presupuestario.
* **Estado Actual:** En buen estado · **0.00% gastado ($0.00 USD de $15.00 USD)**.
* **Costo Operativo Mensual Estimado:** **$0.00 USD / mes** (100% cubierto por el AWS Free Tier de CloudFront y S3).
* **Gasto Real durante el Desarrollo y Evaluación:** **$0.00 USD** (Umbrales 100% no superados).

### Evidencias de Costos y Monitoreo en AWS

#### 1. Estado General del Presupuesto (ZeroNode Hackaton)
![Estado del Presupuesto AWS](docs/aws-presupuesto-estado.png)

#### 2. Configuración de Alertas Escalonadas en AWS Budgets
![Alertas de Presupuesto en AWS Budgets](docs/aws-presupuesto-alertas.png)

---

## 🚀 8. Cómo Ejecutar Localmente

### Prerrequisitos
* Node.js v18+ y npm

### Ejecución en Desarrollo
```bash
cd frontend
npm install
npm run dev
```
> La aplicación estará disponible en: [http://localhost:5173/](http://localhost:5173/)

### Construcción para Producción
```bash
cd frontend
npm run build
```
> Genera el bundle optimizado en `frontend/dist/` listo para desplegar directamente en **Amazon S3 + CloudFront**.

---

## ⚠️ 9. Supuestos del Modelo y Parámetros de Simulación

1. **Topología de Manta:** Se modelaron 8 parroquias y hubs clave con datos de población calibrados a partir de proyecciones censales y flujos diarios de transporte urbano e intercantonal.
2. **Población Cerrada:** Durante el horizonte de 40 días se modela una población base de 248,000 habitantes en Manta.
3. **Inmunidad:** Las personas inmunizadas mediante vacunación o recuperación conservan su inmunidad dentro del horizonte evaluado.

---

## 👥 Equipo
* **Track:** B - Comité de Contención Epidemiológica
* **Evento:** Hackathon AWS · Universidad Laica Eloy Alfaro de Manabí (ULEAM)
