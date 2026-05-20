---
layout: page
title: Heavy-Lift Multirotor (50 kg) + Drone Battery Optimizer
description: >
  Heavy-lift multirotor for logistics and emergency response —
  50 kg payload, 30 min flight, 15 km comms, 1.5:1 T/W ratio.
  This page ships with an interactive in-browser Drone Battery
  Optimizer that sizes the pack and motor against your mission.
img: assets/img/projects/cargo_drone.jpg
importance: 6
category: professional
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-info" role="alert">
      <strong>Interactive tool inside.</strong> This page bundles a
      <strong>Drone Battery Optimizer</strong> — pick a preset, tweak the mission and airframe inputs, and the optimizer reports feasible battery configurations against your payload. Jump straight there:
      <a href="{{ '/projects/06_heavy_lift_drone/tool/' | relative_url }}">Launch the optimizer →</a>
    </div>
  </div>
</div>

Led design and optimisation of a heavy-lift multirotor drone for logistics
and emergency-response applications. Key engineering challenges: advanced battery
management for 30-minute endurance at full payload, structural frame analysis for
asymmetric load distribution, propulsion sizing to achieve a **1.5:1
thrust-to-weight ratio**, and flight-control tuning for stable hover and waypoint
flight under variable wind at altitude.

### Specifications

| Parameter | Value |
|---|---|
| Max payload | 50 kg |
| Flight time | 30 min |
| Max altitude | 300 ft |
| Communications range | 15 km |
| Thrust-to-weight ratio | 1.5 : 1 |

### Engineering Focus

- **Custom battery management system (BMS)** sized for the 30-minute endurance
  requirement at peak draw — cell balancing, fault isolation, telemetry to GCS.
- **Propulsion stack sizing** — motor/ESC/prop pairing across the operating point,
  with thrust margin for emergency-response payloads and gusty conditions.
- **Frame structural design** (SolidWorks) for asymmetric payload mounts and
  vibration isolation between the propulsion plate and avionics bay.
- **Power-distribution PCBs** designed in Altium for high-current routing and
  in-flight current/voltage monitoring.

{% include figure.liquid path="assets/img/projects/heavy-lift-drone-aero-brief.jpg" class="project-hero-img rounded z-depth-1" alt="Walking through the heavy-lift drone's aerodynamics simulation results." %}

<p class="text-center"><em>Walking the team through the heavy-lift drone's aerodynamics-simulation results at design review.</em></p>

This is the heavy-lift platform in [Cybernetics' drone product line](https://cyberneticsbd.com/cargo-drone/);
the [SD15-N surveillance drone](../05_sd15n) is the lighter-weight tracking variant.

### Drone Battery Optimizer

The battery-pack and motor sizing study that drove this drone's design has been ported into a browser-side **Drone Battery Optimizer**. Enter the component weights, cell specs, motor thrust / current / throttle curve, and mission profile — it enumerates feasible Yₛ × Zₚ pack configurations and reports MTOW, throttle %, per-motor current, and forward-flight velocity for each payload level. All math runs locally; no backend.

<p class="text-center my-4">
  <a href="{{ '/projects/06_heavy_lift_drone/tool/' | relative_url }}"
     class="btn btn-primary btn-lg btn-launch-tool">
    <i class="fa-solid fa-bolt"></i>
    Launch the Drone Battery Optimizer
    <span aria-hidden="true">→</span>
  </a>
</p>

### Tech Stack

`ArduPilot` · `Custom BMS` · `Propulsion design` · `SolidWorks (frame)` · `Altium (power PCB)`
