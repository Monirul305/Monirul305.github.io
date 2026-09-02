---
layout: page
title: 6-DOF Mobile Manipulator with Custom Closed-Form IK (ROS 2 / MoveIt 2)
description: >
  Full real-time control stack for a 6-DOF arm + 2-DOF anti-flipper arm
  on a tracked base. Custom closed-form analytical IK replacing MoveIt's
  KDL solver. Singularity-aware smooth scaling, FK-anchored accumulator.
img: assets/img/projects/manipulator-two-assembled-units.jpeg
importance: 1
category: professional
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" alt="Two fully assembled Jontro Soinik 2.0 units side by side on the shop floor." %}

<p class="text-center"><em>Two complete Jontro Soinik 2.0 units — 6-DOF arms mounted on the carbon-fibre carriers, grippers and camera masts fitted, ready for bench and integration testing.</em></p>

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-info" role="alert">
      <strong>Scope:</strong> Full real-time control stack written in Python — coordinator node, custom IK solver, FK module, SBus decoder, and a unit-test suite. Full URDF/SRDF description with MoveIt 2 / ros2_control integration.
    </div>
  </div>
</div>

### Platform — Jontro Soinik 2.0

**Jontro Soinik 2.0** is the lightweight, carbon-fibre, man-transportable generation of the Jontro Soinik EOD ROV family — a ~25 kg carrier carrying a detachable ~25 kg arm with a 5 kg payload, where the carrier can drive independently of the arm. Unlike the heavier (~130 kg) v1 / v2 platforms, which are direct-teleop only, 2.0 is the generation that adds on-board autonomy: the custom closed-form IK, motion planning, and obstacle avoidance described below. It is tele-operated over an RC link and carries three coordinated subsystems on the same chassis: a **6-DOF arm** for primary manipulation, a **2-DOF anti-flipper arm** mounted on the carrier (which both stabilises the vehicle in transit and contributes to the on-board collision-avoidance envelope — the manipulator cannot plan into the anti-flipper's swept volume), and a **differential-drive tracked base**. The arm chain — `turret, shoulder, elbow, telescope, wrist_pan, wrist_roll` (6 DOF) plus a `gripper` end-effector — spans both the position-controlled Arm group and the torque-controlled Gripper row in the table below.

> **Deployment status.** Two complete units are assembled and in bench / integration testing — joint-offset calibration, subsystem bring-up, and system-level validation. Once field-tested, the platform is set for deployment in UN peacekeeping missions, joining the [Jontro Soinik v1 / v2 EOD ROV family]({{ '/projects/03_soinik_rov/' | relative_url }}) already in UN service.

| Group | Joints | Control Mode |
|---|---|---|
| **Arm** | turret, shoulder, elbow, telescope, wrist_pan, wrist_roll | Position (JTC via ros2_control) |
| **Anti-flipper arm** | front_flipper, rear_flipper | Position (JTC) — also a collision-avoidance element |
| **Drive** | left_drive, right_drive | Velocity (open-loop from SBus) |
| **Gripper** | gripper | Torque (open-loop from SBus) |

<div class="row project-photo-row mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator.jpg" class="img-fluid rounded z-depth-1" alt="CAD model of the Jontro Soinik 2.0 platform with the 6-DOF arm extended and both flipper arms raised." %}
    <p class="text-center mt-1"><small class="text-muted">The design model — 6-DOF arm extended off the turret, front and rear flipper arms raised, on the differential-drive tracked base.</small></p>
  </div>
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator-carrier-stair-climb.jpg" class="img-fluid rounded z-depth-1" alt="The assembled Jontro Soinik 2.0 carrier taking a stair flight with front and rear flipper arms deployed." %}
    <p class="text-center mt-1"><small class="text-muted">The built carrier on a stair flight — flipper arms deployed to bridge the step edges. The arm detaches; the carrier drives on its own.</small></p>
  </div>
</div>

---

### ROS 2 Node Graph

```
sbus_publisher  ──(SbusControl @200Hz)──▶  coordinator_node
                                                  │
                         ┌────────────────────────┤
                         ▼                        ▼
              arm_controller/                 move_group
           follow_joint_trajectory          (MoveIt 2)
             (action server)            /check_state_validity
                                        /plan_kinematic_path
```

