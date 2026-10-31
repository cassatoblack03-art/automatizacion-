# Módulo 7: Backtesting, demo y paso a real

[← Psicología y diario](06-psicologia-y-diario.md) · [Índice](README.md) · [Siguiente: Grupos de señales →](08-grupos-de-senales.md)

**Objetivo:** demostrar con datos (no con sensaciones) que tu estrategia tiene ventaja **antes** de jugarte el dinero, y pasar a real de forma gradual.

---

## 1. Backtesting manual

**Qué es:** aplicar tus reglas al histórico, vela a vela, como si fuera en directo.

### Cómo hacerlo en TradingView
1. Abre tu activo en la temporalidad de entrada (H1).
2. Activa **"Replay"** (repetición de barras) y retrocede al menos **12 meses**.
3. Avanza vela a vela. **No mires el futuro.**
4. Cada vez que se cumplan **todas** las reglas de tu setup, apunta la operación en el diario (setup, entrada, stop, TP, resultado en R).
5. Si una situación es dudosa, apúntala como dudosa y **mejora la redacción de la regla**.

### Reglas para que el backtest no te engañe
- **Muestra mínima: 100 operaciones** (50 como mínimo absoluto) y en **distintas condiciones** de mercado (tendencia, rango, alta y baja volatilidad).
- **No ajustes las reglas a mitad del backtest** para que salga mejor (eso se llama sobreoptimización). Si cambias una regla, empieza de cero.
- **Resta los costes:** spread, comisión y algo de slippage. En temporalidades bajas pueden convertir una estrategia ganadora en perdedora.
- Sé honesto con las entradas "obvias a posteriori". Si en directo no la habrías visto, no cuenta.

---

## 2. Métricas que importan

| Métrica | Qué mide | Referencia razonable |
|---|---|---|
| **Expectativa** | R medio por operación | > +0,2R |
| **Profit factor** | Ganancias totales ÷ pérdidas totales | > 1,3 (y > 2 es sospechosamente bueno: revisa el backtest) |
| **Winrate** | % de aciertos | Depende del R:B; por sí solo no dice nada |
| **Máximo drawdown** | Peor caída desde un pico | Que lo aguantes **con tu riesgo** sin romper el plan |
| **Peor racha perdedora** | Pérdidas seguidas | Escribe en el plan qué harás cuando llegue |

Calcúlalas con:
```bash
python3 herramientas/calculadora_riesgo.py estadisticas mi-backtest.csv
```

Y comprueba la robustez con el simulador usando tu winrate y tu R:B **reales**:
```bash
python3 herramientas/calculadora_riesgo.py simular --winrate 42 --rr 2.1 --riesgo 1 --trades 200
```

---

## 3. Las fases para convertirte en trader

| Fase | Duración orientativa | Qué haces | Criterio para pasar a la siguiente |
|---|---|---|---|
| **1. Formación** | Semanas 1-4 | Módulos 1-5, análisis de capturas conmigo | Rúbrica ≥ 10/12 en 3 análisis seguidos |
| **2. Backtesting** | Semanas 5-8 | 100 operaciones en el histórico con tu setup | Expectativa > +0,2R después de costes |
| **3. Demo en directo (forward test)** | Semanas 9-16 | Operas el plan en demo, **con el saldo que pondrías en real** | ≥ 50 operaciones, expectativa > 0, plan seguido en ≥ 90 % de ellas, drawdown < 10 % |
| **4. Real pequeño** | Meses 4-6 | Cuenta real **pequeña**, riesgo del **0,25-0,5 %** | 50 operaciones con resultados parecidos a los de la demo |
| **5. Escalar** | Desde el mes 6-7 | Subes al 1 % de riesgo y aportas capital poco a poco | Revisión trimestral de las estadísticas |

> **Por qué una fase de "real pequeño":** la demo no te enseña lo que sientes al perder dinero de verdad. Casi todo el mundo opera peor en real al principio. Es mejor descubrirlo con una cuenta pequeña.

### Si en cualquier fase las cosas van mal
- Expectativa negativa tras 50 operaciones **siguiendo el plan** → el problema es la estrategia: vuelve a la fase 2.
- Expectativa negativa **saltándote el plan** → el problema es la disciplina: vuelve a la demo y trabaja el módulo 6.
- Drawdown del −10 % en real → paras, vuelves a demo y revisas.

---

## 4. Plan de 90 días

| Semana | Tarea principal | Entregable que me mandas |
|---|---|---|
| 1 | Módulo 1, cuenta demo y TradingView | Ejercicios del módulo 1 |
| 2 | Módulo 2: estructura y zonas | 3 capturas con la estructura marcada |
| 3 | Módulos 2 y 3: liquidez y riesgo | Cálculos de tamaño de posición |
| 4 | Módulos 4 y 5: estrategia y lectura de capturas | Plan de trading (borrador) + 3 capturas para que yo las analice |
| 5-6 | Backtest de las primeras 50 operaciones + 3 análisis tuyos a la semana | Diario CSV + análisis con el formato de señal |
| 7-8 | Backtest de 50 operaciones más, plan de trading definitivo | `estadisticas` del backtest |
| 9-12 | Demo en directo, revisión semanal | `estadisticas` semanales + tus 3 peores operaciones |
| 13 | **Evaluación:** ¿se cumplen los criterios de la fase 3? | Informe: métricas + % de plan seguido + qué has aprendido |

---

## 5. Sobre las "prop firms" (cuentas de fondeo)

Empresas que te dejan operar su capital si superas una evaluación de pago.

- **A favor:** arriesgas solo la cuota, no un capital grande.
- **En contra:** **la mayoría de los candidatos no supera la evaluación**, las reglas de drawdown diario son estrictas y algunas empresas tienen condiciones poco transparentes o han cerrado de repente.
- **Mi consejo:** ni te lo plantees hasta que tengas al menos 3 meses de resultados positivos en real pequeño. Comprar evaluaciones una detrás de otra es otra forma de perder dinero.

[← Psicología y diario](06-psicologia-y-diario.md) · [Índice](README.md) · [Siguiente: Grupos de señales →](08-grupos-de-senales.md)
