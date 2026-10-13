# Databricks notebook source
# MAGIC %md
# MAGIC # 01 · Primeros pasos en Databricks
# MAGIC
# MAGIC En este notebook vas a:
# MAGIC 1. Crear un **esquema** (una "carpeta" de tablas) en Unity Catalog.
# MAGIC 2. Crear un **DataFrame** de envíos y explorarlo.
# MAGIC 3. Transformarlo con PySpark y con SQL.
# MAGIC 4. Guardarlo como **tabla Delta**.
# MAGIC 5. Actualizarlo con **MERGE** y viajar en el tiempo con el **historial de versiones**.
# MAGIC 6. Crear una tabla de **KPIs** por transportista.
# MAGIC
# MAGIC **Cómo ejecutarlo:** conecta el notebook a *Serverless* (arriba a la derecha) y ejecuta celda por celda con `Shift + Enter`.
# MAGIC
# MAGIC > Pensado para **Databricks Free Edition**. Si usas otro workspace, cambia `CATALOGO` por un catálogo donde tengas permisos.

# COMMAND ----------

# MAGIC %md
# MAGIC ## 1. Configuración: catálogo y esquema
# MAGIC Toda tabla en Databricks tiene un nombre de 3 niveles: `catalogo.esquema.tabla`.

# COMMAND ----------

CATALOGO = "workspace"       # En Free Edition este catálogo ya existe
ESQUEMA = "logistica_demo"   # Lo creamos aquí abajo

spark.sql(f"CREATE SCHEMA IF NOT EXISTS {CATALOGO}.{ESQUEMA}")
spark.sql(f"USE CATALOG {CATALOGO}")
spark.sql(f"USE SCHEMA {ESQUEMA}")

print(f"Trabajando en: {CATALOGO}.{ESQUEMA}")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 2. Crear un DataFrame
# MAGIC Un **DataFrame** es una tabla en memoria. Aquí lo creamos desde una lista de Python; en la vida real lo leerías de un archivo o de otra tabla.
# MAGIC El esquema (`columna TIPO, ...`) le dice a Spark el tipo de cada columna.

# COMMAND ----------

from datetime import date

esquema_envios = """
    id_envio STRING, transportista STRING, origen STRING, destino STRING,
    fecha_despacho DATE, fecha_compromiso DATE, fecha_entrega DATE,
    peso_kg DOUBLE, costo DOUBLE, estado STRING
"""

datos = [
    ("ENV-001", "TransRápido", "Bodega Central", "Sucursal Norte", date(2026, 9, 1), date(2026, 9, 3), date(2026, 9, 3), 120.0, 450.0, "ENTREGADO"),
    ("ENV-002", "TransRápido", "Bodega Central", "Sucursal Sur",   date(2026, 9, 1), date(2026, 9, 4), date(2026, 9, 6), 80.0,  300.0, "ENTREGADO"),
    ("ENV-003", "LogiExpress", "Bodega Central", "Sucursal Este",  date(2026, 9, 2), date(2026, 9, 5), date(2026, 9, 4), 200.0, 610.0, "ENTREGADO"),
    ("ENV-004", "LogiExpress", "Bodega Central", "Sucursal Oeste", date(2026, 9, 2), date(2026, 9, 5), date(2026, 9, 5), 150.0, 520.0, "ENTREGADO"),
    ("ENV-005", "CargaSegura", "Bodega Central", "Sucursal Norte", date(2026, 9, 3), date(2026, 9, 6), date(2026, 9, 9), 300.0, 780.0, "ENTREGADO"),
    ("ENV-006", "CargaSegura", "Bodega Central", "Sucursal Sur",   date(2026, 9, 3), date(2026, 9, 6), date(2026, 9, 6), 90.0,  330.0, "ENTREGADO"),
    ("ENV-007", "TransRápido", "Bodega Central", "Sucursal Este",  date(2026, 9, 4), date(2026, 9, 7), date(2026, 9, 7), 60.0,  250.0, "ENTREGADO"),
    ("ENV-008", "LogiExpress", "Bodega Central", "Sucursal Norte", date(2026, 9, 4), date(2026, 9, 7), date(2026, 9, 8), 110.0, 420.0, "ENTREGADO"),
    ("ENV-009", "CargaSegura", "Bodega Central", "Sucursal Oeste", date(2026, 9, 5), date(2026, 9, 8), None,             250.0, 690.0, "EN_TRANSITO"),
    ("ENV-010", "TransRápido", "Bodega Central", "Sucursal Sur",   date(2026, 9, 5), date(2026, 9, 8), None,             70.0,  280.0, "EN_TRANSITO"),
]

envios = spark.createDataFrame(datos, schema=esquema_envios)

display(envios)   # display() muestra una tabla interactiva (puedes ordenar, filtrar y graficar)

