# Ahmet Efe's portfolio

Next.js App Router, React, TypeScript and a static export hosted on Cloudflare.

## Development

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Run `npm run lint` and `npx tsc --noEmit` for checks.
`npm run build` (also `npm run export`) generates the static site in `out/`.
Deploy that directory; `next start` is not supported by this static-export setup.

## Structure

- `app/`: route, metadata, icons, active `globals.css`, gallery loader and UI components.
- `public/`: assets used by the live website, including generated gallery and gear images.
- `assets/photography/`: original photo masters, excluded from the deployed site.
- `assets/gear/`: original product photos and source attribution.
- `assets/thesis/`: supporting thesis images retained for future edits.
- `scripts/`: image preparation tools.
- `design-archive/`: deliberate design snapshots and retired experiments for rollback.
- `.next/`, `out/`, `node_modules/`: generated, ignored directories.

## Image preparation

Install Python dependencies in a virtual environment:

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
python scripts/prepare-frames.py
python scripts/prepare-gear-cutouts.py
```

Gallery derivatives are 640 and 1280 pixels wide; lightbox images have a 2400-pixel
longest edge. Gear cutouts are generated from `assets/gear/` into `public/gear/`.
Commit generated public assets along with changes to their preparation scripts.
Normal builds use these checked-in assets and do not require Python.
