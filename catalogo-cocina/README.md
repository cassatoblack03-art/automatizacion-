# Catálogo de Cocina (Food Prep)

Catálogo para clientes y lista de precios interna, armados a partir de las capturas de la app de venta a empleados (pestaña **Food Prep**).

## Archivos

| Archivo | Para qué sirve |
|---|---|
| `salida/catalogo_food_prep.pdf` | Catálogo para mandar a clientes (A4, 2 páginas). **No muestra costos.** |
| `salida/catalogo_food_prep.png` | El mismo catálogo en una sola imagen, para WhatsApp o estados. |
| `salida/catalogo_food_prep.html` | Versión web del catálogo. |
| `salida/precios_internos_food_prep.xlsx` | **Solo para ti**: costo, % de aumento, precio de venta, ganancia y margen, con fórmulas. |
| `productos.csv` | Lista de productos y costos (aquí se agregan productos nuevos). |
| `generar_catalogo.py` | Vuelve a generar todo a partir del CSV. |

## Cómo se calculó el precio de venta

Aumento por rango de costo (más % en lo barato para que la ganancia en pesos valga la pena, menos % en lo caro para que el precio siga atractivo):

| Costo | Aumento |
|---|---|
| Menos de $300 | +80 % |
| $300 a $699 | +65 % |
| $700 a $1,199 | +55 % |
| $1,200 o más | +45 % |

Después se redondea a precio "de tienda": abajo de $1,000 termina en 9 ($599), arriba termina en 49 o 99 ($1,499).

## Para agregar productos o cambiar precios

1. Agrega una fila en `productos.csv` (o cambia el `costo`). Si quieres un aumento distinto para un producto, pon por ejemplo `0.70` (= +70 %) en `aumento_manual`.
2. Ejecuta `python3 generar_catalogo.py`.

En el Excel también puedes cambiar costos (azul), el aumento manual (amarillo) o las reglas en la hoja **Reglas**, y todo se recalcula solo.
