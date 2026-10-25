"""
Snap every ring/tour/tap coordinate onto the UI element it points at.

The marks were measured by hand to about a percent. At the old 980px canvas a
percent was ~4px and nobody could see it; at 1920 it is ~8px and the boxes
visibly miss their targets. This re-derives them from the screenshots.

    python tools/snap-marks.py            # report what it would change
    python tools/snap-marks.py --write    # apply it

RUN IT ONCE. It is not idempotent: the search window is derived from the
declared box, so feeding it its own output lets a region creep outward a little
further each pass. Always read the report, and check the result on the slide
before trusting it — a few marks need measuring by hand, and the gate below
refuses the ones it cannot do safely rather than writing nonsense.
"""
import re, sys, os
import numpy as np
from PIL import Image
from collections import deque

SHOTS = 'public/shots'
WRITE = '--write' in sys.argv
_cache = {}

def img_for(src):
    if src not in _cache:
        p = os.path.join(SHOTS, src)
        _cache[src] = np.asarray(Image.open(p).convert('RGB')).astype(int) if os.path.exists(p) else None
    return _cache[src]

def grow(img, x, y, w, h, pad=1.6, tol=34):
    """Bbox of the solid-backed element under (x,y), bounded near the declared box."""
    H, W, _ = img.shape
    cx, cy = x/100*W, y/100*H
    hw, hh_ = w/200*W, h/200*H
    x0 = max(0, int(cx-hw-pad/100*W)); x1 = min(W, int(cx+hw+pad/100*W))
    y0 = max(0, int(cy-hh_-pad/100*H)); y1 = min(H, int(cy+hh_+pad/100*H))
    win = img[y0:y1, x0:x1]
    if win.size == 0: return None
    sx, sy = int(cx)-x0, int(cy)-y0
    hgt, wid, _ = win.shape
    if not (0 <= sx < wid and 0 <= sy < hgt): return None
    patch = win[max(0,sy-6):sy+7, max(0,sx-14):sx+15].reshape(-1,3)
    if not len(patch): return None
    cols, counts = np.unique(patch, axis=0, return_counts=True)
    seed = cols[counts.argmax()]
    near = (np.abs(win-seed).sum(axis=2) <= tol)
    if not near[sy, sx]:
        ys, xs = np.where(near)
        if not len(xs): return None
        i = np.argmin((xs-sx)**2 + (ys-sy)**2); sx, sy = int(xs[i]), int(ys[i])
    seen = np.zeros((hgt, wid), bool); q = deque([(sx, sy)]); seen[sy, sx] = True
    while q:
        px, py = q.popleft()
        for nx, ny in ((px+1,py),(px-1,py),(px,py+1),(px,py-1)):
            if 0 <= nx < wid and 0 <= ny < hgt and not seen[ny,nx] and near[ny,nx]:
                seen[ny,nx] = True; q.append((nx,ny))
    ys, xs = np.where(seen)
    if len(xs) < 20: return None
    L,R,T,B = xs.min()+x0, xs.max()+x0, ys.min()+y0, ys.max()+y0
    return (round((L+R+1)/2/W*100,1), round((T+B+1)/2/H*100,1),
            round((R-L+1)/W*100,1), round((B-T+1)/H*100,1))

def block(text, i):
    """Substring of the {...} or [...] starting at i."""
    open_c = text[i]; close_c = '}' if open_c == '{' else ']'
    depth = 0; q = None
    for j in range(i, len(text)):
        c = text[j]
        if q:
            if c == q: q = None
            continue
        if c in "'\"": q = c; continue
        if c == open_c: depth += 1
        elif c == close_c:
            depth -= 1
            if depth == 0: return text[i:j+1], j+1
    return None, i

NUM = r'-?\d*\.?\d+'

