# Módulo 4: Estrategia y plan de trading

[← Gestión del riesgo](03-gestion-del-riesgo.md) · [Índice](README.md) · [Siguiente: Cómo analizar una captura →](05-como-analizar-una-captura.md)

**Objetivo:** pasar de "veo cosas en el gráfico" a **reglas escritas tan claras que otra persona podría ejecutarlas igual que tú**. Si una regla necesita "intuición", aún no es una regla.

---

## 1. Qué es tener una "ventaja" (edge)

Una ventaja es un **conjunto de reglas repetibles que, aplicado muchas veces, tiene expectativa positiva**. No es acertar la próxima operación: es ganar en las próximas 100.

Todo setup tiene seis piezas:

| Pieza | Pregunta |
|---|---|
| 1. **Contexto** | ¿A favor de qué tendencia opero? (temporalidad mayor) |
| 2. **Zona** | ¿Dónde espero entrar? (soporte/resistencia, EMA, retroceso) |
| 3. **Gatillo** | ¿Qué tiene que pasar exactamente para entrar? |
| 4. **Stop** | ¿Dónde queda invalidada la idea? |
| 5. **Objetivo** | ¿Dónde salgo con ganancia? ¿Hay espacio para 1:2 como mínimo? |
| 6. **Gestión** | ¿Qué hago mientras la operación está abierta? |

---

## 2. Estrategia de aprendizaje: "Pullback en tendencia" (PET)

Es la base de muchísimas señales que verás en grupos: **comprar retrocesos en tendencia alcista y vender rebotes en tendencia bajista**. Es simple, lógica y te obliga a operar a favor del mercado.

> ⚠️ Es un **marco para aprender y probar**, no un sistema con ganancias garantizadas. Antes de usarla con dinero real tienes que hacer tu propio backtest ([Módulo 7](07-backtesting-y-progresion.md)) en tus activos.

### Reglas (versión compra; para ventas, todo al revés)

**Activos:** EURUSD, GBPUSD, XAUUSD, US500 (líquidos, con spread bajo).
**Temporalidades:** D1 (sesgo) → H4 (zona) → H1 (gatillo).

#### Paso 1: Sesgo en D1 (contexto)
- [ ] El precio está **por encima de la EMA 200** de D1.
- [ ] La estructura de D1 es alcista: el último movimiento relevante hizo **HH** y no se ha roto el último **HL**.
- Si D1 está en rango o es confuso → **no se opera este activo hoy**.

#### Paso 2: Zona en H4
- [ ] El precio está **retrocediendo** después de un impulso alcista (no persigas el precio en mitad del impulso).
- [ ] Llega a una **zona de confluencia**, con al menos **2** de estas:
  - Antigua resistencia convertida en soporte (polaridad).
  - EMA 50 de H4.
  - Retroceso del 50-61,8 % de Fibonacci del último impulso.
  - Número redondo.

#### Paso 3: Gatillo en H1
Uno de estos dos, **con la vela cerrada** (no te adelantes):
- [ ] **Vela de rechazo** (pin bar o envolvente alcista) que cierra **dentro o por encima** de la zona.
- [ ] **Ruptura de la estructura bajista del retroceso** en H1: el precio supera el último LH del retroceso (un CHoCH alcista en H1).

#### Paso 4: Stop
- [ ] Debajo del mínimo del retroceso (o de la zona) **menos 0,5 × ATR(14) de H1**.

#### Paso 5: Objetivo
- [ ] **TP en el último máximo de H4** (el HH previo) o en 2R, lo que esté **más cerca**.
- [ ] **Si el último máximo está a menos de 2R → no hay operación.** No hay espacio.

#### Paso 6: Gestión
- [ ] Riesgo: **0,5-1 %**.
- [ ] Opción simple (recomendada al empezar): **no tocar nada** hasta SL o TP.
- [ ] Si a las **48 horas** la operación no ha avanzado ni 1R, valorar el cierre (la idea no está funcionando).

#### Filtros (no se opera si…)
- [ ] Hay una **noticia de alto impacto** del activo en los próximos 30 minutos.
- [ ] Es **viernes por la tarde** (riesgo de gap el fin de semana) o **domingo en la apertura**.
- [ ] El spread es anormalmente alto.
- [ ] Ya tienes abierta una operación correlacionada (por ejemplo, otra compra en un par con USD como cotizada).
- [ ] Has llegado a tu límite diario de pérdidas.

### Ejemplo descrito (cifras ilustrativas)

> **EURUSD.** D1: precio por encima de la EMA 200, último HH en 1.0950 → sesgo **comprador**.
> H4: retroceso hasta 1.0860-1.0870, antigua resistencia, con la EMA 50 en 1.0865 y el 61,8 % del impulso en 1.0862 → **3 confluencias**.
> H1: envolvente alcista que cierra en 1.0872 → **gatillo**.
> Stop: mínimo del retroceso 1.0852 − 0,5 × ATR (8 pips) = **1.0844** → 28 pips de riesgo.
> Objetivo: el último máximo (1.0950) está a 78 pips → R:B **1:2,8** ✅ hay espacio. Según la regla, el TP va al más cercano de los dos: 2R = **1.0928**.
> Tamaño con 2.000 USD al 1 %: 20 ÷ (28 × 10) = **0,07 lotes**.

---

## 3. Otros setups para más adelante

Domina **uno** primero (unos 3 meses). Después puedes probar:

| Setup | Idea | Cuándo funciona |
|---|---|---|
| **Ruptura y retesteo** | El precio rompe una resistencia, vuelve a probarla como soporte y entras en el retesteo | Al empezar una tendencia o tras un rango largo |
| **Rango** | Compras en el suelo y vendes en el techo de un rango claro | Mercados laterales, sesión asiática |
| **Barrido + reversión** | El precio barre un máximo/mínimo obvio y vuelve dentro del rango con fuerza | En zonas mayores de D1/H4 |

---

## 4. Tu plan de trading

Un plan de trading es **un documento escrito** que responde de antemano a todas las decisiones, para que no tengas que decidir nada en caliente.

👉 Rellena [`plantillas/plan-de-trading.md`](plantillas/plan-de-trading.md). Debe incluir:

1. Por qué haces trading y qué objetivos **de proceso** tienes (no "ganar 1.000 al mes", sino "seguir mi plan en el 95 % de las operaciones").
2. Activos y horarios.
3. Setup(s) con reglas exactas (como el PET de arriba).
4. Reglas de riesgo y límites.
5. Rutina antes, durante y después del mercado.
6. Qué haces tras una racha de pérdidas.
7. Cuándo y cómo revisas el plan (no lo cambies a mitad de semana por una pérdida).

**Regla:** si una operación no cumple el plan, **no se abre**. Si la abres igualmente, se apunta en el diario como **"fuera de plan"**. La calculadora te separará las estadísticas de ambas para que veas cuánto te cuesta saltártelo.

---

## ✍️ Ejercicios del módulo 4

1. Copia la estrategia PET en tu plan y adáptala a tus activos y tu horario.
2. Busca en el histórico **10 operaciones PET válidas** (5 ganadoras y 5 perdedoras). Mándame las capturas de 3 y te digo si cumplían todas las reglas.
3. Busca 5 situaciones que **parecían** un PET pero fallaban algún filtro. ¿Qué habría pasado si hubieras entrado?

[← Gestión del riesgo](03-gestion-del-riesgo.md) · [Índice](README.md) · [Siguiente: Cómo analizar una captura →](05-como-analizar-una-captura.md)
