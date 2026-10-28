# Reporte ejecutivo · Backorder en CMMF viejo → cambio al CMMF nuevo

Proyecto de Power BI (`.pbip`) construido a partir de `BO_CMMF_viejo_a_nuevo_28oct.xlsx`
(corte **28-oct-2026**). Los datos del corte vienen guardados dentro del proyecto, así que
abre sin depender del Excel original.

## Cómo abrirlo

1. Descarga y descomprime `Reporte_BO_CMMF_PBIP.zip` (o esta carpeta completa). Las tres
   piezas deben quedar juntas:
   - `Reporte BO CMMF.pbip`
   - `Reporte BO CMMF.Report/`
   - `Reporte BO CMMF.SemanticModel/`
2. Abre `Reporte BO CMMF.pbip` con **Power BI Desktop** (versión actual).
3. La primera vez los visuales salen vacíos: da clic en **Inicio → Actualizar**. Carga
   los datos del corte en unos segundos, sin pedir credenciales.
4. ¿Quieres un solo archivo para compartir? **Archivo → Guardar como → Archivo de Power BI (.pbix)**.

> Si tu Power BI Desktop es anterior a 2026 y no abre el proyecto, activa en
> **Archivo → Opciones → Características en versión preliminar** las opciones
> *Guardar como Power BI Project (.pbip)* y *Formato de informe mejorado (PBIR)*, y reinicia.

## Páginas

| Página | Qué responde |
|---|---|
| **Resumen ejecutivo** | 6 KPIs ($ BO, piezas, clientes, % con OC vencida, $ listo para cambiar, $ con OC por vencer), $ BO por acción, clientes por estado de OC, canal, producto y **puntos clave** con texto dinámico. |
| **Plan de acción** | $ y líneas por acción (cambiar, solo BO, revisar OV, confirmar con cliente), prioridades por cliente y KAM, urgencia por estado de OC y antigüedad del BO. |
| **Clientes y productos** | Mapa de canal → cliente, $ BO por KAM y mapa de cambio CMMF viejo → nuevo. |
| **Detalle por línea** | Cada línea SAP (OV, línea, OC, fechas, CMMF viejo/nuevo, piezas, $ y qué hacer), lista para exportar. |

Todas las páginas comparten los segmentadores **Canal, KAM, Estado de la OC y Acción**
(sincronizados entre páginas). Además, al dar clic en cualquier barra o segmento se filtra
el resto de la página. Los textos de subtítulos y puntos clave se recalculan con cada filtro.

## Cifras del corte 28-oct-2026

| Cifra | Valor |
|---|---|
| $ backorder en CMMF viejo | $2,118,854.67 |
| Piezas en backorder | 4,991 (50 más ya en picking, que no se cambian) |
| Líneas / OVs / clientes | 77 / 59 / 14 |
| CMMF viejos con BO | 11 de 17 |
| $ con OC vencida | $1,084,380 (51.2 %), 20 líneas por confirmar con el cliente |
| Listo para cambiar ya | $1,027,468 en 55 líneas (52 al CMMF nuevo + 3 solo el BO) |
| OC que vence en ≤7 días | $144,940 en 2 líneas |
| Cliente con más BO | WAL MART, $1,025,600 (48 %), toda con OC vencida |
| Producto con más BO | Plancha con cable retráctil Virtuo 30 (1830009390 → 1830010001), 53 % del BO |

## Actualizar con un corte nuevo

El modelo tiene el parámetro **`RutaExcel`**. Vacío = usa los datos guardados del 28-oct.

1. **Inicio → Transformar datos → Editar parámetros**.
2. En `RutaExcel` pega la ruta completa del Excel nuevo, por ejemplo
   `C:\Reportes\BO_CMMF_viejo_a_nuevo_04nov.xlsx`.
3. **Aceptar → Aplicar cambios** (o **Actualizar**).

El Excel debe tener la misma estructura: hoja **`Por linea SAP`** (encabezados desde la
columna `CANAL`) y hoja **`Por CMMF`** (encabezados desde `CMMF VIEJO`). La fila `TOTAL` se
ignora sola y la fecha de corte se calcula de los datos (`FECHA PEDIDO + DIAS`).

## Modelo de datos

- **BO Lineas**: una fila por línea SAP con BO, con columnas derivadas *Cliente Corto*,
  *Estado OC* (Vencida / Vence en 7 días / Vigente), *Acción*, *Antigüedad BO* y
  *Días para cancelar OC*.
- **Productos CMMF**: la lista de 17 CMMF viejo → nuevo, relacionada por *CMMF Viejo*.
- **Medidas**: 44 medidas DAX en carpetas (KPIs, por acción, textos dinámicos).
- **Puntos Clave**: tabla auxiliar para el panel de puntos clave.

## Regenerar el proyecto (opcional)

`generador/generar_pbip.py` reconstruye todo el proyecto desde un Excel con la misma
estructura (requiere Python 3 y `openpyxl`):

```bash
python generador/generar_pbip.py "BO_CMMF_viejo_a_nuevo_28oct.xlsx" .
```
