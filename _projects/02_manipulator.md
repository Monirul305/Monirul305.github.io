---
layout: page
title: 6-DOF Mobile Manipulator with Custom Closed-Form IK (ROS 2 / MoveIt 2)
description: >
  Full real-time control stack for a 6-DOF arm + 2-DOF anti-flipper arm
  on a tracked base. Custom closed-form analytical IK replacing MoveIt's
  KDL solver, singularity-aware turret scaling, and a 50 Hz cubic command
  stream driving seven CiA-402 drives over CANopen. 215 passing tests.
img: assets/img/projects/manipulator-two-assembled-units.jpeg
importance: 1
category: professional
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" alt="Two fully assembled Jontro Soinik 2.0 units side by side on the shop floor." %}

<p class="text-center"><em>Two complete Jontro Soinik 2.0 units — 6-DOF arms mounted on the carbon-fibre carriers, grippers and camera masts fitted, ready for bench and integration testing.</em></p>

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-info" role="alert">
      <strong>Scope:</strong> Full real-time control stack written in Python — coordinator node, custom IK solver, FK module, SBus decoder, a 50 Hz command streamer, and a CANopen bridge driving seven CiA-402 drives. Full URDF/SRDF description with MoveIt 2 collision checking and planning. 215 passing tests.
    </div>
  </div>
</div>

### Platform — Jontro Soinik 2.0

