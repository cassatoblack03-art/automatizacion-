# Módulo 2: Análisis técnico

[← Fundamentos](01-fundamentos.md) · [Índice](README.md) · [Siguiente: Gestión del riesgo →](03-gestion-del-riesgo.md)

**Objetivo:** leer un gráfico como lo hago yo cuando me llega una captura: **contexto → estructura → zonas → gatillo**. Los indicadores van al final, y en dosis pequeñas.

---

## 1. Velas japonesas

```
      │  ← mecha superior: hasta dónde subió el precio y fue rechazado
    ┌─┴─┐
    │   │ ← cuerpo: diferencia entre apertura y cierre
    │   │   (verde/blanco = cerró arriba · rojo/negro = cerró abajo)
    └─┬─┘
      │  ← mecha inferior: hasta dónde bajó y fue rechazado
```

**Qué te dice una vela:** quién ganó la batalla en ese periodo.

- Cuerpo grande y mechas pequeñas → **convicción**.
- Mecha larga → **rechazo** de ese precio.
- Cuerpo diminuto (doji) → **indecisión**.

### Patrones de velas que sí uso

| Patrón | Aspecto | Lectura |
|---|---|---|
| **Pin bar / martillo** | Mecha larga (≥2 veces el cuerpo) en un extremo | Rechazo fuerte. Alcista si la mecha está abajo, en un soporte |
| **Envolvente** | El cuerpo de la vela cubre entero el cuerpo de la anterior | Cambio de control. Muy fiable **en zona** |
| **Inside bar** | Vela entera dentro del rango de la anterior | Compresión, suele preceder a un movimiento |
| **Doji** | Apertura ≈ cierre | Indecisión. Solo, no dice nada |

> **Regla clave:** un patrón de vela **solo tiene valor en una zona importante y a favor del contexto**. Un martillo en medio de la nada no significa nada.

---

## 2. Estructura del mercado (lo más importante del módulo)

El precio se mueve en **impulsos y retrocesos**. La secuencia de máximos y mínimos te dice quién manda.

```
TENDENCIA ALCISTA                    TENDENCIA BAJISTA
(máximos y mínimos crecientes)       (máximos y mínimos decrecientes)

            HH                       LH
           /\                        /\
     HH   /  \                      /  \    LH
     /\  /    \  ← retroceso       /    \   /\
    /  \/      HL                 /      \ /  \
   /   HL                               LL     \
  /                                             LL
 HH = Higher High (máximo más alto)   LH = Lower High (máximo más bajo)
 HL = Higher Low  (mínimo más alto)   LL = Lower Low  (mínimo más bajo)
```

- **Alcista:** HH + HL → busco **compras** en los retrocesos (en los HL).
- **Bajista:** LH + LL → busco **ventas** en los rebotes (en los LH).
- **Rango:** el precio rebota entre un techo y un suelo → compro abajo y vendo arriba, o espero la ruptura.

### Ruptura de estructura y cambio de carácter

Vas a leer estas siglas en todos los grupos de señales:

- **BOS (Break of Structure):** el precio supera el último máximo en una tendencia alcista (o el último mínimo en una bajista). **La tendencia continúa.**
- **CHoCH (Change of Character):** en una tendencia alcista, el precio rompe por debajo del **último HL**. **Primera señal de que la tendencia puede estar cambiando.** No es una confirmación: es una alerta.

```
    HH                    El precio rompe el último HL
    /\    HH              → CHoCH: posible cambio a bajista
   /  \   /\
  /    \ /  \
 /      HL   \
              \ ← rompe aquí
               \
```

**Cómo marcar la estructura sin volverte loco:** usa solo los **giros claros** (los que se ven sin hacer zoom). Si dudas de si un punto es un giro, no lo es.

---

## 3. Soportes y resistencias

- **Soporte:** zona donde históricamente aparecieron compradores (el precio rebotó hacia arriba).
- **Resistencia:** zona donde aparecieron vendedores.
- **Cambio de polaridad:** una resistencia rota suele convertirse en soporte, y al revés. **Es uno de los conceptos más rentables que existen.**

```
 ────────────── resistencia ──╮      ╭───── ahora es SOPORTE
        /\        /\          │ /\  /
       /  \      /  \         │/  \/  ← retesteo: zona de compra
      /    \    /    \       /│
     /      \  /      \     / │
```

### Cómo dibujarlos bien

1. **Empieza en la temporalidad mayor** (D1 o H4). Los niveles de M5 no los respeta nadie.
2. Dibuja **zonas (rectángulos), no líneas finas**: el precio no es un láser.
3. Busca zonas con **varias reacciones claras** o donde arrancó un **movimiento fuerte**.
4. **Números redondos** (1.1000, 2400, 5000): atraen órdenes.
5. **Máximo 3-4 zonas por gráfico.** Si tienes 15 líneas, no tienes ninguna.

---

## 4. Análisis multi-temporal ("top-down")

El mismo activo cuenta historias distintas en cada temporalidad. Siempre de arriba abajo:

| Temporalidad | Para qué | Pregunta que respondes |
|---|---|---|
| **Diario (D1)** | **Contexto / sesgo** | ¿Tendencia alcista, bajista o rango? ¿Cerca de qué zona mayor estamos? |
| **4 horas (H4)** | **Estructura y zonas** | ¿Dónde están los soportes/resistencias operables? ¿En qué fase estamos: impulso o retroceso? |
| **1 hora / 15 min (H1/M15)** | **Gatillo de entrada** | ¿El precio está confirmando la reacción en mi zona? |