def process(path):
    text = open(path, encoding='utf-8').read()
    edits = []   # (start, end, newtext)
    report = []
    rejected = []
    for fm in re.finditer(r':frames="(\[)', text):
        arr, _ = block(text, fm.start(1))
        base = fm.start(1)
        pos = 1
        while True:
            k = arr.find('{', pos)
            if k < 0: break
            frame, nxt = block(arr, k)
            if frame is None: break
            pos = nxt
            fbase = base + k          # where this frame starts in the file
            m = re.search(r"src:\s*'([^']+)'", frame)
            if not m: continue
            src = m.group(1); img = img_for(src)
            # every mark inside this frame, with its offset within `frame`
            marks = []
            rm = re.search(r'ring:\s*\{', frame)
            if rm:
                b, _ = block(frame, rm.end()-1)
                marks.append(('ring', rm.end()-1, b))
            tm = re.search(r'tour:\s*\[', frame)
            if tm:
                tb, _ = block(frame, tm.end()-1)
                off = tm.end()-1; p2 = 1
                while True:
                    kk = tb.find('{', p2)
                    if kk < 0: break
                    ib, n2 = block(tb, kk)
                    if ib is None: break
                    marks.append(('tour', off+kk, ib)); p2 = n2
            tp = re.search(r'tap:\s*\{', frame)
            if tp:
                b, _ = block(frame, tp.end()-1)
                marks.append(('tap', tp.end()-1, b))

            for kind, off, body in marks:
                gx = re.search(rf'x:\s*({NUM})', body); gy = re.search(rf'y:\s*({NUM})', body)
                if not (gx and gy): continue
                x, y = float(gx.group(1)), float(gy.group(1))
                if kind == 'tap':
                    if img is None: continue
                    r = grow(img, x, y, 8, 4)
                    if not r: continue
                    nx, ny = r[0], r[1]
                    if abs(nx-x) > 3 or abs(ny-y) > 3:
                        rejected.append(f'  {src:34} tap   {x},{y} -> {nx},{ny}  REJECTED')
                        continue
                    if abs(nx-x) < .25 and abs(ny-y) < .25: continue
                    new = body
                    new = re.sub(rf'(x:\s*){NUM}', lambda m: m.group(1)+fmt(nx), new, count=1)
                    new = re.sub(rf'(y:\s*){NUM}', lambda m: m.group(1)+fmt(ny), new, count=1)
                    edits.append((0, 0, None))  # placeholder, fixed up next
                    edits[-1] = (fbase+off, fbase+off+len(body), new)
                    report.append(f'  {src:34} tap   {x},{y} -> {nx},{ny}')
                    continue
                gw = re.search(rf'w:\s*({NUM})', body); gh = re.search(rf'h:\s*({NUM})', body)
                if not (gw and gh) or img is None: continue
                w, h = float(gw.group(1)), float(gh.group(1))
                r = grow(img, x, y, w, h)
                if not r: continue
                nx, ny, nw, nh = r
                # A seed that lands on a glyph instead of the element's fill
                # grows a letter, not a button. Refuse anything that changes the
                # box beyond recognition, and say so rather than writing it.
                if not (0.55*w <= nw <= 1.8*w and 0.55*h <= nh <= 2.2*h
                        and abs(nx-x) <= 3 and abs(ny-y) <= 3):
                    rejected.append(f'  {src:34} {kind:5} {x},{y},{w},{h} -> {nx},{ny},{nw},{nh}  REJECTED')
                    continue
                if max(abs(nx-x), abs(ny-y), abs(nw-w), abs(nh-h)) < .25: continue
                new = body
                for key, val in (('x', nx), ('y', ny), ('w', nw), ('h', nh)):
                    new = re.sub(rf'({key}:\s*){NUM}', lambda m, v=val: m.group(1)+fmt(v), new, count=1)
                edits.append((fbase+off, fbase+off+len(body), new))
                report.append(f'  {src:34} {kind:5} {x},{y},{w},{h} -> {nx},{ny},{nw},{nh}')
    # apply back-to-front
    out = text
    for s, e, new in sorted(edits, key=lambda t: -t[0]):
        out = out[:s] + new + out[e:]
    return out, report, rejected

def fmt(v):
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s

total = 0
for path in ['pages/01-driver.md', 'pages/02-kiosk.md']:
    out, rep, rej = process(path)
    print(f'{path}: {len(rep)} adjusted, {len(rej)} rejected')
    for line in rep: print(line)
    for line in rej: print(line)
    total += len(rep)
    if WRITE and rep:
        open(path, 'w', encoding='utf-8', newline='\n').write(out)
print(f'\n{total} marks {"written" if WRITE else "would change"}')
