# Módulo 1: Fundamentos

[← Índice](README.md) · [Siguiente: Análisis técnico →](02-analisis-tecnico.md)

**Objetivo:** entender qué estás comprando o vendiendo, cómo se mueve el precio, qué cuesta operar y cómo funcionan las órdenes. Sin esto, cualquier señal es una apuesta a ciegas.

---

## 1. Trading vs. inversión

| | Inversión | Trading |
|---|---|---|
| Horizonte | Años | De minutos a semanas |
| Busca | Que el activo crezca en valor | Aprovechar movimientos del precio, al alza **o a la baja** |
| Herramienta principal | Análisis fundamental (negocio, economía) | Análisis técnico + gestión del riesgo |
| Riesgo | Ligado al activo | Ligado a **tu ejecución** y tu apalancamiento |

### Estilos de trading

| Estilo | Duración de la operación | Temporalidades | Para empezar |
|---|---|---|---|
| Scalping | Segundos a minutos | M1-M5 | ❌ Los costes y el ruido te comen. Exige experiencia |
| Intradía | Minutos a horas | M15-H1 | ⚠️ Posible, pero exige pantalla y control emocional |
| **Swing** | **Días** | **H4-D1** | ✅ **Recomendado.** Más tiempo para pensar, menos ruido, compatible con un trabajo |
| Posicional | Semanas a meses | D1-W1 | ✅ Bueno, pero aprendes más lento (pocas operaciones) |

**Mi recomendación:** empieza con **swing/intradía lento**: análisis en D1-H4 y entradas en H1. Cuanto más baja la temporalidad, más aleatorio el movimiento y más pesan los costes.

---

## 2. Los mercados

| Mercado | Ejemplos | Características |
|---|---|---|
| **Forex** (divisas) | EURUSD, GBPUSD, USDJPY | Abierto 24 h de lunes a viernes, muy líquido, spreads bajos en los pares principales |
| **Índices** | US500 (S&P 500), NAS100, GER40 (DAX) | Reflejan la bolsa de un país; muy reactivos a noticias económicas |
| **Materias primas** | XAUUSD (oro), petróleo (WTI, Brent) | El oro se mueve mucho y es muy popular en grupos de señales, **pero es volátil**: no es para empezar con riesgo alto |
| **Acciones** | Apple, Tesla, Santander | Horario de su bolsa; gaps en la apertura por resultados o noticias |
| **Cripto** | BTCUSD, ETHUSD | 24/7, muy volátil, más manipulable; los fines de semana hay movimientos sin liquidez |

**Para aprender:** elige **2-3 activos líquidos** y conócelos a fondo (por ejemplo EURUSD, XAUUSD y US500). Saltar de activo en activo según "lo que se mueve hoy" es un error clásico.

### Sesiones del mercado de divisas (aprox., en hora UTC)

| Sesión | Horario UTC aprox. | Comentario |
|---|---|---|
| Asia (Tokio) | 00:00-09:00 | Rangos estrechos en los pares europeos |
| Londres | 07:00-16:00 | Gran volumen. A menudo marca el movimiento del día |
| Nueva York | 12:00-21:00 | Datos de EE. UU. a las 12:30-13:30 UTC |
| **Solape Londres-NY** | **12:00-16:00** | **Máxima liquidez y volatilidad** |

> Los horarios se desplazan una hora con los cambios de horario de verano. Convierte a tu hora local con cualquier conversor.

---

## 3. Instrumentos: qué compras realmente

- **Contado (spot):** compras el activo real (acciones, cripto en un exchange).
- **CFD (contrato por diferencias):** apuestas al movimiento del precio sin poseer el activo. Te permite ir corto y usar apalancamiento. Es lo que ofrecen casi todos los brokers de forex. **Pagas swap** por mantener posiciones de un día para otro.
- **Futuros:** contratos estandarizados en un mercado regulado (CME, por ejemplo). Más transparentes, pero con tamaños de contrato grandes (existen micro futuros).
- **Opciones:** derechos a comprar o vender. Potentes y complejas: déjalas para más adelante.

---

## 4. Vocabulario imprescindible

