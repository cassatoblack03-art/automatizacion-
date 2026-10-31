#!/usr/bin/env python3
"""Herramientas de gestión de riesgo para traders (solo librería estándar).

Subcomandos:
  tamano        Calcula el tamaño de posición a partir del riesgo y del stop loss.
  estadisticas  Calcula métricas (winrate, expectativa, drawdown...) desde el diario CSV.
  simular       Simulación Monte Carlo: qué rachas y drawdowns esperar de una estrategia.

Ejemplos:
  python3 calculadora_riesgo.py tamano --mercado forex --balance 1000 --riesgo 1 \
      --entrada 1.0850 --stop 1.0820 --tp 1.0880 --tp 1.0910
  python3 calculadora_riesgo.py estadisticas ../plantillas/diario-de-trading.csv
  python3 calculadora_riesgo.py simular --winrate 45 --rr 2 --riesgo 1 --trades 200
"""

from __future__ import annotations

import argparse
import csv
import math
import random
import statistics
import sys
from dataclasses import dataclass, field

# Valores típicos. Comprueba SIEMPRE la especificación del contrato en tu broker.
PRESETS = {
    "forex": {"contrato": 100_000, "paso": 0.01, "unidad": ("lote", "lotes"), "pip": 0.0001},
    "forex-jpy": {"contrato": 100_000, "paso": 0.01, "unidad": ("lote", "lotes"), "pip": 0.01},
    "oro": {"contrato": 100, "paso": 0.01, "unidad": ("lote", "lotes"), "pip": None},
    "acciones": {"contrato": 1, "paso": 1, "unidad": ("acción", "acciones"), "pip": None},
    "cripto": {"contrato": 1, "paso": 0.0001, "unidad": ("unidad", "unidades"), "pip": None},
    "personalizado": {"contrato": 1, "paso": 0.01, "unidad": ("unidad", "unidades"), "pip": None},
}


# --------------------------------------------------------------------------- #
# Tamaño de posición
# --------------------------------------------------------------------------- #
def _redondear_abajo(valor: float, paso: float) -> float:
    """Redondea hacia abajo al múltiplo de `paso` (nunca arriesgar de más)."""
    if paso <= 0:
        raise ValueError("El paso debe ser mayor que 0.")
    texto = f"{paso:.10f}".rstrip("0")
    decimales = len(texto.split(".")[1]) if "." in texto else 0
    return round(math.floor(valor / paso + 1e-9) * paso, decimales)


def tamano_posicion(
    balance: float,
    riesgo_pct: float,
    entrada: float,
    stop: float,
    contrato: float = 1.0,
    conversion: float = 1.0,
    paso: float = 0.01,
) -> dict:
    """Calcula cuántos lotes/unidades operar para perder `riesgo_pct` si salta el stop.

    perdida_por_unidad = |entrada - stop| * contrato * conversion
    tamano             = (balance * riesgo_pct / 100) / perdida_por_unidad

    `conversion` pasa de la divisa cotizada a la divisa de tu cuenta
    (p. ej. USDJPY con cuenta en USD -> conversion = 1 / precio USDJPY).
    """
    if balance <= 0:
        raise ValueError("El balance debe ser mayor que 0.")
    if not 0 < riesgo_pct <= 100:
        raise ValueError("El riesgo debe estar entre 0 y 100 %.")
    distancia = abs(entrada - stop)
    if distancia == 0:
        raise ValueError("La entrada y el stop no pueden ser iguales.")
    if contrato <= 0 or conversion <= 0:
        raise ValueError("Contrato y conversión deben ser mayores que 0.")

    riesgo_dinero = balance * riesgo_pct / 100
    perdida_por_unidad = distancia * contrato * conversion
    tamano_exacto = riesgo_dinero / perdida_por_unidad
    tamano = _redondear_abajo(tamano_exacto, paso)
    riesgo_real = tamano * perdida_por_unidad

    return {
        "direccion": "COMPRA" if stop < entrada else "VENTA",
        "riesgo_dinero": riesgo_dinero,
        "distancia": distancia,
        "perdida_por_unidad": perdida_por_unidad,
        "tamano_exacto": tamano_exacto,
        "tamano": tamano,
        "riesgo_real": riesgo_real,
        "riesgo_real_pct": riesgo_real / balance * 100,
        "nocional": tamano * contrato * entrada * conversion,
    }


