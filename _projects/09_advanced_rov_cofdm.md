---
layout: page
title: Advanced ROV — 6-DOF Arm & COFDM Multi-Camera
description: >
  Next-generation ROV with 6-DOF arm (20 kg @ 5 km/h), six IP cameras,
  1.4 GHz COFDM 1 km video link, HCU/OCU dual control.
img: assets/img/projects/advanced_rov.jpg
importance: 9
category: professional
---

Next-generation ROV demonstrating significantly expanded capability over the
[Soinik family](../03_soinik_rov): a 6-DOF robotic arm carrying **20 kg while
moving at 5 km/h**, paired with a comprehensive multi-camera and wireless video
system. Targeted at field operations where situational awareness and operator
adaptability are the limiting factors.

### Vision System — Six IP Cameras

| Role | Capabilities |
|---|---|
| Main PTZ | Pan/tilt/zoom — primary situational awareness |
| Claw PTZ | Pan/tilt/zoom — fine manipulation feedback |
| 3× zoom cameras | 4× optical zoom each — secondary angles |
| Thermal | Heat-signature monitoring |
| All cameras | Night-vision capability |

Live video transmitted over a **1.4 GHz COFDM** link at up to **1 km range**,
chosen for low-latency, secure video transport that holds up in RF-noisy
environments where commodity 2.4/5 GHz video links degrade.

### Operator-Side Control — Three Modes

- **HCU (Handheld Control Unit)** — short-range, lightweight portable operation
- **OCU (Operation Control Unit)** — long-range with full diagnostics and
  multi-camera switching
- **Wired optical fallback** — fibre tether for fully RF-contested environments,
  preserving operator control when the wireless channels are jammed

### Engineering Focus

- **Multi-camera streaming pipeline** over COFDM — synchronisation across six
  feeds, latency budgeting for arm-end-effector teleop, bandwidth allocation
  per camera role.
- **Heavy-payload arm dynamics** — 20 kg lift while in transit at 5 km/h
  imposes coupling between locomotion and manipulation control loops.
- **Fail-soft control hand-off** — automatic degrade from wireless OCU to
  wired fallback when link quality drops below thresholds.

### Tech Stack

`1.4 GHz COFDM` · `IP cameras` · `PTZ control` · `Thermal imaging` · `Night vision` · `STM32` · `Embedded C`
