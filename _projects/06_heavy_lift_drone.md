---
layout: page
title: Heavy-Lift Multirotor Drone (50 kg payload, 30 min endurance, 15 km comms)
description: >
  Heavy-lift multirotor for logistics and emergency response.
  50 kg payload, 30 min flight, 15 km comms range, 1.5:1 T/W ratio.
  Includes an interactive battery + motor sizing tool.
img: assets/img/projects/cargo_drone.jpg
importance: 6
category: professional
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

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

This is the heavy-lift platform in [Cybernetics' drone product line](https://cyberneticsbd.com/cargo-drone/);
the [SD15-N surveillance drone](../05_sd15n) is the lighter-weight tracking variant.

### Interactive Sizing Tool

The battery-pack and motor-sizing study that drove this drone's design has been ported to a browser-side calculator. Enter the component weights, battery-cell specs, motor thrust/current/throttle curve, and mission profile — it enumerates feasible Yₛ × Zₚ pack configurations and reports MTOW, throttle %, per-motor current, and forward-flight velocity for each payload level you ask about.

<p>
  <a href="{{ '/projects/06_heavy_lift_drone/tool/' | relative_url }}" class="btn btn-primary">Launch the sizing calculator →</a>
</p>

<p class="text-muted"><small>Coming soon — the tool currently lives in a separate workstream; this page will deep-link into it as soon as it's ready.</small></p>

### Tech Stack

`ArduPilot` · `Custom BMS` · `Propulsion design` · `SolidWorks (frame)` · `Altium (power PCB)`
