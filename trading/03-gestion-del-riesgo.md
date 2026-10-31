# Módulo 3: Gestión del riesgo (el módulo que te mantiene vivo)

[← Análisis técnico](02-analisis-tecnico.md) · [Índice](README.md) · [Siguiente: Estrategia y plan →](04-estrategia-y-plan.md)

> Puedes tener un análisis mediocre y sobrevivir con una gran gestión del riesgo.
> Con un análisis brillante y una mala gestión del riesgo, **solo es cuestión de tiempo**.

---

## 1. Las matemáticas de perder

Cuanto más pierdes, más difícil es recuperarte:

| Pérdida | Ganancia necesaria para volver al punto de partida |
|---|---|
| −10 % | +11,1 % |
| −20 % | +25 % |
| −30 % | +42,9 % |
| −40 % | +66,7 % |
| **−50 %** | **+100 %** |
| −70 % | +233 % |
| −90 % | +900 % |

**Conclusión:** tu primer trabajo como trader no es ganar: es **no perder mucho**.

---

## 2. La regla del 1 %

**No arriesgues más del 1 % de tu cuenta en una sola operación.** Mientras aprendes, **0,5 %**.

"Arriesgar el 1 %" **no** significa abrir posiciones con el 1 % de tu dinero. Significa que **si salta el stop, pierdes el 1 % de tu cuenta**.

¿Por qué tan poco? Porque **las rachas de pérdidas llegan siempre**. Esto es lo que te quedaría tras **10 pérdidas seguidas**:

| Riesgo por operación | Cuenta tras 10 pérdidas seguidas |
|---|---|
| **1 %** | **−9,6 %** → molesto, recuperable |
| 2 % | −18,3 % |
| 5 % | −40,1 % → necesitas +67 % para recuperarte |
| 10 % | −65,1 % → prácticamente acabado |

---

## 3. Cómo calcular el tamaño de la posición (la fórmula)

```
Riesgo en dinero   = Saldo × % de riesgo
Tamaño de posición = Riesgo en dinero ÷ (Distancia al stop × Valor del movimiento por unidad)
```

**El orden correcto siempre es:**
1. Defino **dónde va el stop** según el gráfico (donde mi idea queda invalidada).
2. Mido la **distancia** entre entrada y stop.
3. **Calculo el tamaño** para que esa distancia equivalga a mi 1 %.

❌ Nunca al revés ("quiero abrir 1 lote, así que pongo el stop a 10 pips").

### Ejemplo 1: Forex (EURUSD, cuenta en USD)

- Saldo: 1.000 USD · Riesgo: 1 % → **10 USD**
- Compra en 1.0850 · Stop en 1.0820 → **30 pips**
- 1 lote de EURUSD = 10 USD por pip → 30 pips × 10 = 300 USD por lote
- Tamaño = 10 ÷ 300 = 0,033 → **0,03 lotes** (redondea siempre **hacia abajo**)
- Riesgo real: 0,03 × 300 = **9 USD**

### Ejemplo 2: Acciones

- Saldo: 5.000 · Riesgo 1 % → **50**
- Compra en 100 · Stop en 96 → 4 por acción
- Tamaño = 50 ÷ 4 = **12 acciones** (riesgo real: 48)

### Ejemplo 3: Cripto (BTC)

- Saldo: 2.000 · Riesgo 1 % → **20**
- Compra en 68.000 · Stop en 66.640 → 1.360 de distancia
- Tamaño = 20 ÷ 1.360 = **0,0147 BTC** (≈ 1.000 de exposición, sin necesidad de apalancamiento)

### Ejemplo 4: Oro (XAUUSD)

- Saldo: 3.000 · Riesgo 1 % → **30**
- Compra en 2.400 · Stop en 2.394 → 6 USD de distancia
- 1 lote = 100 onzas → cada 1 USD de movimiento = 100 USD por lote → 6 × 100 = 600 por lote
- Tamaño = 30 ÷ 600 = **0,05 lotes**

### Valor por pip/punto con 1 lote (cuenta en USD; confírmalo en tu broker)

