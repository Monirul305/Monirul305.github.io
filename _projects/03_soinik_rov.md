---
layout: page
title: Indigenous EOD ROV Family — UN Peacekeeping Deployment (Mali, Congo)
description: >
  Smart Soinik 1.0 (SS1.0) and Jontro Soinik 1.0 (JS1.0) — Bangladesh's
  2nd and 3rd generation EOD ROVs. Army-tested, UN-deployed.
  Motion control, BLDC sync, RS485 communication, custom PCBs.
img: assets/img/projects/soinik_rov.jpg
importance: 3
category: professional
related_publications: true
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-warning" role="alert">
      <strong>🌍 UN Deployment</strong> — Smart Soinik 1.0 is deployed under the
      <strong>UN Peacekeeping Mission in the Republic of Mali</strong>
      (gifted to Peruvian Armed Forces by Bangladesh Army, May 5, 2024).
      Jontro Soinik 1.0 is set for the <strong>Republic of Congo</strong> in 2025.
    </div>
  </div>
</div>

### Platform Overview

| | Smart Soinik 1.0 (SS1.0) | Jontro Soinik 1.0 (JS1.0) |
|---|---|---|
| Generation | 2nd | 3rd |
| Arm DOF | 6 | 7 |
| IP Rating | — | **IP55** |
| Speed | 4 km/h | 5 km/h |
| Grip Force | 40 kg | 40 kg |
| Lift Capacity | 20 kg (retracted) | 20 kg (retracted) |
| Battery | 16 Ah, 48 V | 16 Ah, 48 V |
| Endurance | 3–5 hours | 3–5 hours |
| Cameras | IR, thermal, 4× PTZ | IR, thermal, 4× PTZ + claw IR |
| Range (LOS) | 1000 ft | 1000 ft |
| Disrupter | — | ✓ 24 V actuation circuit |

---

### Army Validation — JS1.0

**Disrupter Test — Mirpur Range**
The Bangladesh Army validated the JS1.0 disrupter mechanism — the first locally-built ROV with this capability — using a **350 m/s water projectile**. The disrupter is a standard tool of Explosive Ordnance Disposal teams worldwide, used to safely render unexploded ordnance inert in humanitarian and UN peacekeeping operations.

**IP55 Water Protection Test — Bangladesh Army IE&I**
High-pressure test: water sprayed from all directions at 30 m/s, 12.5 L/min for 3 minutes. JS1.0 passed, confirming resilience in harsh field conditions.

---

### My Contributions

- **Motion control algorithm** for all arm degrees of freedom — precision, stability, and end-effector dexterity
- **BLDC motor speed synchronization** across multiple drive units {% cite islam2025gapid %} — subject of first-author paper under review
- **Inter-node RS485 communication** coordinating motion commands and sensor feedback across all DOFs {% cite tanvir2024rs485 %}
- **Dual-network feedback communication** — fault-tolerant pathways for multi-node unmanned robotic control {% cite tanvir2025dual %}
- **Custom PCB design and CNC fabrication** for control and communication subsystems (Altium Designer, KiCad)
- **48 V power distribution** and energy management for extended field operations
- **ROS 2 control architecture** for JS1.0's 7-DOF arm (ongoing integration)

---

### Key Specifications

**Arm range of motion:**
Turret 200° · Shoulder 100° (JS1.0) · Elbow 150° · Wrist 270° · Claw 360° continuous

**Reach envelope:**
Vertical 150 cm · Horizontal 100 cm · Beneath 25 cm · Gripper opening 18 cm

**Electrical subsystems:**
GPS locator · Wireless HCU · Laser range finder (10 cm – 40 m) · 2+ proximity sensors ·
Thermal camera · Self-diagnostics · Active/passive overload protection · RF extender to 152 m ·
Initiator circuit: 4× 24 V shock-tube sets · Deployment time ≤ 5 min

---

### Promo & Test Videos

<div class="row mt-3">
  <div class="col-sm-6">
    <div class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/Mipwd6lcz5s"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-1"><em>Jontro Soinik 1.0 — Promo Video</em></p>
  </div>
</div>

---

### Tech Stack

`STM32` · `Embedded C` · `RS-485` · `BLDC motor control` · `Altium Designer` · `KiCad` · `48 V power system` · `ROS 2` · `Thermal imaging` · `IR night vision`
