"""
Turns the POS product photo into a device frame the deck can put screens into.

Output: public/shots/pos-frame.png — the terminal on transparency, with the
display cut out, so a screenshot can sit behind it and the bezel overlaps the
seam. Geometry below was read off the photo; re-run only if the photo changes.

    python tools/make-pos-frame.py "<path to pos device.jpg>"
"""
import sys
from collections import deque
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else r"C:/Users/leigh/OneDrive/Desktop/pos device.jpg"
OUT = 'public/shots/pos-frame.png'

DEVICE = (154, 44, 349, 522)          # the terminal in the source photo
SCREEN = (181, 212, 337, 474)         # its display, same coordinate space

im = Image.open(SRC).convert('RGBA')
dev = im.crop(DEVICE)
w, h = dev.size
px = dev.load()

# Drop the studio background by flooding in from the border, so white
# highlights on the casing survive. The photo has a soft drop shadow, so the
# cut has to reach well below pure white or a grey halo is left behind.
WHITE = 222
seen = [[False]*h for _ in range(w)]
q = deque()
for x in range(w):
    for y in (0, h-1):
        q.append((x, y))
for y in range(h):
    for x in (0, w-1):
        q.append((x, y))
while q:
    x, y = q.popleft()
    if x < 0 or y < 0 or x >= w or y >= h or seen[x][y]:
        continue
    r, g, b, _ = px[x, y]
    if r < WHITE or g < WHITE or b < WHITE:
        continue
    seen[x][y] = True
    px[x, y] = (r, g, b, 0)
    q.extend(((x+1, y), (x-1, y), (x, y+1), (x, y-1)))

# Cut the display out: the screenshot goes behind this.
sx0, sy0 = SCREEN[0]-DEVICE[0], SCREEN[1]-DEVICE[1]
sx1, sy1 = SCREEN[2]-DEVICE[0], SCREEN[3]-DEVICE[1]
for x in range(sx0, sx1):
    for y in range(sy0, sy1):
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)

dev.save(OUT)
print(f'{OUT}  {w}x{h}')
print(f'screen within frame: left {sx0/w:.4%}  top {sy0/h:.4%}  '
      f'width {(sx1-sx0)/w:.4%}  height {(sy1-sy0)/h:.4%}')
print(f'device aspect w/h = {w/h:.4f}   screen aspect = {(sx1-sx0)/(sy1-sy0):.4f}')