def evaluar_objetivos(entrada: float, stop: float, objetivos: list[float]) -> list[dict]:
    """Devuelve el ratio R:B de cada take profit y valida que esté del lado correcto."""
    riesgo = abs(entrada - stop)
    es_compra = stop < entrada
    resultado = []
    for tp in objetivos:
        if (es_compra and tp <= entrada) or (not es_compra and tp >= entrada):
            raise ValueError(
                f"El TP {tp} está del lado equivocado: en una "
                f"{'compra' if es_compra else 'venta'} el TP debe estar "
                f"{'por encima' if es_compra else 'por debajo'} de la entrada."
            )
        resultado.append({"tp": tp, "rr": abs(tp - entrada) / riesgo})
    return resultado


# --------------------------------------------------------------------------- #
# Estadísticas del diario
# --------------------------------------------------------------------------- #
COMPRA = {"compra", "buy", "long", "largo"}
VENTA = {"venta", "sell", "short", "corto"}
SI = {"si", "sí", "s", "yes", "y", "true", "1"}


def _numero(texto: str | None) -> float | None:
    if texto is None:
        return None
    texto = texto.strip().replace(",", ".")
    if not texto:
        return None
    return float(texto)


def calcular_r(fila: dict) -> float | None:
    """Obtiene el resultado en R de una fila del diario.

    Usa `resultado_R` si está relleno; si no, lo calcula con entrada/stop/salida.
    """
    r = _numero(fila.get("resultado_R"))
    if r is not None:
        return r
    entrada = _numero(fila.get("entrada"))
    stop = _numero(fila.get("stop"))
    salida = _numero(fila.get("salida"))
    direccion = (fila.get("direccion") or "").strip().lower()
    if None in (entrada, stop, salida) or entrada == stop:
        return None
    if direccion in COMPRA:
        return (salida - entrada) / (entrada - stop)
    if direccion in VENTA:
        return (entrada - salida) / (stop - entrada)
    return None


def max_drawdown(resultados: list[float]) -> float:
    """Máxima caída (en R) desde un pico de la curva acumulada, empezando en 0."""
    acumulado = pico = peor = 0.0
    for r in resultados:
        acumulado += r
        pico = max(pico, acumulado)
        peor = max(peor, pico - acumulado)
    return peor


def max_racha_perdedora(resultados: list[float]) -> int:
    racha = mejor = 0
    for r in resultados:
        racha = racha + 1 if r < 0 else 0
        mejor = max(mejor, racha)
    return mejor


def metricas(resultados: list[float]) -> dict:
    """Métricas clave a partir de una lista de resultados en R (en orden cronológico)."""
    n = len(resultados)
    if n == 0:
        raise ValueError("No hay operaciones con resultado para analizar.")
    ganadoras = [r for r in resultados if r > 0]
    perdedoras = [r for r in resultados if r < 0]
    suma_g = sum(ganadoras)
    suma_p = abs(sum(perdedoras))
    return {
        "operaciones": n,
        "ganadoras": len(ganadoras),
        "perdedoras": len(perdedoras),
        "breakeven": n - len(ganadoras) - len(perdedoras),
        "winrate": len(ganadoras) / n * 100,
        "ganancia_media_R": statistics.mean(ganadoras) if ganadoras else 0.0,
        "perdida_media_R": -statistics.mean([abs(r) for r in perdedoras]) if perdedoras else 0.0,
        "expectativa_R": statistics.mean(resultados),
        "total_R": sum(resultados),
        "profit_factor": suma_g / suma_p if suma_p else math.inf,
        "max_drawdown_R": max_drawdown(resultados),
        "max_racha_perdedora": max_racha_perdedora(resultados),
    }


@dataclass
class AnalisisDiario:
    resultados: list[float] = field(default_factory=list)
    con_plan: list[float] = field(default_factory=list)
    sin_plan: list[float] = field(default_factory=list)
    por_setup: dict[str, list[float]] = field(default_factory=dict)
    omitidas: int = 0


