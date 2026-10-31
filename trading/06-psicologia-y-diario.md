# Módulo 6: Psicología y diario de trading

[← Cómo analizar una captura](05-como-analizar-una-captura.md) · [Índice](README.md) · [Siguiente: Backtesting y progresión →](07-backtesting-y-progresion.md)

> Saber lo que hay que hacer es la parte fácil. **Hacerlo cuando estás perdiendo dinero** es el trabajo de verdad.

---

## 1. Pensar en probabilidades

Una operación concreta es **casi aleatoria**. Una serie de 100 operaciones con ventaja, **no**.

- No sabes si **esta** operación va a ganar. Lo único que sabes es que, si sigues tu plan, **las próximas 100** deberían salir positivas.
- Por tanto, **una pérdida siguiendo el plan es una buena operación**. Una ganancia saltándote el plan es una **mala** operación.
- Lectura recomendada: *Trading in the Zone*, de Mark Douglas.

---

## 2. Los 8 errores que hunden cuentas

| Error | Cómo se siente | Antídoto |
|---|---|---|
| **FOMO** (miedo a perderse el movimiento) | "¡Se está yendo sin mí!" | Si no estaba en tu plan antes de que se moviera, no existe. **Siempre hay otra operación.** |
| **Revenge trading** (operar para recuperar) | "Tengo que recuperar lo de antes" | Límite diario: con 3 pérdidas seguidas o −2 %, **cierras la plataforma** |
| **Mover el stop** | "Seguro que se da la vuelta" | El stop solo se mueve **a favor**, nunca en contra. Si te pasa, apúntalo en el diario como "fuera de plan" |
| **Cerrar ganadoras demasiado pronto** | "Mejor asegurar algo" | Deja que el TP trabaje. Con un winrate del 40 %, cortar las ganadoras te pone en negativo |
| **Sobreoperar** | "Hoy tengo que hacer algo" | Máximo de operaciones al día en tu plan. **No operar también es una decisión** |
| **Subir el riesgo tras ganar** | "Estoy en racha, soy bueno" | El riesgo es fijo en %. La euforia es tan peligrosa como el miedo |
| **Cambiar de estrategia tras 3 pérdidas** | "Esto no funciona" | Una estrategia se juzga con 50-100 operaciones, no con 3 |
| **Copiar señales sin entenderlas** | "Él sabe más que yo" | Si no sabes **por qué** entras, tampoco sabrás cuándo salir ni podrás evaluar al proveedor |

---

## 3. Rutina diaria

### Antes del mercado (15-20 min)
1. ¿Cómo estoy? (cansado, enfadado o con problemas → **no opero**, o lo hago con medio riesgo).
2. Calendario económico: noticias rojas del día.
3. Análisis top-down de mis 2-3 activos: sesgo de D1, zonas de H4.
4. Escribo los **escenarios** y coloco **alertas** en los niveles (no me quedo mirando la pantalla).

### Durante
1. Solo actúo si salta una alerta **y** se cumple el gatillo.
2. Checklist pre-trade ([`plantillas/checklist-pre-trade.md`](plantillas/checklist-pre-trade.md)) **antes de cada orden**.
3. Con la orden puesta (SL y TP incluidos) **me alejo de la pantalla**. Mirar cada vela no cambia el resultado: solo te tienta a intervenir.

### Después (10 min)
1. Apunto la operación en el diario con capturas de **antes** y **después**.
2. Pregunta clave: **¿seguí el plan?** (sí/no). Es más importante que el resultado.

---

## 4. El diario de trading

Es la herramienta que separa a los traders que mejoran de los que repiten sus errores durante años.

👉 Usa [`plantillas/diario-de-trading.csv`](plantillas/diario-de-trading.csv) (ábrelo en Excel o Google Sheets y borra las filas de ejemplo).

| Columna | Qué apuntar |
|---|---|
| `fecha`, `activo`, `temporalidad` | Lo básico |
| `direccion` | compra / venta |
| `setup` | Nombre del setup (por ejemplo `pullback-tendencia`). Así sabrás cuál funciona |
| `entrada`, `stop`, `tp`, `salida` | Precios reales |
| `resultado_R` | Opcional: si lo dejas vacío, la calculadora lo calcula |
| `riesgo_pct` | El % que arriesgaste |
| `seguiste_plan` | **si / no**. La columna más importante |
| `emocion` | tranquilo, nervioso, FOMO, venganza, eufórico… |
| `captura_antes`, `captura_despues` | Enlace a la imagen (TradingView te da un enlace al compartir) |
| `notas` | Qué aprendiste |

### Analizarlo con la calculadora

```bash
python3 herramientas/calculadora_riesgo.py estadisticas plantillas/diario-de-trading.csv
```

```
=== RESUMEN GENERAL ===
Operaciones: 4  (G 2 / P 2 / BE 0)
Winrate: 50.0%   Ganancia media: +1.75R   Pérdida media: -1.00R
Expectativa: +0.375R por operación   Total: +1.50R   Profit factor: 1.75
Máx. drawdown: 2.00R   Peor racha perdedora: 2

=== ¿SEGUISTE EL PLAN? ===
Siguiendo el plan: 3 ops, expectativa +0.833R, total +2.50R
Saltándote el plan: 1 ops, expectativa -1.000R, total -1.00R
...
```

La sección **"¿Seguiste el plan?"** suele ser la más reveladora: casi siempre muestra que las operaciones fuera de plan son las que te vacían la cuenta.

---

## 5. Revisión semanal (cada fin de semana, 30 min)

1. Ejecuta `estadisticas` sobre tu diario.
2. Responde por escrito:
   - ¿En qué % de operaciones seguí el plan? (objetivo: ≥ 90 %)
   - ¿Cuál fue mi **peor error** de la semana? ¿Cuánto me costó en R?
   - ¿Qué setup funcionó mejor y cuál peor?
   - ¿A qué hora y con qué emoción opero peor?
   - **Una sola cosa** que voy a mejorar la próxima semana.
3. Repasa las capturas de tus **3 peores operaciones**: ¿eran válidas según el plan?

---

## 6. Señales de que tienes que parar

- Estás operando para **recuperar** dinero.
- Has **subido el riesgo** "solo esta vez".
- Te escondes las pérdidas a ti mismo o a tu entorno.
- El trading **afecta a tu sueño, tu trabajo o tus relaciones**.
- Estás operando con dinero que necesitas para vivir o que te han prestado.

Si te ves en alguna de estas, **para una semana completa**. Si te cuesta parar, habla con alguien de confianza: el trading con dinero real puede generar patrones parecidos a los del juego.

[← Cómo analizar una captura](05-como-analizar-una-captura.md) · [Índice](README.md) · [Siguiente: Backtesting y progresión →](07-backtesting-y-progresion.md)
