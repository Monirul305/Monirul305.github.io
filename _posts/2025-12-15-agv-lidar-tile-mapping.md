---
layout: post
title: "Inside the AGV Nav Stack: LiDAR Tile-Mapping with Multi-Scan Stability Filtering"
date: 2025-12-15 10:00:00
description: Sharing a teammate's LinkedIn update — Mainul Islam's LiDAR occupancy-grid module that feeds our 3-robot AGV navigation stack. Tile-indexed point clouds, stable/unstable obstacle detection across 5 scans, and a color-coded debug overlay. (His work, not mine — I was on the same team.)
tags: robotics agv ros2 lidar mapping perception
categories: linkedin
featured: false
thumbnail: assets/img/posts/lidar-tile-mapping.jpg
external_source: LinkedIn
external_source_url: https://www.linkedin.com/posts/mainul-islam-254071205_lidar-robotics-ros2-activity-7399835481351516160-hcRp
---

My teammate **Mainul Islam** has been building a **LiDAR tile-mapping module** for our AGV navigation stack at [Cybernetics Hi-Tech Solutions](https://cyberneticsbd.com), and shared a great progress update on LinkedIn this week. He owns this layer end-to-end; I'm sharing it here because it's an important piece of the broader system our team deployed, and I think the engineering deserves attention.

The module converts raw LiDAR point clouds into the stable, grid-based occupancy map the path planner consumes — sitting one layer below the FleetCore coordinator and the AprilTag-fused EKF localization featured in the [main AGV deployment post]({{ '/blog/2026/agv-fleet-production-deployment/' | relative_url }}). Where the EKF answers *"where am I?"*, Mainul's module answers *"what's around me, and what's persistent enough to plan around?"*

### 🔍 What's in Mainul's iteration

- **Tile indexing** — automatic conversion of raw LiDAR points into structured `(i, j)` tile coordinates on the facility grid.
- **Stability filtering** — each cell is classified as stable / unstable based on whether obstacles persist across the last **5 scans**. Transient returns (workers walking through, reflections, sensor jitter) get suppressed; persistent obstacles get committed to the map.
- **Color-coded debug overlay** — three states at a glance:
  - 🔵 Blue → outside the LiDAR FOV
  - 🟢 Green → inside FOV, no stable obstacle
  - 🟡 Yellow → stable obstacle detected
- **Tuned parameters** — 25 cm tile resolution with a 2 m LiDAR sensing range, matched to the corridor geometry and the AGV planning horizon.
- **Per-tile indexed overlay** — every tile carries its own index, so debugging an obstacle classification reduces to a single tile lookup.

### 🎯 Why it matters for the AGV deployment

This is the layer that turns *"the LiDAR sees something"* into *"the planner should treat tile (i, j) as occupied."* Without stability filtering, a single noisy return — or a worker walking past — would briefly mark a corridor cell as blocked and trigger a needless replan. Mainul's 5-scan stability gate is what keeps the three robots from twitching on transient detections while still reacting to a real obstacle the moment it persists.

This module is also a key input to the **planning-layer** (Layer 3) of the safety architecture described in the [project page]({{ '/projects/01_agv_fleet/' | relative_url }}) — the layer that lets each robot reason about persistent obstacles in its peers' planned paths.

### 🛠 Next on this module

Mainul flagged two follow-ups in the post:

- Dynamic-obstacle filtering — handling motion-confirmed obstacles separately from static map cells.
- Publishing optimized ROS 2 message outputs for downstream decision modules.

### Credits

- **Original author:** Mainul Islam — Embedded Systems Engineer @ Cybernetics Hi-Tech Solutions, part-time Lecturer @ AUST
- **Project page on this site:** [3-robot AGV fleet]({{ '/projects/01_agv_fleet/' | relative_url }})

---

*Mainul's original LinkedIn post → [view the original](https://www.linkedin.com/posts/mainul-islam-254071205_lidar-robotics-ros2-activity-7399835481351516160-hcRp)*

`#LiDAR` · `#Robotics` · `#ROS2` · `#Mapping` · `#Perception` · `#AutonomousSystems` · `#EmbeddedSystems` · `#ComputerVision`
