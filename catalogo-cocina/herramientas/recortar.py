import json, os, sys, cv2, numpy as np
sys.path.insert(0, os.path.dirname(__file__))
from ocr_match import lineas, puntaje, norm
import csv as _csv
nombres = [norm(p['nombre_app']) for p in _csv.DictReader(open('/home/user/automatizacion-/catalogo-cocina/productos.csv', encoding='utf-8')) if p['nombre_app'] and not p['nombre_app'].startswith('(')]
SRC = '/tmp/fotos_app/src'; OUT = '/tmp/fotos_app/crops'; os.makedirs(OUT, exist_ok=True)
matches = json.load(open('/tmp/fotos_app/work/matches.json'))
overrides = json.load(open('/tmp/fotos_app/work/overrides.json')) if os.path.exists('/tmp/fotos_app/work/overrides.json') else {}
_lin = {}
def lineas_de(img):
    if img not in _lin:
        _lin[img] = lineas((f'/tmp/fotos_app/ocr/{img}.tsv', 40), (f'/tmp/fotos_app/ocr2/{img}.tsv', 55))
    return _lin[img]
_im = {}
def imagen(img):
    if img not in _im: _im[img] = cv2.imread(f'{SRC}/{img}.jpg')
    return _im[img]

import re as _re
_hdr = {}
def tope_encabezado(img):
    """parte de abajo del encabezado de la app (pestañas / buscador), para no recortarlo"""
    if img not in _hdr:
        H = imagen(img).shape[0]; y = 0
        for l in lineas_de(img):
            t = _re.sub(r'[^A-Z]', '', l['text'].upper())
            if l['box'][3] > 0.45*H: continue
            b, h = l['box'][3], l['h']
            if any(k in t for k in ('ENCONTRADOS','ARTICULOS','ARTCULOS','ENCON')): y = max(y, b + int(1.0*h))
            if any(k in t for k in ('FOODPREP','KWPC','CWBW')): y = max(y, b + int(6.5*h))
            if 'PRODUCTOS' in t: y = max(y, b + int(8.5*h))
        _hdr[img] = y
    return _hdr[img]

def region(hit):
    """espacio entre el texto de arriba (precio de la tarjeta anterior / encabezado) y el nombre"""
    x0, y0, x1, y1 = hit['box']; h = hit['h']; cx = (x0+x1)/2
    L, R = cx-7.4*h, cx+7.4*h
    top_txt = None
    for l in lineas_de(hit['img']):
        b = l['box']
        if b[3] > y0-0.3*h or b[3] < y0-11*h: continue
        if b[2] < L or b[0] > R: continue
        if not (0.55*h <= l['h'] <= 2.2*h): continue
        if len(_re.sub(r'[^A-Za-z0-9]', '', l['text'])) < 3: continue
        top_txt = b[3] if top_txt is None else max(top_txt, b[3])
    hdr = tope_encabezado(hit['img'])
    if top_txt is not None:
        top = top_txt + 0.4*h; por_texto = True
    else:
        top = max(y0-9.5*h, 0); por_texto = False
    if hdr > top: top = hdr; por_texto = False
    return [int(L), int(top), int(R), int(y0-0.3*h)], por_texto

