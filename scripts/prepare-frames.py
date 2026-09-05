"""Derive the gallery and lightbox images from the full-resolution masters.

photo-masters/NN.jpg holds the untouched exports. They live outside public/ so
the 140 MB of originals never reach the static export; everything the site ships
is generated from them, so re-running this script is always safe.

  public/frames/w640/NN.webp   grid, phones and contact-sheet cells
  public/frames/w1280/NN.webp  grid, desktop and retina phones
  public/frames/view/NN.webp   lightbox
"""
from pathlib import Path

from PIL import Image

PROJECT = Path(__file__).resolve().parents[1]
ROOT = PROJECT / "public" / "frames"
MASTERS = PROJECT / "photo-masters"
# Long-edge width, output directory, encoder quality.
DERIVATIVES = [(640, "w640", 74), (1280, "w1280", 76), (2400, "view", 80)]
LONGEST = max(width for width, _, _ in DERIVATIVES)

for width, folder, quality in DERIVATIVES:
    (ROOT / folder).mkdir(parents=True, exist_ok=True)

written = 0
for master in sorted(MASTERS.glob("*.jpg")):
    picture = Image.open(master)
    # Decode at the smallest DCT scale that still covers the largest derivative.
    picture.draft("RGB", (LONGEST, LONGEST))
    picture = picture.convert("RGB")
    for long_edge, folder, quality in DERIVATIVES:
        scale = long_edge / max(picture.size)
        if scale >= 1:
            resized = picture
        else:
            resized = picture.resize((round(picture.width * scale), round(picture.height * scale)), Image.Resampling.LANCZOS)
        destination = ROOT / folder / f"{master.stem}.webp"
        resized.save(destination, "WEBP", quality=quality, method=5)
        written += 1
    print(master.stem, picture.size, "->", ", ".join(folder for _, folder, _ in DERIVATIVES))

print(f"\n{written} files written")
for _, folder, _ in DERIVATIVES:
    files = list((ROOT / folder).glob("*.webp"))
    total = sum(f.stat().st_size for f in files)
    print(f"  {folder:<6} {len(files):>3} files  {total / 1048576:6.1f} MB  avg {total / len(files) / 1024:5.0f} KB")
