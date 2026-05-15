---
layout: page
title: Hobby 3D Printer — Designed from Scratch in SolidWorks, Laser-Cut Acrylic, Custom Marlin
description: >
  A 3D printer designed from scratch as a personal hobby build during
  COVID-19 — SolidWorks for every component, laser-cut acrylic frame,
  Arduino Mega controller, 5x NEMA 17 stepper motors, and a customised
  Marlin firmware. Distinct from the later Titan 550 industrial product.
img: assets/img/projects/hobby_3d_printer.jpg
importance: 2
category: undergraduate
---

{% include figure.liquid path=page.img class="img-fluid rounded z-depth-1" %}

A 3D printer built from scratch as a personal hobby project during the COVID-19 lockdown — primarily so I could fabricate the chassis, links, and custom planetary gearboxes for the [5-DOF robotic arm]({{ '/projects/12_6dof_arm/' | relative_url }}) without relying on outsourced printing. The machine has been my workhorse for every undergraduate mechanical project since.

This is **not** the Titan 550 — that's a much later **industrial product** I led at Cybernetics, built from the ground up for production use. This hobby printer is the personal undergraduate build that preceded any of that work.

**Mechanical design.** Every component was designed in **SolidWorks** — the frame, motion axes, extruder mount, hot-end carriage, build plate, and belt-tensioning hardware. Structural parts were cut from **acrylic sheet on a laser cutter**, then assembled with standard fasteners and off-the-shelf bearings.

**Motion and electronics.** Motion is driven by **five NEMA 17 stepper motors** — one each for X, Y, Z (typically dual-driver on Z), the extruder, and an auxiliary axis. The controller is an **Arduino Mega** running a **customised Marlin firmware** configured for the machine's specific motion geometry, belt-pulley ratios, microstepping, and bed dimensions. Limit switches handle axis homing; thermistors on the hot-end and bed close the temperature loops.

**Outcome.** A functional desktop printer used continuously through my BUET years to fabricate the parts I needed for other projects — the 5-DOF arm's links and planetary gearboxes, drone airframe fittings, sensor enclosures, and so on. Roughly off-the-shelf for the electronics and motors; everything mechanical came out of the laser cutter from my own SolidWorks files.

A photo gallery of the build is available [here](https://drive.google.com/drive/folders/18oeEcdt59pd_Sk-MCc7_giZn6kYx4_qt?usp=drive_link).

### Tech Stack

`SolidWorks` · `Laser-cut acrylic` · `Arduino Mega` · `5× NEMA 17 stepper` · `Marlin (customised)` · `Thermistor / endstop`

[**Code on GitHub →**](https://github.com/Monirul305/Designing-and-Implementation-of-A-3D-printing-Machine)
