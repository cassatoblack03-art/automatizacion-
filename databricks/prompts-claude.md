# Prompts para aprender y trabajar con Databricks usando Claude

Copia, rellena lo que está entre `< >` y pega. Mientras más contexto me des, más preciso será el código.

> **Contexto que conviene incluir siempre:** edición (Free Edition / empresa), tipo de cómputo
> (serverless, cluster, SQL warehouse), nombre completo de las tablas (`catalogo.esquema.tabla`)
> y su esquema (la salida de `DESCRIBE TABLE`). **No pegues datos sensibles**: con nombres de
> columna, tipos y unas pocas filas anonimizadas es suficiente.

---

## 1. Entender un concepto
```
Explícame <concepto: ej. "qué es una partición en Spark" / "Unity Catalog" / "Auto Loader">
como si yo supiera Excel y SQL básico pero nunca hubiera usado Databricks.
Usa una analogía de logística, un ejemplo de código mínimo y dime en qué casos NO conviene usarlo.
```

## 2. De Excel / SAP a Databricks
```
En Excel hago esto: <describe la fórmula o proceso, ej. "BUSCARV del código de material contra
el maestro y luego una tabla dinámica de cantidad por centro y mes">.
Mis tablas en Databricks son:
- <catalogo.esquema.tabla1>: <columnas y tipos>
- <catalogo.esquema.tabla2>: <columnas y tipos>
Escríbelo en SQL de Databricks y también en PySpark. Explica cada paso.
```

## 3. Escribir una consulta o transformación
```
Tengo la tabla <catalogo.esquema.tabla> con columnas <lista>.
Necesito <resultado esperado, ej. "OTIF por cliente y semana, considerando a tiempo si
fecha_entrega <= fecha_compromiso y completo si cantidad_entregada >= cantidad_pedida">.
Uso <serverless / SQL warehouse>. Dame la consulta y 2–3 validaciones para revisar que el resultado tenga sentido.
```

## 4. Depurar un error
```
Al ejecutar esta celda en Databricks (<serverless / runtime X>):
<pega el código>
Obtengo este error (completo):
<pega el error con el stack trace>
¿Cuál es la causa? Dame la corrección y explícame cómo evitarlo la próxima vez.
```

## 5. Revisar y optimizar
```
Revisa este notebook de Databricks buscando: errores de lógica, cosas que no funcionan en
serverless, operaciones costosas (toPandas, collect, joins sin filtro, UDFs de Python)
y oportunidades de simplificar. Prioriza los hallazgos por impacto.
<pega el código o indica la ruta en este repo>
```

## 6. Diseñar un pipeline
```
Quiero automatizar <proceso, ej. "el reporte semanal de entregas que hoy armo con 3 exportaciones de SAP">.
Fuentes: <archivos/sistemas, frecuencia, volumen aproximado>.
Salida: <dashboard / tabla / correo>.
Propón un diseño medallion (bronce/plata/oro) con el nombre de cada tabla, sus columnas
principales, las reglas de calidad y cómo programarlo como Job.
```

## 7. Que Claude escriba el notebook en este repo (Claude Code)
```
Crea en databricks/notebooks/ un notebook <nombre> en formato fuente de Databricks que
<objetivo>. Debe funcionar en Free Edition (serverless), usar el catálogo workspace y el
esquema logistica_demo, y tener celdas de markdown explicando cada paso. Súbelo a la rama.
```
Luego en Databricks: tu **Git folder** → **Pull** → ejecutar.

## 8. Datos de prueba
```
Genérame un notebook PySpark que cree datos ficticios realistas de <dominio: ej. inventario
por bodega, órdenes de compra, rutas de reparto> con <N> filas, incluyendo casos raros
(nulos, duplicados, fechas invertidas) para practicar limpieza de datos.
```

## 9. Practicar y certificarme
```
Hazme un quiz de 10 preguntas de opción múltiple estilo <Databricks Certified Data Analyst
Associate / Data Engineer Associate> sobre <tema>. Muéstrame una pregunta a la vez,
espera mi respuesta y explícame por qué es correcta o incorrecta.
```

## 10. Explicar código ajeno
```
Heredé este notebook y no entiendo qué hace. Explícamelo por bloques: qué tablas lee,
qué transforma, qué escribe y qué riesgos ves.
<pega el código>
```

---

### Con el conector de Databricks activo
Si conectas Databricks en <https://claude.ai/customize/connectors>, puedes pedir cosas
que requieren ver tus datos reales:
- *"Lista las tablas del esquema `workspace.logistica_demo` y describe cada una."*
- *"¿Cuál fue el % de entregas a tiempo por transportista el mes pasado?"*
- *"Revisa si `plata_lineas_envio` tiene duplicados por id_pedido + linea."*
