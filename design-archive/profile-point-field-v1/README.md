# Profile point-field, version 1

Snapshot before the camera-sensor experiment. No commit needed.

The original component remains at `app/components/ProfileField.tsx`. To restore only
that background, replace `<CameraSensor />` in Portfolio with `<ProfileField hue={hue} />`
and restore its import. Remove the `profile-camera` class and camera-specific profile
layout styles if restoring the original arrangement too.

These snapshots preserve the exact component, complete profile markup, and CSS from
before this experiment. Use them as reference for a selective restoration; replacing
the complete files would also revert later unrelated changes.

Defaults: hue 12, chroma 88, exposure/light 58, P3, warm temperature.
Field: 28px grid, 180px pointer radius, spring .065, damping .79,
330px/s click ripples lasting 1.6s, at most six ripples, DPR capped at 2.
