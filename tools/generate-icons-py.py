"""
PromptCanvas Icon Generator — Tokyo Duo Edition
Palette: Golden Amber (#FFA649) & Slate Navy (#283845)
Renders stylish, premium vector-sharp icons with zero gradients.
"""

import math
import os
import struct
import zlib


def write_png(width, height, rgba_data, filepath):
    png = b'\x89PNG\r\n\x1a\n'

    # IHDR
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    png += struct.pack('>I', 13) + b'IHDR' + ihdr + struct.pack('>I', zlib.crc32(b'IHDR' + ihdr))

    # IDAT
    raw = bytearray()
    for y in range(height):
        raw.append(0)
        idx = y * width * 4
        raw.extend(rgba_data[idx:idx + width * 4])

    idat = zlib.compress(bytes(raw), 9)
    png += struct.pack('>I', len(idat)) + b'IDAT' + idat + struct.pack('>I', zlib.crc32(b'IDAT' + idat))

    # IEND
    png += struct.pack('>I', 0) + b'IEND' + struct.pack('>I', zlib.crc32(b'IEND'))

    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'wb') as f:
        f.write(png)


def clamp(val, low=0, high=255):
    return max(low, min(high, int(round(val))))


def generate_tokyo_icon(size):
    rgba = bytearray(size * size * 4)

    # Color Palette from the reference image (lightened for higher contrast)
    AMBER = (255, 251, 245)       # #FFFBF5 (Ultra-light warm linen/amber background)
    SLATE = (40, 56, 69)          # #283845 (Dark color foreground)
    DARK_SLATE = (21, 30, 37)     # #151E25 (Darker version for contrast)

    def put_pixel(x, y, color, a):
        if 0 <= x < size and 0 <= y < size:
            idx = (y * size + x) * 4
            ea = rgba[idx + 3] / 255.0
            na = a / 255.0
            oa = na + ea * (1.0 - na)
            if oa > 0:
                rgba[idx] = clamp((color[0] * na + rgba[idx] * ea * (1.0 - na)) / oa)
                rgba[idx + 1] = clamp((color[1] * na + rgba[idx + 1] * ea * (1.0 - na)) / oa)
                rgba[idx + 2] = clamp((color[2] * na + rgba[idx + 2] * ea * (1.0 - na)) / oa)
                rgba[idx + 3] = clamp(oa * 255)

    # 1. Fill base with Golden Amber (#FFA649)
    corner = max(1.0, size * 0.16)
    for y in range(size):
        for x in range(size):
            dx = max(0, abs(x - (size - 1) / 2.0) - ((size - 1) / 2.0 - corner))
            dy = max(0, abs(y - (size - 1) / 2.0) - ((size - 1) / 2.0 - corner))
            dist = math.sqrt(dx * dx + dy * dy)
            alpha = max(0.0, min(1.0, corner - dist + 0.5))
            if alpha > 0:
                put_pixel(x, y, AMBER, alpha * 255)

    # 2. Draw the stylish geometric Tokyo icon mark in Slate Navy (#283845)
    # Architectural 'T' / Layered Canvas glyph inspired by the Chorus Tokyo font
    def inside_glyph(nx, ny):
        # Top crossbar: x in [0.20, 0.80], y in [0.20, 0.36]
        if 0.20 <= nx <= 0.80 and 0.20 <= ny <= 0.36:
            return True

        # Vertical column: x in [0.38, 0.62], y in [0.36, 0.80]
        if 0.38 <= nx <= 0.62 and 0.36 <= ny <= 0.80:
            return True

        # Stepped bottom architectural base / wing
        if 0.28 <= nx <= 0.72 and 0.68 <= ny <= 0.80:
            return True

        # Inner cutaways for Chorus font aesthetic
        if 0.44 <= nx <= 0.56 and 0.44 <= ny <= 0.68:
            return False

        return False

    sub = 4
    for y in range(size):
        for x in range(size):
            hits = 0
            for sy in range(sub):
                for sx in range(sub):
                    nx = (x + (sx + 0.5) / sub) / size
                    ny = (y + (sy + 0.5) / sub) / size
                    if inside_glyph(nx, ny):
                        hits += 1
            if hits > 0:
                alpha = hits / float(sub * sub)
                put_pixel(x, y, SLATE, alpha * 255)

    # Subtle inner dot accent in dark slate
    dot_size = max(1, int(size * 0.08))
    dx0 = int(size * 0.46)
    dy0 = int(size * 0.52)
    for y in range(dy0, min(size, dy0 + dot_size)):
        for x in range(dx0, min(size, dx0 + dot_size)):
            put_pixel(x, y, DARK_SLATE, 255)

    return rgba


if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    root_dir = os.path.dirname(script_dir)
    icons_dir = os.path.join(root_dir, 'icons')

    sizes = [16, 32, 48, 128]
    for s in sizes:
        out_path = os.path.join(icons_dir, f'icon{s}.png')
        data = generate_tokyo_icon(s)
        write_png(s, s, data, out_path)
        print(f"  [OK] Saved to {out_path}")

    print("\n[DONE] All icons generated with Tokyo Duo palette (#FFA649 / #283845)")
