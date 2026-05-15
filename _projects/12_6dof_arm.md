---
layout: page
title: 5-DOF Robotic Arm — Stepper-Driven with 3D-Printed Planetary Gearboxes
description: >
  Five-degree-of-freedom serial robotic arm — SolidWorks frame, body
  fabricated on a hobby 3D printer I built in parallel, stepper-motor
  actuation through custom 3D-printed planetary gearboxes, Arduino-based
  control, and analytical inverse kinematics with closed-form algebraic
  solutions.
img: assets/img/projects/6dof_arm.jpg
importance: 1
category: undergraduate
---

{% include figure.liquid path=page.img class="img-fluid rounded z-depth-1" %}

A 5-degree-of-freedom serial robotic arm built end-to-end as an undergraduate robotics project at BUET — mechanical design, custom drivetrain, fabrication, and control software all done in-house. The arm has a fixed base, three intermediate revolute joints providing reach across a typical desktop workspace, a wrist roll joint, and a gripper end-effector.

**Mechanical design.** All structural links were designed in **SolidWorks**, sized against the torque demands at each joint, then 3D-printed on the [hobby 3D printer I built as a parallel project]({{ '/projects/16_hobby_3d_printer/' | relative_url }}) — not an outsourced or commercial machine. Joint axes and bearing locations were dimensioned so that the printed parts could be assembled without significant post-processing. Cable routing was planned at the design stage to avoid binding through the workspace.

**Drivetrain — custom 3D-printed planetary gearboxes.** Each joint is driven by a **stepper motor through a custom-designed planetary gearbox** that I designed in SolidWorks and 3D-printed on the same hobby printer. The planetary stage trades motor speed for torque at each joint — necessary because the raw stepper torque alone is insufficient to hold the cantilevered link mass and payload at the more distal joints. Designing the gearboxes in-house also made the gear ratios tunable per-joint to the actual load profile, rather than being forced into off-the-shelf ratios.

**Control.** An **Arduino** receives a target end-effector pose, computes the inverse kinematics to derive each joint angle, and dispatches synchronised step / direction pulses to the stepper drivers. A simple interpolation layer smooths motion between successive targets.

**Kinematics.** Forward kinematics use a Denavit–Hartenberg parameterisation of the arm. Inverse kinematics is implemented as **analytical IK using closed-form algebraic solutions** — derived by decomposing the arm's geometry into position-reachability and wrist-orientation sub-problems, then solving each in closed form rather than relying on numerical iteration. Elbow-up / elbow-down branch selection is exposed as a parameter to the caller.

A demonstration of the assembled arm performing pick-and-place is available in the repository's [demo video](https://www.youtube.com/watch?v=wLU_OnsAH6g).

### Tech Stack

`SolidWorks` · `3D printing (hobby printer)` · `Custom planetary gearbox` · `Stepper motors` · `Arduino` · `Analytical IK (closed-form)` · `Denavit–Hartenberg`

[**Code & demo on GitHub →**](https://github.com/Monirul305/Designing-and-Implementation-of-Robotic-Arm-with-5-Degree-fo-Freedom)
