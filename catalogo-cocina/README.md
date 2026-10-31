# Catálogo de Cocina

Catálogo para clientes y lista de precios interna, armados a partir de las capturas de la app de venta a empleados (pestañas **CW & BW** y **Food Prep**).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `salida/catalogo_cocina.pdf` | Catálogo completo para clientes (A4). **No muestra costos.** |
| `salida/catalogo_sartenes_*.png` | Imágenes de sartenes y juegos de sartenes, para WhatsApp o estados. |
| `salida/catalogo_ollas_y_baterias_*.png` | Imágenes de ollas, cazos y baterías. |
| `salida/catalogo_licuadoras_y_mas_*.png` | Imágenes de licuadoras, batidoras y exprimidores. |
| `salida/catalogo_cocina.html` | Versión web del catálogo completo. |
| `salida/precios_internos_cocina.xlsx` | **Solo para ti**: costo, % de aumento, precio de venta, ganancia y margen, con fórmulas. Hojas: Precios, Resumen (por pestaña), Reglas, Pendientes. |
| `productos.csv` | Lista de productos y costos (aquí se agregan productos nuevos). La columna `foto` dice qué archivo de `fotos/` usa cada producto. |
| `fotos/` | Foto de cada producto, recortada de las capturas de la app (fondo blanco, 320×320). |
| `herramientas/` | Scripts con los que se recortaron las fotos (lector de texto + recorte automático; `overrides.json` tiene los recortes hechos a mano). |
| `generar_catalogo.py` | Vuelve a generar todo a partir del CSV. |

Cada tarjeta lleva la foto del producto. Si en la app la foto no se ve (por ejemplo, porque quedó cortada arriba de la captura), sale un ícono con "Foto próximamente".

Las imágenes traen máximo 12 productos cada una (si hay más se parten en _1, _2, ...) para que se lean bien en el celular.

## Cómo se calculó el precio de venta

Aumento por rango de costo (más % en lo barato para que la ganancia en pesos valga la pena, menos % en lo caro para que el precio siga atractivo):

| Costo | Aumento |
|---|---|
| Menos de $300 | +80 % |
| $300 a $699 | +65 % |
| $700 a $1,199 | +55 % |
| $1,200 o más | +45 % |

Después se redondea a precio "de tienda": abajo de $1,000 termina en 9 ($599), arriba termina en 49 o 99 ($1,499).

Además, cada rango tiene un **precio mínimo** (lo que costaría el producto más caro del rango anterior), para que nunca vendas más barato algo que te costó más.

**Productos repetidos:** si dos productos tienen el mismo `nombre_catalogo`, en el catálogo sale solo el que te cuesta menos; el otro aparece en la hoja *Pendientes* del Excel como repetido. Si en realidad son distintos, ponles nombres diferentes en el CSV.

## Para agregar productos o cambiar precios

1. Agrega una fila en `productos.csv` (con su `pestana_app` y, si tienes, el nombre de su foto en `foto`) (o cambia el `costo`). Si quieres un aumento distinto para un producto, pon por ejemplo `0.70` (= +70 %) en `aumento_manual`.
2. Ejecuta `python3 generar_catalogo.py`.

En el Excel también puedes cambiar costos (azul), el aumento manual (amarillo) o las reglas en la hoja **Reglas**, y todo se recalcula solo.
