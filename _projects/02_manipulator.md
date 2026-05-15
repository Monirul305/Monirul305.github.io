---
layout: page
title: Mobile Manipulator with Custom Closed-Form 6-DOF IK (ROS 2 / MoveIt 2)
description: >
  Full real-time control stack for a 6-DOF arm + tracked base. Custom
  closed-form analytical IK replacing MoveIt's KDL solver. Singularity-aware
  smooth scaling, FK-anchored accumulator, 40-test unit suite.
img: assets/img/projects/manipulator.jpg
importance: 1
category: professional
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-info" role="alert">
      <strong>Scope:</strong> ~3,500 lines of Python across coordinator, IK solver,
      FK module, SBus decoder, and 40-test unit suite. Full URDF/SRDF description
      and MoveIt 2 / ros2_control integration.
    </div>
  </div>
</div>

### Platform

A tracked mobile robot with 11 independently actuated joints:

| Group | Joints | Control Mode |
|---|---|---|
| **Arm** | turret, shoulder, elbow, telescope, wrist_pan, wrist_roll | Position (JTC via ros2_control) |
| **Flippers** | front_flipper, rear_flipper | Position (JTC) |
| **Drive** | left_drive, right_drive | Velocity (open-loop from SBus) |
| **Gripper** | gripper | Torque (open-loop from SBus) |

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

**coordinator_node** (2,200 lines) handles: operator-intent translation, IK solving, FSM state management, trajectory dispatch, MoveIt collision gating, watchdog, and diagnostics at 10 Hz.

---

### Closed-Form Inverse Kinematics

**Why not numerical (KDL)?** MoveIt's default KDL solver has 5–30 ms solve-time jitter (breaking the 20 Hz dispatch rhythm), silent singularity failures, and freely picks far solution branches causing arm flips.

**Custom analytical solver:** Constant-time arithmetic, no convergence loops, deterministic, and biased toward the current arm configuration to avoid discontinuous joint flips.

#### Kinematic Decomposition — 3 Stages

**Stage 1 — Turret (yaw)**
`θ_turret = atan2(x, ±y)` of the target's planar projection, with branch selection based on the current arm-local Y direction.

**Stage 2 — Planar 2R + prismatic (shoulder, elbow, telescope)**
The wrist-center distance `D` from the shoulder pivot forms a triangle. Elbow vertex angle from the law of cosines:

```
cos(vertex) = (L_upper² + L_forearm² − D²) / (2 · L_upper · L_forearm)
θ_elbow     = arccos(clip(cos(vertex), −1, +1)) − ELBOW_RPY_OFFSET
```

**Stage 3 — Wrist (pitch-roll)**
Additive decoupling: `wrist_pan = pitch_world − shoulder − elbow − URDF_offset`

#### URDF Constants

| Constant | Value | Meaning |
|---|---|---|
| L_UPPER | 0.34520 m | Shoulder → elbow distance |
| FOREARM_PARA | 0.33238 m | Elbow → wrist parallel |
| FOREARM_PERP | 0.0915 m | Elbow → wrist perpendicular |
| SHOULDER_Z | 0.28447 m | Shoulder pivot height |
| TURRET_MAX_STEP | 0.30 rad/tick | Slew rate limit |

#### Validation — 40-Test Suite

- Workspace grid sweep: ~1,500 reachable poses, accuracy ≤ 1×10⁻⁵ m
- Boundary conditions at D_min ± ε and D_max ± ε
- Joint-limit clipping for shoulder, elbow, turret
- Branch consistency near y=0 transitions
- FK roundtrip: IK → FK returns the original target

---

### Singularity Handling: Smooth Turret Scaling

**The problem:** At home pose, the wrist sits 18 mm from the base axis. A 5 mm Y-nudge (with X held at 5 mm) demanded a **47° turret swing** — producing 16 cm of visible, mechanically stressful elbow horizontal motion.

**Hard dead-zone rejected:** Held turret constant below a radius threshold. Caused a discontinuous boundary jump and loss of X-direction response.

**Smooth scaling (adopted):** Below `TURRET_SCALE_R`, both the turret diff AND the per-tick slew clamp scale by `r_xy / SCALE_R`:

```python
scale_factor       = min(1.0, r_xy / TURRET_SCALE_R)
turret_diff_scaled = turret_diff_full * scale_factor
max_step_effective = TURRET_MAX_STEP * scale_factor
new_turret         = current_turret + clamp(turret_diff_scaled, ±max_step_effective)
```

**Quantified impact (same operator command sequence):**

| SCALE_R | Peak turret | Elbow swing | X-tracking error |
|---|---|---|---|
| None (unscaled) | 80°+ | 33 cm | — |
| 0.15 m (default) | **34°** | **19 cm** | ~3 mm in zone |
| 0.30 m | 23° | 14 cm | ~6 mm in zone |

Default SCALE_R = 0.15 m: **≥ 40% reduction** in home-pose swing, X-tracking error < 1 cm.

---

### FK-Anchored Closed-Loop Accumulator

**The bug:** After smooth-scaling partially tracked a motion, the stale commanded X was fed forward by the open-loop accumulator into subsequent ticks — producing **diagonal motion on pure-Y commands**.

**Root cause:** `_last_valid_goal` was anchored to the commanded position, not where the wrist actually arrived.

**Two-part fix:**
1. After each IK execution, run FK on the joint solution. Anchor `_last_valid_goal` to the FK-actual wrist position.
2. Per-axis hybrid accumulation: active axes accumulate from current goal; inactive axes snap to the FK anchor each tick.

**Quantified impact:**

| Metric | Before | After |
|---|---|---|
| Turret peak during pure-Y phase | 1.04 rad (60°) | 0.46 rad (26°) |
| Un-commanded X drift during Y push | +3.8 cm | **+0.7 cm** |
| Cross-axis coupling on pure-Y | Visible | Suppressed |

**5× reduction** in un-commanded cross-axis motion.

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
| 1 — Collision | MoveIt `/check_state_validity` | Every flipper tick; 200 ms timeout; single-flight lock |
| 2 — Joint delta | Per-tick max cap (0.5 rad / 0.5 m) | Excess → reject + force re-arm |
| 3 — Radio link | 2 s SBus watchdog | Cancel trajectories, refuse commands until re-arm |

---

### Code Metrics

| Component | Language | Size |
|---|---|---|
| coordinator_node.py | Python | 2,200 lines |
| arm_ik.py | Python | 430 lines |
| fk.py | Python | 150 lines |
| test_arm_ik.py | Python | 500 lines, **40 tests** |
| sbus_publisher.py | Python | 300 lines |
| URDF + Xacro | XML | 600 lines |
| YAML configs | YAML | 300 lines |

---

### Tech Stack

`ROS 2` · `MoveIt 2` · `ros2_control` · `JointTrajectoryController` · `Python` · `URDF/Xacro` · `SRDF` · `SBus/UART` · `Closed-form IK` · `Python unittest`
