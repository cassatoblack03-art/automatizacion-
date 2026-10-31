# Módulo 5: Cómo analizar una captura (el proceso de un trader de señales)

[← Estrategia y plan](04-estrategia-y-plan.md) · [Índice](README.md) · [Siguiente: Psicología y diario →](06-psicologia-y-diario.md)

**Objetivo:** que conozcas **exactamente** lo que hago cuando me llega una captura, para que puedas repetirlo tú. Una señal seria es el **resultado final de un proceso**, no una corazonada.

---

## 1. El proceso en 10 pasos

### Paso 1: Identificar
- ¿Qué **activo** y qué **temporalidad**? ¿Qué **precio actual**? ¿**Fecha y hora**?
- Si falta algo de esto, lo pido. Analizar sin saber la temporalidad es adivinar.

### Paso 2: Contexto mayor (D1)
- ¿Tendencia alcista, bajista o rango?
- ¿Dónde está el precio respecto a la EMA 200 y a las zonas mayores?
- Si solo tengo una captura de M15, **pido la de D1 y H4 antes de opinar**.

### Paso 3: Estructura (H4)
- Marco los últimos HH/HL o LH/LL.
- ¿Estamos en **impulso** (no se persigue) o en **retroceso** (aquí se buscan entradas)?
- ¿Ha habido un BOS reciente (continuación) o un CHoCH (posible giro)?

### Paso 4: Zonas clave
- Máximo 3-4 zonas: soporte mayor, resistencia mayor, la zona donde está el precio ahora.
- **Si el precio está en medio de dos zonas → no hay operación.** Escribo "esperar" y el nivel donde me interesaría.

### Paso 5: Liquidez
- ¿Hay máximos o mínimos iguales (dobles techos o suelos) que funcionen como imán?
- ¿Ha habido un barrido reciente?
- Esto me dice **dónde NO poner el stop** y hacia dónde puede ir el precio.

### Paso 6: Escenarios (si… entonces…)
Siempre dos:
- **Escenario principal:** "Si el precio retrocede a 1.0860-1.0870 y da una vela de rechazo en H1 → compra."
- **Escenario alternativo:** "Si cierra una vela H4 por debajo de 1.0840 → se invalida la idea alcista; vigilar ventas en el rebote."

### Paso 7: Gatillo
¿Qué tiene que pasar **exactamente** para entrar? Una vela de rechazo, una ruptura de estructura en H1, que se active una orden limit…
**Sin gatillo definido no hay señal**, solo una opinión.

### Paso 8: Niveles
- **Entrada:** precio exacto o tipo de orden (mercado / limit / stop).
- **Stop loss:** donde se invalida la idea + margen por ATR.
- **TP1 / TP2:** zonas de liquidez o estructura opuestas.
- **R:B:** si no llega a **1:2** hasta el primer obstáculo serio → **se descarta**.

### Paso 9: Riesgo
- Tamaño de posición con la calculadora (si me das el saldo y el % de riesgo).
- ¿Hay noticias rojas próximas? ¿Correlación con otras operaciones abiertas?

### Paso 10: Redactar la señal
En el formato estándar (abajo). **Siempre con stop, siempre con invalidación, siempre con el porqué.**

---

## 2. Formato de señal estándar

Así es como te voy a devolver cada análisis (y como quiero que tú escribas los tuyos):

```
📊 [ACTIVO] | [TEMPORALIDAD DE ENTRADA] | [COMPRA / VENTA] ([tipo de orden])

🎯 Entrada:   [precio o zona]
🛑 Stop Loss: [precio]  ([distancia] pips/puntos)
✅ TP1:       [precio]  (R:B 1:[x]) → [acción: cerrar 50 % / mover SL…]
✅ TP2:       [precio]  (R:B 1:[x])
💰 Riesgo:    [0,5-1] % de la cuenta → [tamaño] lotes con [saldo]

🧭 Contexto (D1):    [tendencia y zona mayor]
🧱 Estructura (H4):  [fase y nivel clave]
🔫 Gatillo (H1):     [qué ha pasado o qué tiene que pasar]
❌ Invalidación:     [qué anula la idea]
📅 Noticias:         [eventos relevantes o "ninguna"]
⏳ Validez:          [hasta cuándo es válida la orden pendiente]
```

### Señal mala vs. señal buena

❌ **Lo que verás en muchos grupos:**
```
GOLD BUY NOW 🔥🔥
TP 2410 2420 2450
SL 2350
```
Sin contexto, sin el porqué, con un stop de 50 USD y un TP1 a 10 USD (R:B 1:0,2) y sin tamaño de posición. Si aciertan, lo celebran; si fallan, borran el mensaje.