| Activo | Valor aproximado |
|---|---|
| EURUSD, GBPUSD, AUDUSD (pares XXXUSD) | 10 USD por pip |
| USDJPY | 1.000 JPY por pip ÷ precio (≈ 6,67 USD a 150) |
| USDCHF, USDCAD | 10 CHF/CAD por pip ÷ precio |
| XAUUSD (oro) | 100 USD por cada 1 USD de movimiento |
| Índices (US500, NAS100, GER40) | **Depende del broker.** Mira la especificación del contrato |

### Con la calculadora

```bash
cd trading/herramientas
python3 calculadora_riesgo.py tamano --mercado forex --balance 1000 --riesgo 1 \
    --entrada 1.0850 --stop 1.0820 --tp 1.0880 --tp 1.0910 --apalancamiento 30
```

```
Operación: COMPRA  |  Entrada 1.085  |  Stop 1.082
Distancia al stop: 0.003  (30.0 pips)
Riesgo permitido:  10.00 (1.0% de 1,000.00)
Pérdida por 1 lote si toca el stop: 300.00
------------------------------------------------------------
TAMAÑO DE POSICIÓN: 0.03 lotes  (exacto: 0.0333)
Riesgo real:       9.00 (0.90%)
Exposición total:  3,255.00
Margen aprox. con 1:30: 108.50
  -> El apalancamiento cambia el margen, NO el riesgo. El riesgo lo fijan el stop y el tamaño.
------------------------------------------------------------
TP 1.088: R:B 1:1.00  ->  +9.00  ⚠️ por debajo de 1:2
TP 1.091: R:B 1:2.00  ->  +18.00
```

Otros mercados: `--mercado acciones`, `--mercado oro`, `--mercado cripto`, `--mercado forex-jpy --conversion 0.00667`, o `--contrato` y `--paso` para lo que diga tu broker.

---

## 4. Pensar en "R"

**1R = lo que arriesgas en una operación.** Si arriesgas 10 USD: ganar 20 USD es **+2R**, perder 10 USD es **−1R**.

Medir en R te permite comparar operaciones y estrategias sin importar el tamaño de la cuenta. **Todos los traders profesionales piensan en R, no en dinero.**

### Ratio riesgo:beneficio (R:B) y winrate de equilibrio

¿Qué porcentaje de aciertos necesitas para no perder?

```
Winrate de equilibrio = 1 ÷ (1 + R:B)
```

| R:B | Winrate necesario para quedar a cero |
|---|---|
| 1:1 | 50 % |
| 1:1,5 | 40 % |
| **1:2** | **33,3 %** |
| 1:3 | 25 % |

Con 1:2 puedes **equivocarte 6 de cada 10 veces** y seguir ganando dinero. Por eso exijo un mínimo de 1:2.

---

## 5. Expectativa matemática: ¿tu estrategia gana dinero?

```
Expectativa (R) = (Winrate × Ganancia media en R) − (% de pérdidas × Pérdida media en R)
```

**Ejemplo A (sano):** winrate 45 %, ganancia media 2R, pérdida media 1R
→ 0,45 × 2 − 0,55 × 1 = **+0,35R por operación**
→ en 100 operaciones ≈ +35R. Arriesgando el 1 %, eso es ≈ +35 % (sin contar el interés compuesto).

**Ejemplo B (la trampa de los grupos de señales):** winrate 75 %, ganancia media 0,25R, pérdida media 1R
→ 0,75 × 0,25 − 0,25 × 1 = **−0,06R por operación**
→ **Aciertas 3 de cada 4 veces… y pierdes dinero.** Muchos grupos presumen de "90 % de acierto" con TPs minúsculos y stops enormes (o sin stop).

> **Un winrate alto no significa nada sin el tamaño medio de las ganancias y las pérdidas.**

---

## 6. Rachas: lo que vas a vivir (sí o sí)

Racha perdedora más larga esperable en 100 operaciones ≈ log(100) ÷ log(1 ÷ % de pérdidas):

| Winrate | Racha perdedora típica en 100 operaciones |
|---|---|
| 50 % | ≈ 7 seguidas |
| 40 % | ≈ 9 seguidas |
| 35 % | ≈ 11 seguidas |

