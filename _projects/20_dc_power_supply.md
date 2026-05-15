---
layout: page
title: Laboratory Variable DC Power Supply — Linear-Regulator Bench Build
description: >
  Bench-grade variable DC power supply — linear-regulator architecture
  with adjustable output voltage, current limiting, and short-circuit
  protection. Built end-to-end including transformer secondary,
  rectification, filtering, regulation, and enclosure. BUET EEE
  coursework.
img: assets/img/projects/dc_power_supply.png
importance: 10
category: undergraduate
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

A bench-grade **variable DC power supply** designed for laboratory use — built end-to-end from transformer secondary through the regulator to the front-panel enclosure. BUET EEE coursework.

**Topology.** A classic **linear regulator** chain: step-down transformer → full-wave rectifier → smoothing capacitor → adjustable voltage regulator with feedback. Linear regulation was the right choice here over a switcher — the goal is **clean, low-noise output suitable for benchtop analog work**, where the additional cost of a switching supply's filtering and EMI control isn't worth it for the modest currents involved.

**Features.**

- **Adjustable output voltage** over a useful bench range, set by a front-panel potentiometer with a real-time digital display.
- **Current limiting** — the regulator transitions from constant-voltage to constant-current mode at a user-set current threshold, protecting both the supply and the device under test from over-current faults.
- **Short-circuit protection** — output shorts are detected and the supply enters fold-back current limiting until the fault clears, with no permanent damage to the pass element.
- **Heat-sinked pass transistor** — the linear topology dissipates the input-to-output voltage difference as heat, so the pass element is mounted on an appropriately sized heat sink with thermal-shutdown protection.

A short video demonstration of the supply in operation — voltage / current adjustment and fault response — is available on the repository's [video presentation](https://www.youtube.com/watch?v=ZSO7t5vjk-Y).

### Tech Stack

`Linear regulator` · `Full-wave rectification` · `Constant-voltage / constant-current control` · `Current limiting` · `Thermal management` · `Analog feedback`

[**Code on GitHub →**](https://github.com/Monirul305/Design-and-Implication-of-Laboratory-Variable-DC-Power-Supply)
