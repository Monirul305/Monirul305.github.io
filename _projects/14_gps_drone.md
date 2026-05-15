---
layout: page
title: Autonomous GPS-Waypoint Delivery Drone (SolidWorks · Arduino · IMU + GPS · PID)
description: >
  Quadcopter built end-to-end for autonomous waypoint-based parcel
  delivery — SolidWorks airframe, Arduino flight controller with IMU
  attitude stabilisation, GPS waypoint navigation, and a servo-actuated
  payload release. BUET EEE undergraduate build.
img: assets/img/projects/gps_drone.jpg
importance: 4
category: undergraduate
---

A quadcopter built end-to-end for autonomous waypoint-based parcel delivery — frame design through flight control through mission logic. The objective: a flying platform that could lift a small payload, traverse to a GPS-specified destination autonomously, drop the payload, and return.

**Airframe.** Designed in **SolidWorks**, with frame geometry sized around the available motors and propellers. Motor mounts, battery placement, and the payload bay were positioned to keep the centre of gravity close to the propeller plane — important for clean attitude response from the controller.

**Flight control.** A custom flight controller running on an **Arduino**, reading attitude from an onboard **IMU** (accelerometer + gyroscope) and computing per-rotor speed corrections via a **PID stabilisation loop** on roll, pitch, and yaw. PID gains were tuned empirically on a tethered test rig before free-flight testing — a deliberately conservative bring-up workflow given the cost of crashing the prototype.

**Autonomous navigation.** A **GPS module** provides position fixes that the navigation layer compares against a list of target waypoints uploaded before takeoff. The controller computes a desired heading and forward velocity for each leg of the mission, with a simple radius-based waypoint-reached check to advance to the next target.

**Payload delivery.** A **servo-actuated release mechanism** sits in the payload bay. When the drone reaches the delivery waypoint and confirms it is within a configured radius, the controller commands the servo to release, allowing the parcel to fall.

A demonstration of an autonomous waypoint flight with payload release is available in the repository's [demo video](https://www.youtube.com/watch?v=G2CUlhSLEss).

### Tech Stack

`SolidWorks` · `Arduino` · `IMU (accel + gyro)` · `GPS` · `PID attitude control` · `Waypoint navigation` · `Servo actuation`

[**Code & demo on GitHub →**](https://github.com/Monirul305/Automatic-drone-delivery-system-using-GPS)
