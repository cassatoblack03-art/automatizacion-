-- Databricks notebook source
-- MAGIC %md
-- MAGIC # 02 · Pipeline medallion en SQL (bronce → plata → oro)
-- MAGIC
-- MAGIC Usamos los datos de ejemplo **TPC-H** que trae todo workspace en el catálogo `samples`.
-- MAGIC La tabla `lineitem` tiene líneas de pedidos con **modo de envío** y tres fechas clave:
-- MAGIC
-- MAGIC | Columna original | Significado |
-- MAGIC |---|---|
-- MAGIC | `l_shipdate` | Fecha de despacho |
-- MAGIC | `l_commitdate` | Fecha comprometida con el cliente |
-- MAGIC | `l_receiptdate` | Fecha en que el cliente recibió |
-- MAGIC | `l_shipmode` | Modo de envío (TRUCK, RAIL, AIR, SHIP…) |
-- MAGIC
-- MAGIC Con eso calculamos un KPI de **entregas a tiempo** por modo de envío y mes, igual que harías con datos de tu TMS o de SAP.
-- MAGIC
-- MAGIC **Cómo ejecutarlo:** conecta a *Serverless* (o a un SQL Warehouse) y usa **Run all**.

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## 0. Configuración
-- MAGIC Si no usas Free Edition, cambia `workspace` por un catálogo donde tengas permisos.

-- COMMAND ----------

CREATE SCHEMA IF NOT EXISTS workspace.logistica_demo;
USE CATALOG workspace;
USE SCHEMA logistica_demo;

-- COMMAND ----------

-- Exploración rápida de la fuente: siempre mira los datos antes de transformarlos
SELECT * FROM samples.tpch.lineitem LIMIT 10;

-- COMMAND ----------

DESCRIBE TABLE samples.tpch.lineitem;

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## 1. BRONCE: los datos crudos, tal cual llegan
-- MAGIC Copiamos solo un año para que corra rápido en Free Edition y agregamos **cuándo** se cargó cada fila (útil para auditar).

-- COMMAND ----------

CREATE OR REPLACE TABLE bronce_lineitem
COMMENT 'Bronce: copia cruda de samples.tpch.lineitem (año 1997)'
AS
SELECT
  *,
  current_timestamp() AS _fecha_carga
FROM samples.tpch.lineitem
WHERE l_shipdate BETWEEN DATE'1997-01-01' AND DATE'1997-12-31';

-- COMMAND ----------

SELECT COUNT(*) AS filas_bronce FROM bronce_lineitem;

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## 2. PLATA: datos limpios y con sentido de negocio
-- MAGIC - Nombres de columna en español y entendibles.
-- MAGIC - Columnas calculadas: días de tránsito, días de retraso, ¿llegó a tiempo?
-- MAGIC - Reglas de calidad: descartamos fechas imposibles y duplicados.
-- MAGIC
-- MAGIC `QUALIFY` filtra sobre una función de ventana: aquí nos quedamos con una sola fila por `(pedido, línea)`.

-- COMMAND ----------

CREATE OR REPLACE TABLE plata_lineas_envio
COMMENT 'Plata: líneas de pedido limpias con métricas de entrega'
AS
SELECT
  l_orderkey                                            AS id_pedido,
  l_linenumber                                          AS linea,
  l_shipmode                                            AS modo_envio,
  l_shipinstruct                                        AS instruccion_envio,
  l_shipdate                                            AS fecha_despacho,
  l_commitdate                                          AS fecha_compromiso,
  l_receiptdate                                         AS fecha_recepcion,
  l_quantity                                            AS cantidad,
  ROUND(l_extendedprice * (1 - l_discount), 2)          AS importe_neto,
  DATEDIFF(l_receiptdate, l_shipdate)                   AS dias_transito,
  GREATEST(0, DATEDIFF(l_receiptdate, l_commitdate))    AS dias_retraso,
  l_receiptdate <= l_commitdate                         AS a_tiempo,
  _fecha_carga
FROM bronce_lineitem
WHERE l_receiptdate >= l_shipdate                       -- regla de calidad: no se recibe antes de despachar
QUALIFY ROW_NUMBER() OVER (PARTITION BY l_orderkey, l_linenumber ORDER BY _fecha_carga DESC) = 1;