# COMMAND ----------

envios.printSchema()                         # Columnas y tipos
print("Número de filas:", envios.count())    # count() SÍ ejecuta el cálculo

# COMMAND ----------

# MAGIC %md
# MAGIC ## 3. Transformar con PySpark
# MAGIC Las funciones más usadas: `select`, `filter`, `withColumn`, `groupBy` + `agg`.
# MAGIC
# MAGIC Recuerda: Spark es **perezoso**. Estas líneas solo arman un plan; el trabajo se hace cuando llamas `display`, `count` o `write`.

# COMMAND ----------

from pyspark.sql import functions as F

envios_enriquecidos = (
    envios
    .withColumn("dias_transito", F.datediff("fecha_entrega", "fecha_despacho"))
    .withColumn("dias_retraso", F.greatest(F.lit(0), F.datediff("fecha_entrega", "fecha_compromiso")))
    .withColumn("a_tiempo", F.col("fecha_entrega") <= F.col("fecha_compromiso"))
    .withColumn("costo_por_kg", F.round(F.col("costo") / F.col("peso_kg"), 2))
)

display(envios_enriquecidos.filter(F.col("estado") == "ENTREGADO"))

# COMMAND ----------

# Resumen por transportista
resumen = (
    envios_enriquecidos
    .filter(F.col("estado") == "ENTREGADO")
    .groupBy("transportista")
    .agg(
        F.count("*").alias("entregas"),
        F.round(F.avg("dias_transito"), 1).alias("dias_transito_prom"),
        F.round(100 * F.avg(F.col("a_tiempo").cast("int")), 1).alias("pct_a_tiempo"),
    )
    .orderBy(F.desc("pct_a_tiempo"))
)

display(resumen)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 4. Guardar como tabla Delta
# MAGIC `saveAsTable` crea una tabla administrada por Unity Catalog. Delta es el formato por defecto.
# MAGIC Después de ejecutar esta celda, búscala en **Catalog → workspace → logistica_demo → envios**.

# COMMAND ----------

envios.write.mode("overwrite").saveAsTable("envios")

# COMMAND ----------

# MAGIC %md
# MAGIC ## 5. Lo mismo, pero en SQL
# MAGIC Una celda que empieza con `%sql` ejecuta SQL. Como hicimos `USE CATALOG` / `USE SCHEMA`, basta con escribir `envios`.

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT transportista,
# MAGIC        COUNT(*)                                          AS entregas,
# MAGIC        ROUND(AVG(DATEDIFF(fecha_entrega, fecha_despacho)), 1) AS dias_transito_prom,
# MAGIC        ROUND(100 * AVG(CASE WHEN fecha_entrega <= fecha_compromiso THEN 1 ELSE 0 END), 1) AS pct_a_tiempo
# MAGIC FROM envios
# MAGIC WHERE estado = 'ENTREGADO'
# MAGIC GROUP BY transportista
# MAGIC ORDER BY pct_a_tiempo DESC

# COMMAND ----------

# MAGIC %md
# MAGIC ## 6. Actualizar con MERGE (upsert)
# MAGIC Caso típico: cada día llega un archivo con envíos **nuevos** y **cambios de estado** de envíos existentes.
# MAGIC `MERGE` actualiza los que ya existen e inserta los nuevos en una sola operación atómica.

# COMMAND ----------

actualizaciones = spark.createDataFrame(
    [
        # Dos envíos que estaban en tránsito y ya se entregaron
        ("ENV-009", "CargaSegura", "Bodega Central", "Sucursal Oeste", date(2026, 9, 5), date(2026, 9, 8), date(2026, 9, 10), 250.0, 690.0, "ENTREGADO"),
        ("ENV-010", "TransRápido", "Bodega Central", "Sucursal Sur",   date(2026, 9, 5), date(2026, 9, 8), date(2026, 9, 8),  70.0,  280.0, "ENTREGADO"),
        # Un envío nuevo
        ("ENV-011", "LogiExpress", "Bodega Central", "Sucursal Este",  date(2026, 9, 6), date(2026, 9, 9), None,              140.0, 500.0, "EN_TRANSITO"),
    ],
    schema=esquema_envios,
)

actualizaciones.createOrReplaceTempView("actualizaciones")   # Vista temporal para usarla desde SQL

# COMMAND ----------

# MAGIC %sql
# MAGIC MERGE INTO envios AS destino
# MAGIC USING actualizaciones AS origen
# MAGIC ON destino.id_envio = origen.id_envio
# MAGIC WHEN MATCHED THEN UPDATE SET
# MAGIC   destino.fecha_entrega = origen.fecha_entrega,
# MAGIC   destino.estado        = origen.estado
# MAGIC WHEN NOT MATCHED THEN INSERT *

