---
layout: page
title: Jontro Soinik v1 — Tele-Op & Multi-Camera Vision (COFDM, HCU/OCU)
description: >
  Deep-dive on Jontro Soinik v1's teleoperation and vision subsystem —
  6-camera IP head, 1.4 GHz COFDM 1 km video link, HCU / OCU / wired-optical
  control hand-off.
img: assets/img/projects/advanced_rov.jpg
importance: 5
category: professional
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-info" role="alert">
      <strong>Scope.</strong> This page goes deep on the teleoperation control modes and the multi-camera + COFDM video subsystem of <strong>Jontro Soinik v1</strong>. For the full robot — chassis, arm, communication architecture, UN deployment context — see the main
      <a href="{{ '/projects/03_soinik_rov/' | relative_url }}">EOD ROV family page</a>.
    </div>
  </div>
</div>

The vision and tele-op stack documented here is what an operator actually sees and touches on Jontro Soinik v1 in the field: six IP cameras feeding back over a long-range RF video link, two physical control units sized for different mission profiles, and a wired fallback that keeps the robot under operator command when the RF environment turns hostile.

<div class="row project-photo-row mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/jontro-soinik-v1-bench.jpg" class="img-fluid rounded z-depth-1" alt="Working on Jontro Soinik v1 at the Cybernetics bench during the build phase." %}
    <p class="text-center mt-1"><small class="text-muted">Bench work on v1 during the build phase — arm, tracks, and electronics on the test fixture.</small></p>
  </div>
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/jontro-soinik-v1-firmware-dev.jpeg" class="img-fluid rounded z-depth-1" alt="Firmware development bench for Jontro Soinik v1." %}
    <p class="text-center mt-1"><small class="text-muted">v1 firmware-development bench — central control node talking to peripheral controllers over the star fan-out.</small></p>
  </div>
</div>

### Vision System — Six IP Cameras

| Role | Capabilities |
|---|---|
| Main PTZ | Pan/tilt/zoom — primary situational awareness |
| Claw PTZ | Pan/tilt/zoom — fine manipulation feedback |
| 3× zoom cameras | 4× optical zoom each — secondary angles |
| Thermal | Heat-signature monitoring |
| All cameras | Night-vision capability |

Live video is transmitted over a **1.4 GHz COFDM** link at up to **1 km range**, chosen for low-latency, secure video transport that holds up in RF-noisy environments where commodity 2.4 / 5 GHz video links degrade. The arm carries **20 kg while moving at 5 km/h**, so the camera-to-claw closed loop has to stay tight on the operator end even as the platform is moving under load.

### Operator-Side Control — Three Modes

- **HCU (Handheld Control Unit)** — short-range, lightweight portable operation for setup, line-of-sight tasks, and operator pre-checks.
- **OCU (Operation Control Unit)** — long-range console with the full diagnostics view, multi-camera switching, and the primary mission interface.
- **Wired optical fallback** — fibre tether for fully RF-contested environments, preserving operator control when the wireless channels are jammed or unusable.

### Engineering Focus

- **Multi-camera streaming pipeline** over COFDM — synchronisation across six feeds, latency budgeting for arm-end-effector teleop, bandwidth allocation per camera role.
- **Heavy-payload arm dynamics** — lifting 20 kg while in transit at 5 km/h imposes real coupling between locomotion and manipulation control loops, which the operator console has to mask.
- **Fail-soft control hand-off** — automatic degrade from wireless OCU to wired fallback when link quality drops below thresholds, so the robot never silently goes out of operator reach.

### Field-Operation Clip

<div class="row justify-content-center mt-3">
  <div class="col-sm-8">
    <video controls preload="metadata" class="img-fluid rounded z-depth-1" style="width: 100%;">
      <source src="{{ '/assets/video/jontro-soinik-v1-operation.mp4' | relative_url }}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <p class="text-center mt-2"><em>Jontro Soinik v1 — field operation, full vision + tele-op stack live.</em></p>
  </div>
</div>

A longer field-operations clip of the same stack is mirrored as a blog entry:
[Tele-Operated ROV Demo — 6-DOF Heavy-Lift Arm, Six-Camera COFDM Link, HCU/OCU Dual Control]({{ '/blog/2024/advanced-rov-demo/' | relative_url }}).

### Tech Stack

`1.4 GHz COFDM` · `IP cameras` · `PTZ control` · `Thermal imaging` · `Night vision` · `STM32` · `Embedded C`
