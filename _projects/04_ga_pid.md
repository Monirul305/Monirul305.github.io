---
layout: page
title: GA-Optimized Cascaded PID for BLDC Motor Synchronization (STM32, First-Author Paper)
description: >
  Genetic Algorithm-tuned cascaded PID on STM32 for precise real-time
  synchronization of BLDC motors in differential-drive platforms.
  First-author paper under review.
img: assets/img/projects/ga_pid.jpg
importance: 1
category: research
related_publications: true
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

### Motivation

Differential-drive platforms — AGVs, mobile robots, ROV thrusters — demand tight
wheel-speed synchronization to track straight-line and curved trajectories without
drift. Classical PID tuning (Ziegler-Nichols, manual gain scheduling) leaves
significant tracking error when motor parameters drift with load, temperature, or
battery state.

### Approach

A **cascaded PID** structure separates the outer position loop and inner velocity
loop, giving two independent bandwidth points. Six gain parameters (Kp, Ki, Kd
for each loop) are encoded as a chromosome in a **Genetic Algorithm** that evolves
offline against a fitness function combining settling time, overshoot, and
steady-state synchronization error from a step-response benchmark.

The resulting gains are flashed to an **STM32F4**-class MCU running at 1 kHz
inner-loop rate via HAL drivers. GA inference cost is negligible in deployment —
only the tuned gains run on hardware.

### Validation

System validated under:
- Varying mechanical loads across the motor speed range
- Battery-voltage variation (dominant field disturbance)
- Step-response benchmarks comparing GA-tuned vs. Ziegler-Nichols vs. manual baselines

### Status

**First-author manuscript under review** {% cite islam2025gapid %}. This paper represents
my highest degree of independent research contribution within the Cybernetics R&D programme.

---

### Tech Stack

`STM32F4` · `Embedded C` · `HAL drivers` · `Cascaded PID` · `Genetic Algorithm` · `BLDC motors` · `MATLAB (simulation)`
