---
layout: page
title: research statement
permalink: /research-statement/
nav: false
description: >
  My PhD thesis direction, a concrete first-year plan, the methodological tools
  I would bring, and how the systems I have already shipped position me to do the
  work.
---

### The question

Small teams of mobile robots are starting to share dense, human-occupied spaces — factory floors, warehouses, disposal sites — with no physical barriers between robot and person. The coordination layer that keeps such a team safe is, in almost every deployed system I know of (my own included), **empirically robust but methodologically thin**: it works because every anticipated failure mode was engineered around, not because anyone can state the conditions under which it is guaranteed to hold.

**The thesis I want to write:** how do you scale decentralised coordination of a mobile-robot team in a shared human space past demonstrative fleet sizes, with a safety claim that is *characterised* — a stated guarantee with stated assumptions — rather than a hand-engineered failure-mode survey, and characterised all the way **down to the embedded substrate** the coordination silently depends on?

That last clause is the part that is distinctly mine. Most multi-robot-coordination work assumes a well-behaved drive and comms layer; I have spent three years building that layer and watching exactly where it breaks in the field.

### Why this question falls out of the work I've shipped

My [3-robot AGV fleet]({{ '/projects/01_agv_fleet/' | relative_url }}) runs **decentralised prioritised MAPF** — each robot publishes its plan as timestamped reservations, and peers treat them as spatiotemporal constraints under vertex / swap / target conflict checks. It has months of zero-collision operation alongside hundreds of workers with no barriers. But I cannot hand a committee a completeness argument, a deadlock-recovery bound, or a benchmark against the literature: priorities are inherited from dispatch order and never searched, and "safe" currently means "no failure mode we anticipated has occurred yet." The gap between a fleet that demonstrably works and a coordination scheme whose guarantees are *stated* is the thesis.

The coordination layer rests on assumptions about the layer beneath it — bounded inter-node latency, fault detection that actually fires, drives that hold a commanded speed. I have built and debugged that substrate directly, though on more than one drivetrain: the AGV fleet runs differential-drive control over Modbus RTU with NTP fleet-time gating, while my first-author [dual-MCU BLDC synchronisation]({{ '/projects/04_ga_pid/' | relative_url }}) and co-authored [fault-tolerant dual-network feedback]({{ '/projects/23_dual_network/' | relative_url }}) work sits on the EOD ROV drivetrain. Different buses, same dependency — and it is where I have most directly confronted the difference between "works on the bench" and "holds in the field." A coordination-layer safety claim that ignores these substrate assumptions is not actually characterised. Closing that loop — coordination guarantees that account for the substrate they ride on — is what I can do that a simulation-only applicant cannot.

The robots in such a team increasingly carry manipulators: my [Jontro Soinik 2.0]({{ '/projects/02_manipulator/' | relative_url }}) is a mobile platform with a 6-DOF arm, custom closed-form IK, and on-board motion planning. Whole-body, singularity-aware control of an arm on a moving base in human envelopes is a real open problem and a natural extension of this direction — but it is control theory I would take up with a co-advisor, not the spine of the thesis.

### A concrete first-year plan

To keep the thesis falsifiable rather than aspirational, the first year has a specific, runnable shape:

1. **Reproduce and benchmark.** Port the deployed reservation scheme into simulation and measure its degradation curve — success rate, makespan, replans per agent, deadlock-recovery time — at **3 → 10 → 25 → 50 agents** on the standard MAPF benchmark maps (the MovingAI / MAPF-benchmark suite), against named baselines: prioritised planning, cooperative A\*, and **PIBT**. This turns "it works on 3 robots" into a measured statement of where it breaks and why.
2. **State a safety object.** Replace the hand-engineered failure-mode survey with one named formal claim — a **runtime safety monitor / shield** that provably refuses unsafe actions, or a **probabilistic collision bound** under bounded localisation error — and prove or empirically validate it on the benchmark.
3. **Reach down to the substrate.** Make explicit the substrate assumptions the safety claim depends on (an inter-node latency bound, a fault-detection-latency bound, a synchronised-drive error bound), using my BLDC-sync and dual-network testbeds, and characterise how the coordination-layer guarantee degrades as each is violated.

The year-one output I would aim for is a single paper: the deployed scheme, its measured scaling behaviour against MAPF baselines, and a first characterised safety claim with its substrate assumptions made explicit.

### What I bring, and what I am here to add

What I bring is three years of full-stack field deployment — production systems, real customers including a uniformed end-user, and a track record of being the person called when something has to work in the field rather than on a slide.

What I am here to add is **bounded and specific to the thesis above**, not a whole field I am starting from zero: formal-methods tooling for the safety claim (runtime verification, control-barrier functions, probabilistic model checking), MAPF theory at thesis depth (completeness and the priority-ordering literature I currently use only by name), and the publishable-result discipline that turns a shipped system into a benchmarked, characterised contribution. I would close these in first-year coursework — convex optimisation, a formal-methods / verification course, and a multi-agent-systems or motion-planning seminar — and in qualifying-exam preparation.

The fit I am looking for is a group whose students **ship hardware and prove things about it** — multi-robot coordination, field robotics, or safe autonomy in human-shared spaces.

### Provenance

Every claim above traces to a system I have built, a paper I am on, or a deployment I have personally been part of — see [projects]({{ '/projects/' | relative_url }}) and [publications]({{ '/publications/' | relative_url }}) for the evidence.
