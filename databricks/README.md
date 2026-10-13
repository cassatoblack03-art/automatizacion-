# Databricks desde cero (con Claude como copiloto)

Guía práctica en español para entender **qué es Databricks, cómo funciona por dentro y cómo usarlo**,
más una sección sobre **cómo apoyarte en Claude** para aprender y trabajar más rápido.

Contenido de esta carpeta:

| Archivo | Para qué sirve |
|---|---|
| `README.md` | Esta guía (teoría + recorrido práctico) |
| `notebooks/01_primeros_pasos.py` | Notebook de Python: crear tablas, transformar, MERGE, historial de versiones |
| `notebooks/02_medallion_sql.sql` | Notebook de SQL: pipeline bronce → plata → oro con datos de ejemplo de Databricks |
| `datos/envios_ejemplo.csv` | CSV pequeño para practicar la carga de tus propios archivos |
| `prompts-claude.md` | Plantillas de prompts para pedirle ayuda a Claude con Databricks |

---

## 1. ¿Qué es Databricks?

Databricks es una **plataforma en la nube para trabajar con datos**: guardarlos, limpiarlos,
transformarlos, analizarlos, hacer dashboards y entrenar modelos de IA, todo en un mismo lugar.
La crearon en 2013 los autores de **Apache Spark** y funciona sobre AWS, Azure o Google Cloud.

Una forma sencilla de ubicarlo:

| Herramienta | Cuántos datos aguanta | Para qué |
|---|---|---|
| Excel | Hasta ~1 millón de filas | Análisis manual, reportes pequeños |
| Base de datos (SQL Server, MySQL…) | Millones de filas | Sistemas transaccionales (ERP, SAP) |
| **Databricks (lakehouse)** | Miles de millones de filas | Juntar datos de muchas fuentes, automatizar procesos, analítica e IA |

Databricks llama a su enfoque **"lakehouse"**: combina lo barato y flexible de un *data lake*
(archivos en la nube) con el orden y la confiabilidad de un *data warehouse* (tablas con SQL).

## 2. Cómo funciona por dentro

```
               ┌──────────────────────────────────────────────┐
  Tú (navegador│  PLANO DE CONTROL (lo administra Databricks) │
  o Claude) ──►│  Workspace · Notebooks · Jobs · Unity Catalog│
               └───────────────────────┬──────────────────────┘
                                       │ manda a ejecutar
               ┌───────────────────────▼──────────────────────┐
               │  CÓMPUTO (clusters / serverless)             │
               │  Apache Spark reparte el trabajo en muchas   │
               │  máquinas que procesan en paralelo           │
               └───────────────────────┬──────────────────────┘
                                       │ lee / escribe
               ┌───────────────────────▼──────────────────────┐
               │  ALMACENAMIENTO en la nube (S3, ADLS, GCS)   │
               │  Archivos Parquet + registro Delta Lake      │
               └──────────────────────────────────────────────┘
```

Las cuatro piezas que tienes que entender:

1. **Almacenamiento separado del cómputo.** Los datos viven como archivos en la nube. Las máquinas
   que los procesan se prenden solo cuando las necesitas, y por eso pagas el cómputo por uso.
2. **Apache Spark** es el motor. Divide una tabla grande en pedazos (*particiones*) y los procesa
   en paralelo en varias máquinas. Tú escribes SQL o Python normal y Spark se encarga de repartir el trabajo.
3. **Delta Lake** es el formato de las tablas. Encima de archivos Parquet guarda un registro de
   transacciones (`_delta_log`), y gracias a eso tienes:
   - Transacciones ACID: una carga a medias no deja la tabla corrupta.
   - `UPDATE`, `DELETE` y `MERGE`, igual que en una base de datos.
   - **Time travel**: consultar la tabla como estaba ayer o en la versión 3.
4. **Unity Catalog** es el gobierno: organiza los datos y controla quién ve qué.
   Toda tabla tiene un nombre de 3 niveles:

   ```
   catalogo.esquema.tabla        →   workspace.logistica_demo.envios
   ```

   Los archivos sueltos (CSV, Excel, PDF) se guardan en **volúmenes**:
   `/Volumes/catalogo/esquema/volumen/archivo.csv`

## 3. Glosario esencial

