# Módulo 8: Grupos de señales: cómo evaluarlos y no ser estafado

[← Backtesting y progresión](07-backtesting-y-progresion.md) · [Índice](README.md)

Me has pedido actuar como "los que te dan capturas y mandan señales". Para hacerlo bien, primero tienes que saber **cómo funciona ese negocio por dentro**, porque una parte importante de los grupos de Telegram, WhatsApp e Instagram **no gana dinero con el trading, sino con sus seguidores**.

---

## 1. Cómo ganan dinero muchos "gurús"

| Modelo | Cómo funciona | Por qué es un problema |
|---|---|---|
| **Afiliación (IB) con un broker** | "Abre cuenta en ESTE broker para unirte al VIP gratis" | Cobran por cada lote que operas, **ganes o pierdas**. Algunos acuerdos pagan incluso un porcentaje de lo que **pierdes**. Les interesa que operes mucho y con mucho tamaño |
| **Suscripción VIP** | Pagas cada mes por las señales | El negocio es vender suscripciones, no acertar |
| **Cursos y "mentorías"** | Venta de formación con estilo de vida de lujo | El dinero viene de los alumnos, no del mercado |
| **Cuentas gestionadas / "te opero yo"** | "Mándame tu dinero (o tus claves) y te lo multiplico" | 🚨 **Fraude habitual.** Además, en la mayoría de países gestionar dinero ajeno sin licencia es ilegal |
| **Pump & dump** (cripto y acciones pequeñas) | "Comprad X ahora" | Ellos compraron antes y te venden a ti en el máximo |

---

## 2. Señales de alarma 🚩

- **"90-100 % de acierto"**, "sin pérdidas", "rentabilidad garantizada".
- Solo publican **capturas de ganancias**. Las pérdidas no aparecen o se **borran los mensajes**.
- Señales **sin stop loss**, o con "SL mental", o con stops enormes y TPs minúsculos.
- Publican la señal **después** de que el precio se haya movido ("¡TP1 tocado! 🔥", sin haberla enviado antes).
- Te presionan para usar **un broker concreto**, sobre todo si no está regulado en serio.
- Te piden **dinero en cripto a una wallet**, tus contraseñas o acceso remoto a tu cuenta.
- **Urgencia:** "últimas plazas", "solo hoy", "el VIP se cierra".
- Marketing de **coches, relojes y viajes** en lugar de estadísticas.
- Resultados en **% o en pips**, nunca en dinero de una cuenta verificada.
- "Recuperamos el dinero que perdiste con otros estafadores" → **segunda estafa** clásica.

---

## 3. Cómo verificar a un proveedor de señales

1. **Historial verificado por un tercero** (por ejemplo Myfxbook o FXBlue con "track record" y "trading privileges" verificados), conectado a una **cuenta real**, de **al menos 12 meses**. Las capturas de pantalla no valen: se falsifican en segundos.
2. **Auditoría tú mismo:** durante 1-2 meses apunta **todas** sus señales en el momento en que llegan (hora, entrada, SL, TP) y calcula los resultados en R con la calculadora. Sin operar.
3. Mira el **R:B real**, no el winrate (ver [Módulo 3](03-gestion-del-riesgo.md), sección 5).
4. ¿Las señales son **ejecutables**? Si llegan cuando el precio ya se ha movido, sus resultados no son los tuyos.
5. ¿Explican **el porqué** y la **invalidación**? Un profesional no tiene problema en explicar su razonamiento.

### Plantilla para auditar un grupo

Usa el mismo diario CSV con `setup` = nombre del grupo:

```
fecha,activo,temporalidad,direccion,setup,entrada,stop,tp,salida,resultado_R,...
2026-03-02,XAUUSD,M15,compra,grupo-X,2391,2381,2395,2381,,...
```

Después ejecuta `estadisticas` y compara grupos (y compáralos con tu propia estrategia).

---

## 4. Qué debe tener una señal decente

Una señal útil incluye **siempre**:
- Activo, dirección y **tipo de orden**.
- **Entrada, stop loss y take profit** concretos desde el primer momento.
- **R:B ≥ 1:1,5-1:2.**
- **Contexto e invalidación**: por qué se entra y qué anula la idea.
- **Riesgo recomendado en %** de la cuenta (no "entra con 1 lote").
- Una **validez temporal** para las órdenes pendientes.

Ese es exactamente el formato del [Módulo 5](05-como-analizar-una-captura.md).

---

## 5. Si algún día quieres dar señales tú

Es un objetivo legítimo, pero hazlo bien:

1. **Primero sé rentable tú.** Mínimo 12 meses de historial **real y verificado** antes de enseñar resultados a nadie.
2. **Revisa la ley de tu país.** En muchos países (la UE con MiFID II, España con la CNMV, EE. UU. con la SEC/CFTC, México con la CNBV, Colombia con la SFC…) dar **recomendaciones de inversión personalizadas** o **gestionar dinero de terceros** exige una **licencia**. Compartir análisis educativos generales suele estar permitido, pero **la frontera depende de cada jurisdicción**: consulta con un abogado especializado antes de cobrar.
3. **Transparencia total:** publica también las pérdidas, el historial verificado y un aviso de riesgo claro.
4. **Nunca** gestiones dinero ajeno ni pidas acceso a cuentas de otras personas sin la licencia correspondiente.

---

## ✍️ Ejercicios del módulo 8

1. Si estás en algún grupo de señales, audita sus próximas 30 señales con el diario CSV. Calcula su expectativa real en R.
2. Repasa la lista de señales de alarma: ¿cuántas cumple ese grupo?
3. Compara: ¿su expectativa es mejor o peor que la de tu backtest de la estrategia PET?

[← Backtesting y progresión](07-backtesting-y-progresion.md) · [Índice](README.md)
