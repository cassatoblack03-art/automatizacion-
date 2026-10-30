# CFDI a Excel

Revisar factura por factura contra el Excel cansa. Esta herramienta lo hace por ti:

1. **Lee todos los XML de CFDI** de una carpeta (versiones 3.3 y 4.0; también
   los que vienen dentro de un `.zip`).
2. **Arma un Excel** con UUID, serie, folio, fechas, RFC y nombre de emisor y
   receptor, subtotal, IVA, retenciones, total, método y forma de pago, y el
   detalle de cada concepto.
3. **Lo compara contra tu Excel de control** y te marca cada factura con un color:

| Estado | Color | Qué significa |
|---|---|---|
| **OK** | Verde | El XML coincide con tu Excel (UUID, folio, RFC, total). |
| **Con diferencias** | Amarillo | Lo encontró, pero algo no coincide. La columna *Diferencias* dice qué, por ejemplo: `Total: XML 9,533.33 / Excel 9,533.00`. |
| **Revisar XML** | Amarillo | Coincide con tu Excel, pero el XML trae un problema (por ejemplo, el total no cuadra con subtotal + impuestos). |
| **No está en tu Excel** | Rojo | Te llegó el XML pero no lo tienes capturado. |
| **Falta el XML** | Naranja | Lo tienes capturado en tu Excel pero no llegó su XML. |

Además revisa cada XML por su cuenta: que el total cuadre, que tenga timbre
(UUID) y que no haya UUID repetidos. Todo se procesa en tu computadora: no se
envía nada a internet.

---

## Instalación (solo la primera vez)

1. **Instala Python** desde <https://www.python.org/downloads/>.
   En Windows, en la primera pantalla del instalador **marca la casilla
   "Add python.exe to PATH"**.
2. **Instala Visual Studio Code** desde <https://code.visualstudio.com/>.
3. **Descarga esta carpeta**: en GitHub, botón verde **Code → Download ZIP**,
   descomprímelo y ubica la carpeta `cfdi-a-excel`.
4. En VS Code: **Archivo → Abrir carpeta…** y elige la carpeta `cfdi-a-excel`
   (esta carpeta, no la de arriba). Si VS Code te sugiere instalar la extensión
   de Python, acepta.
5. Menú **Terminal → Ejecutar tarea… → "CFDI: Instalar lo necesario (solo la primera vez)"**.
6. Para ver cómo funciona: **Terminal → Ejecutar tarea… → "CFDI: Probar con los ejemplos"**.
   Se abrirá un Excel con facturas de prueba.

## Uso diario

1. Copia los XML que te mandaron (o los `.zip` tal como vienen del correo) a
   la carpeta **`xml_entrada`**. Puedes usar subcarpetas.
2. Pon tu Excel de control (`.xlsx`) en la carpeta **`mi_excel`**.
   Si hay varios, se usa el más reciente.
3. En VS Code presiona **`Ctrl + Shift + B`** (en Mac: `Cmd + Shift + B`).
4. Se abre el reporte. Además queda guardado en la carpeta **`reportes`** con
   la fecha y hora.

Cuando termines, puedes vaciar `xml_entrada` para el siguiente lote.

> **Sin VS Code (Windows):** también puedes darle doble clic a `procesar.bat`.

### Qué trae el reporte

| Hoja | Contenido |
|---|---|
| **Resumen** | Cuántas facturas se leyeron, sumas por tipo y moneda, qué columnas de tu Excel se usaron y cuántas facturas hay en cada estado. |
| **Comparación** | Una fila por factura con su estado y color. Los problemas salen arriba. Usa los filtros del encabezado. |
| **Facturas** | Todos los datos de cada XML. En amarillo, las que tienen observaciones. |
| **Conceptos** | Cada producto o servicio de cada factura. |
| **Errores** | Archivos que no se pudieron leer (XML dañado, o que no es un CFDI). |

## Tu Excel de control

No hace falta cambiar tu Excel. La herramienta busca sola la hoja y la fila de
encabezados (aunque tengas un título arriba) y reconoce los nombres más
comunes de columna, sin importar mayúsculas ni acentos:

| Dato | Nombres que reconoce |
|---|---|
| UUID | `UUID`, `Folio fiscal`, `Folio SAT`… |
| Folio | `Folio`, `Factura`, `No. Factura`, `Número de factura`… (acepta `A-0012` = serie A, folio 12) |
| Serie | `Serie` |
| RFC | `RFC`, `RFC Emisor`, `RFC Proveedor`, `RFC Receptor`, `RFC Cliente` |
| Importes | `Total`, `Importe total`, `Importe`, `Monto`, `Subtotal`, `IVA` |

Cada factura se busca primero por **UUID** y, si en tu Excel no está el UUID,
por **serie y folio**. Si dos proveedores usan el mismo folio, se elige el
renglón con el mismo RFC. Los importes se consideran iguales si la diferencia
es de un centavo o menos.

Si alguna columna se llama distinto, díselo así (desde la terminal de VS Code):

```bash
python cfdi_a_excel.py --columna folio="Doc" --columna total="Monto a pagar"
```

Campos válidos: `uuid`, `serie`, `folio`, `rfc_emisor`, `rfc_receptor`, `rfc`,
`subtotal`, `iva`, `total`. Para usar una hoja específica agrega
`--hoja "Octubre"`. Todas las opciones: `python cfdi_a_excel.py --help`.

En Windows escribe `py` en lugar de `python` si `python` no funciona.

## Privacidad

Las carpetas `xml_entrada`, `mi_excel` y `reportes` están excluidas de Git, así
que tus facturas y tu Excel **no se suben a GitHub** aunque hagas commit. Los
archivos de `ejemplos` usan RFC de prueba públicos del SAT.

## Problemas comunes

- **"No se reconoce python / py"**: reinstala Python marcando
  "Add python.exe to PATH" y reinicia VS Code.
- **"Falta instalar openpyxl"**: ejecuta la tarea *CFDI: Instalar lo necesario*.
- **"No pude guardar … ¿Lo tienes abierto en Excel?"**: cierra el reporte en
  Excel y vuelve a correrlo.
- **Tu Excel es `.xls`**: ábrelo en Excel y usa *Guardar como → Libro de
  Excel (.xlsx)*.
- **No encontró una columna**: el mensaje te lista los encabezados que sí
  vio; usa `--columna` con el nombre exacto.

## Para desarrolladores

```bash
python -m unittest discover -s tests -v
```
