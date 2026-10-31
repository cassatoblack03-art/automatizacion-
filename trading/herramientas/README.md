# Herramientas

`calculadora_riesgo.py`: Python 3.9+ y solo la librería estándar (no hay que instalar nada).

## 1. `tamano`: ¿cuánto opero?

```bash
python3 calculadora_riesgo.py tamano --mercado forex --balance 1000 --riesgo 1 \
    --entrada 1.0850 --stop 1.0820 --tp 1.0880 --tp 1.0910 --apalancamiento 30
```

| Opción | Significado |
|---|---|
| `--mercado` | `forex`, `forex-jpy`, `oro`, `acciones`, `cripto` o `personalizado` (fija el tamaño de contrato y el paso) |
| `--balance` | Saldo de la cuenta |
| `--riesgo` | % de la cuenta que arriesgas (por defecto 1) |
| `--entrada`, `--stop` | Precios. La dirección se deduce: stop por debajo = compra |
| `--tp` | Take profit; se puede repetir. Avisa si el R:B queda por debajo de `--rr-minimo` (por defecto 2) |
| `--contrato` | Unidades por lote (sobrescribe el preset; útil para índices, cuyo contrato cambia según el broker) |
| `--paso` | Incremento mínimo de tamaño (0.01 lotes, 1 acción…) |
| `--conversion` | De la divisa cotizada a la divisa de tu cuenta. Ejemplo: USDJPY a 150 con cuenta en USD → `0.00667` |
| `--apalancamiento` | Solo informa del margen; **no cambia el riesgo** |

El tamaño se redondea siempre **hacia abajo** para no superar nunca tu riesgo. Si sale 0, la herramienta te avisa de que el stop es demasiado amplio para tu cuenta.

## 2. `estadisticas`: ¿cómo voy de verdad?

```bash
python3 calculadora_riesgo.py estadisticas ../plantillas/diario-de-trading.csv
```

Lee el CSV del diario y muestra el winrate, la ganancia y la pérdida media, la expectativa, el profit factor, el máximo drawdown en R y la peor racha. Además separa los resultados **siguiendo / saltándote el plan** y **por setup**.

- Si la columna `resultado_R` está vacía, la calcula con `direccion`, `entrada`, `stop` y `salida`.
- Acepta decimales con coma o con punto.

## 3. `simular`: ¿qué rachas me esperan?

```bash
python3 calculadora_riesgo.py simular --winrate 45 --rr 2 --riesgo 1 --trades 200
```

Simulación Monte Carlo (5.000 secuencias por defecto) con riesgo fijo en %. Muestra la distribución del balance final, el drawdown máximo y la peor racha perdedora. Usa `--semilla` para obtener resultados reproducibles.

## Pruebas

```bash
python3 -m unittest test_calculadora_riesgo -v
```
