#!/usr/bin/env python3
"""Genera el catálogo para clientes (HTML + PDF + PNG por línea) y el Excel interno de precios.

Uso:
    python3 generar_catalogo.py

Datos de entrada: productos.csv (misma carpeta).
  - pestana_app: pestaña de la app donde sale el producto (CW & BW, Food Prep, ...).
  - costo: lo que te cuesta a ti (MXN).
  - aumento_manual: opcional, p. ej. 0.70 = +70 %. Si lo dejas vacío se usa la regla por rango.
  - Filas sin nombre_catalogo o sin costo se mandan a la hoja "Pendientes" y no salen en el catálogo.
"""

import csv
import html
import json
import math
import subprocess
import tempfile
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import column_index_from_string, get_column_letter

# ---------------------------------------------------------------------------
# CONFIGURACIÓN — cambia aquí lo que quieras
# ---------------------------------------------------------------------------
TITULO = "Catálogo de Cocina"
SUBTITULO = "Sartenes · Ollas · Baterías · Licuadoras · Batidoras · Exprimidores"
CONTACTO = ""  # p. ej. "Pedidos por WhatsApp: 55 1234 5678". Vacío = no se muestra.
VIGENCIA = "Precios vigentes: noviembre 2026"

# Reglas de aumento por rango de costo: (costo desde, aumento)
# Entre más barato el producto, mayor % (para que la ganancia en pesos valga la pena);
# entre más caro, menor % (para que el precio siga siendo atractivo).
REGLAS = [
    (0, 0.80),     # costo menor a $300     -> +80 %
    (300, 0.65),   # $300 a $699.99         -> +65 %
    (700, 0.55),   # $700 a $1,199.99       -> +55 %
    (1200, 0.45),  # $1,200 en adelante     -> +45 %
]

# Orden de las pestañas de la app en el Excel (hoja Resumen).
PESTANAS = ["CW & BW", "Food Prep"]

# Imágenes PNG para WhatsApp (cortas, para que se lean bien en el celular):
# (título, categorías que incluye, archivo)
IMAGENES = [
    ("Sartenes y juegos de sartenes", ["Sartenes", "Juegos de sartenes"], "catalogo_sartenes.png"),
    ("Ollas, cazos y baterías", ["Ollas y cazos", "Baterías de cocina"], "catalogo_ollas_y_baterias.png"),
    ("Licuadoras, batidoras y exprimidores",
     ["Licuadoras", "Licuadoras de alto rendimiento", "Licuadoras personales", "Batidoras de inmersión",
      "Procesadores y picadores", "Exprimidores y extractores"], "catalogo_licuadoras_y_mas.png"),
]

ORDEN_CATEGORIAS = [
    # CW & BW
    "Sartenes",
    "Juegos de sartenes",
    "Ollas y cazos",
    "Baterías de cocina",
    # Food Prep
    "Licuadoras",
    "Licuadoras de alto rendimiento",
    "Licuadoras personales",
    "Batidoras de inmersión",
    "Procesadores y picadores",
    "Exprimidores y extractores",
]

# Cuántos artículos dice la app que hay en cada pestaña (para avisar cuántos faltan).
TOTAL_EN_APP = {"Food Prep": 37}

BASE = Path(__file__).resolve().parent
SALIDA = BASE / "salida"
CSV_PATH = BASE / "productos.csv"
HTML_COMPLETO = "catalogo_cocina.html"
PDF_COMPLETO = "catalogo_cocina.pdf"
EXCEL = "precios_internos_cocina.xlsx"


# ---------------------------------------------------------------------------
# Lógica de precios (la misma que usan las fórmulas del Excel)
# ---------------------------------------------------------------------------
def indice_regla(costo: float) -> int:
    idx = 0
    for i, (desde, _) in enumerate(REGLAS):
        if costo >= desde:
            idx = i
    return idx


def piso_regla(idx: int) -> float:
    """Precio mínimo de un rango = lo que costaría el producto más caro del rango anterior.

    Evita que algo que te cuesta $301 se venda más barato que algo que te cuesta $299.
    """
    if idx == 0:
        return 0.0
    return REGLAS[idx][0] * (1 + REGLAS[idx - 1][1])


