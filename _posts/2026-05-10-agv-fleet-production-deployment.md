---
layout: post
title: "Three Robots, One Factory Floor: Production-Deployed AGV Fleet at Cybernetics"
date: 2026-05-10 10:00:00
description: A LinkedIn-post mirror — the story behind a 3-robot AGV fleet now live on a busy garment factory floor in Bangladesh. ROS 2, AprilTag-fused EKF localization, distributed path planning, three-layer safety.
tags: robotics agv ros2 multi-robot autonomous-systems mechatronics
categories: linkedin
featured: true
thumbnail: assets/img/posts/agv-fleet-localization.jpg
external_source: LinkedIn
external_source_url: https://www.linkedin.com/posts/monirul-islam-460001148_robotics-agv-ros2-activity-7458928837653946368-dnuD
---

🚀 Excited to share a project I've been leading for the past several months — now live and operational.

At [Cybernetics Hi-Tech Solutions](https://cyberneticsbd.com), my team and I designed, built, and deployed a fleet of three **Autonomous Guided Vehicles (AGVs)** at an active garment manufacturing facility. The robots autonomously transport finished-goods cartons across a **68-metre corridor** — alongside hundreds of workers, through narrow aisles, with **no physical barriers**.

As R&D Engineer and Team Lead on this project, I drove the effort end-to-end: from system architecture and hardware selection, through software development and field commissioning, to production handover.

### 🛠 What we built

→ A centralized **fleet coordinator** handling job dispatch, station mutual exclusion, and staging — managing three robots as a single coordinated system.

→ A full **per-robot navigation stack** with multi-sensor localization fusing wheel-encoder odometry with absolute pose fixes from dual side-mounted cameras detecting **AprilTag fiducials**, integrated through a custom **Extended Kalman Filter**.

→ **Distributed multi-robot path planning** where each robot reasons about its peers' planned paths — no central traffic controller, no bottlenecks.

→ A **three-layer safety architecture** for human-occupied operation: LiDAR-based emergency stop, readiness gating, and planning-level conflict prevention.

→ Built on **ROS 2 (Python)**, running on Raspberry Pi per robot, with motor control over **RS-485 Modbus RTU**.

### 🎯 The hard parts

The most interesting engineering challenges weren't the individual components — they were the **system-level problems**:

- Reliable localization in a long, repetitive corridor with few visual features.
- Coordinating three robots in a single-lane corridor without a central traffic controller.
- Guaranteeing job delivery over a noisy factory network.
- Operating safely alongside hundreds of workers, every shift, every day.

### 📊 The result

The fleet is **live in a production garment facility**, running across active shifts. Three robots autonomously handle carton transport between production lines and unload stations — reducing physical burden on workers and improving logistics throughput, all without human supervision.

Taking a project from a whiteboard sketch to a system that runs reliably on a live factory floor, alongside real people, has been one of the most rewarding things I've done as an engineer. Massive thanks to my team and to everyone at Cybernetics Hi-Tech Solutions who helped make this happen.

### ▶️ Full system walkthrough

<div class="row justify-content-center mt-3">
  <div class="col-sm-10">
    <div class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/ooK1592gYgM?start=4"
        allowfullscreen></iframe>
    </div>
  </div>
</div>

Direct link: [https://www.youtube.com/watch?v=ooK1592gYgM&t=4s](https://www.youtube.com/watch?v=ooK1592gYgM&t=4s)

### Credits

- **Team members:** Mainul Islam, Emon Hasan Saumik
- **Video editor:** Mainul Islam
- **Company:** [Cybernetics Hi-Tech Solutions (Pvt) Ltd.](https://cyberneticsbd.com)
- **Project page on this site:** [3-robot AGV fleet]({{ '/projects/01_agv_fleet/' | relative_url }})

---

*Originally posted on LinkedIn → [view the original post](https://www.linkedin.com/posts/monirul-islam-460001148_robotics-agv-ros2-activity-7458928837653946368-dnuD)*

`#Robotics` · `#AGV` · `#ROS2` · `#AutonomousSystems` · `#MultiRobotSystems` · `#Mechatronics` · `#IndustrialAutomation` · `#Engineering` · `#RnD` · `#Industry4.0` · `#FactoryAutomation` · `#Bangladesh` · `#TechLeadership`
