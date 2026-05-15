---
layout: page
title: 5-DOF Robotic Arm — 3D-Printed Frame, Servo Actuation, Inverse Kinematics
description: >
  Five-degree-of-freedom serial robotic arm — SolidWorks frame,
  PLA-printed links, micro-servo actuation, Arduino-based control with
  closed-form inverse kinematics for end-effector positioning. First
  hands-on robotics build at BUET.
img: assets/img/projects/6dof_arm.jpg
importance: 1
category: undergraduate
---

A 5-degree-of-freedom serial robotic arm built end-to-end as my first hands-on robotics project at BUET — mechanical design through control software. The arm has a fixed base, three intermediate revolute joints providing reach across a typical desktop workspace, a wrist roll joint, and a gripper end-effector.

**Mechanical design.** All structural links were designed in **SolidWorks**, sized against the torque demands at each joint, then **3D-printed in PLA**. Joint axes and bearing locations were dimensioned so that the printed parts could be assembled without significant post-processing. Cable routing was planned at the design stage to avoid binding through the workspace.

**Actuation and control.** Five **micro-servos** drive the joints, sized per-joint for the cantilevered torque load. Control runs on an **Arduino**, which receives a target end-effector pose, computes the **inverse kinematics** to derive each joint angle, and dispatches synchronised PWM signals to the five servos. A simple interpolation layer smooths motion between successive targets.

**Kinematics.** Forward kinematics use a Denavit–Hartenberg parameterisation of the arm. The inverse-kinematics solver targets a specified end-effector position in Cartesian space; given the geometry of a 5-DOF arm with planar wrist, the solution is closed-form with elbow-up / elbow-down branch selection.

A demonstration of the assembled arm performing pick-and-place is available in the repository's [demo video](https://www.youtube.com/watch?v=wLU_OnsAH6g). This work later motivated a more refined version with stepper-motor actuation and tighter IK control — and indirectly drove the in-house [Titan 550 industrial 3D printer]({{ '/projects/08_titan550/' | relative_url }}) programme, originally started because the chassis parts for this arm were too expensive to outsource.

### Tech Stack

`SolidWorks` · `3D printing (PLA)` · `Micro-servos` · `Arduino` · `Inverse kinematics` · `Denavit–Hartenberg`

[**Code & demo on GitHub →**](https://github.com/Monirul305/Designing-and-Implementation-of-Robotic-Arm-with-5-Degree-fo-Freedom)