def redondear_precio(bruto: float) -> int:
    """Precios "de tienda": < $1,000 terminan en 9 ($599); >= $1,000 terminan en 49/99 ($1,549)."""
    if bruto < 1000:
        return int(math.ceil(bruto / 10) * 10 - 1)
    return int(math.ceil(bruto / 50) * 50 - 1)


def calcular_precio(costo: float, manual):
    if manual is not None:
        return redondear_precio(costo * (1 + manual))
    idx = indice_regla(costo)
    return redondear_precio(max(costo * (1 + REGLAS[idx][1]), piso_regla(idx)))


def cargar_productos():
    listos, pendientes = [], []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        for fila in csv.DictReader(f):
            costo_txt = (fila.get("costo") or "").strip()
            nombre = (fila.get("nombre_catalogo") or "").strip()
            if not costo_txt or not nombre:
                pendientes.append(fila)
                continue
            costo = float(costo_txt)
            manual_txt = (fila.get("aumento_manual") or "").strip()
            manual = float(manual_txt) if manual_txt else None
            listos.append({**fila, "nombre_catalogo": nombre, "costo": costo,
                           "manual": manual, "precio": calcular_precio(costo, manual)})

    def clave(p):
        cat = p["categoria"]
        idx = ORDEN_CATEGORIAS.index(cat) if cat in ORDEN_CATEGORIAS else len(ORDEN_CATEGORIAS)
        return (idx, cat, p["precio"], p["nombre_catalogo"])

    listos.sort(key=clave)
    return listos, pendientes


def pesos(n: float) -> str:
    return f"${n:,.0f}"


