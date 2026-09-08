"""1-bit Atkinson plate for Selected Work.

usage: python scripts/plate.py IN.png OUT.png [--width 440] [--gamma 1.0] [--contrast 1.0] [--autocontrast 0]
Prints "W H". Needs Pillow + numpy (scripts/requirements.txt). Driven by scripts/assets.mjs.
"""
import argparse
import sys

import numpy as np
from PIL import Image, ImageEnhance, ImageOps


def atkinson(g):
    """g: float32 HxW in 0..1 -> bool HxW (True = white).

    Error/8 goes to (x+1,y) (x+2,y) (x-1,y+1) (x,y+1) (x+1,y+1) (x,y+2); the remaining
    2/8 is dropped on purpose. That loss is what gives Atkinson its high-contrast,
    blown-highlight look.
    """
    h, w = g.shape
    g = np.pad(g.astype(np.float32), ((0, 2), (1, 2)))  # 1 left, 2 right, 2 bottom: no bounds checks
    out = np.zeros((h, w), dtype=bool)
    for y in range(h):
        row, r1, r2 = g[y], g[y + 1], g[y + 2]
        for x in range(1, w + 1):
            old = row[x]
            new = 1.0 if old >= 0.5 else 0.0
            out[y, x - 1] = new > 0.5
            e = (old - new) * 0.125
            row[x + 1] += e
            row[x + 2] += e
            r1[x - 1] += e
            r1[x] += e
            r1[x + 1] += e
            r2[x] += e
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("dst")
    ap.add_argument("--width", type=int, default=440)
    ap.add_argument("--gamma", type=float, default=1.0, help="<1 lifts shadows; ~0.5 for white-on-black sites")
    ap.add_argument("--contrast", type=float, default=1.0)
    ap.add_argument("--autocontrast", type=float, default=0.0, help="percent cutoff for ImageOps.autocontrast, 0 = off")
    a = ap.parse_args()

    im = Image.open(a.src).convert("RGB")
    w, h = im.size
    tw, th = a.width, max(1, round(h * a.width / w))
    im = im.resize((tw, th), Image.Resampling.LANCZOS, reducing_gap=3.0).convert("L")
    if a.autocontrast > 0:
        im = ImageOps.autocontrast(im, cutoff=a.autocontrast)
    if a.contrast != 1.0:
        im = ImageEnhance.Contrast(im).enhance(a.contrast)
    g = np.asarray(im, dtype=np.float32) / 255.0
    if a.gamma != 1.0:
        g = np.power(g, a.gamma)

    bits = atkinson(g)
    black = 100.0 * (~bits).mean()
    if black > 97 or black < 3:
        print(f"warning: {a.dst} is {black:.1f}% black, tune --gamma/--contrast", file=sys.stderr)
    Image.fromarray(bits).save(a.dst, optimize=True)  # bool array -> mode "1" -> true 1-bit PNG
    print(tw, th)


if __name__ == "__main__":
    main()