def primer_plano(im, reg, h):
    H, W = im.shape[:2]
    rx0, ry0, rx1, ry1 = max(0,reg[0]), max(0,reg[1]), min(W,reg[2]), min(H,reg[3])
    if rx1-rx0 < 3*h or ry1-ry0 < 2.5*h: return None, 0
    sub = im[ry0:ry1, rx0:rx1]
    g = cv2.GaussianBlur(cv2.cvtColor(sub, cv2.COLOR_BGR2GRAY), (0,0), 2.0)
    sat = cv2.cvtColor(cv2.GaussianBlur(sub,(0,0),2.0), cv2.COLOR_BGR2HSV)[:,:,1]
    # fondo = tono claro típico de la tarjeta (percentil alto), lo demás es producto
    bgv = np.percentile(g, 85)
    mask = ((g < bgv - 30) | (sat > 75)).astype(np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3,3),np.uint8))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((13,13),np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(mask, 8)
    comps = []
    for i in range(1, n):
        x, y, w, hh, a = st[i]
        if a < 0.3*h*h: continue
        if hh < 0.18*w and w > 5*h: continue          # líneas largas: buscador / bordes
        if w < 0.18*hh and hh > 5*h: continue
        comps.append((a, x, y, w, hh))
    if not comps: return None, 0
    big = max(c[0] for c in comps)
    keep = [c for c in comps if c[0] >= 0.05*big]
    xs0 = min(c[1] for c in keep); ys0 = min(c[2] for c in keep)
    xs1 = max(c[1]+c[3] for c in keep); ys1 = max(c[2]+c[4] for c in keep)
    return (rx0+xs0, ry0+ys0, rx0+xs1, ry0+ys1), int(sum(c[0] for c in keep))

def guardar(im, bb, ruta, lado_final=320):
    x0,y0,x1,y1 = [int(v) for v in bb]; H, W = im.shape[:2]
    m = int(0.05*max(x1-x0, y1-y0)) + 2
    x0, y0, x1, y1 = max(0,x0-m), max(0,y0-m), min(W,x1+m), min(H,y1+2)
    crop = im[y0:y1, x0:x1].copy()
    if max(crop.shape[:2]) < 200:   # fotos chiquitas (Food Prep): agrandar antes de limpiar
        f = 200/max(crop.shape[:2]); crop = cv2.resize(crop, None, fx=f, fy=f, interpolation=cv2.INTER_CUBIC)
    crop = cv2.fastNlMeansDenoisingColored(crop, None, 7, 7, 7, 21)
    h, w = crop.shape[:2]
    # corrección de iluminación: plano ajustado a los pixeles del borde (fondo de la tarjeta)
    yy, xx = np.mgrid[0:h, 0:w]
    ring = np.zeros((h, w), bool); r = max(3, int(0.03*min(h, w)))
    ring[:r] = ring[-r:] = True; ring[:, :r] = ring[:, -r:] = True
    A = np.stack([np.ones(ring.sum()), xx[ring], yy[ring]], 1).astype(np.float64)
    out = np.empty_like(crop, dtype=np.float32)
    for c in range(3):
        vals = crop[:, :, c][ring].astype(np.float64)
        coef, *_ = np.linalg.lstsq(A, vals, rcond=None)
        bg = (coef[0] + coef[1]*xx + coef[2]*yy).clip(90, 255)
        out[:, :, c] = crop[:, :, c] * (250.0/bg)
    out = out.clip(0, 255)
    mn, mx = out.min(axis=2), out.max(axis=2)
    # fondo = claro y sin color (incluye el patrón de rayas de la pantalla)
    fondo = ((mn > 214) & (mx - mn < 24)).astype(np.uint8)
    fondo = cv2.morphologyEx(fondo, cv2.MORPH_CLOSE, np.ones((3,3), np.uint8))
    # solo se blanquea lo que está conectado al borde (no los brillos dentro del producto)
    n, lab = cv2.connectedComponents(fondo, connectivity=8)
    borde_ids = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    mask = np.isin(lab, list(borde_ids)) & (fondo > 0)
    mask = cv2.dilate(mask.astype(np.uint8), np.ones((2,2), np.uint8)) > 0
    out[mask] = 255
    out[mn > 232] = 255
    out = out.astype(np.uint8)
    s = int(max(h, w)*1.08)
    canvas = np.full((s, s, 3), 255, np.uint8)
    canvas[(s-h)//2:(s-h)//2+h, (s-w)//2:(s-w)//2+w] = out
    cv2.imwrite(ruta, cv2.resize(canvas, (lado_final, lado_final), interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 84])

def slug(s):
    import re
    return re.sub(r'[^a-z0-9]+', '_', s.lower()).strip('_')[:60]

def iou_bb(a, b):
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    inter = ix*iy; ua = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter/ua if ua else 0

resumen = {}; usados = []
orden = sorted(matches.items(), key=lambda kv: -(kv[1][0]['score'] if kv[1] else 0))
for app, hits in orden:
    if app in overrides:
        o = overrides[app]
        if o is None: resumen[app] = None; continue
        cur_img = o['img']; im = imagen(cur_img)
        ruta = f'{OUT}/{slug(app)}.jpg'; guardar(im, o['bb'], ruta)
        resumen[app] = {'img': cur_img, 'bb': o['bb'], 'manual': True}; continue
    mejor = None
    for hit in hits[:8]:
        otro = max(nombres, key=lambda n: puntaje(n, hit['txt']))
        if otro != norm(app) and puntaje(otro, hit['txt']) > hit['score'] + 0.02: continue
        cur_img = hit['img']; im = imagen(cur_img)
        reg, por_texto = region(hit)
        bb, area = primer_plano(im, reg, hit['h'])
        if bb is None: continue
        lado = max(bb[2]-bb[0], bb[3]-bb[1])
        if lado < 2.6*hit['h']: continue
        cortada = (not por_texto) and bb[1] <= max(reg[1], 0) + 3
        puntos = hit['score'] + (0 if cortada else 0.3) + min(lado/(14*hit['h']), 1)*0.1
        if mejor is None or puntos > mejor[0]:
            mejor = (puntos, cur_img, bb, hit['score'], not cortada, lado)
    if mejor is None: resumen[app] = None; continue
    _, cur_img, bb, sc, dentro, frac = mejor
    usados.append((cur_img, bb))
    guardar(imagen(cur_img), bb, f'{OUT}/{slug(app)}.jpg')
    resumen[app] = {'img': cur_img, 'bb': [int(v) for v in bb], 'score': sc, 'completa': dentro}
json.dump(resumen, open('/tmp/fotos_app/work/resumen.json','w'), indent=1)
print('con foto:', sum(1 for v in resumen.values() if v), 'de', len(resumen))