-- COMMAND ----------

-- Una restricción CHECK hace que Delta RECHACE futuras cargas con datos inválidos
ALTER TABLE plata_lineas_envio
  ADD CONSTRAINT fechas_validas CHECK (fecha_recepcion >= fecha_despacho);

-- COMMAND ----------

SELECT * FROM plata_lineas_envio LIMIT 20;

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## 3. ORO: KPIs listos para el negocio
-- MAGIC Una tabla agregada, pequeña y rápida, que alimenta dashboards y Genie.

-- COMMAND ----------

CREATE OR REPLACE TABLE oro_kpi_modo_envio_mensual
COMMENT 'Oro: KPIs mensuales de entrega a tiempo por modo de envío'
AS
SELECT
  TRUNC(fecha_despacho, 'MM')                            AS mes,
  modo_envio,
  COUNT(*)                                               AS lineas,
  ROUND(100 * AVG(CAST(a_tiempo AS INT)), 1)             AS pct_a_tiempo,
  ROUND(AVG(dias_transito), 1)                           AS dias_transito_prom,
  ROUND(AVG(CASE WHEN NOT a_tiempo THEN dias_retraso END), 1) AS dias_retraso_prom_tardias,
  ROUND(SUM(importe_neto), 2)                            AS importe_total
FROM plata_lineas_envio
GROUP BY TRUNC(fecha_despacho, 'MM'), modo_envio;

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## 4. Consultas para el dashboard
-- MAGIC Después de ejecutar una celda, haz clic en **+ → Visualization** sobre el resultado para graficarlo.

-- COMMAND ----------

-- Ranking anual por modo de envío
SELECT
  modo_envio,
  SUM(lineas)                                                  AS lineas,
  ROUND(SUM(pct_a_tiempo * lineas) / SUM(lineas), 1)           AS pct_a_tiempo,
  ROUND(SUM(importe_total), 0)                                 AS importe_total
FROM oro_kpi_modo_envio_mensual
GROUP BY modo_envio
ORDER BY pct_a_tiempo DESC;

-- COMMAND ----------

-- Tendencia mensual (ideal para una gráfica de líneas: X = mes, Y = pct_a_tiempo, color = modo_envio)
SELECT mes, modo_envio, pct_a_tiempo
FROM oro_kpi_modo_envio_mensual
ORDER BY mes, modo_envio;

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## 5. Siguientes pasos
-- MAGIC 1. **Automatízalo:** *Jobs & Pipelines → Create job*, agrega este notebook como tarea y prográmalo (ej. diario 6:00 a.m.).
-- MAGIC 2. **Dashboard:** *Dashboards → Create dashboard* y usa `oro_kpi_modo_envio_mensual` como fuente.
-- MAGIC 3. **Genie:** crea un *Genie space* con la tabla oro y pregúntale en español: *"¿Qué modo de envío tuvo peor cumplimiento en el tercer trimestre?"*
-- MAGIC 4. **Reto:** une `plata_lineas_envio` con `samples.tpch.orders` (por `id_pedido = o_orderkey`) para calcular el % a tiempo por **prioridad del pedido** (`o_orderpriority`).
-- MAGIC
-- MAGIC **Prompt sugerido para Claude:**
-- MAGIC > Tengo la tabla `workspace.logistica_demo.plata_lineas_envio` (columnas: id_pedido, linea, modo_envio, fecha_despacho, fecha_compromiso, fecha_recepcion, dias_transito, dias_retraso, a_tiempo, importe_neto). Quiero resolver el reto 4 uniéndola con `samples.tpch.orders`. Dame la consulta en SQL de Databricks y explícame qué hace cada parte.

-- COMMAND ----------

-- MAGIC %md
-- MAGIC ## Limpieza (opcional)

-- COMMAND ----------

-- DROP TABLE IF EXISTS oro_kpi_modo_envio_mensual;
-- DROP TABLE IF EXISTS plata_lineas_envio;
-- DROP TABLE IF EXISTS bronce_lineitem;
