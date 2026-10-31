import csv, glob, os, re, json, difflib
from collections import defaultdict

def norm(s):
    s = s.upper().replace('Í','I').replace('É','E').replace('Á','A').replace('Ó','O').replace('Ú','U')
    return re.sub(r'[^A-Z0-9]+', ' ', s).strip()

def palabras(tsv, minconf):
    out = []
    for r in csv.DictReader(open(tsv, encoding='utf-8'), delimiter='\t', quoting=csv.QUOTE_NONE):
        if r['level'] != '5' or not (r['text'] or '').strip(): continue
        try: conf = float(r['conf'])
        except: continue
        if conf < minconf: continue
        x0, y0 = int(r['left']), int(r['top']); w, h = int(r['width']), int(r['height'])
        if h < 8: continue
        out.append({'t': r['text'], 'b': [x0, y0, x0+w, y0+h], 'h': h, 'c': conf})
    return out

def iou(a, b):
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    inter = ix*iy; ua = (a[2]-a[0])*(a[3]-a[1]) + (b[2]-b[0])*(b[3]-b[1]) - inter
    return inter/ua if ua else 0

def lineas(*tsvs):
    ws = []
    for tsv, mc in tsvs:
        for w in palabras(tsv, mc):
            dup = next((o for o in ws if iou(o['b'], w['b']) > 0.4), None)
            if dup is None: ws.append(w)
            elif w['c'] > dup['c']: ws[ws.index(dup)] = w
    ws.sort(key=lambda w: ((w['b'][1]+w['b'][3])/2, w['b'][0]))
    L = []
    for w in ws:
        yc = (w['b'][1]+w['b'][3])/2
        for l in L:
            lyc = (l['box'][1]+l['box'][3])/2
            if abs(yc-lyc) < 0.6*l['h'] and w['b'][0]-l['box'][2] < 2.2*l['h'] and w['b'][2] > l['box'][0]-2.2*l['h']:
                l['ws'].append(w); b = l['box']
                l['box'] = [min(b[0],w['b'][0]), min(b[1],w['b'][1]), max(b[2],w['b'][2]), max(b[3],w['b'][3])]
                break
        else:
            L.append({'ws': [w], 'box': list(w['b']), 'h': w['h']})
    for l in L:
        l['ws'].sort(key=lambda w: w['b'][0]); l['text'] = ' '.join(w['t'] for w in l['ws'])
        l['h'] = sorted(w['h'] for w in l['ws'])[len(l['ws'])//2]
    return L

def candidatos(lns):
    """líneas sueltas y pares de líneas (nombres que ocupan 2 renglones)"""
    c = []
    for i, a in enumerate(lns):
        c.append((norm(a['text']), a['box'], a['h'], [i]))
        for j, b in enumerate(lns):
            if j == i: continue
            ax = (a['box'][0]+a['box'][2])/2; bx = (b['box'][0]+b['box'][2])/2
            gap = b['box'][1] - a['box'][3]
            if 0 <= gap <= 1.6*a['h'] and abs(ax-bx) < 6*a['h']:
                box = [min(a['box'][0],b['box'][0]), a['box'][1], max(a['box'][2],b['box'][2]), b['box'][3]]
                c.append((norm(a['text']+' '+b['text']), box, a['h'], [i,j]))
    return c

COLORES = [{'ROJA','ROJO','RJ','RED','RJO'}, {'NEGRA','NEGRO','NGO','NG','BLACK','BLK','NERA'},
           {'GRIS','GREY','GRAY','GR'}, {'AZUL','BLUE','BLU'}, {'BEIGE','BG'}, {'BL'}]
def puntaje(n, c):
    sc = difflib.SequenceMatcher(None, n, c).ratio()
    dn = set(re.findall(r'\d+', n)); dc = set(re.findall(r'\d+', c))
    if dn != dc: sc -= 0.12 * len(dn ^ dc)
    tn, tc = set(n.split()), set(c.split())
    gn = {i for i,g in enumerate(COLORES) if tn & g}; gc = {i for i,g in enumerate(COLORES) if tc & g}
    if gn and gc and not (gn & gc): sc -= 0.2
    return sc

if __name__ == '__main__':
    prods = list(csv.DictReader(open('/home/user/automatizacion-/catalogo-cocina/productos.csv', encoding='utf-8')))
    ocr = {os.path.basename(f)[:-4]: lineas((f, 40), (f.replace('/ocr/','/ocr2/'), 55)) for f in sorted(glob.glob('/tmp/fotos_app/ocr/*.tsv'))}
    cands = {img: candidatos(l) for img, l in ocr.items()}
    res = {}
    for p in prods:
        n = norm(p['nombre_app'])
        if not n or n.startswith('NOMBRE CORTADO'): continue
        hits = []
        for img, cs in cands.items():
            best = max(cs, key=lambda c: puntaje(n, c[0]), default=None)
            if best is None: continue
            sc = puntaje(n, best[0])
            if sc >= 0.62: hits.append({'img': img, 'score': round(sc,3), 'box': best[1], 'h': best[2], 'txt': best[0]})
        hits.sort(key=lambda h: -h['score'])
        res[p['nombre_app']] = hits
    json.dump(res, open('/tmp/fotos_app/work/matches.json','w'), indent=1)
    sin = [k for k,v in res.items() if not v]
    print('productos:', len(res), '| con al menos 1 coincidencia:', len(res)-len(sin))
    print('SIN COINCIDENCIA:'); [print('  ', s) for s in sin]
