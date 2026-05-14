---
layout: post
title: "Under the Hood of the ROV: Addressable RS485 Master-Slave for BLDC-Servo Drive"
date: 2024-08-14 10:00:00
description: A teammate's LinkedIn deep-dive — Shakil Tanvir's addressable RS485 master-slave communication system driving the 6-DOF ROV with integrated BLDC servos. Motor specs, control-loop tuning, and a stair-climbing torque fix via RS232 reconfiguration. (His work, not mine — I was on the same team.)
tags: robotics rov rs485 bldc embedded motor-control
categories: linkedin
featured: false
thumbnail: assets/img/posts/ROV-drive-modbus.jpg
external_source: LinkedIn
external_source_url: https://www.linkedin.com/posts/shakil-tanvir-4500731ba_rov-robotics-rs485-activity-7228958426561716224-5L8y
---

My teammate **Shakil Tanvir** shared an excellent deep-dive on LinkedIn into the **addressable RS485 master–slave drive system** he developed for our Tele-Operated ROV at [Cybernetics Hi-Tech Solutions](https://cyberneticsbd.com). He owns this subsystem end-to-end; I'm sharing it here because the same RS485 Modbus RTU control architecture is what we later carried over to the AGV motor stack, and his work directly underpins one of the references in the [AGV project page]({{ '/projects/01_agv_fleet/' | relative_url }}).

If the [ROV demo post]({{ '/blog/2024/advanced-rov-demo/' | relative_url }}) showed *what* the ROV can do, this one shows *how* the drive train is actually built.

### 🔌 What the system does

Shakil's design uses an **addressable RS485 master–slave bus** to coordinate the ROV's motion: a single master controller addressing multiple BLDC-servo slaves over a single half-duplex line. Each slave is an **integrated-driver BLDC servo motor**, chosen so the closed-loop current/velocity loops live on the motor itself — the master only sends high-level setpoints.

The same bus also drives the **6-DOF manipulator arm**. One protocol, one wiring topology, every actuator on the vehicle.

### 🔧 The stair-climbing torque problem

The interesting engineering note in Shakil's post:

> "We were facing different issues like torque issues while climbing stairs and so on. Finally, we solved by configuring motor parameters via RS232."

Translation: the stock motor-parameter set wasn't matched to the load profile when the ROV had to deliver high transient torque on inclined / stepped terrain. Rather than swap motors, the fix was a **side-channel RS232 reconfiguration** of the BLDC drive's internal current and torque limits — a one-time bring-up step that re-tuned the integrated controller for the heavy-payload duty cycle.

### ⚙️ Motor specifications

The integrated BLDC servos he settled on:

| Parameter | Value |
|---|---|
| Rated power | 750 W |
| Rated torque | 2.39 Nm (338.45 oz·in) |
| Peak torque | 7.17 Nm (1015.36 oz·in) |
| Rated speed | 3000 RPM |
| Peak speed | 4000 RPM |
| Rated voltage | 48 VDC |
| Input voltage | 24–70 VDC |
| Continuous current | 19 A |
| Peak current | 57 A |
| Encoder | Incremental |
| Logic signal current | 10 mA |
| Isolation resistance | 100 MΩ |

### 🚗 Why it matters beyond the ROV

Shakil also noted the broader applicability — the same addressable-RS485 + BLDC-servo architecture transfers cleanly to **electric vehicle drive systems**, where the design constraints (multi-actuator coordination, low-latency feedback, robust comms in electrically noisy environments) are largely the same as on a tele-operated platform.

For our team specifically, the carry-over has already happened: the AGV fleet's motor-drive layer uses the **same RS485 Modbus RTU stack**, built on the foundation Shakil laid in this drive system.

### Credits

- **Original author:** Shakil Tanvir — Research & Development, Cybernetics Hi-Tech Solutions
- **Related posts:** [Tele-Operated ROV Demo]({{ '/blog/2024/advanced-rov-demo/' | relative_url }}) · [AGV fleet production deployment]({{ '/blog/2026/agv-fleet-production-deployment/' | relative_url }})
- **Project page on this site:** [Tele-Operated ROV — 6-DOF Manipulator + COFDM Multi-Camera Teleoperation]({{ '/projects/09_advanced_rov_cofdm/' | relative_url }})

---

*Shakil's original LinkedIn post → [view the original](https://www.linkedin.com/posts/shakil-tanvir-4500731ba_rov-robotics-rs485-activity-7228958426561716224-5L8y)*

`#ROV` · `#Robotics` · `#RS485` · `#BLDC` · `#MotorControl` · `#EmbeddedSystems` · `#EVDrive`