**coordinator_node** handles: operator-intent translation, IK solving, FSM state management, trajectory dispatch, MoveIt collision gating, watchdog, and diagnostics at 10 Hz.

---

### Closed-Form Inverse Kinematics

**Why not numerical (KDL)?** MoveIt's default KDL solver had three problems on this arm: solve-time jitter that broke the dispatch rhythm, silent failures at singularities, and free choice of solution branch that produced surprise arm flips.

**Custom analytical solver:** A from-scratch closed-form solver that decomposes the chain into turret (yaw), planar 2R + prismatic (shoulder / elbow / telescope), and wrist (pitch-roll) stages. Constant-time arithmetic, no convergence loops, deterministic, and biased toward the current arm configuration so it stays on the operator's expected branch. Backed by a unit-test suite covering workspace sweeps, joint-limit clipping, branch consistency at boundaries, and FK round-tripping.

<div class="row project-photo-row mt-3 mb-2 justify-content-center">
  <div class="col-sm-9">
    {% include figure.liquid path="assets/img/projects/manipulator-joint-offset-calibration.jpeg" class="img-fluid rounded z-depth-1" alt="Correcting the arm's joint-position offsets from a laptop, with the arm mounted on a bench frame." %}
    <p class="text-center mt-1"><small class="text-muted">Correcting joint-position offsets on a frame-mounted arm. A closed-form solver takes the joint zeros and link geometry as exact — every offset error lands straight on the gripper as Cartesian error, so this calibration is what the whole analytical chain rests on.</small></p>
  </div>
</div>

---

### Singularity Handling: Smooth Turret Scaling

Near the base axis, a small Cartesian nudge in Y demanded a huge turret swing — visibly stressful elbow motion for what the operator perceived as a tiny command. A hard dead-zone fixed the swing but introduced a discontinuous boundary and killed X-direction response inside the zone.

The shipped solution scales both the commanded turret delta and its per-tick slew clamp by `r_xy / SCALE_R` whenever the wrist is inside `SCALE_R` of the base axis. The motion stays continuous across the boundary, the home-pose swing shrinks by more than 40 %, and X-direction tracking error inside the zone stays under a centimetre.

---

### FK-Anchored Closed-Loop Accumulator

After smooth-scaling partially tracked a motion, the stale commanded position was fed forward into subsequent ticks — pure-Y operator commands started producing diagonal motion because the goal accumulator anchored to the commanded position rather than where the wrist actually arrived.

The fix: after each IK execution, run FK on the joint solution and re-anchor the accumulator to the FK-actual wrist position. Active axes still accumulate from the current goal; inactive axes snap to the FK anchor each tick. Cross-axis coupling on pure-axis commands dropped roughly 5×.

---

### Motion Planning (Special Commands)

Standard tele-op runs directly through the closed-form IK described above — the operator gets instant Cartesian response with no planner latency. **Special commands** that require coordinated multi-joint motion — return-to-rest, the home pose, named configuration setpoints — go through **MoveIt 2's planning service** (`/plan_kinematic_path`) instead. The planned trajectory is dispatched through the same `FollowJointTrajectory` action server that handles tele-op output, and the per-tick `/check_state_validity` collision filter applies to both paths.

---

### State Machine & Operator Interface

**Operation modes:** `DISARMED` · `ARMED` · `ACTUATING`

**Control sub-modes:** `ARM` · `DRIVE` · `HOME`

**FSM states:** `IDLE → VALIDATE → PLANNING → EXECUTING → HOMING` (8 transitions)

**Re-arm discipline:** Required after any IK rejection, joint-delta excess, collision failure, watchdog event, or mode transition — prevents surprise motion from a previously stuck stick.

---

### Safety Architecture

| Tier | Mechanism | Detail |
|---|---|---|
| 1 — Collision | MoveIt `/check_state_validity` | Checks the **arm, anti-flipper arm, and carrier** together every flipper tick; 200 ms timeout; single-flight lock |
| 2 — Joint delta | Per-tick max cap (0.5 rad / 0.5 m) | Excess → reject + force re-arm |
| 3 — Radio link | 2 s SBus watchdog | Cancel trajectories, refuse commands until re-arm |

