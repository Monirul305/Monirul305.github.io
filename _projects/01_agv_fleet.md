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

A ROS 2 dispatcher that turns operator button-presses at calling stations into AGV missions and runs them through pickup → unload → return cycles. Architected to **fail closed** at every layer.

- **FIFO job queue** fed by physical call-station button presses; rising-edge detection prevents duplicate enqueues.
- **Per-robot FSMs** track each robot's `IDLE` / `WORKING` / `RECOVERING` / `INACTIVE` state from heartbeats and availability messages — using sequence counters rather than single messages, so transient comms glitches don't flip the FSM.
- **Mutual exclusion** on shared unload stations: the lift and inbound scanner are single-occupant resources; robots blocked on a busy station queue in dedicated staging bays.
- **Layered timeouts** for accept, arrival, and pickup / unload gates — each timeout releases shared resources, mints a fresh job ID, and sends the robot back to its waiting station to retry.
- **Deadlock recovery**: when several robots stall on simultaneous obstacle flags, FleetCore issues staggered re-dispatches with fresh job IDs so each robot's nav stack treats the next leg as a new goal.
- **Heartbeat / directory / failsafe substrate**: every robot must continuously broadcast a liveness heartbeat to stay in the active-robot directory; top-level `home` / `reset` / `failsafe` switches give the operator a single-button override of the whole fleet.

#### Per-Robot Navigation Stack

**Localization — Custom 5-State EKF with Two Operating Modes**
Per-robot pose `(x, y, θ)` is published at **50 Hz**, fusing wheel-encoder odometry with absolute pose fixes from two side-mounted USB cameras detecting AprilTag fiducials.

- The EKF state is **5-dimensional** — pose plus learned linear and angular velocity biases that absorb systematic encoder errors (wheel-radius miscalibration, slip) over the long corridor.
- **Camera-latency compensation** — every camera update is applied at its true measurement timestamp via a rewind-and-replay step on a bounded encoder history buffer, not at the time the measurement arrived.
- **Mode switching** — while moving, the EKF is the source of truth; while parked, a complementary filter blends nearby-tag readings into a drift-free parked pose. Returning to motion snaps the EKF to the refined parked pose so the robot starts driving from a clean fix.
- **Gating** — each camera reading is checked for freshness, distance, and bearing before it enters the filter.

**Path Planning — Distributed A\* with Peer-Aware Reservations**
Each robot runs an A* planner over a shared **63 × 171 occupancy grid at 0.4 m / cell** (≈ 25 m × 68 m) of the facility. Plans are not centrally coordinated; instead, each robot continuously **publishes its current planned path** as a sequence of timestamped grid waypoints, and every other robot subscribes.

- The planner enforces three peer-conflict rules: **node conflict** (spatial–temporal overlap with a peer waypoint), **edge swap** (head-on conflict on the same edge), and **final-cell occupation** (no plan terminates inside another robot's planned end cell).
- A **planner / manager split** keeps the A* search stateless and on-demand, while a per-robot manager handles when to re-plan, how to react to obstacles, and how to keep the published timestamps fresh.
- **Continuous timestamp maintenance** — the plan is computed once but its waypoint timestamps are rigidly shifted on every publish so peers always see realistic ETAs, not stale ones. This is what makes the spatiotemporal conflict checks actually work in practice.
- **Obstacle handling without dropping the path** — when an obstacle persists, the old plan keeps publishing with shifted timestamps so peers stay committed to a coherent fleet picture; only when a clean replacement plan is found does it swap in.

**Motion Control — Closed-Loop PID over RS-485 Modbus RTU**
A PID controller translates planned paths into differential-drive wheel velocity commands at high frequency, issued over **RS-485 Modbus RTU** to the motor drives {% cite tanvir2024rs485 %}.

**Safety — Three Layers**

| Layer | Mechanism | Trigger |
|---|---|---|
| 1 — Immediate | Forward-facing LiDAR safety zone | Emergency motor stop on obstacle |
| 2 — Readiness | Subsystem health gating | No motion until every subsystem reports healthy |
| 3 — Planning | Peer-aware conflict avoidance | Robots never plan into each other's space |

Layered above all three: the FleetCore heartbeat / directory / failsafe substrate halts motion fleet-wide on a single operator button.

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