| Concepto | Qué es | Analogía |
|---|---|---|
| **Workspace** | Tu espacio de trabajo en Databricks (carpetas, notebooks, etc.) | Tu escritorio |
| **Notebook** | Documento con celdas de código (Python, SQL) y texto que se ejecutan una por una | Un Excel donde cada celda es código |
| **Compute / Cluster** | Las máquinas que ejecutan tu código | El motor del carro |
| **Serverless** | Cómputo que Databricks prende y apaga por ti, sin configurar nada | Un taxi en vez de carro propio |
| **SQL Warehouse** | Cómputo especializado en consultas SQL y dashboards | Motor afinado solo para SQL |
| **DataFrame** | Una tabla en memoria con la que trabajas desde Python (PySpark) | Una hoja de Excel en código |
| **Delta table** | Tabla guardada en formato Delta (el formato por defecto) | Un archivo de Excel con historial de cambios |
| **Unity Catalog** | Catálogo central de datos y permisos | El índice de una biblioteca, con control de acceso |
| **Volume** | Carpeta gobernada para archivos (CSV, JSON, imágenes) | Una carpeta compartida con permisos |
| **Job** (Lakeflow Jobs) | Ejecución programada de notebooks/scripts, con dependencias | Una tarea programada de Windows, pero con pasos |
| **Pipeline** (Lakeflow Declarative Pipelines, antes *Delta Live Tables*) | Defines qué tablas quieres y Databricks gestiona el orden, la calidad y las cargas incrementales | Una receta que se cocina sola |
| **Auto Loader** | Detecta archivos nuevos en una carpeta y los carga de forma incremental | Un buzón que procesa cada carta que llega |
| **Databricks SQL / Dashboards** | Editor SQL y tableros visuales (AI/BI Dashboards) | Power BI dentro de Databricks |
| **Genie** | Espacio donde usuarios de negocio preguntan en lenguaje natural sobre tablas | "Pregúntale a tus datos" |
| **Databricks Assistant** | Asistente de IA integrado en notebooks y en el editor SQL | Un copiloto dentro de la herramienta |
| **Git folders** | Conectar una carpeta del workspace a un repositorio de GitHub | Sincronizar con este repo |

## 4. La arquitectura medallion (bronce → plata → oro)

Es la forma estándar de organizar un proyecto de datos en Databricks:

```
 Fuentes (SAP, Excel, APIs, WMS/TMS)
        │
        ▼
 ┌────────────┐     ┌────────────────┐     ┌──────────────────┐
 │  BRONCE    │ ──► │  PLATA         │ ──► │  ORO             │ ──► Dashboards, Genie,
 │  Datos     │     │  Limpios,      │     │  KPIs listos     │     reportes, modelos
 │  crudos,   │     │  tipados,      │     │  para negocio    │
 │  tal cual  │     │  sin duplicados│     │  (agregados)     │
 └────────────┘     └────────────────┘     └──────────────────┘
```

Un ejemplo de logística:

- **Bronce:** extracción diaria de entregas de SAP, tal como viene (con columnas `VBELN`, `LFDAT`…).
- **Plata:** columnas renombradas (`id_entrega`, `fecha_entrega`), fechas convertidas, duplicados quitados,
  y columnas calculadas como `dias_retraso`.
- **Oro:** `kpi_otif_por_transportista_mensual`, la tabla que alimenta el dashboard ejecutivo.

El notebook `02_medallion_sql.sql` construye exactamente este flujo.

## 5. Empezar gratis: Databricks Free Edition

1. Entra a <https://www.databricks.com/learn/free-edition> y regístrate (es gratis y no pide
   tarjeta). Reemplazó a la antigua *Community Edition*.
2. Tienes un workspace con **cómputo serverless** (no hay que configurar clusters), el catálogo
   `workspace` con el esquema `default`, y el catálogo **`samples`** con datos de ejemplo.
   Tiene cuotas de uso: sirve para aprender y practicar, no para producción.
3. Recorrido por la barra lateral (los nombres pueden variar un poco con las actualizaciones):
   - **Workspace**: tus carpetas y notebooks.
   - **Catalog**: explorar catálogos, esquemas, tablas y volúmenes (aquí subes archivos).
   - **Jobs & Pipelines**: automatizaciones.
   - **SQL Editor / Queries / Dashboards / Genie**: la parte de analítica.
   - **Compute**: el cómputo (en Free Edition es serverless).

### Traer los notebooks de este repo a Databricks

**Opción A, con Git (recomendada):**
`Workspace` → `Create` → `Git folder` → pega la URL de este repositorio → elige la rama.
Los notebooks de `databricks/notebooks/` aparecen listos para ejecutar. Cuando Claude haga cambios
y los suba a GitHub, en Databricks solo das **Pull** para traerlos.

