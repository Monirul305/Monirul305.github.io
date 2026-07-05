---
layout: page
title: Fault-Tolerant Dual-Network Feedback Communication for Multi-Node Unmanned Robotic Platforms (Co-Author Paper)
description: >
  Two physically and electrically independent feedback networks running
  in parallel between every control node, with receiver-side fallback
  on channel degradation. Targets single-point-of-failure risks in
  field-deployed unmanned robotic platforms. Co-author manuscript
  submitted.
importance: 2
category: research
related_publications: true
---

### Motivation

Field-deployed multi-node unmanned robotic platforms rely on continuous feedback exchange between control nodes — sensor readings, drive-state telemetry, watchdog liveness. When that exchange traverses a **single** network, any link failure (wiring damage, connector fatigue, RF interference, an EMC event) silently degrades coordination and, in safety-critical operations, becomes a single point of failure for the whole platform. The failure modes are not hypothetical: they surface specifically in field deployment, where harsh-environment and contested-spectrum operation can knock out a single channel without any clean error indication on the application layer.

### Approach

The architecture is a **fault-tolerant dual-network feedback communication scheme**: two **physically and electrically independent** feedback networks carry the same coordination stream in parallel between every node. Per-channel health is monitored continuously at the receiver; on degradation, the receiver falls back to the surviving network **without losing a control cycle**. The master node logs the event so post-mission diagnostics can trace exactly when and where the channel dropped.

The design is targeted at unmanned multi-node robotic platforms operating in environments where any single wired or RF link can drop intermittently, and is validated on a multi-DOF unmanned ROV with deliberately injected single-channel faults — the failure-injection test confirms the system rides through the fault without an observable interruption in the control loop.

### My Role

**Co-author.** I contributed to the architecture design, the hardware-level fallback implementation, and the failure-injection validation on the ROV testbed. The full author list and additional detail are in the [publications]({{ '/publications/' | relative_url }}) entry.

### Status

**Manuscript submitted** {% cite tanvir2025dual %}. The architecture has informed the on-vehicle communication layer of the [Jontro Soinik v2 EOD ROV]({{ '/projects/03_soinik_rov/' | relative_url }}), where a similar redundancy principle applies to the custom multi-drop bus.

---

### Tech Stack

`Embedded C` · `STM32` · `RS-485` · `Dual-network redundancy` · `Failure-injection testing` · `Multi-DOF ROV testbed`