Proporción orientativa entre temporalidades: de 4 a 6 veces (D1 → H4 → H1, o H4 → H1 → M15).

> **El error número uno de los principiantes:** ver una señal de compra en M5 mientras el diario cae a plomo. **La temporalidad mayor manda.**

---

## 5. Liquidez: por qué el precio "va a por tus stops"

Encima de los máximos evidentes y debajo de los mínimos evidentes se acumulan **órdenes stop** (stops de quienes están en contra y órdenes de ruptura). Esas órdenes son **liquidez**: los participantes grandes la necesitan para ejecutar sus posiciones.

- **Barrido de liquidez (sweep / stop hunt):** el precio rompe un máximo o mínimo obvio, salta los stops y **vuelve rápido** dentro del rango. Muchas veces es el inicio del movimiento contrario.
- **Falsa ruptura:** igual, pero vista desde quien compró la ruptura.

```
         barrido ↓ (mecha rompe el máximo y cierra dentro)
    ─ ─ ─ ─ ─ ─ ─│─ ─ ─ máximo igual / doble techo
      /\    /\   │
     /  \  /  \ /│\
    /    \/    V   \  ← vuelve dentro del rango: posible venta
                    \
```

**Consecuencias prácticas:**
1. **No pongas tu stop justo en el máximo o mínimo obvio.** Ponlo **más allá**, con un margen (ver ATR más abajo).
2. Una ruptura que **cierra la vela** fuera del nivel vale más que una mecha.

> **Sobre "Smart Money Concepts" (SMC/ICT):** order blocks, FVG, liquidez... Es vocabulario útil para describir lo que hace el precio, pero se vende con mucho marketing. Todo lo que funciona de ahí se reduce a: **estructura + zonas + liquidez + gestión del riesgo**, que es lo que estás aprendiendo aquí.

---

## 6. Patrones chartistas clásicos

| Patrón | Señal | Objetivo aproximado (proyección) |
|---|---|---|
| **Doble techo / doble suelo** | Agotamiento de tendencia | Altura del patrón proyectada desde la ruptura de la "línea de cuello" |
| **Hombro-cabeza-hombro (HCH)** | Cambio de tendencia | Distancia de la cabeza al cuello, proyectada |
| **Triángulos** | Compresión → ruptura | Altura de la base del triángulo |
| **Banderas / banderines** | Pausa dentro de una tendencia fuerte | Longitud del mástil (el impulso previo) |

Ojo: un patrón **no está completo hasta que rompe**. Un "doble techo" sin ruptura del cuello es solo un rango.

---

## 7. Indicadores: pocos y bien usados

| Indicador | Uso práctico | Ajuste habitual |
|---|---|---|
| **EMA 200** | Filtro de tendencia: precio por encima → priorizo compras | 200 en D1/H4 |
| **EMA 50 / EMA 20** | Zonas dinámicas de retroceso en tendencias | 50 en H4, 20 en H1 |
| **RSI** | Fuerza del movimiento y **divergencias** (el precio hace un nuevo máximo y el RSI no) | 14 |
| **ATR** | Volatilidad media → **para colocar stops con margen** | 14. Stop = nivel ± 0,5 a 1 × ATR |
| **Volumen** | Confirma rupturas (en acciones y futuros; en forex es volumen de ticks, menos fiable) | |

**Reglas:**
- **Máximo 2-3 indicadores.** Más indicadores no dan más precisión: dan más contradicciones.
- **RSI por encima de 70 no significa "vender".** En tendencias fuertes el RSI pasa mucho tiempo sobrecomprado.
- Los indicadores **se calculan a partir del precio**: van por detrás. La estructura va primero.

---

## 8. El mínimo de análisis fundamental

No necesitas ser economista, pero **sí tienes que mirar el calendario económico** cada día (Forex Factory, Investing.com o el de TradingView).

Noticias de **alto impacto** (las "rojas"):
- **NFP** (empleo de EE. UU., normalmente el primer viernes de mes)
- **IPC / CPI** (inflación)
- **Decisiones de tipos de interés** (Fed/FOMC, BCE, BoE, BoJ) y sus ruedas de prensa
- PIB, PMI y datos de ventas minoristas

**Regla:** no abras operaciones entre unos 30 minutos antes y 30 minutos después de una noticia roja que afecte a tu activo. El spread se dispara, hay slippage y el movimiento es aleatorio.

---

## ✍️ Ejercicios del módulo 2

1. **Estructura:** elige 10 gráficos D1 de tus activos (distintas fechas) y marca HH/HL/LH/LL. Escribe en cada uno: alcista, bajista o rango.
2. **Zonas:** en esos 10 gráficos dibuja **máximo 3 zonas** en H4. Mándame 3 capturas y te las corrijo.
3. **Polaridad:** encuentra 5 ejemplos de resistencia rota que funcionó como soporte (y 5 en que falló). Apunta qué tenían de distinto.
4. **Barridos:** encuentra 5 barridos de liquidez en H1 y mira qué hizo el precio en las 10 velas siguientes.
5. **Calendario:** durante una semana, apunta cada noticia roja y cuánto se movió tu activo en los 30 minutos siguientes.

[← Fundamentos](01-fundamentos.md) · [Índice](README.md) · [Siguiente: Gestión del riesgo →](03-gestion-del-riesgo.md)
