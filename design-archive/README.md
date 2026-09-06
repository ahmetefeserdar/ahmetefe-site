# Design snapshots

These are intentional rollback references, not active application code. Keep them
out of `app/` and `public/` so experiments are neither compiled nor deployed.

- `profile-point-field-v1/`: original interactive background and settings.
- `profile-camera-v2/`: camera experiment.
- `before-uniform-theme/`: saved contrasting section theme.
- `retired-components/`: latest inactive background components, preserved as text.
- `assets/profile.jpg`: original portrait; restore to `public/profile.jpg` if needed.

The active stylesheet is now `app/globals.css`. Historical `site-v3.css` snapshots
are unchanged; apply relevant rules selectively rather than replacing current files.
