---
layout: page
title: Hybrid VTOL Quad-Plane — Multirotor Hover + Fixed-Wing Cruise
description: >
  First-generation VTOL quad-plane prototype for heavy-lift and
  long-duration surveillance. Maiden flight validated core design.
img: assets/img/projects/vtol.jpg
importance: 8
category: professional
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

Contributed to design and validation of a first-generation VTOL (Vertical Take-Off
and Landing) quad-plane prototype combining multirotor hover capability with
fixed-wing cruise efficiency. Targets heavy-lift transportation and
long-duration surveillance for both commercial and defense applications.

### Why a Quad-Plane

A pure multirotor (like the [50 kg heavy-lift drone](../06_heavy_lift_drone)) trades
endurance for vertical agility. A pure fixed-wing trades vertical agility for
endurance. A quad-plane runs four vertical rotors for take-off, landing, and
hover, then transitions to a forward-thrust fixed-wing configuration for
efficient cruise — the best of both modes at the cost of mode-transition
control complexity.

### Engineering Focus

- **Transition flight-mode tuning** in ArduPilot — gain scheduling between
  multirotor hover, hover-to-forward transition, and fixed-wing cruise.
- **Aero/propulsion sizing** — wing area, motor thrust, and forward-prop sizing
  to maintain controlled flight through the transition envelope.
- **Airframe design** balancing the structural needs of vertical thrust mounts
  with the aerodynamic profile required for cruise.

**Status:** Maiden flight completed successfully — core design principles validated
on the first generation. Future work targets payload capacity and cruise endurance.

{% include figure.liquid path="assets/img/projects/vtol-field.jpeg" class="project-hero-img rounded z-depth-1" alt="On the test field with the first-generation VTOL quad-plane." %}

<p class="text-center"><em>On the field with the first-generation VTOL quad-plane between test sorties.</em></p>

### Tech Stack

`VTOL design` · `Fixed-wing aerodynamics` · `ArduPilot` · `Flight controller tuning`
