"""Make transparent gear assets from the original studio photographs.

Every cutout is resampled to one shared physical scale (PX_PER_MM) and cropped
exactly to its own silhouette, so the files themselves carry the true relative
sizes: the A7C body really is about three times the width of the 40mm lens. The
page only has to pick one millimetre-to-pixel ratio and the arrangement stays
proportional at every breakpoint.

Each entry anchors the object against a measured dimension of the real product.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

ROOT = Path(__file__).resolve().parents[1] / "public" / "gear"
# Chosen so no cutout is meaningfully upscaled past its source resolution while
# still covering the widest object at 2x on screen.
PX_PER_MM = 4.6

# anchor: which measured edge of the real product the silhouette spans, in mm.
KIT = {
    "camera": {"source": "camera.jpg", "mm_h": 71.1},    # A7C body height, screen swung out
    "sony": {"source": "sony.jpg", "mm_w": 66.6},        # FE 28-60mm maximum diameter
    "viltrox": {"source": "viltrox.png", "mm_w": 64.0},  # AF 40mm F2.5 maximum diameter
    "phone": {"source": "phone-back.jpg", "mm_h": 160.7},  # iPhone 14 Pro Max height
    "strap": {"source": "strap.jpg", "mm_h": 205.0},     # Wrist Strap Air, hanging
}


def matte(picture: Image.Image, name: str) -> Image.Image:
    """Replace the neutral studio backdrop with transparency."""
    pixels = np.array(picture)
    if pixels[:, :, 3].min() != 255:
        return picture

    rgb = pixels[:, :, :3].astype(float)
    neutral_white = (rgb.min(axis=2) > 241) & (np.ptp(rgb, axis=2) < 12)
    labels, _ = ndimage.label(neutral_white)
    border = np.unique(np.concatenate((labels[0], labels[-1], labels[:, 0], labels[:, -1])))
    background = np.isin(labels, border[border != 0])
    if name == "strap":
        # The empty wrist loop is also background, although fully enclosed.
        sizes = np.bincount(labels.ravel())
        background |= neutral_white & (sizes[labels] > 1000)

    alpha = np.where(background, 0.0, 255.0)
    # Soften the cut with a sub-pixel feather instead of a hard stair-stepped
    # edge, then pull the matte in slightly so no white studio rim survives.
    alpha = np.asarray(Image.fromarray(alpha.astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), dtype=float)
    alpha = np.clip((alpha - 96) * (255 / (232 - 96)), 0, 255)

    # Decontaminate: pixels the feather left semi-transparent still carry the
    # backdrop's white, which reads as a halo once the object sits on a dark
    # panel. Unpremultiply them back towards the object's own colour.
    edge = (alpha > 8) & (alpha < 248)
    if edge.any():
        weight = (alpha[edge] / 255)[:, None]
        recovered = (rgb[edge] - 255 * (1 - weight)) / np.maximum(weight, 0.35)
        rgb[edge] = np.clip(recovered, 0, 255)

    pixels[:, :, :3] = rgb.astype(np.uint8)
    pixels[:, :, 3] = alpha.astype(np.uint8)
    return Image.fromarray(pixels)


for name, spec in KIT.items():
    picture = matte(Image.open(ROOT / spec["source"]).convert("RGBA"), name)
    # Crop to the silhouette exactly: the file's own size is now the object's size.
    picture = picture.crop(picture.getbbox())

    if "mm_w" in spec:
        scale = spec["mm_w"] * PX_PER_MM / picture.width
    else:
        scale = spec["mm_h"] * PX_PER_MM / picture.height
    picture = picture.resize((max(1, round(picture.width * scale)), max(1, round(picture.height * scale))), Image.Resampling.LANCZOS)

    destination = ROOT / f"{name}-cutout.png"
    picture.save(destination, optimize=True)
    print(f"{destination.name:<20} {picture.width:>4} x {picture.height:<4} px "
          f"= {picture.width / PX_PER_MM:5.1f} x {picture.height / PX_PER_MM:5.1f} mm")