✅ **Lo que debe tener una señal:**
```
📊 XAUUSD | H1 | COMPRA (Buy Limit)

🎯 Entrada:   2.392,00
🛑 Stop Loss: 2.385,50  (6,5 USD)
✅ TP1:       2.405,00  (R:B 1:2)   → cerrar 50 %, SL a la entrada
✅ TP2:       2.418,00  (R:B 1:4)   → último máximo de H4
💰 Riesgo:    1 % → 0,04 lotes con 3.000 USD

🧭 Contexto (D1):    Alcista, precio sobre la EMA 200, último HH en 2.420.
🧱 Estructura (H4):  Retroceso a la zona 2.388-2.395 (antigua resistencia + 61,8 %).
🔫 Gatillo (H1):     Orden limit en la zona (entrada agresiva). Versión conservadora:
                     esperar una vela de rechazo en H1 y entrar al cierre de esa vela.
❌ Invalidación:     Precio por debajo de 2.385,50 (el stop). Un cierre de H4 por debajo
                     de la zona anula el sesgo alcista de corto plazo.
📅 Noticias:         IPC de EE. UU. mañana a las 12:30 UTC → cancelar si no se activa antes.
⏳ Validez:          Hasta hoy a las 20:00 UTC.
```

*(Cifras ilustrativas para enseñar el formato, no una recomendación de operación.)*

---

## 3. Qué captura mandarme

| ✅ Haz esto | ❌ Evita esto |
|---|---|
| Velas japonesas | Gráfico de líneas o Heikin Ashi |
| Que se vean el activo, la temporalidad y la fecha/hora | Recortes donde no se ve qué gráfico es |
| Que se vea el **eje de precios** a la derecha | Zoom extremo sin precios |
| 100-200 velas visibles | 20 velas (sin contexto) o 2.000 (ilegible) |
| D1 + H4 + H1 del mismo activo | Una sola captura de M5 |
| EMA 50/200 como mucho | 6 indicadores superpuestos |
| Tu saldo y tu % de riesgo (si quieres el tamaño) | "¿Compro o vendo?" sin más |

**Cómo hacerla en TradingView:** icono de la cámara (arriba a la derecha) → "Descargar imagen", o Alt+S (Windows) / Option+S (Mac).

---

## 4. Mis limitaciones (para que sepas cómo usar mis análisis)

- **No veo el precio en tiempo real.** La captura es una foto. Para cuando la leas, el precio puede haberse movido. Por eso trabajo con **escenarios y niveles**, no con "entra ya".
- **Puedo leer mal un nivel exacto** si el eje no se ve con nitidez. Comprueba siempre los precios en tu plataforma antes de colocar una orden.
- **No conozco tu situación financiera completa.** Es formación, no asesoramiento personalizado. **La decisión y el riesgo son tuyos.**
- **Habrá análisis que fallen.** Es normal y forma parte del juego. Lo que importa es que el proceso sea correcto y el riesgo esté controlado.

---

## 5. Cuando tú me mandes tu análisis: la rúbrica

A partir de la fase 2 me mandas la captura **con tu análisis** (plantilla en [`plantillas/senal.md`](plantillas/senal.md)) y te puntúo de 0 a 12:

| Criterio | 0 puntos | 1 punto | 2 puntos |
|---|---|---|---|
| **Contexto** | Ignora D1 | Lo menciona | Sesgo correcto y bien justificado |
| **Estructura** | No marca giros | Giros marcados con errores | Fase (impulso/retroceso) bien identificada |
| **Zonas** | En medio de la nada o con 10 líneas | Zona razonable | Zona con confluencias y bien dibujada |
| **Gatillo** | "Entro porque sí" | Gatillo vago | Gatillo concreto y verificable |
| **Riesgo** | Sin stop, o R:B < 1:1 | Stop presente pero mal ubicado | Stop en la invalidación + margen, R:B ≥ 1:2 y tamaño bien calculado |
| **Plan B** | Sin invalidación | Invalidación vaga | Escenario alternativo claro |

- **0-6:** volvemos a repasar los módulos 2 y 3.
- **7-9:** vas bien; sigue practicando.
- **10-12:** listo para el forward test en demo ([Módulo 7](07-backtesting-y-progresion.md)).

**Importante:** la puntuación mide la **calidad del proceso**, no si la operación ganó. Una operación bien planteada puede perder y una mal planteada puede ganar por suerte. Ganar con un mal proceso es lo más peligroso que te puede pasar al empezar, porque refuerza malos hábitos.

---

## ✍️ Ejercicios del módulo 5

1. Esta semana mándame **3 juegos de capturas** (D1 + H4 + H1) **sin tu análisis**. Estudia mi respuesta paso por paso.
2. La semana siguiente, mándame **3 juegos con tu análisis** completo en el formato de señal.
3. Para cada análisis, apunta en tu diario si el escenario principal o el alternativo se cumplió **sin operar**. Llevar esta cuenta de "señales en papel" te entrena gratis.

[← Estrategia y plan](04-estrategia-y-plan.md) · [Índice](README.md) · [Siguiente: Psicología y diario →](06-psicologia-y-diario.md)
