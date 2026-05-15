---
layout: page
title: Regulated DC-DC Boost Converter — Schematic & Layout in TSMC 180 nm (Cadence)
description: >
  Designed and laid out a regulated DC-DC boost converter on TSMC
  180 nm in Cadence — schematic capture, transistor-level simulation,
  and physical layout with parasitic extraction. VLSI coursework at
  BUET EEE.
img: assets/img/projects/boost_converter.jpg
importance: 7
category: undergraduate
---

A regulated DC-DC boost converter designed at the **transistor level on the TSMC 180 nm process node** in the **Cadence** EDA environment — full custom from schematic to layout. VLSI coursework at BUET EEE.

**Circuit design.** Standard switched-inductor boost topology, with a closed feedback loop providing **output-voltage regulation** against input-voltage variation and load-current changes. The control loop comprises an error amplifier, compensation network, and PWM comparator driving the switching transistor — all designed at the transistor level rather than relying on macromodels.

**Process and tools.** Implemented on the **TSMC 180 nm** PDK in **Cadence Virtuoso**. Schematic capture, transistor sizing for required transconductance and drive strength, DC operating-point and transient simulation in Spectre, and full physical **layout** with DRC / LVS clean-up.

**Verification.** The converter was characterised across input-voltage and load-current sweeps to extract conversion efficiency, line and load regulation, and switching transient behaviour. Layout parasitic extraction was used to confirm the regulated output stayed within spec after parasitics.

This was my closest exposure to **analog / mixed-signal IC design** — complementary to the digital-design experience from the [RV32I processor project]({{ '/projects/13_riscv/' | relative_url }}) and the brief Ulkasemi exposure to the same process node.

### Tech Stack

`Cadence Virtuoso` · `TSMC 180 nm` · `Spectre simulation` · `DRC / LVS` · `Analog IC design` · `Boost converter topology`

[**Code on GitHub →**](https://github.com/Monirul305/Designing-A-regulated-Boost-converter-using-tsmc180nm-technology-in-Cadence)