def analizar_diario(filas: list[dict]) -> AnalisisDiario:
    analisis = AnalisisDiario()
    for fila in filas:
        r = calcular_r(fila)
        if r is None:
            analisis.omitidas += 1
            continue
        analisis.resultados.append(r)
        plan = (fila.get("seguiste_plan") or "").strip().lower()
        if plan:
            (analisis.con_plan if plan in SI else analisis.sin_plan).append(r)
        setup = (fila.get("setup") or "").strip() or "(sin nombre)"
        analisis.por_setup.setdefault(setup, []).append(r)
    return analisis


# --------------------------------------------------------------------------- #
# Simulación Monte Carlo
# --------------------------------------------------------------------------- #
def simular(
    winrate_pct: float,
    rr: float,
    riesgo_pct: float,
    trades: int = 100,
    simulaciones: int = 5000,
    balance: float = 10_000,
    semilla: int | None = None,
) -> dict:
    """Simula `simulaciones` secuencias de `trades` operaciones con riesgo fijo (%)."""
    if not 0 <= winrate_pct <= 100:
        raise ValueError("El winrate debe estar entre 0 y 100.")
    if rr <= 0 or not 0 < riesgo_pct < 100 or trades <= 0 or simulaciones <= 0:
        raise ValueError("rr, riesgo, trades y simulaciones deben ser positivos (riesgo < 100).")

    rng = random.Random(semilla)
    p = winrate_pct / 100
    f = riesgo_pct / 100
    finales, drawdowns, rachas = [], [], []
    for _ in range(simulaciones):
        saldo = pico = balance
        peor_dd = 0.0
        racha = peor_racha = 0
        for _ in range(trades):
            if rng.random() < p:
                saldo *= 1 + f * rr
                racha = 0
            else:
                saldo *= 1 - f
                racha += 1
                peor_racha = max(peor_racha, racha)
            pico = max(pico, saldo)
            peor_dd = max(peor_dd, (pico - saldo) / pico)
        finales.append(saldo)
        drawdowns.append(peor_dd * 100)
        rachas.append(peor_racha)

    finales.sort()
    drawdowns.sort()
    rachas.sort()

    def percentil(datos: list[float], q: float) -> float:
        return datos[min(len(datos) - 1, int(q * len(datos)))]

    return {
        "expectativa_R": p * rr - (1 - p),
        "winrate_equilibrio": 100 / (1 + rr),
        "balance_inicial": balance,
        "final_p5": percentil(finales, 0.05),
        "final_mediana": statistics.median(finales),
        "final_p95": percentil(finales, 0.95),
        "pct_en_perdida": sum(x < balance for x in finales) / simulaciones * 100,
        "dd_mediana": statistics.median(drawdowns),
        "dd_p95": percentil(drawdowns, 0.95),
        "pct_dd_20": sum(d >= 20 for d in drawdowns) / simulaciones * 100,
        "pct_dd_50": sum(d >= 50 for d in drawdowns) / simulaciones * 100,
        "racha_mediana": statistics.median(rachas),
        "racha_p95": percentil(rachas, 0.95),
    }


# --------------------------------------------------------------------------- #
# Interfaz de línea de comandos
# --------------------------------------------------------------------------- #
def _fmt(valor: float, decimales: int = 2) -> str:
    return f"{valor:,.{decimales}f}"