# COMMAND ----------

# MAGIC %sql
# MAGIC SELECT * FROM envios ORDER BY id_envio

# COMMAND ----------

# MAGIC %md
# MAGIC ## 7. Historial de versiones (time travel)
# MAGIC Cada escritura crea una **versión** nueva de la tabla. Puedes ver quién cambió qué y consultar versiones anteriores.

# COMMAND ----------

# MAGIC %sql
# MAGIC DESCRIBE HISTORY envios

# COMMAND ----------

# MAGIC %sql
# MAGIC -- La tabla tal como estaba ANTES del MERGE (versión 0 = la primera escritura)
# MAGIC SELECT id_envio, estado, fecha_entrega
# MAGIC FROM envios VERSION AS OF 0
# MAGIC WHERE id_envio IN ('ENV-009', 'ENV-010', 'ENV-011')

# COMMAND ----------

# MAGIC %md
# MAGIC ## 8. Tabla de KPIs (capa "oro")
# MAGIC Guardamos el resumen para que un dashboard o Genie lo pueda consultar.

# COMMAND ----------

kpi_transportista = (
    spark.table("envios")
    .filter(F.col("estado") == "ENTREGADO")
    .groupBy("transportista")
    .agg(
        F.count("*").alias("entregas"),
        F.round(100 * F.avg((F.col("fecha_entrega") <= F.col("fecha_compromiso")).cast("int")), 1).alias("pct_a_tiempo"),
        F.round(F.sum("costo") / F.sum("peso_kg"), 2).alias("costo_por_kg"),
        F.max(F.datediff("fecha_entrega", "fecha_compromiso")).alias("peor_retraso_dias"),
    )
)

kpi_transportista.write.mode("overwrite").saveAsTable("kpi_transportista")
display(spark.table("kpi_transportista"))

# COMMAND ----------

# MAGIC %md
# MAGIC ## 9. (Opcional) Cargar tu propio archivo CSV
# MAGIC 1. Ejecuta la celda de abajo para crear un **volumen** (una carpeta gobernada para archivos).
# MAGIC 2. Ve a **Catalog → workspace → logistica_demo → Volumes → archivos → Upload to this volume** y sube `databricks/datos/envios_ejemplo.csv` de este repo (o un CSV exportado de SAP/Excel).
# MAGIC 3. Ejecuta la celda siguiente.

# COMMAND ----------

spark.sql("CREATE VOLUME IF NOT EXISTS archivos")
print(f"Sube tus archivos a: /Volumes/{CATALOGO}/{ESQUEMA}/archivos/")

# COMMAND ----------

ruta_csv = f"/Volumes/{CATALOGO}/{ESQUEMA}/archivos/envios_ejemplo.csv"

envios_csv = (
    spark.read
    .option("header", True)        # La primera fila tiene los nombres de columna
    .option("inferSchema", True)   # Que Spark adivine los tipos (para producción, mejor define el esquema)
    .csv(ruta_csv)
)

envios_csv.printSchema()
display(envios_csv)

# COMMAND ----------

# MAGIC %md
# MAGIC ## 10. Ejercicios
# MAGIC Intenta resolverlos tú primero. Si te atoras, pídele ayuda a Claude con un prompt como el del final.
# MAGIC
# MAGIC 1. ¿Qué destino tiene el mayor porcentaje de entregas tarde? (hazlo en SQL y en PySpark)
# MAGIC 2. Agrega una columna `rango_peso` con los valores `"<100 kg"`, `"100-200 kg"`, `">200 kg"` (pista: `F.when`).
# MAGIC 3. Haz un `MERGE` que marque `ENV-011` como `ENTREGADO` el `2026-09-10` y revisa el `DESCRIBE HISTORY`.
# MAGIC 4. Usa `RESTORE TABLE envios TO VERSION AS OF 1` y verifica qué cambió.
# MAGIC 5. En la tabla de resultados de `kpi_transportista`, haz clic en **+ → Visualization** y crea una gráfica de barras.
# MAGIC
# MAGIC **Prompt sugerido para Claude:**
# MAGIC > Estoy aprendiendo Databricks (Free Edition, serverless). Tengo la tabla `workspace.logistica_demo.envios` con las columnas id_envio, transportista, origen, destino, fecha_despacho, fecha_compromiso, fecha_entrega, peso_kg, costo, estado. Ayúdame con el ejercicio 2 dándome primero una pista y, si te la pido, la solución en PySpark explicada línea por línea.

# COMMAND ----------

# MAGIC %md
# MAGIC ## Limpieza (opcional)
# MAGIC Descomenta y ejecuta para borrar todo lo que creó este notebook.

# COMMAND ----------

# spark.sql(f"DROP SCHEMA IF EXISTS {CATALOGO}.{ESQUEMA} CASCADE")
