---
layout: page
title: GA-Tuned Bilateral Cross-Coupled BLDC Synchronization on a Dual-MCU Architecture (First-Author Paper)
description: >
  Distributed dual-MCU speed-synchronization scheme for a tracked
  differential-drive vehicle driven by two deliberately mismatched
  BLDC motors. Bilateral cross-coupled controller with GA-tuned gains.
  First-author manuscript submitted.
importance: 1
category: research
related_publications: true
---

### Motivation

Differential-drive and skid-steer ground vehicles steer by the relative speed of their left and right drives, so any uncommanded difference between the two track speeds appears directly as heading drift and path error. The problem is aggravated by low-cost brushless DC (BLDC) motors that — like the auto-rickshaw motors used in this work — exhibit unit-to-unit variation in winding resistance and back-EMF constant, so at equal command the two drives accelerate and cruise differently. This mismatch is a persistent, structured disturbance rather than random noise: it biases one track faster than the other for the entire run, producing exactly the steady heading drift that independent per-motor control cannot see.

### Approach

I designed a **distributed dual-MCU bilateral cross-coupled speed-synchronization controller**:

- Each motor is regulated by its **own microcontroller** running a **PID loop with velocity and acceleration feedforward**.
- A **bilateral cross-coupled term**, evaluated identically on both nodes from a dedicated **1 ms inter-MCU speed exchange**, drives the inter-motor speed difference toward zero.
- A **master node** distributes commands and logs data over an **RS-485 bus**.
- All gains are obtained offline against an **identified motor model** by a **genetic algorithm** and then deployed on the vehicle.

The cross-coupled term is symmetric (both motors react to the same error signal), so the synchronization behaviour is well-defined regardless of which motor is the leader at any instant. The 1 ms speed exchange keeps the cross-coupling tight enough to suppress the unit-to-unit mismatch in real time.

### Validation

The controller is benchmarked against an **independent-PID baseline** (the synchronization-off case) on a real tracked vehicle driven by two deliberately mismatched auto-rickshaw BLDC motors. Test scenarios include:

- Step-response benchmarks across the motor speed range
- Battery-voltage variation (dominant field disturbance)
- Single-track load disturbances (simulating one wheel encountering uneven ground)

Relative to the independent-PID baseline, the bilateral cross-coupled controller delivers a sharp reduction in both transient and steady-state inter-motor speed error, plus a substantial reduction in accumulated heading drift on straight-line runs and in heading excursion under single-track load disturbance.

### Status

**First-author manuscript submitted** {% cite islam2025gapid %}. This work is my highest-degree independent research contribution within the Cybernetics R&D programme and is the basis of the differential-drive synchronization layer shipped on the [Jontro Soinik v2 EOD ROV]({{ '/projects/03_soinik_rov/' | relative_url }}).

---

### Tech Stack

`STM32 (HAL)` · `Embedded C` · `Bilateral cross-coupled control` · `Genetic Algorithm tuning` · `BLDC motors` · `RS-485 master / dual-MCU comms` · `MATLAB (model identification & GA)`
