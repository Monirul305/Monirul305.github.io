---
layout: page
title: Optical Particle-Concentration Detector — Laser Light-Scattering with Webcam Readout
description: >
  Low-cost airborne-particle concentration sensor using laser
  illumination and a webcam-based intensity readout — measures the
  light scattered off particle–photon interaction. Built as a
  cost-conscious alternative to commercial particle counters. BUET
  EEE coursework.
img: assets/img/projects/particle_detection.png
importance: 9
category: undergraduate
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

A low-cost airborne-particle concentration sensor built around the **light-scattering principle**, using laser illumination and a consumer **webcam** as the photodetector — a cost-conscious alternative to commercial optical particle counters. BUET EEE coursework.

**Principle.** When laser light passes through a gas containing suspended particulates, photons scatter off the particles via Mie / Rayleigh scattering depending on particle size relative to wavelength. The **intensity of the scattered light is proportional (over a working range) to the particle concentration** in the illuminated volume.

**Optical setup.** A focused laser beam crosses a defined sensing volume. A webcam is positioned off-axis — outside the direct laser path — so that it only captures light that has been scattered by particles in the volume. The webcam's exposure / aperture is fixed; the digital image effectively becomes a calibrated photodetector.

**Signal extraction.** The captured frames are processed to extract scattered-light intensity in the relevant pixel region; the intensity reading is mapped to particle concentration via a calibration curve obtained against known reference samples.

**Why this approach.** Off-the-shelf optical particle counters use a precision photodiode + analog signal-conditioning chain — accurate, but cost-prohibitive for course-project budgets and undergraduate lab build. Substituting a commodity webcam as the photodetector recovers most of the sensing capability at a fraction of the cost; the trade-off is reduced dynamic range and slower sampling rate, both of which were acceptable for the intended use.

### Tech Stack

`Laser optics` · `Mie / Rayleigh scattering` · `Webcam photometry` · `Image-based signal extraction` · `Calibration` · `Particulate sensing`

[**Code on GitHub →**](https://github.com/Monirul305/Detection-of-Particle-Concentration-Using-Light-Scattering-Mechanism)
