---
layout: page
title: Production-Deployed 3-Robot AGV Fleet (ROS 2, AprilTag EKF, Distributed Path Planning)
description: >
  Production-deployed autonomous guided vehicle fleet navigating a live
  garment factory alongside hundreds of workers. ROS 2, AprilTag EKF,
  distributed path planning, FleetCore coordinator.
img: assets/img/projects/agv_fleet.jpg
importance: 2
category: professional
related_publications: true
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-success" role="alert">
      <strong>Live in production</strong> — 3 robots operating continuously at
      The Urmi Group (RMG manufacturing facility), Dhaka, Bangladesh.
    </div>
  </div>
</div>

### The Problem

Large garment factories rely on manual labour for internal carton transport — physically demanding, repetitive, and a workflow bottleneck during peak production. The objective: replace this manual transport with a fleet of intelligent, human-safe autonomous robots capable of operating reliably in a dense, dynamic, human-occupied environment with **no physical barriers**.

---

### My Role

**Lead Engineer — end-to-end.** I owned system architecture, hardware selection and integration, all software development (fleet coordinator + per-robot navigation stack), field commissioning, production handover, and ongoing support. Team members: Mainul Islam, Emon Hasan Saumik.

---

### System Architecture

The system has two layers: a **centralised fleet coordinator (FleetCore)** managing logistics and job dispatch, and an **independent full navigation stack** running on each robot.

#### FleetCore — Fleet Coordinator

- Tracks real-time status of every robot
- Maintains a job queue fed by physical call stations across the factory floor
- Dispatches tasks to available robots
- Enforces **mutual exclusion** on shared unload stations — only one robot assigned at a time, others queue in staging positions
- **Guaranteed delivery**: job dispatch is confirmed through observable robot state transitions, not dropped silently under network load

#### Per-Robot Navigation Stack

**Localization — Custom EKF**
Multi-sensor fusion combining wheel encoder odometry with absolute pose fixes from ceiling-mounted AprilTag fiducials detected by dual side-mounted USB cameras. A custom Extended Kalman Filter integrates these sources continuously, with bias estimation and outlier rejection to maintain accuracy in a 68-metre feature-poor corridor.

**Path Planning — Distributed Reservation-Based**
Robots plan routes on a discrete grid of the facility map. Each robot is aware of its peers' **planned future paths** (as time-stamped reservations) and plans around them. A priority scheme resolves conflicts — no central traffic controller, no bottleneck.

**Motion Control — Closed-Loop PID**
PID controller translating planned paths into differential-drive wheel velocity commands at high frequency, issued over **RS-485 Modbus RTU** to motor drive units {% cite tanvir2024rs485 %}.

**Safety — Three Layers**

| Layer | Mechanism | Trigger |
|---|---|---|
| 1 — Immediate | Forward-facing LiDAR zone | Emergency motor stop on obstacle |
| 2 — Readiness | Subsystem health gating | No motion until all subsystems healthy |
| 3 — Planning | Peer-aware conflict avoidance | Robots never plan into each other's space |

---

### Hardware

| Component | Details |
|---|---|
| Onboard compute | Raspberry Pi (per robot) |
| Drive | 2× DC motors, gearbox, high-resolution encoders |
| Motor interface | RS-485 Modbus RTU |
| Cameras | 2× USB cameras (AprilTag localization) |
| Range sensor | 2D LiDAR (obstacle detection + safety) |
| Status | RGB LED tower (GPIO) |
| Middleware | ROS 2 (Python) |
| Clock sync | NTP across all nodes |

---

### Key Engineering Challenges

**Robust localization in a repetitive corridor**
The factory corridor offers few distinguishing visual features, making pure odometry unreliable over long runs. Solved via dual-camera AprilTag detection with ceiling-mounted markers distributed along the full 68-metre corridor, fused into an EKF with bias estimation and outlier rejection.

**3-robot coordination without a central traffic controller**
Centralising all path requests would create a bottleneck. Instead: each robot incorporates its peers' planned routes as time-stamped reservations in its own path search. The lower-priority robot automatically replans around its peer.

**Guaranteed job delivery over a noisy factory network**
Standard pub-sub messaging can drop commands under load. For job dispatch — where a missed message leaves a robot idle indefinitely — I implemented a delivery mechanism that confirms receipt through observable state transitions, without dedicated ACK messages.

**Human-safe operation on a live factory floor**
Continuous operation alongside hundreds of workers with no physical barriers. Designed the 3-layer safety architecture covering all foreseeable failure scenarios. System demonstrated continued navigation **during a full facility power outage** (low-light navigation captured on video).

**Fleet-wide time consistency**
Distributed path planning requires all robots to share a consistent view of time. Integrated NTP monitoring with automatic resync and a hard gate preventing robot operation until clock sync is confirmed across the fleet.

---

### Supporting Infrastructure

- **Custom station hardware** — OLED displays for tactile unload/scan triggers, integrated into the FleetCore job queue
- **Web-based fleet dashboard** — real-time robot status, job queues, live diagnostics

---

### Outcome & Impact

The AGV fleet is live and operational across active production shifts. Three robots autonomously handle carton transport between production lines and unload stations, reducing physical burden on workers and improving logistics throughput — without human supervision.

Productised by Cybernetics as **CyberFleet** — marketed as the first-ever AGV solution in Bangladesh, with payload variants from 50 kg to 1,000 kg for garments, warehousing, pharma, and smart factory deployments.

---

### Demo Video

<div class="row justify-content-center mt-3">
  <div class="col-sm-8">
    <div class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/ooK1592gYgM?start=4"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-2">
      <em>Zero Collisions: How 3 Autonomous Robots Share a Busy Garment Factory Floor</em>
      — Cybernetics Hi-Tech (May 2026)
    </p>
  </div>
</div>

---

### Tech Stack

`ROS 2 (Python)` · `AprilTag` · `Extended Kalman Filter` · `LiDAR` · `RS-485 Modbus RTU` · `Raspberry Pi` · `Differential-drive PID` · `Fleet scheduling` · `Web dashboard`