**Opción B, importar a mano:**
`Workspace` → clic derecho en una carpeta → `Import` → sube el archivo `.py` o `.sql`.

## 6. Primeros comandos: SQL y Python lado a lado

En un notebook puedes mezclar lenguajes. Las celdas que empiezan con `%sql` son SQL y las demás,
el lenguaje del notebook. La variable `spark` ya viene creada.

| Tarea | SQL | Python (PySpark) |
|---|---|---|
| Leer una tabla | `SELECT * FROM samples.tpch.orders` | `df = spark.table("samples.tpch.orders")` |
| Ver resultados | (se muestra solo) | `display(df)` |
| Filtrar | `WHERE o_totalprice > 1000` | `df.filter("o_totalprice > 1000")` |
| Agrupar | `GROUP BY o_orderstatus` | `df.groupBy("o_orderstatus").count()` |
| Leer CSV | `SELECT * FROM read_files('/Volumes/.../archivo.csv', format => 'csv', header => true)` | `spark.read.csv(ruta, header=True, inferSchema=True)` |
| Guardar tabla | `CREATE TABLE t AS SELECT ...` | `df.write.saveAsTable("cat.esq.t")` |
| Ver historial | `DESCRIBE HISTORY t` | `spark.sql("DESCRIBE HISTORY t")` |

**Regla de oro:** si sabes SQL, ya puedes hacer el 80% del trabajo en Databricks.
Python sirve para lo que SQL no hace cómodo: leer APIs, lógica compleja, ML.

### Spark es "perezoso" (lazy)

Las transformaciones (`filter`, `select`, `groupBy`) **no se ejecutan** cuando las escribes. Spark
arma un plan y lo ejecuta recién cuando pides un resultado (`display`, `count`, `write`).
Por eso una celda con transformaciones termina al instante y la que muestra el resultado es la que tarda.

## 7. Delta Lake en la práctica

```sql
-- Upsert: actualiza lo que existe e inserta lo nuevo (típico para cargas diarias)
MERGE INTO envios AS destino
USING actualizaciones AS origen
ON destino.id_envio = origen.id_envio
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;

-- ¿Quién cambió qué y cuándo?
DESCRIBE HISTORY envios;

-- Consultar la tabla como estaba antes (time travel)
SELECT * FROM envios VERSION AS OF 0;

-- Me equivoqué: regresar a una versión anterior
RESTORE TABLE envios TO VERSION AS OF 1;
```

Mantenimiento (en tablas administradas por Unity Catalog, la *predictive optimization* suele
encargarse sola): `OPTIMIZE` compacta archivos pequeños y `VACUUM` borra archivos viejos que ya no se usan.

## 8. Automatizar: de notebook a proceso diario

1. Haces que el notebook funcione de principio a fin, sin pasos manuales.
2. **Jobs & Pipelines → Create job** → agregas el notebook como tarea.
3. Si hay varios pasos (bronce → plata → oro), agregas tareas con dependencias.
4. Configuras un **schedule** (ej. todos los días 6:00 a.m.) y alertas por correo si falla.
5. Nivel siguiente: **Databricks Asset Bundles** para definir jobs como código (YAML) y desplegarlos
   desde GitHub con CI/CD. Claude te puede ayudar a escribirlos.

## 9. Errores típicos de principiante

| Error / síntoma | Causa probable | Solución |
|---|---|---|
| `TABLE_OR_VIEW_NOT_FOUND` | Falta el catálogo/esquema o está mal escrito | Usa el nombre completo `catalogo.esquema.tabla` o `USE CATALOG` / `USE SCHEMA` |
| `PERMISSION_DENIED` | No tienes permiso en Unity Catalog | Pide `USE CATALOG`, `USE SCHEMA` y `SELECT` al administrador |
| `toPandas()` se cuelga o falla por memoria | Traes millones de filas a una sola máquina | Agrega o filtra en Spark primero; usa `toPandas()` solo con resultados pequeños |
| Fechas que salen `null` | El formato del texto no coincide | `to_date(col, 'dd/MM/yyyy')` con el formato correcto |
| `DIVIDE_BY_ZERO` | El modo ANSI está activo (por defecto) | Usa `try_divide(a, b)` |
| Celdas que corren en el orden equivocado | Ejecutaste celdas sueltas | **Run all** antes de dar algo por bueno |
| `sc` / `.rdd` / `.cache()` no funcionan | En serverless no están soportados | Usa la API de DataFrame / SQL |