**Jontro Soinik 2.0** is the lightweight, carbon-fibre, man-transportable generation of the Jontro Soinik EOD ROV family — a ~25 kg carrier carrying a detachable ~25 kg arm with a 5 kg payload, where the carrier can drive independently of the arm. Unlike the heavier (~130 kg) v1 / v2 platforms, which are direct-teleop only, 2.0 is the generation that adds on-board autonomy: the custom closed-form IK, motion planning, and obstacle avoidance described below. It is tele-operated over an RC link and carries three coordinated subsystems on the same chassis: a **6-DOF arm** for primary manipulation, a **2-DOF anti-flipper arm** mounted on the carrier (which both stabilises the vehicle in transit and contributes to the on-board collision-avoidance envelope — the manipulator cannot plan into the anti-flipper's swept volume), and a **differential-drive tracked base**. The arm chain — `turret, shoulder, elbow, telescope, wrist_pan, wrist_roll` (6 DOF) plus a `gripper` end-effector — spans both the position-controlled Arm group and the torque-controlled Gripper row in the table below.

Six commanded joints ride **seven drives**: the shoulder and elbow are not independently driven but share a differential pair, so every shoulder or elbow command reaches the hardware as a combination on both motors and every measurement comes back through the exact inverse. A sign error in either direction shows up as the shoulder and elbow fighting each other, so both halves of the mix live within forty lines of the same file. All arm drives are 16-bit encoders on 101:1 gearing — 6 619 136 counts per output revolution.

> **Deployment status.** Two complete units are assembled and in bench / integration testing — joint-offset calibration, subsystem bring-up, and system-level validation. Once field-tested, the platform is set for deployment in UN peacekeeping missions, joining the [Jontro Soinik v1 / v2 EOD ROV family]({{ '/projects/03_soinik_rov/' | relative_url }}) already in UN service.

| Group | Joints | Control Mode |
|---|---|---|
| **Arm** | turret, shoulder, elbow, telescope, wrist_pan, wrist_roll | Position — CiA-402 CSP (mode 8), 6 joints across 7 drives |
| **Anti-flipper arm** | front_flipper, rear_flipper | Position (JTC) — also a collision-avoidance element |
| **Drive** | left_drive, right_drive | Velocity (open-loop from SBus) |
| **Gripper** | gripper | Torque — CiA-402 CST (mode 10), straight through from SBus |

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

### See It Move

<div class="card mt-3 mb-4 p-3">
  <div class="row">
    <div class="col-md-6">
      <video controls preload="metadata" poster="{{ '/assets/img/projects/js2-live-demo-poster.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" style="width: 100%;">
        <source src="{{ '/assets/video/js2-live-demo.mp4' | relative_url }}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <p class="text-center mt-2"><small class="text-muted"><strong>Live demo — handling a payload.</strong> The arm carries a cable reel by its carry handle, lowers it to the floor and releases it, then stows as the vehicle drives away.</small></p>
    </div>
    <div class="col-md-6 mt-3 mt-md-0">
      <div class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item"
          src="https://www.youtube.com/embed/fVKDyWmPwtU?start=25"
          allowfullscreen></iframe>
      </div>
      <p class="text-center mt-2"><small class="text-muted"><strong>Jontro Soinik 2.0 — Tracked Robot with 6-DOF Arm in Action.</strong> Full-system RViz / MoveIt walkthrough and live tele-op.</small></p>
    </div>
  </div>
</div>

---

### ROS 2 Node Graph

The arm runs across three ROS 2 processes. Nothing in the chain is a controller in the servo sense — every stage is a rate converter that hands a position to the next one, and the only closed loop around a physical joint lives inside the drives themselves.

```
 PROCESS 1          PROCESS 2 — coordinator          PROCESS 3 — robot_bringup
┌──────────────┐   ┌─────────────┬───────────────┐   ┌───────────────┬───────────────┐
│sbus_publisher│──▶│  _arm_tick  │ worker thread │──▶│ _command_tick │  6 CSP drives │
│ 50 Hz · 16ch │   │ 20 Hz accum.│ arm_ik +      │   │ 50 Hz · diff. │ +1 CST gripper│
│              │   │             │ collision     │   │ mix · CiA-402 │  node id 6–12 │
└──────────────┘   └─────────────┴───────────────┘   └───────────────┴───────────────┘
   /sbus/control      /arm_joint_commands — 50 Hz cubic stream        │
                              ▲                                       │
                              └──── /joint_states · pos + vel ────────┘
                                    TPDO1-triggered · ~56 Hz
```

**coordinator** integrates operator intent at 20 Hz, solves closed-form IK on a worker thread, gates every solve through MoveIt collision checking, feeds a 50 Hz command streamer, and publishes diagnostics at 10 Hz. Dispatch between the worker and the streamer is paced by deadbands rather than a timer, so it floats between roughly 4 and 7 Hz depending on which axis is driven.

**Tele-op bypasses `ros2_control` and the JointTrajectoryController entirely.** Joint targets go straight to a CANopen bridge that writes a `(Target_position, Profile_velocity)` pair per drive. MoveIt is consulted for validity on *every* tele-op solve, but only plans a path for the HOME and STAIR poses.

The return path is not just telemetry — it feeds the physical caps that bound open-loop demand, the arrival check that triggers rollback, the turret seed for IK, and MoveIt's start state.

---

### Closed-Form Inverse Kinematics

**Why not numerical (KDL)?** MoveIt's default KDL solver had three problems on this arm: solve-time jitter that broke the dispatch rhythm, silent failures at singularities, and free choice of solution branch that produced surprise arm flips.

**Custom analytical solver:** A from-scratch closed-form solver that decomposes the chain into turret (yaw), planar 2R + prismatic (shoulder / elbow / telescope), and wrist (pitch-roll) stages. Constant-time arithmetic, no convergence loops, deterministic, and biased toward the current arm configuration so it stays on the operator's expected branch. Backed by **215 passing tests** — 134 on the coordinator, 81 on the bridge — covering workspace sweeps, joint-limit clipping, branch consistency at boundaries, and FK round-tripping. Every piece of arithmetic that could be separated from ROS has been, so the whole suite runs as plain Python on a development machine with no ROS installed.

<div class="row mt-3 mb-2 justify-content-center">
  <div class="col-sm-9">
    {% include figure.liquid path="assets/img/projects/manipulator-joint-offset-calibration.jpeg" class="img-fluid rounded z-depth-1" alt="Correcting the arm's joint-position offsets from a laptop, with the arm mounted on a bench frame." %}
    <p class="text-center mt-1"><small class="text-muted">Correcting joint-position offsets on a frame-mounted arm. A closed-form solver takes the joint zeros and link geometry as exact — every offset error lands straight on the gripper as Cartesian error, so this calibration is what the whole analytical chain rests on.</small></p>
  </div>
</div>

---

### Singularity Handling: Smooth Turret Scaling

Near the base axis, a small Cartesian nudge in Y demanded a huge turret swing — visibly stressful elbow motion for what the operator perceived as a tiny command. A hard dead-zone fixed the swing but introduced a discontinuous boundary and killed X-direction response inside the zone.

Concretely: near the base axis a **5 mm wrist motion can demand 60° of turret**, which is about **16 cm of elbow swing** — enormous, stressful motion for what the operator feels as a nudge.

The shipped solution scales both the commanded turret delta and its per-tick slew clamp by `min(1, r_xy / 0.150 m)` whenever the wrist is inside that radius of the base axis. The wrist then lands on the signed projection of the target onto the slewed heading: partial tracking everywhere, no boundary jump, and per-tick elbow swing proportional to `r_xy`.

A related throttle turned out to be doing harm rather than good. A separate `turret_max_rate` clamp was limiting the slew in **100 % of solves** during long lateral pushes — the solver wanted 0.030 rad and was allowed 0.0060, a 5× throttle — which is why left–right ran at half the speed of forward–back. Disabling it took lateral speed from 6–8 mm/s to **16–19 mm/s**.

---

### Uncommanded Axes Hold — the X→Y Coupling Fix

A pure-X operator push was walking the arm diagonally. The cause was the goal accumulator re-anchoring every *uncommanded* axis to the FK anchor on each tick — that is, to where the solver actually ended up, not where the operator asked it to go. In the singular region the solver deliberately lands on a projection of the target rather than the target itself, so that residual got fed forward and integrated.

Measured on the robot: an X-only push ran Y from 0.280 m to 0.505 m — **223 mm of travel on an axis nobody touched**, while X advanced 101 mm.

The fix is a distinction between an axis that *holds* and an axis that *snaps*. A commanded axis accumulates from its current goal; an uncommanded axis holds its previous goal instead of re-anchoring. FK anchoring stays in the design, but only for `_last_valid_goal`, the rollback reference — anchoring the *live* accumulator to it is what carried untracked error forward. After the change the same X-only push produced **0.0 mm** of Y travel.

---

### Motion Planning (Special Commands)

Standard tele-op runs directly through the closed-form IK described above — the operator gets instant Cartesian response with no planner latency. **Special commands** that require coordinated multi-joint motion — the home pose, the stair pose — go through **MoveIt 2's planning service** (`/plan_kinematic_path`) instead. The planned path is then streamed sample-by-sample by a `TrajectoryPlayer` at 50 Hz with segment velocity as feed-forward. The `/check_state_validity` collision filter applies to both paths.

> **The bug that made the planner useless**
>
> MoveIt's `CheckStartStateBounds` adapter aborts the entire planning pipeline when any start joint sits outside its limit by *any* amount. The telescope encoder reads `+1.2e-08` at zero, against a URDF upper bound of exactly `0`. Every plan failed with "start state out of bounds" — **100 % of homing plans** — so HOME silently fell back to an unchecked straight-line path, which is precisely the fallback the collision-checked planner existed to replace. Nothing in the logs said so. The start state is now clamped into URDF range before the request goes out; a rounding-error clamp is silent, a real excursion logs a warning.

---

### State Machine & Operator Interface

**Operation modes (CH2):** `DISARMED` · `ARMED` · `STAIR`

**Control sub-modes (CH1):** `HOME` · `ARM` · `DRIVE`

**FSM states:** `IDLE → VALIDATE → PLANNING → EXECUTING → HOMING`

Sixteen SBUS channels are decoded into a typed message at 50 Hz, and frames with two or more channels outside the sane range are rejected as garbage before anything downstream sees them. Every arm axis is a discrete **−1 / 0 / +1** switch — there is no proportional stick anywhere in the arm path, which is why the coordinator has to synthesise speed by integrating: 1 mm per tick in translation, 0.006 rad of pitch, 0.02 rad of roll. At 20 Hz that is a commanded envelope of 20 mm/s, 0.12 rad/s of pitch and 0.4 rad/s of roll.

**Priority poses.** Three modes take the arm off the sticks entirely and bypass the accumulators. **HOME** drives all joints to zero and runs non-interruptibly, kicking the flippers off first so their sequence runs in parallel with planning rather than waiting out the planner. **STAIR** sets the flippers to ±0.6109 rad and the arm to zero, then *locks* the arm until the switch returns to ARMED — latching into hold once both legs finish or a 60 s backstop expires, so the mode cannot stick half-entered. **FIRING** is entered over a service rather than the RC, and gives direct wrist_pan control with every candidate angle collision-checked before it is committed.

**Re-arm discipline:** Required after any IK rejection, joint-delta excess, collision failure, watchdog event, or mode transition — prevents surprise motion from a previously stuck stick.

---

### Safety Architecture

| Guard | Threshold | Action on trip |
|---|---|---|
| RC watchdog | 2.0 s without SBUS | Cancel trajectory and playback, zero every command, abort flipper homing, drain the queue, snap to measured |
| Joint-state watchdog | 0.5 s silence | Block all arm motion; resumes automatically when messages return |
| Arrival check | 0.150 rad | Roll the accumulators back and require every stick to centre before motion resumes |
| Joint-delta guard | 0.5 rad | Reject the IK solution outright and log full diagnostic context |
| Collision check | every solve | Reject the solution; the goal rolls back |
| Following check | cmd moved > 0.03 rad, measured < 20 % of it over 1 s | Throttled warning naming the joint |
| Arm fault stop | event | Arm bridge latches disarmed; the drive bus keeps running |
| Battery gate | 60 s at startup | Bring-up waits; no motor initialisation without it |

Two design rules run through all of it.

**Caps restrain, never induce.** A naive two-sided clamp `max(lo, min(hi, want))` does not merely restrain a stuck joint — it *induces* motion, because when the measurement sits far from the command the clamp snaps the command to the window edge, which can be on the opposite side of where it started. Measured on the robot: a cap meant to slow an axis down moved it from `−0.006` to `+0.391` rad, a 0.4 rad jump. The replacement only ever moves a proposal back *toward* the current value, never past it.

**The arm bus is expendable; the drive bus is not.** A missing arm motor disables the arm bus and lets the vehicle drive home. A missing drive motor terminates the process.

---

### Build & Integration

#### Firmware test bed — SO-101 replica

Before any of this ran on the real arm, it ran on a desktop stand-in. I built a replica of the open-source **SO-101** arm as the initial test bed for JS2 firmware and motion development — a light, cheap surrogate is the right place to discover that a joint command is wrong, not 25 kg of carbon fibre with a gripper on the end.

Joint-level firmware (servo command and feedback), the operator control GUI, and the IK / motion-command path were all brought up here first. The controller drives the arm the way the real platform does — the operator commands an end-effector pose and the solver works out the joints — so the interaction model was settled on the bench before it was ever pointed at the real hardware.

<div class="row justify-content-center mt-3">
  <div class="col-md-8">
    <video controls preload="metadata" poster="{{ '/assets/img/projects/js2-firmware-testbed-poster.jpg' | relative_url }}" class="img-fluid rounded z-depth-1" style="width: 100%;">
      <source src="{{ '/assets/video/js2-firmware-testbed.mp4' | relative_url }}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <p class="text-center mt-2"><small class="text-muted">The desktop SO-101 replica — not the JS2 arm — jogged from the custom controller. The operator commands the end-effector in Cartesian space with the mouse and the solver works out the joints, the same interaction model the real platform uses.</small></p>
  </div>
</div>

#### Electrical and integration

Alongside the software stack, I led the **electrical side** of this platform — the on-vehicle harness routed through the carbon-fibre carrier, power distribution to the arm motors and drive groups, sensor / encoder wiring, and the radio / SBus chain that feeds the coordinator node. From schematic-level decisions through harness build and system bring-up, this side was mine.

<div class="row project-photo-row mt-3">
  <div class="col-sm-3">
    {% include figure.liquid path="assets/img/projects/manipulator-arm-harness-solder.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="Soldering the arm harness at the bench, with the carbon-fibre wrist and gripper assembly alongside." %}
    <p class="text-center mt-1"><small class="text-muted">Terminating the arm harness at the bench.</small></p>
  </div>
  <div class="col-sm-3">
    {% include figure.liquid path="assets/img/projects/manipulator-carrier-wiring.jpeg" class="img-fluid rounded z-depth-1" zoomable=true alt="Wiring the on-carrier harness during integration." %}
    <p class="text-center mt-1"><small class="text-muted">Routing power and signal lines through the carrier.</small></p>
  </div>
  <div class="col-sm-3">
    {% include figure.liquid path="assets/img/projects/manipulator-internal-wiring.jpeg" class="img-fluid rounded z-depth-1" zoomable=true alt="Working on the internal wiring of the 6-DOF mobile manipulator." %}
    <p class="text-center mt-1"><small class="text-muted">Dressing the internal harness and motor-drive lines.</small></p>
  </div>
  <div class="col-sm-3">
    {% include figure.liquid path="assets/img/projects/manipulator-wrist-bench-test.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="Bench bring-up of the wrist and gripper assembly over a USB-CAN analyser and lab supply." %}
    <p class="text-center mt-1"><small class="text-muted">Wrist / gripper bring-up over USB-CAN, on a current-limited supply.</small></p>
  </div>
</div>

#### Mechanical — supporting role

The **mechanical side** — the carbon-fibre carrier the 6-DOF chain mounts on, the tracked-base drive groups, the chassis hard-points — was led by Cybernetics' mechanical team. I helped on the bench with lay-up, fit-up, and assembly while the mechanical lead drove the design decisions.

<div class="row project-photo-row mt-3">
  <div class="col-sm-4">
    {% include figure.liquid path="assets/img/projects/manipulator-carbonfiber-1.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="Assisting with the carbon-fibre carrier lay-up on the manipulator." %}
    <p class="text-center mt-1"><small class="text-muted">Assisting the carrier lay-up — orienting plies before cure.</small></p>
  </div>
  <div class="col-sm-4">
    {% include figure.liquid path="assets/img/projects/manipulator-carbonfiber-2.jpg" class="img-fluid rounded z-depth-1" zoomable=true alt="Pre-resin-infusion trimming of the dry carbon-fibre lay-up in the mould." %}
    <p class="text-center mt-1"><small class="text-muted">Trimming the dry lay-up before vacuum infusion.</small></p>
  </div>
  <div class="col-sm-4">
    {% include figure.liquid path="assets/img/projects/manipulator-drive-wheels.jpeg" class="img-fluid rounded z-depth-1" zoomable=true alt="Helping build up the drive-wheel assembly for the 6-DOF mobile manipulator's tracked base." %}
    <p class="text-center mt-1"><small class="text-muted">Helping build up the drive-wheel assembly.</small></p>
  </div>
</div>

<p class="text-center mt-2"><small class="text-muted"><em>Click any photo to enlarge.</em></small></p>

---

### Tech Stack

`ROS 2 (Jazzy)` · `MoveIt 2` · `CANopen / CiA-402` · `CSP + CST drive modes` · `TPDO / SDO` · `Python` · `URDF/Xacro` · `SRDF` · `SBus/UART` · `Closed-form IK` · `Cubic Hermite streaming` · `Differential drive mix` · `Python unittest (215 passing)`