def cmd_tamano(args: argparse.Namespace) -> None:
    preset = PRESETS[args.mercado]
    contrato = args.contrato if args.contrato is not None else preset["contrato"]
    paso = args.paso if args.paso is not None else preset["paso"]

    if args.mercado == "forex-jpy" and args.conversion == 1.0:
        print("⚠️  En pares JPY con cuenta en USD/EUR debes indicar --conversion "
              "(p. ej. 1/150 = 0.00667 para USDJPY a 150). El cálculo de abajo NO es válido.\n")

    res = tamano_posicion(args.balance, args.riesgo, args.entrada, args.stop,
                          contrato, args.conversion, paso)
    singular, unidad = preset["unidad"]

    print(f"Operación: {res['direccion']}  |  Entrada {args.entrada}  |  Stop {args.stop}")
    distancia = f"{res['distancia']:g}"
    if preset["pip"]:
        distancia += f"  ({res['distancia'] / preset['pip']:.1f} pips)"
    print(f"Distancia al stop: {distancia}")
    print(f"Riesgo permitido:  {_fmt(res['riesgo_dinero'])} ({args.riesgo}% de {_fmt(args.balance)})")
    print(f"Pérdida por 1 {singular} si toca el stop: {_fmt(res['perdida_por_unidad'])}")
    print("-" * 60)
    print(f"TAMAÑO DE POSICIÓN: {res['tamano']:g} {unidad}  (exacto: {res['tamano_exacto']:.4f})")
    print(f"Riesgo real:       {_fmt(res['riesgo_real'])} ({res['riesgo_real_pct']:.2f}%)")
    print(f"Exposición total:  {_fmt(res['nocional'])}")
    if args.apalancamiento:
        print(f"Margen aprox. con 1:{args.apalancamiento:g}: "
              f"{_fmt(res['nocional'] / args.apalancamiento)}")
        print("  -> El apalancamiento cambia el margen, NO el riesgo. El riesgo lo fijan "
              "el stop y el tamaño.")

    if res["tamano"] == 0:
        print("\n⛔ El stop es demasiado amplio para tu cuenta y riesgo: el tamaño mínimo "
              "arriesgaría más de lo permitido. NO operes este trade (o busca un stop lógico más corto).")

    if args.tp:
        print("-" * 60)
        for obj in evaluar_objetivos(args.entrada, args.stop, args.tp):
            ganancia = obj["rr"] * res["riesgo_real"]
            aviso = "" if obj["rr"] >= args.rr_minimo else f"  ⚠️ por debajo de 1:{args.rr_minimo:g}"
            print(f"TP {obj['tp']}: R:B 1:{obj['rr']:.2f}  ->  +{_fmt(ganancia)}{aviso}")


def _imprimir_metricas(m: dict, sangria: str = "") -> None:
    pf = "∞" if math.isinf(m["profit_factor"]) else f"{m['profit_factor']:.2f}"
    print(f"{sangria}Operaciones: {m['operaciones']}  (G {m['ganadoras']} / "
          f"P {m['perdedoras']} / BE {m['breakeven']})")
    print(f"{sangria}Winrate: {m['winrate']:.1f}%   Ganancia media: {m['ganancia_media_R']:+.2f}R   "
          f"Pérdida media: {m['perdida_media_R']:+.2f}R")
    print(f"{sangria}Expectativa: {m['expectativa_R']:+.3f}R por operación   "
          f"Total: {m['total_R']:+.2f}R   Profit factor: {pf}")
    print(f"{sangria}Máx. drawdown: {m['max_drawdown_R']:.2f}R   "
          f"Peor racha perdedora: {m['max_racha_perdedora']}")


def cmd_estadisticas(args: argparse.Namespace) -> None:
    with open(args.archivo, newline="", encoding="utf-8-sig") as fh:
        filas = list(csv.DictReader(fh))
    analisis = analizar_diario(filas)
    if analisis.omitidas:
        print(f"(Se omitieron {analisis.omitidas} filas sin datos suficientes)\n")

    print("=== RESUMEN GENERAL ===")
    _imprimir_metricas(metricas(analisis.resultados))

    if analisis.con_plan or analisis.sin_plan:
        print("\n=== ¿SEGUISTE EL PLAN? ===")
        for nombre, datos in (("Siguiendo el plan", analisis.con_plan),
                              ("Saltándote el plan", analisis.sin_plan)):
            if datos:
                m = metricas(datos)
                print(f"{nombre}: {m['operaciones']} ops, expectativa {m['expectativa_R']:+.3f}R, "
                      f"total {m['total_R']:+.2f}R")

    if len(analisis.por_setup) > 1:
        print("\n=== POR SETUP ===")
        for setup, datos in sorted(analisis.por_setup.items()):
            m = metricas(datos)
            print(f"{setup}: {m['operaciones']} ops, winrate {m['winrate']:.0f}%, "
                  f"expectativa {m['expectativa_R']:+.3f}R")

    n = len(analisis.resultados)
    if n < 30:
        print(f"\nℹ️  Solo {n} operaciones: muestra demasiado pequeña para sacar conclusiones. "
              "Apunta al menos a 50-100.")