| Concepto | Qué es | Ejemplo |
|---|---|---|
| **Bid / Ask** | Precio al que puedes vender / comprar | Bid 1.08500 · Ask 1.08510 |
| **Spread** | Diferencia entre ask y bid: lo que pagas al entrar | 1 pip en EURUSD |
| **Pip** | Movimiento estándar en forex: 0.0001 (0.01 en pares JPY) | 1.0850 → 1.0851 = 1 pip |
| **Punto** | Unidad de movimiento en índices, oro, etc. (cada broker la define a su manera) | US500 5200 → 5201 = 1 punto |
| **Lote estándar** | 100.000 unidades de la divisa base | 1 lote EURUSD ≈ 10 USD por pip |
| **Mini / micro lote** | 0,1 lotes / 0,01 lotes | 0,01 lotes EURUSD ≈ 0,10 USD por pip |
| **Apalancamiento** | El broker te deja mover más dinero del que depositas | 1:30 → con 1.000 controlas 30.000 |
| **Margen** | Dinero bloqueado como garantía mientras la operación está abierta | |
| **Margin call / stop out** | El broker cierra tus posiciones si tu margen no alcanza | |
| **Swap** | Interés que pagas o cobras por mantener la posición de un día para otro | |
| **Slippage** | Te ejecutan a un precio peor que el pedido (habitual en noticias) | |
| **Gap** | Salto del precio sin cotizar en medio (en aperturas o tras noticias) | Tu stop puede ejecutarse **más allá** de su precio |

### La gran confusión del apalancamiento

> **El apalancamiento no define tu riesgo. Lo definen el tamaño de la posición y la distancia del stop.**

Con 1:30 o con 1:500, si arriesgas 10 USD con el stop a 30 pips abres el mismo tamaño (0,03 lotes). El apalancamiento solo cambia el margen que se bloquea. El problema es que un apalancamiento alto **te permite** abrir posiciones enormes, y ahí es donde se vuelan las cuentas. En el [Módulo 3](03-gestion-del-riesgo.md) aprendes a calcularlo.

---

## 5. Tipos de órdenes

| Orden | Cuándo se usa | Se ejecuta… |
|---|---|---|
| **Mercado** | Quieres entrar ya | Al precio actual (con spread y posible slippage) |
| **Buy Limit** | Comprar **más barato** que ahora (esperas un retroceso a un soporte) | Si el precio **baja** hasta tu nivel |
| **Sell Limit** | Vender **más caro** que ahora (esperas un rebote a una resistencia) | Si el precio **sube** hasta tu nivel |
| **Buy Stop** | Comprar **más caro** que ahora (ruptura alcista) | Si el precio **sube** hasta tu nivel |
| **Sell Stop** | Vender **más barato** que ahora (ruptura bajista) | Si el precio **baja** hasta tu nivel |
| **Stop Loss (SL)** | Limitar la pérdida | Cierra la operación si el precio va en tu contra hasta ese nivel |
| **Take Profit (TP)** | Asegurar la ganancia | Cierra la operación en tu objetivo |
| **Trailing stop** | Stop que sigue al precio a favor | Útil en tendencias fuertes |

Regla mnemotécnica: **Limit = mejor precio que el actual · Stop = peor precio que el actual** (desde el punto de vista de quien entra).

---

## 6. Cómo elegir broker

1. **Regulación seria.** Comprueba la licencia **en la web del regulador**, no en la del broker. Ejemplos: FCA (Reino Unido), ASIC (Australia), CySEC (Chipre/UE), CNMV (España), BaFin (Alemania), NFA/CFTC (EE. UU.). Si eres de Latinoamérica, revisa también qué permite tu regulador local.
2. **Fondos segregados** y protección de saldo negativo.
3. **Costes claros:** spread, comisión, swap.
4. **Retiros sin trabas.** Lee opiniones específicamente sobre retiradas.
5. 🚩 **Desconfía** del broker que te "recomienda" un grupo de señales o un mentor. Muchas veces cobran comisión por cada operación que haces o por lo que pierdes (ver [Módulo 8](08-grupos-de-senales.md)).

### Plataformas

- **TradingView:** para análisis y gráficos. La versión gratuita sobra para empezar. Es donde harás tus capturas.
- **MetaTrader 4/5, cTrader:** para ejecutar las órdenes en tu broker.
- **Cuenta demo:** ábrela ya, con el **mismo saldo que pondrías en real** (no 100.000 de fantasía).

---

## ✍️ Ejercicios del módulo 1

1. Abre una cuenta demo en un broker regulado e instala TradingView.
2. Elige tus 2-3 activos y apunta su spread típico, su horario y cuánto vale 1 pip o 1 punto con 0,01 lotes.
3. En demo, coloca **una orden de cada tipo** (buy limit, sell limit, buy stop, sell stop) con SL y TP. Cancélalas o déjalas correr y observa qué pasa.
4. Explica con tus palabras, en 3 líneas, por qué el apalancamiento no define el riesgo. Mándamelo.

[← Índice](README.md) · [Siguiente: Análisis técnico →](02-analisis-tecnico.md)