# ---------------------------------------------------------------------------
# Catálogo para clientes (NO muestra costos)
# ---------------------------------------------------------------------------
def generar_html(productos, subtitulo: str) -> str:
    secciones = []
    categoria_actual = None
    tarjetas = []

    def cerrar_seccion():
        if categoria_actual is not None:
            secciones.append(
                f'<section class="cat"><h2>{html.escape(categoria_actual)}</h2>'
                f'<div class="grid">{"".join(tarjetas)}</div></section>'
            )

    for p in productos:
        if p["categoria"] != categoria_actual:
            cerrar_seccion()
            categoria_actual = p["categoria"]
            tarjetas = []
        desc = (p.get("descripcion") or "").strip()
        tarjetas.append(
            '<article class="card">'
            f'<div class="name">{html.escape(p["nombre_catalogo"])}</div>'
            f'<div class="desc">{html.escape(desc) if desc else "&nbsp;"}</div>'
            f'<div class="price">{pesos(p["precio"])}</div>'
            "</article>"
        )
    cerrar_seccion()

    contacto = f'<div class="contact">{html.escape(CONTACTO)}</div>' if CONTACTO else ""

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(TITULO)}</title>
<style>
  :root {{
    --ink: #1f2328;
    --muted: #6b7280;
    --line: #e7e2dc;
    --paper: #ffffff;
    --bg: #faf7f3;
    --accent: #c2410c;
    --accent-soft: #fff1e8;
  }}
  * {{ box-sizing: border-box; }}
  html, body {{ margin: 0; background: var(--bg); color: var(--ink);
    font-family: "Inter", "Liberation Sans", Arial, sans-serif; }}
  .page {{ max-width: 820px; margin: 0 auto; padding: 36px 32px 28px; background: var(--paper); }}
  header {{ border-bottom: 3px solid var(--accent); padding-bottom: 16px; margin-bottom: 8px; }}
  h1 {{ margin: 0; font-size: 34px; letter-spacing: -0.5px; }}
  .sub {{ margin-top: 6px; color: var(--muted); font-size: 15px; }}
  .meta {{ margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; }}
  .pill {{ background: var(--accent-soft); color: var(--accent); font-weight: 600; font-size: 12px;
    padding: 4px 10px; border-radius: 999px; }}
  .cat {{ margin-top: 22px; }}
  h2 {{ font-size: 15px; text-transform: uppercase; letter-spacing: 1.2px; color: var(--accent);
    margin: 0 0 10px; padding-bottom: 6px; border-bottom: 1px solid var(--line); break-after: avoid; }}
  .grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }}
  .card {{ border: 1px solid var(--line); border-radius: 10px; padding: 12px 12px 10px;
    display: flex; flex-direction: column; break-inside: avoid; background: #fff; }}
  .name {{ font-weight: 600; font-size: 14px; line-height: 1.25; }}
  .desc {{ color: var(--muted); font-size: 12px; margin-top: 4px; flex: 1; }}
  .price {{ margin-top: 10px; font-size: 22px; font-weight: 800; color: var(--ink); }}
  .price::after {{ content: " MXN"; font-size: 11px; font-weight: 600; color: var(--muted); }}
  footer {{ margin-top: 26px; padding-top: 12px; border-top: 1px solid var(--line);
    color: var(--muted); font-size: 12px; display: flex; justify-content: space-between; gap: 12px;
    flex-wrap: wrap; }}
  .contact {{ color: var(--ink); font-weight: 700; font-size: 14px; }}
  @media (max-width: 640px) {{ .grid {{ grid-template-columns: repeat(2, 1fr); }} .page {{ padding: 24px 16px; }} }}
  @page {{ size: A4; margin: 12mm; }}
  @media print {{ html, body {{ background: #fff; }} .page {{ padding: 0; max-width: none; }} }}
</style>
</head>
<body>
<div class="page">
  <header>
    <h1>{html.escape(TITULO)}</h1>
    <div class="sub">{html.escape(subtitulo)}</div>
    <div class="meta"><span class="pill">{len(productos)} productos</span><span class="pill">{html.escape(VIGENCIA)}</span></div>
  </header>
  {"".join(secciones)}
  <footer>
    <div>Precios en pesos mexicanos. Sujetos a disponibilidad.</div>
    {contacto}
  </footer>
</div>
</body>
</html>
"""


def exportar_con_navegador(trabajos):
    """trabajos: lista de dicts {html, pdf?, png?} con rutas absolutas."""
    script = """
const { chromium } = require('playwright');
const trabajos = JSON.parse(process.argv[1]);
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 820, height: 400 }, deviceScaleFactor: 2 });
  for (const t of trabajos) {
    await page.goto('file://' + t.html);
    if (t.pdf) await page.pdf({ path: t.pdf, format: 'A4', printBackground: true });
    if (t.png) await page.screenshot({ path: t.png, fullPage: true });
  }
  await browser.close();
})();
"""
    subprocess.run(["node", "-e", script, json.dumps(trabajos)], check=True)


# ---------------------------------------------------------------------------
# Excel interno (con costos y ganancias, fórmulas vivas)
# ---------------------------------------------------------------------------
FUENTE = "Arial"
AZUL = Font(name=FUENTE, color="0000FF")
NEGRO = Font(name=FUENTE)
NEGRITA = Font(name=FUENTE, bold=True)
VERDE = Font(name=FUENTE, color="008000")
TITULO_F = Font(name=FUENTE, bold=True, size=14)
NOTA_F = Font(name=FUENTE, italic=True, color="6B7280")
ENCABEZADO_F = Font(name=FUENTE, bold=True, color="FFFFFF")
ENCABEZADO_FILL = PatternFill("solid", fgColor="C2410C")
AMARILLO = PatternFill("solid", fgColor="FFFF00")
GRIS = PatternFill("solid", fgColor="F3F4F6")
BORDE = Border(bottom=Side(style="thin", color="D1D5DB"))
MONEDA = '"$"#,##0.00;("$"#,##0.00);"-"'
MONEDA_ENTERA = '"$"#,##0;("$"#,##0);"-"'
PORCENTAJE = '0.0%;(0.0%);"-"'


def encabezado(ws, fila, textos, alto=32):
    for col, txt in enumerate(textos, start=1):
        c = ws.cell(row=fila, column=col, value=txt)
        c.font, c.fill = ENCABEZADO_F, ENCABEZADO_FILL
        c.alignment = Alignment(wrap_text=True, vertical="center", horizontal="center")
    ws.row_dimensions[fila].height = alto


def celda(ws, fila, col, valor, fuente=NEGRO, formato=None, relleno=None):
    c = ws.cell(row=fila, column=col, value=valor)
    c.font = fuente
    if formato:
        c.number_format = formato
    if relleno:
        c.fill = relleno
    return c


def hoja_reglas(wb):
    ws = wb.create_sheet("Reglas")
    ws["A1"] = "Reglas de aumento por rango de costo"
    ws["A1"].font = TITULO_F
    ws["A2"] = "Celdas azules = puedes cambiarlas. El Excel recalcula todos los precios solo."
    ws["A2"].font = NOTA_F
    encabezado(ws, 4, ["Costo desde (MXN)", "Rango", "Aumento %", "Precio mínimo del rango (MXN)"])
    primera = 5
    for i, (desde, aumento) in enumerate(REGLAS):
        r = primera + i
        hasta = REGLAS[i + 1][0] if i + 1 < len(REGLAS) else None
        celda(ws, r, 1, desde, AZUL, MONEDA_ENTERA)
        rango = f"${desde:,} a ${hasta - 0.01:,.2f}" if hasta else f"${desde:,} en adelante"
        celda(ws, r, 2, rango)
        celda(ws, r, 3, aumento, AZUL, PORCENTAJE)
        celda(ws, r, 4, 0 if i == 0 else f"=A{r}*(1+C{r - 1})", NEGRO, MONEDA)
    ultima = primera + len(REGLAS) - 1
    notas = [
        "Redondeo: si el precio queda abajo de $1,000 se sube al siguiente número terminado en 9 (ej. $593 → $599).",
        "Si queda en $1,000 o más se sube al siguiente terminado en 49 o 99 (ej. $1,473 → $1,499).",
        "Precio mínimo del rango: lo que costaría el producto más caro del rango anterior. Así nunca vendes más",
        "barato algo que te costó más (ej. algo de $305 no queda abajo de algo de $299).",
        "Criterio: % más alto en productos baratos (para que la ganancia en pesos valga la pena) y más bajo en los",
        "caros (para que el precio siga siendo atractivo frente a tienda). Supuestos propuestos por Claude; ajústalos.",
        "La columna 'Rango' es solo texto descriptivo: si cambias 'Costo desde', actualízala a mano.",
    ]
    for i, t in enumerate(notas):
        celda(ws, ultima + 2 + i, 1, t, Font(name=FUENTE, color="374151"))
    for col, w in zip("ABCD", (20, 26, 14, 20)):
        ws.column_dimensions[col].width = w
    return f"Reglas!$A${primera}:$A${ultima}", f"Reglas!$C${primera}:$C${ultima}", \
        f"Reglas!$D${primera}:$D${ultima}"


def generar_excel(productos, pendientes, ruta: Path):
    wb = Workbook()
    ws = wb.active
    ws.title = "Precios"
    r_desde, r_aum, r_piso = hoja_reglas(wb)

    ws["A1"] = "Lista de precios interna (NO compartir con clientes)"
    ws["A1"].font = TITULO_F
    ws["A2"] = ("Azul = dato que puedes cambiar (costo). Amarillo = aumento manual opcional "
                "(ej. 0.70 = +70 %); si lo dejas vacío se usa la regla de la hoja 'Reglas'. "
                "Verde = viene de la hoja 'Reglas'. Negro = fórmula.")
    ws["A2"].font = NOTA_F
    ws["A2"].alignment = Alignment(wrap_text=True, vertical="top")
    ws.merge_cells("A2:N2")
    ws.row_dimensions[2].height = 30

    cols = ["#", "Pestaña app", "Categoría", "Producto (como sale en la app)", "Nombre en catálogo",
            "Costo (MXN)", "Aumento por regla", "Aumento manual (opcional)", "Precio mínimo del rango (MXN)",
            "Precio sin redondear (MXN)", "Precio de venta (MXN)", "Ganancia por pieza (MXN)",
            "Margen sobre venta", "Aumento real"]
    encabezado(ws, 4, cols)
    C = {nombre: get_column_letter(i) for i, nombre in enumerate(
        ["n", "pest", "cat", "app", "nom", "costo", "regla", "manual", "piso", "bruto", "venta",
         "ganancia", "margen", "real"], start=1)}

    primera = 5
    for i, p in enumerate(productos):
        r = primera + i
        costo, regla, manual, piso = (f"{C[k]}{r}" for k in ("costo", "regla", "manual", "piso"))
        bruto, venta, gan = (f"{C[k]}{r}" for k in ("bruto", "venta", "ganancia"))
        match = f"MATCH({costo},{r_desde},1)"
        celda(ws, r, 1, i + 1)
        celda(ws, r, 2, p["pestana_app"])
        celda(ws, r, 3, p["categoria"])
        celda(ws, r, 4, p["nombre_app"])
        celda(ws, r, 5, p["nombre_catalogo"])
        celda(ws, r, 6, p["costo"], AZUL, MONEDA)
        celda(ws, r, 7, f"=INDEX({r_aum},{match})", VERDE, PORCENTAJE)
        celda(ws, r, 8, p["manual"], AZUL, PORCENTAJE, AMARILLO)
        celda(ws, r, 9, f"=INDEX({r_piso},{match})", VERDE, MONEDA)
        celda(ws, r, 10, f'=IF({manual}="",MAX({costo}*(1+{regla}),{piso}),{costo}*(1+{manual}))', NEGRO, MONEDA)
        celda(ws, r, 11, f"=IF({bruto}<1000,CEILING({bruto},10)-1,CEILING({bruto},50)-1)", NEGRITA, MONEDA_ENTERA)
        celda(ws, r, 12, f"={venta}-{costo}", NEGRO, MONEDA)
        celda(ws, r, 13, f'=IF({venta}=0,"",{gan}/{venta})', NEGRO, PORCENTAJE)
        celda(ws, r, 14, f'=IF({costo}=0,"",{venta}/{costo}-1)', NEGRO, PORCENTAJE)
        for col in range(1, len(cols) + 1):
            ws.cell(row=r, column=col).border = BORDE
    ultima = primera + len(productos) - 1

    t = ultima + 1
    celda(ws, t, 5, "TOTAL (1 pieza de cada uno)", NEGRITA)
    for k, fmt in (("costo", MONEDA), ("venta", MONEDA_ENTERA), ("ganancia", MONEDA)):
        col = C[k]
        celda(ws, t, column_index_from_string(col), f"=SUM({col}{primera}:{col}{ultima})", NEGRITA, fmt)
    celda(ws, t, 13, f'=IF({C["venta"]}{t}=0,"",{C["ganancia"]}{t}/{C["venta"]}{t})', NEGRITA, PORCENTAJE)
    for col in range(1, len(cols) + 1):
        ws.cell(row=t, column=col).fill = GRIS
    ws.cell(row=t, column=6).comment = Comment(
        "Costos tomados de las capturas de la app 'Venta Empleado' que mandó el usuario.", "Claude")

    for i, w in enumerate([5, 12, 22, 36, 40, 13, 11, 13, 14, 14, 13, 14, 11, 11], start=1):
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.freeze_panes = ws.cell(row=primera, column=6)
    ws.auto_filter.ref = f"A4:{get_column_letter(len(cols))}{ultima}"

    # ---- Hoja Resumen (por pestaña de la app) ----
    res = wb.create_sheet("Resumen", 1)
    res["A1"] = "Resumen por pestaña (1 pieza de cada producto)"
    res["A1"].font = TITULO_F
    encabezado(res, 3, ["Pestaña app", "Productos", "Inversión (MXN)", "Venta (MXN)", "Ganancia (MXN)",
                        "Margen sobre venta"])
    rango = lambda k: f"Precios!${C[k]}${primera}:${C[k]}${ultima}"  # noqa: E731
    pestanas = PESTANAS + sorted({p["pestana_app"] for p in productos} - set(PESTANAS))
    for i, pest in enumerate(pestanas):
        r = 4 + i
        celda(res, r, 1, pest)
        celda(res, r, 2, f"=COUNTIF({rango('pest')},A{r})")
        celda(res, r, 3, f"=SUMIF({rango('pest')},A{r},{rango('costo')})", NEGRO, MONEDA)
        celda(res, r, 4, f"=SUMIF({rango('pest')},A{r},{rango('venta')})", NEGRO, MONEDA_ENTERA)
        celda(res, r, 5, f"=SUMIF({rango('pest')},A{r},{rango('ganancia')})", NEGRO, MONEDA)
        celda(res, r, 6, f'=IF(D{r}=0,"",E{r}/D{r})', NEGRO, PORCENTAJE)
    tr = 4 + len(pestanas)
    celda(res, tr, 1, "TOTAL", NEGRITA)
    for col, fmt in ((2, None), (3, MONEDA), (4, MONEDA_ENTERA), (5, MONEDA)):
        L = get_column_letter(col)
        celda(res, tr, col, f"=SUM({L}4:{L}{tr - 1})", NEGRITA, fmt)
    celda(res, tr, 6, f'=IF(D{tr}=0,"",E{tr}/D{tr})', NEGRITA, PORCENTAJE)
    for col in range(1, 7):
        res.cell(row=tr, column=col).fill = GRIS
    for col, w in zip("ABCDEF", (16, 11, 16, 14, 16, 12)):
        res.column_dimensions[col].width = w

    # ---- Hoja Pendientes ----
    pend = wb.create_sheet("Pendientes")
    pend["A1"] = "Productos con datos incompletos (no salen en el catálogo)"
    pend["A1"].font = TITULO_F
    encabezado(pend, 3, ["Pestaña app", "Producto (app)", "Costo visto (MXN)", "Qué falta"], alto=20)
    for i, f in enumerate(pendientes):
        r = 4 + i
        costo = (f.get("costo") or "").strip()
        celda(pend, r, 1, f.get("pestana_app"))
        celda(pend, r, 2, f.get("nombre_app"))
        celda(pend, r, 3, float(costo) if costo else None, AZUL, MONEDA)
        celda(pend, r, 4, "Precio (no se ve en la foto)" if not costo else "Nombre (cortado en la foto)")
    r = 4 + len(pendientes) + 1
    for pest, total in TOTAL_EN_APP.items():
        vistos = sum(1 for p in productos if p["pestana_app"] == pest) + \
            sum(1 for f in pendientes if f.get("pestana_app") == pest)
        celda(pend, r, 1, f"{pest}: la app dice {total} artículos y en las fotos se ven {vistos}. "
                          "Manda capturas de los que faltan.", NOTA_F)
        r += 1
    for col, w in zip("ABCD", (14, 36, 18, 30)):
        pend.column_dimensions[col].width = w

    wb.save(ruta)


def main():
    SALIDA.mkdir(exist_ok=True)
    productos, pendientes = cargar_productos()

    html_path = SALIDA / HTML_COMPLETO
    html_path.write_text(generar_html(productos, SUBTITULO), encoding="utf-8")
    trabajos = [{"html": str(html_path), "pdf": str(SALIDA / PDF_COMPLETO)}]

    with tempfile.TemporaryDirectory() as tmp:
        for titulo_img, categorias, png in IMAGENES:
            de_imagen = [p for p in productos if p["categoria"] in categorias]
            if not de_imagen:
                continue
            h = Path(tmp) / f"{png}.html"
            h.write_text(generar_html(de_imagen, titulo_img), encoding="utf-8")
            trabajos.append({"html": str(h), "png": str(SALIDA / png)})
        exportar_con_navegador(trabajos)

    generar_excel(productos, pendientes, SALIDA / EXCEL)

    en_imagenes = {c for _, cats, _ in IMAGENES for c in cats}
    sueltas = sorted({p["categoria"] for p in productos} - en_imagenes)
    if sueltas:
        print(f"AVISO: estas categorías no salen en ninguna imagen PNG (agrégalas a IMAGENES): {sueltas}")

    print(f"{'Pestaña':10} {'Producto':42} {'Costo':>9} {'Venta':>7} {'Ganancia':>9} {'Aum.':>6}")
    for p in productos:
        g = p["precio"] - p["costo"]
        print(f"{p['pestana_app']:10} {p['nombre_catalogo'][:42]:42} {p['costo']:>9,.2f} "
              f"{p['precio']:>7,} {g:>9,.2f} {p['precio'] / p['costo'] - 1:>6.0%}")
    tc = sum(p["costo"] for p in productos)
    tv = sum(p["precio"] for p in productos)
    print(f"\n{len(productos)} productos | inversión {tc:,.2f} | venta {tv:,} | "
          f"ganancia {tv - tc:,.2f} ({(tv - tc) / tv:.1%} margen)")
    print(f"Pendientes: {len(pendientes)}")


if __name__ == "__main__":
    main()
