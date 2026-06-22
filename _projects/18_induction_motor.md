---
layout: page
title: Closed-Loop Induction-Motor Speed Control — V/f + SVPWM in MATLAB Simulink
description: >
  3-phase induction motor closed-loop speed control via V/f
  (volts-per-hertz) scalar control with SVPWM (Space Vector PWM)
  inverter modulation. Full Simulink model with speed reference,
  flux/voltage scheduling, and PI compensation. BUET EEE coursework.
img: assets/img/projects/induction_motor.jpg
importance: 3
category: lab finals
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

A complete **MATLAB Simulink** model of a closed-loop variable-speed drive for a 3-phase induction motor — combining **V/f (volts-per-hertz) scalar control** with **SVPWM (Space Vector Pulse Width Modulation)** for inverter switching. Coursework in power electronics / electric machines at BUET EEE.

**Why V/f + SVPWM.** Scalar V/f keeps the stator flux roughly constant by scaling output voltage proportionally to commanded frequency — the simplest practical control law for an induction machine. SVPWM is the modulation strategy used to translate the desired stator-voltage vector into the six switching states of a 3-phase inverter, achieving a higher modulation index and lower harmonic distortion than naïve sinusoidal PWM.

**Simulink model.** The model has four major blocks:

- **Speed reference + PI controller**, which converts speed error into a frequency command.
- **V/f profile**, which maps that frequency command to a magnitude reference for the stator voltage, with low-speed boost to compensate for stator-resistance drop.
- **SVPWM modulator**, which decomposes the commanded voltage vector into the appropriate sector + dwell times across the six inverter switching states.
- **3-phase induction-motor model** in the d-q frame, driven by the inverter output and reporting back rotor speed for the closed-loop comparison.

**Outcome.** The closed-loop drive holds rotor speed at the commanded setpoint under load disturbances, with the SVPWM modulation visibly producing the expected hexagonal voltage trajectory in the αβ frame. The model serves as a study tool for how scalar V/f compares against more advanced field-oriented or direct-torque schemes — the natural follow-on for power-electronics coursework.

### Tech Stack

`MATLAB Simulink` · `Induction-motor d-q model` · `V/f scalar control` · `SVPWM` · `PI compensation` · `3-phase inverter modelling`

[**Code on GitHub →**](https://github.com/Monirul305/Closed-loop-speed-control-of-induction-motor-using-MATLAB-SIMULINK-)