---

### Electrical Build & Integration

Alongside the software stack, I led the **electrical side** of this platform — the on-vehicle harness routed through the carbon-fibre carrier, power distribution to the arm motors and drive groups, sensor / encoder wiring, and the radio / SBus chain that feeds the coordinator node. From schematic-level decisions through harness build and system bring-up, this side was mine.

<div class="row project-photo-row mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator-carrier-wiring.jpeg" class="img-fluid rounded z-depth-1" alt="Wiring the on-carrier harness during integration." %}
    <p class="text-center mt-1"><small class="text-muted">Routing the on-carrier harness — power and signal lines through the carrier into the avionics bay.</small></p>
  </div>
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator-internal-wiring.jpeg" class="img-fluid rounded z-depth-1" alt="Working on the internal wiring of the 6-DOF mobile manipulator." %}
    <p class="text-center mt-1"><small class="text-muted">Inside the chassis — dressing the internal harness, motor-drive lines, and sensor feedback paths.</small></p>
  </div>
</div>

<div class="row project-photo-row mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator-arm-harness-solder.jpg" class="img-fluid rounded z-depth-1" alt="Soldering the arm harness at the bench, with the carbon-fibre wrist and gripper assembly alongside." %}
    <p class="text-center mt-1"><small class="text-muted">Terminating the arm harness at the bench — the carbon-fibre wrist tube and gripper it feeds sit alongside, waiting on the loom.</small></p>
  </div>
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator-wrist-bench-test.jpg" class="img-fluid rounded z-depth-1" alt="Bench bring-up of the wrist and gripper assembly over a USB-CAN analyser and lab supply." %}
    <p class="text-center mt-1"><small class="text-muted">Bench bring-up of the wrist / gripper assembly — driven from the laptop through a USB-CAN analyser on a current-limited lab supply, before anything moves on the vehicle.</small></p>
  </div>
</div>

---

### Mechanical Build (Supporting Role)

The mechanical side — the carbon-fibre carrier the 6-DOF chain mounts on, the tracked-base drive groups, the chassis hard-points — was led by Cybernetics' mechanical team. I helped on the bench with lay-up, fit-up, and assembly while the mechanical lead drove the design decisions.

<div class="row project-photo-row mt-3">
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator-carbonfiber-1.jpg" class="img-fluid rounded z-depth-1" alt="Assisting with the carbon-fibre carrier lay-up on the manipulator." %}
    <p class="text-center mt-1"><small class="text-muted">Assisting with the carbon-fibre carrier lay-up — orienting plies before cure.</small></p>
  </div>
  <div class="col-sm-6">
    {% include figure.liquid path="assets/img/projects/manipulator-carbonfiber-2.jpg" class="img-fluid rounded z-depth-1" alt="Pre-resin-infusion trimming of the dry carbon-fibre lay-up in the mould." %}
    <p class="text-center mt-1"><small class="text-muted">Pre-resin-infusion trimming — dressing the dry lay-up in the mould before vacuum infusion.</small></p>
  </div>
</div>

{% include figure.liquid path="assets/img/projects/manipulator-drive-wheels.jpeg" class="project-hero-img rounded z-depth-1" alt="Helping build up the drive-wheel assembly for the 6-DOF mobile manipulator's tracked base." %}

<p class="text-center"><em>Helping build up the drive-wheel assembly — bearing seats, pulleys, and brace plates laid out before lacing.</em></p>

---

### Demo Video

<div class="row justify-content-center mt-3">
  <div class="col-sm-8">
    <div class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/fVKDyWmPwtU?start=25"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-2">
      <em>Jontro Soinik 2.0 — Tracked Robot with 6-DOF Arm in Action</em>
      — full-system RViz / MoveIt walkthrough and live tele-op
    </p>
  </div>
</div>

---

### Tech Stack

`ROS 2 (Jazzy)` · `MoveIt 2` · `ros2_control` · `JointTrajectoryController` · `Python` · `URDF/Xacro` · `SRDF` · `SBus/UART` · `Closed-form IK` · `Python unittest`
