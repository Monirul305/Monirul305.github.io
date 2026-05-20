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

### Mission Profile

Designed for two operational scenarios:

- **Logistics** — point-to-point cargo movement in environments where ground transport is slow, restricted, or unsafe. The 50 kg envelope covers heavy single items (machinery, generators, fuel) or batched smaller payloads.
- **Emergency response** — first-responder deployment after floods, cyclones, or earthquakes: medical supplies, blood, food rations, search-and-rescue gear into terrain ground vehicles cannot reach quickly.

The 15 km comms range paired with 30 min of endurance defines the operational radius — round-trip with safety margin to a target ~7 km out at full payload.

### Why Heavy Lift is Non-Trivial

A 50 kg payload at the same airframe class as a 5 kg hobby drone is not a 10× scale-up — it's a different design regime. Battery mass dominates: the same 30-min endurance now needs ten times the energy, which costs another battery's worth of lift on top of the payload, which costs more thrust, which costs more current, which costs more battery. The numbers either converge on a feasible pack or run away to infinity, and the only way to know which side you're on is to do the loop. **That's exactly what the optimizer below automates.**

### Engineering Focus

- **Custom battery management system (BMS)** sized for the 30-minute endurance requirement at peak draw — cell balancing, fault isolation, telemetry to GCS.
- **Propulsion stack sizing** — motor / ESC / prop pairing across the operating point, with thrust margin for emergency-response payloads and gusty conditions.
- **Frame structural design** (SolidWorks) for asymmetric payload mounts and vibration isolation between the propulsion plate and avionics bay.
- **Power-distribution PCBs** designed in Altium for high-current routing and in-flight current / voltage monitoring.
- **Failsafe behaviour** — return-to-launch on radio-link loss or low-battery threshold, geofence enforcement, and motor-failure tolerance from the over-actuated rotor count.

{% include figure.liquid path="assets/img/projects/heavy-lift-drone-aero-brief.jpg" class="project-hero-img rounded z-depth-1" alt="Walking through the heavy-lift drone's aerodynamics simulation results." %}

<p class="text-center"><em>Walking the team through the heavy-lift drone's aerodynamics-simulation results at design review.</em></p>

This is the heavy-lift platform in [Cybernetics' drone product line](https://cyberneticsbd.com/cargo-drone/);
the [SD15-N surveillance drone](../05_sd15n) is the lighter-weight tracking variant.

### Drone Battery Optimizer

The battery-pack and motor sizing study that drove this drone's design has been ported into a browser-side **Drone Battery Optimizer**. All math runs locally in your browser — no backend, no sign-up.

#### How the optimization works

Given the component weights, cell specs, motor performance curve, and a mission profile, the optimizer **enumerates every feasible series-parallel pack configuration** (Yₛ × Zₚ) inside the search ranges — typically a few hundred candidates — and evaluates each one against the operating constraints that actually decide whether a multirotor flies:

- **Hover throttle** on the supplied motor curve — must be reachable, not pinned at 100 %.
- **Per-motor current draw** at hover — must stay under the motor's hard-current limit.
- **Voltage compatibility** between the pack's Yₛ string and the motor's tested voltage range.
- **Cruise margin** — headroom between hover and the motor's limit, which sets the wind-recovery envelope and how aggressively the platform can bank in forward flight.

The output is a **Pareto front** in (MTOW, battery weight, cruise margin): for any payload you ask about, the lightest pack that still satisfies every constraint sits on the curve. Configurations that fail any check are flagged and excluded from the feasible-set table.

#### What you control

- **Mission profile** — desired flight time, payload range, banking angle, forward-flight assumption.
- **Airframe** — frame mass, motor / ESC / propeller count and unit weights, electronics overhead.
- **Battery** — cell capacity, C-rate, weight, nominal voltage; Yₛ × Zₚ search ranges.
- **Constraints** — minimum cruise margin, maximum hover throttle, voltage-compatibility tolerance.

#### Designed to stay out of your way

- **Three presets** (heavy-lift / light heavy-lift / hobby quad) to jump straight in.
- **Live recalc** on every input change (debounced ~200 ms — no Calculate button).
- **Motor library** — two bundled performance datasets (X15 heavy-lift class, AS2317) plus CSV upload for your own.
- **Shareable URL** — every input is encoded in the URL hash, so sending a link reproduces the exact configuration on the other side.
- **CSV export** of the feasibility table for offline comparison or import into a spreadsheet.

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