## 10. Ruta de aprendizaje sugerida (4 semanas)

| Semana | Objetivo | Práctica |
|---|---|---|
| 1 | Moverte en la interfaz, SQL sobre `samples` | Notebook `01_primeros_pasos.py` + consultas propias en el SQL Editor |
| 2 | PySpark básico, cargar tus archivos (CSV de SAP/Excel) | Subir un CSV a un volumen y crear una tabla plata |
| 3 | Medallion + Jobs | Notebook `02_medallion_sql.sql` y programarlo como Job |
| 4 | Dashboards y Genie | Dashboard de KPIs logísticos sobre la tabla oro |

Después: los cursos gratuitos de **Databricks Academy** y, si te interesa certificarte,
**Data Analyst Associate** (si te gusta más SQL y los dashboards) o
**Data Engineer Associate** (si te gustan más los pipelines y la automatización).

---

## 11. Cómo usar a Claude para aprender y trabajar con Databricks

Hay cuatro formas de trabajar conmigo, de la más simple a la más integrada:

### a) Como tutor y generador de código (funciona ya, en cualquier chat)
- **Explicar conceptos** con analogías y ejemplos de tu industria.
- **Escribir código** SQL o PySpark a partir de una descripción en español.
- **Traducir** lógica de Excel (BUSCARV, tablas dinámicas, SUMAR.SI) o de transacciones SAP a SQL de Databricks.
- **Depurar**: pegas el error completo y el código, y te explico la causa y cómo arreglarlo.
- **Revisar y optimizar**: encontrar joins costosos, `toPandas()` peligrosos, lógica duplicada.
- **Crearte ejercicios y quizzes**, por ejemplo para preparar una certificación.

### b) Escribiendo el código directamente en GitHub (esta sesión, Claude Code)
1. Me pides un notebook o un cambio, por ejemplo: *"crea un notebook que calcule el OTIF por cliente"*.
2. Lo escribo, lo pruebo hasta donde se puede fuera de Databricks y lo subo a este repositorio.
3. En Databricks, en tu **Git folder**, das **Pull** y lo ejecutas.
4. Si falla, me pegas el error y lo corrijo.

Así se crearon los notebooks de esta carpeta.

### c) Conectado a tu workspace (conector de Databricks)
Con el conector de Databricks activo en Claude, puedo **explorar tu catálogo, ver los esquemas de
tus tablas y ejecutar consultas** directamente, sin que copies y pegues. Se configura en
<https://claude.ai/customize/connectors>, y después hay que abrir una sesión nueva.
Las skills de datos que tienes instaladas (`/data:write-query`, `/data:explore-data`,
`/data:analyze`, `/data:build-dashboard`) también aprovechan esa conexión.

Si trabajas con Claude Code en tu computadora, otra opción es la **Databricks CLI**
(`databricks auth login`, `databricks bundle deploy`, `databricks jobs run-now`…). Con ella puedo
desplegar y lanzar jobs desde la terminal.

### d) Claude dentro de Databricks
Databricks ofrece modelos Claude en **Model Serving** (busca los endpoints `databricks-claude-*`
en la sección *Serving*). Con la función SQL `ai_query()` puedes, por ejemplo, clasificar
comentarios de entregas fallidas directamente en una consulta:

```sql
SELECT id_envio,
       ai_query('<nombre-del-endpoint-claude>',
                CONCAT('Clasifica el motivo de esta incidencia en una palabra: ', comentario)) AS motivo
FROM incidencias_entregas;
```

(Verifica la disponibilidad en tu workspace y región: Free Edition tiene límites en Model Serving.)

### Buenas prácticas al pedirme ayuda
- **Dame contexto:** qué edición usas (Free Edition/serverless), los nombres de catálogo y esquema,
  y la salida de `DESCRIBE TABLE` de las tablas involucradas.
- **Comparte el esquema, no los datos sensibles.** Para que el código salga bien me basta con nombres
  de columnas, tipos y 3–5 filas de ejemplo anonimizadas.
- **Pega el error completo**, no solo la última línea.
- **Pide explicaciones**, no solo código: *"explícame línea por línea"* es la forma de aprender.
- **Verifica**: compara conteos y totales contra tu fuente (SAP, Excel) antes de confiar en un resultado.

En [`prompts-claude.md`](prompts-claude.md) tienes plantillas listas para copiar.