Simúlalo con tu propia estrategia:

```bash
python3 calculadora_riesgo.py simular --winrate 45 --rr 2 --riesgo 1 --trades 200
```

**Lo que enseña la simulación** (5.000 simulaciones de 200 operaciones cada una):

| Escenario | Riesgo | Terminan en pérdida | Drawdown máximo (mediana) | Probabilidad de caer ≥50 % |
|---|---|---|---|---|
| Ventaja clara (45 %, 1:2 → +0,35R) | 1 % | 0,1 % | 8,9 % | 0 % |
| Ventaja pequeña (36 %, 1:2 → +0,08R) | 1 % | 24 % | 16 % | 0 % |
| Ventaja pequeña (36 %, 1:2 → +0,08R) | **5 %** | 35 % | **62 %** | **79 %** |

Fíjate en la última fila: la **misma estrategia** que con un 1 % de riesgo es aguantable, con un 5 % hunde la cuenta a la mitad en 8 de cada 10 casos. Y al empezar **no sabes** si tu ventaja es clara, pequeña o inexistente. Por eso se empieza con riesgo bajo.

---

## 7. Dónde poner el stop

1. **Donde el escenario queda invalidado:** en una compra, debajo del mínimo que no debería romperse (el HL o la zona de soporte).
2. **Con margen:** 0,5-1 × ATR(14) más allá de ese nivel, para que un barrido de liquidez no te saque.
3. **Si el stop lógico es tan amplio que el tamaño sale ridículo o el R:B no llega a 1:2 → no hay operación.** Esperar también es una posición.

### Gestión de la operación abierta

Elige **una** forma y mantenla (y pruébala en el backtest):

- **Simple:** SL y TP fijos (por ejemplo a 2R) y no tocas nada. **Recomendado para empezar**, porque elimina decisiones emocionales.
- **Parcial:** cierras el 50 % en 1R y mueves el stop a la entrada (breakeven); el resto, a 2,5-3R.
- **Trailing:** mueves el stop debajo de cada nuevo HL. Funciona en tendencias, pero te saca a menudo antes de tiempo.

⚠️ Mover el stop a breakeven demasiado pronto suena seguro, pero **convierte muchas ganadoras en operaciones a cero**. Que lo decidan los datos de tu backtest, no el miedo.

---

## 8. Límites que te protegen de ti mismo

| Límite | Valor recomendado |
|---|---|
| Riesgo por operación | 0,5-1 % |
| Pérdida máxima diaria | −2 % o 3 pérdidas seguidas → **cierras por hoy** |
| Pérdida máxima semanal | −5 % → paras hasta la semana siguiente y revisas el diario |
| Drawdown máximo de la cuenta | −10 % → vuelves a demo y revisas la estrategia |
| Riesgo abierto total | Máximo 2-3 % a la vez |
| Correlación | Comprar EURUSD y GBPUSD a la vez es casi **la misma operación dos veces**: cuenta como doble riesgo |

---

## ✍️ Ejercicios del módulo 3

1. Calcula a mano el tamaño de posición de estos casos y compruébalo con la calculadora:
   - Cuenta 2.500 USD, riesgo 1 %, venta en GBPUSD a 1.2700 con stop en 1.2740.
   - Cuenta 800 USD, riesgo 0,5 %, compra en XAUUSD a 2.380 con stop en 2.371.
   - Cuenta 10.000, riesgo 1 %, compra de acciones a 200 con el stop lógico en 190. ¿Cuántas acciones? Si un amigo te dice "compra 50", ¿cuánto estarías arriesgando en realidad?
2. Ejecuta `simular` con tu riesgo previsto y apunta la peor racha y el peor drawdown. **Escribe en tu plan qué harás cuando te ocurra.**
3. Un grupo de señales anuncia "92 % de acierto". ¿Qué dos datos necesitas para saber si eso es bueno? (Respuesta en la sección 5.)

[← Análisis técnico](02-analisis-tecnico.md) · [Índice](README.md) · [Siguiente: Estrategia y plan →](04-estrategia-y-plan.md)
