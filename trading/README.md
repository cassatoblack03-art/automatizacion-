# Programa de formación en trading: de cero a operar con un proceso propio

> Tu mentor: un trader que analiza capturas y da señales, y que te va a enseñar a hacerlo **tú mismo**.
> El objetivo no es que copies mis señales. El objetivo es que dentro de unos meses no las necesites.

---

## ⚠️ Antes de empezar: la verdad sin adornos

- **La mayoría de traders minoristas pierde dinero.** Los brokers regulados en Europa están obligados a publicarlo y las cifras suelen ir del 70 % al 85 % de cuentas en pérdida con CFDs.
- Nadie acierta siempre. Un buen trader **pierde muchas operaciones** (a menudo el 50-60 %) y gana porque sus ganancias son mayores que sus pérdidas y porque controla el riesgo.
- Este material es **educativo**, no asesoramiento financiero personalizado. Opera solo con dinero que puedas permitirte perder por completo.
- La ventaja de quien sobrevive no es un indicador secreto: es **gestión del riesgo + disciplina + un registro honesto**.

Si después de leer esto sigues aquí, vamos a hacerlo bien.

---

## Cómo vamos a trabajar tú y yo

El método es **"Yo lo hago → Lo hacemos juntos → Tú lo haces"**:

| Fase | Qué haces tú | Qué hago yo |
|------|--------------|-------------|
| **1. Observar** (semanas 1-3) | Me mandas capturas de gráficos | Te devuelvo el análisis completo con formato de señal **y el porqué de cada nivel** |
| **2. Practicar juntos** (semanas 4-8) | Me mandas la captura **con tu análisis** (plantilla en [`plantillas/senal.md`](plantillas/senal.md)) | Te corrijo con una rúbrica de 12 puntos y te digo qué viste bien y qué no |
| **3. Autonomía** (semana 9 en adelante) | Operas tu plan en demo y me mandas tu diario | Reviso tus estadísticas y errores, no tus entradas |

### Qué captura mandarme (resumen)

1. **TradingView** (o tu plataforma) con **velas japonesas**, fondo limpio.
2. Que se vean el **activo**, la **temporalidad**, el **eje de precios** y la **fecha/hora**.
3. **Tres capturas** del mismo activo: **Diario (D1)**, **4 horas (H4)** y **1 hora (H1)** o **15 min (M15)**.
4. Unas 100-200 velas visibles por captura, sin hacer zoom extremo.
5. Opcional: EMA 50 y EMA 200. Nada más.
6. Si quieres que te calcule el tamaño de posición: **saldo de tu cuenta** y **% de riesgo**.

Detalle completo y ejemplo de análisis en el [Módulo 5](05-como-analizar-una-captura.md).

---

## Ruta de aprendizaje

| # | Módulo | Qué aprendes | Tiempo orientativo |
|---|--------|--------------|--------------------|
| 1 | [Fundamentos](01-fundamentos.md) | Mercados, órdenes, lotes, pips, apalancamiento, brokers | Semana 1 |
| 2 | [Análisis técnico](02-analisis-tecnico.md) | Velas, estructura, soportes/resistencias, multi-temporalidad, liquidez | Semanas 2-3 |
| 3 | [Gestión del riesgo](03-gestion-del-riesgo.md) | **El módulo más importante.** Tamaño de posición, R, expectativa, rachas | Semana 3 |
| 4 | [Estrategia y plan de trading](04-estrategia-y-plan.md) | Una estrategia completa con reglas exactas y cómo escribir tu plan | Semana 4 |
| 5 | [Cómo analizar una captura](05-como-analizar-una-captura.md) | El proceso paso a paso que sigo con cada gráfico + formato de señal | Semana 4 en adelante |
| 6 | [Psicología y diario](06-psicologia-y-diario.md) | Errores mentales típicos, rutina diaria, cómo llevar el diario | Continuo |
| 7 | [Backtesting y progresión](07-backtesting-y-progresion.md) | Probar la estrategia, pasar de demo a real, plan de 90 días | Semanas 5-16 |
| 8 | [Grupos de señales: cómo no ser estafado](08-grupos-de-senales.md) | Señales de alarma, cómo verificar a un "gurú", y qué exige la ley si vendes señales | Léelo ya |

---

## Plantillas

- [`plantillas/senal.md`](plantillas/senal.md): formato de señal y plantilla para mandarme tu propio análisis.
- [`plantillas/checklist-pre-trade.md`](plantillas/checklist-pre-trade.md): las preguntas que repasas antes de pulsar comprar o vender.
- [`plantillas/plan-de-trading.md`](plantillas/plan-de-trading.md): tu plan escrito. Sin él no se opera en real.
- [`plantillas/diario-de-trading.csv`](plantillas/diario-de-trading.csv): diario de operaciones (ábrelo en Excel o Google Sheets).

## Herramientas

[`herramientas/calculadora_riesgo.py`](herramientas/calculadora_riesgo.py) (Python 3, sin dependencias):

```bash
cd trading/herramientas

# ¿Cuántos lotes opero?
python3 calculadora_riesgo.py tamano --mercado forex --balance 1000 --riesgo 1 \
    --entrada 1.0850 --stop 1.0820 --tp 1.0910

# ¿Cómo voy de verdad? (lee tu diario)
python3 calculadora_riesgo.py estadisticas ../plantillas/diario-de-trading.csv

# ¿Qué rachas y caídas debo esperar de mi estrategia?
python3 calculadora_riesgo.py simular --winrate 45 --rr 2 --riesgo 1 --trades 200
```

Más detalles en [`herramientas/README.md`](herramientas/README.md).

---

## Las 10 reglas de oro

1. **Nunca arriesgues más del 1 % de tu cuenta por operación** (0,5 % mientras aprendes).
2. **Toda operación lleva stop loss desde el primer segundo.** Sin excepciones.
3. El stop va donde **tu idea queda invalidada**, no donde "te duele menos".
4. Si el beneficio potencial no es **al menos el doble** del riesgo (1:2), no hay operación.
5. **Opera a favor de la temporalidad mayor.**
6. **Precio en medio de la nada = no operar.** Se opera en zonas.
7. No abras posiciones **justo antes de noticias de alto impacto**.
8. **Límite diario:** con 3 pérdidas seguidas o −3 % en el día, cierras la plataforma.
9. **Apunta cada operación en el diario**, también (sobre todo) las malas.
10. **No pases a dinero real** hasta tener 50-100 operaciones en demo con expectativa positiva siguiendo tu plan.