def cmd_simular(args: argparse.Namespace) -> None:
    r = simular(args.winrate, args.rr, args.riesgo, args.trades, args.simulaciones,
                args.balance, args.semilla)
    print(f"Estrategia: winrate {args.winrate}%, R:B 1:{args.rr:g}, riesgo {args.riesgo}% "
          f"por operación, {args.trades} operaciones, {args.simulaciones} simulaciones")
    print(f"Expectativa teórica: {r['expectativa_R']:+.3f}R por operación "
          f"(winrate de equilibrio: {r['winrate_equilibrio']:.1f}%)")
    print("-" * 60)
    print(f"Balance final (de {_fmt(r['balance_inicial'])}):  peor 5%: {_fmt(r['final_p5'])}   "
          f"mediana: {_fmt(r['final_mediana'])}   mejor 5%: {_fmt(r['final_p95'])}")
    print(f"Terminan en pérdida: {r['pct_en_perdida']:.1f}% de las simulaciones")
    print(f"Drawdown máximo: mediana {r['dd_mediana']:.1f}%   peor 5%: {r['dd_p95']:.1f}%")
    print(f"Probabilidad de drawdown ≥20%: {r['pct_dd_20']:.1f}%   ≥50%: {r['pct_dd_50']:.1f}%")
    print(f"Peor racha de pérdidas seguidas: mediana {r['racha_mediana']:g}   "
          f"peor 5%: {r['racha_p95']:g}")
    print("\nMoraleja: incluso con ventaja real vas a vivir rachas así. Tu riesgo por "
          "operación debe permitirte sobrevivirlas sin romper tu plan.")


def construir_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Calculadora de riesgo, estadísticas de diario y simulador para traders.")
    sub = parser.add_subparsers(dest="comando", required=True)

    p = sub.add_parser("tamano", help="Calcula el tamaño de posición.")
    p.add_argument("--mercado", choices=sorted(PRESETS), default="personalizado")
    p.add_argument("--balance", type=float, required=True, help="Saldo de la cuenta.")
    p.add_argument("--riesgo", type=float, default=1.0, help="Riesgo por operación en %% (def. 1).")
    p.add_argument("--entrada", type=float, required=True)
    p.add_argument("--stop", type=float, required=True)
    p.add_argument("--tp", type=float, action="append", help="Take profit (se puede repetir).")
    p.add_argument("--contrato", type=float, help="Tamaño de contrato por lote (sobrescribe preset).")
    p.add_argument("--paso", type=float, help="Incremento mínimo de tamaño (sobrescribe preset).")
    p.add_argument("--conversion", type=float, default=1.0,
                   help="Divisa cotizada -> divisa de la cuenta (def. 1).")
    p.add_argument("--apalancamiento", type=float, help="Ej.: 30 para 1:30 (solo informa el margen).")
    p.add_argument("--rr-minimo", type=float, default=2.0, help="R:B mínimo aceptable (def. 2).")
    p.set_defaults(func=cmd_tamano)

    p = sub.add_parser("estadisticas", help="Analiza tu diario de trading (CSV).")
    p.add_argument("archivo", help="Ruta al CSV (usa plantillas/diario-de-trading.csv).")
    p.set_defaults(func=cmd_estadisticas)

    p = sub.add_parser("simular", help="Simulación Monte Carlo de una estrategia.")
    p.add_argument("--winrate", type=float, required=True, help="Porcentaje de aciertos (0-100).")
    p.add_argument("--rr", type=float, required=True, help="Ratio riesgo:beneficio medio (ej. 2).")
    p.add_argument("--riesgo", type=float, default=1.0, help="Riesgo por operación en %%.")
    p.add_argument("--trades", type=int, default=100)
    p.add_argument("--simulaciones", type=int, default=5000)
    p.add_argument("--balance", type=float, default=10_000)
    p.add_argument("--semilla", type=int, help="Semilla aleatoria para resultados reproducibles.")
    p.set_defaults(func=cmd_simular)
    return parser


def main(argv: list[str] | None = None) -> int:
    args = construir_parser().parse_args(argv)
    try:
        args.func(args)
    except (ValueError, OSError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
