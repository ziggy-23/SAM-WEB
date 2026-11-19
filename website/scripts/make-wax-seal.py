# Turns a studio portrait into a dark wax-seal relief (transparent PNG).
# Usage: pip install opencv-python-headless scipy pillow numpy
#        python3 make-wax-seal.py input.jpg output.png vol=150 det=1.15 mid=0.34 spec=0.7
import sys, numpy as np, cv2
from scipy import ndimage as ndi

src = sys.argv[1]; out = sys.argv[2]
P = dict(a.split('=') for a in sys.argv[3:])
img = cv2.imread(src)                       # BGR 896x1195
H, W = img.shape[:2]

# 1. Separate the person from the plain grey backdrop (GrabCut seeded with a rectangle).
mask = np.zeros((H, W), np.uint8)
rect = (20, 90, W - 40, H - 90)
bgd = np.zeros((1, 65), np.float64); fgd = np.zeros((1, 65), np.float64)
cv2.grabCut(img, mask, rect, bgd, fgd, 6, cv2.GC_INIT_WITH_RECT)
person = np.where((mask == 1) | (mask == 3), 1.0, 0.0)
person = ndi.binary_opening(person > 0, iterations=3)
lab, n = ndi.label(person); sizes = ndi.sum(person, lab, range(1, n + 1))
person = (lab == (np.argmax(sizes) + 1)).astype(np.float32)
person = ndi.binary_fill_holes(person).astype(np.float32)

# 2. Square crop: head and shoulders, like a bust on a medallion.
cx, top, size = W // 2 - 10, int(P.get('top', 70)), int(P.get('size', 830))
sl = (slice(top, top + size), slice(cx - size // 2, cx + size // 2))
img = img[sl]; person = person[sl]
S = 1400
scale = float(P.get('scale', 0.74)); B = int(S * scale)
img_b = cv2.resize(img, (B, B), interpolation=cv2.INTER_AREA)
per_b = cv2.resize(person, (B, B), interpolation=cv2.INTER_LINEAR)
ox = (S - B) // 2; oy = int(S * float(P.get('oy', 0.17)))
img = np.full((S, S, 3), 128, np.uint8); person = np.zeros((S, S), np.float32)
h2 = min(B, S - oy)
img[oy:oy + h2, ox:ox + B] = img_b[:h2]; person[oy:oy + h2, ox:ox + B] = per_b[:h2]
person_soft = cv2.GaussianBlur(person, (0, 0), 3)

# 3. Height map: an overall volume (distance from the silhouette edge) plus facial detail.
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
smooth = cv2.bilateralFilter(gray, 15, 0.10, 12)
smooth = cv2.GaussianBlur(smooth, (0, 0), float(P.get('soft', 2.2)))
detail = smooth - cv2.GaussianBlur(smooth, (0, 0), 18)           # local relief (features)
mid = cv2.GaussianBlur(smooth, (0, 0), 6)
dist = ndi.distance_transform_edt(person > 0.5).astype(np.float32)
dist = cv2.GaussianBlur(dist, (0, 0), 6)
volume = np.sqrt(np.clip(dist / float(P.get('vol', 120)), 0, 1))  # rounded bust
height = person_soft * (0.55 * volume + float(P.get('mid', 0.25)) * mid + float(P.get('det', 1.6)) * detail)
height = cv2.GaussianBlur(height, (0, 0), 2.0)

# 4. The seal: flat field, raised rim, and an uneven poured edge.
yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
c = S / 2; r = np.hypot(xx - c, yy - c); ang = np.arctan2(yy - c, xx - c)
R_in, R_rim = S * 0.40, S * 0.445
wobble = (S * 0.006) * (np.sin(ang * 3 + 1.3) + 0.7 * np.sin(ang * 7 + 0.4) + 0.5 * np.sin(ang * 13 + 2.1) + 0.3 * np.sin(ang * 29 + 0.9))
R_out = S * 0.488 + wobble
inner = np.clip((R_in - r) / 3, 0, 1)
rim = np.exp(-((r - (R_in + R_rim) / 2) / (S * 0.016)) ** 2) * 0.55
outer_fall = np.clip((R_out - r) / (S * 0.03), 0, 1) ** 0.6 * 0.18
relief = height * inner * 0.85 + rim + outer_fall * (r > R_rim) + 0.12 * (r <= R_rim)
alpha = np.clip((R_out - r) / 2.5, 0, 1)

# 5. Light it like glossy wax: diffuse + a soft specular sheen from the top left.
k = float(P.get('k', 60))
gy, gx = np.gradient(relief * k)
nx, ny, nz = -gx, -gy, np.ones_like(gx)
nl = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2); nx, ny, nz = nx / nl, ny / nl, nz / nl
L = np.array([-0.55, -0.65, 0.52]); L /= np.linalg.norm(L)
diff = np.clip(nx * L[0] + ny * L[1] + nz * L[2], 0, 1)
Hh = L + np.array([0, 0, 1.0]); Hh /= np.linalg.norm(Hh)
spec = np.clip(nx * Hh[0] + ny * Hh[1] + nz * Hh[2], 0, 1) ** 40

# Colour: the site's near-black with a faint olive warmth (ink #111210 … stone).
dark = np.array([12, 12, 11], np.float32); mid_c = np.array([50, 49, 43], np.float32); hi = np.array([150, 144, 128], np.float32)
t = diff[..., None]
col = dark + (mid_c - dark) * t * 1.15 + hi * spec[..., None] * float(P.get('spec', 0.55))
ao = cv2.GaussianBlur(relief, (0, 0), 12) - relief           # cavities slightly darker
col *= np.clip(1 - ao[..., None] * 1.6, 0.6, 1.1)
col = np.clip(col, 0, 255)

# 6. A soft contact shadow so it sits on the page, then save with transparency.
shadow = cv2.GaussianBlur(np.roll(np.roll(alpha, 14, 0), 10, 1), (0, 0), 16) * 0.75
a_total = np.clip(alpha + shadow * (1 - alpha), 0, 1)
rgb = (col * alpha[..., None]) / np.maximum(a_total[..., None], 1e-4)
rgba = np.dstack([rgb[..., ::-1] if False else rgb, a_total * 255]).astype(np.uint8)
from PIL import Image
Image.fromarray(rgba, 'RGBA').resize((1000, 1000), Image.LANCZOS).save(out, optimize=True)
# Preview on the site background colour
bg = Image.new('RGBA', (1000, 1000), (17, 18, 16, 255)); bg.alpha_composite(Image.open(out))
bg.convert('RGB').save(out.replace('.png', '-preview.jpg'), quality=90)
print('ok')
