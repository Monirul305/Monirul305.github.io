---
layout: page
title: research statement
permalink: /research-statement/
nav: false
description: >
  PhD research direction, the open problems I want to attack, the methodological
  tools I would bring, and how the work I have already shipped positions me to do
  them.
---

### The question

What is the right way to deploy small, coordinated teams of mobile robots — some of them carrying manipulators — into dense, human-occupied environments, with safety and coordination properties that hold up under realistic sensor, network, and mechanical fault, and with formal characterisation rather than empirical hope?

This is the question I want to spend a PhD on. It sits at the intersection of three areas I have already worked in at production depth: decentralised multi-robot coordination, mobile manipulation, and the embedded substrate that lets both run reliably in the field.

### Why this question, and why now

Most of the deployed multi-robot systems I have shipped — the [3-robot AGV fleet]({{ '/projects/01_agv_fleet/' | relative_url }}) at The Urmi Group, the [Jontro Soinik EOD ROVs]({{ '/projects/03_soinik_rov/' | relative_url }}) handed to the Bangladesh Army and forwarded to UN peacekeeping in Mali and the Republic of Congo — share a common pattern: a coordination layer that is empirically robust but methodologically thin.

The AGV fleet runs **decentralised prioritised MAPF** with peer-published reservation tables and three conflict checks (vertex / swap / target); it has accumulated months of zero-collision operation alongside hundreds of workers, with no physical barriers. But I cannot give a reviewer a completeness argument, a deadlock-recovery bound, or a published benchmark — the system works because we engineered around every failure mode we anticipated, not because the literature tells us when it will fail.

The older, heavier EOD ROVs run a 5-DOF arm under direct teleoperation; the lightweight, man-transportable [Jontro Soinik 2.0]({{ '/projects/02_manipulator/' | relative_url }}) adds a sixth (telescopic) joint plus a custom closed-form IK, motion planning, and obstacle avoidance on a moving base. Its singularity handling — smooth scaling as the planar radius shrinks toward zero — is a heuristic that has worked on the bench, but it is not a damping argument I can defend formally near a real singular configuration with a moving base underneath it.

Across both, the embedded layer — [dual-MCU BLDC synchronisation]({{ '/projects/04_ga_pid/' | relative_url }}), [fault-tolerant dual-network feedback]({{ '/projects/23_dual_network/' | relative_url }}) — is where my first-author research contribution and one co-author paper sit, and where I have spent the most time confronting the gap between what works on the bench and what holds up in the field.

The opening these systems leave is the research question above: how do you design, characterise, and field a small team of mobile manipulators in shared human spaces such that the safety and coordination properties are *provable*, not just empirically observed?

### Concrete open problems I would attack

**Scaling decentralised prioritised MAPF beyond demonstrative fleet sizes, with characterised safety under realistic fault.**
The MAPF literature has rich theoretical treatment (CBS, ECBS, PBS, PIBT, cooperative A\*) and large simulation benchmarks, but very few hardware studies past 5–10 robots in dense human environments. The open questions are what the practical degradation curve looks like, what additions (priority resolution, anytime replanning, lifelong formulations) are necessary to keep the scheme safe and complete as fleet size grows from 3 → 10 → 50, and what counts as a *characterised* safety claim in that setting rather than a hand-engineered failure-mode survey.

**Whole-body singularity-aware control for a mobile manipulator in human-shared workspaces.**
Adding manipulator motion to a moving base introduces coupling that pure base or pure arm controllers do not see; doing it near kinematic singularities while respecting human-safe motion envelopes is an open whole-body control problem. The literature is heavy on quadruped whole-body MPC; mobile-base plus serial-arm receives less treatment, and the field-robotics constraint — degraded sensing, intermittent comms, unstructured floor surfaces — sharpens it further.

**Embedded substrate guarantees the coordination layer can actually rely on.**
Multi-robot coordination implicitly assumes properties of the drive and comms layer — latency bounds, fault detection, synchronised drive speeds — that are routinely hand-engineered and rarely characterised. My GA-tuned dual-MCU bilateral cross-coupled BLDC synchronisation work and the co-authored dual-network feedback paper are first steps. The broader question is what set of substrate guarantees are necessary and sufficient for the safety properties at the coordination layer to actually hold.

### What I bring, and what I am explicitly here to add

What I am bringing is three years of full-stack field deployment under one roof — production systems, real customers including a uniformed end-user, and a track record of being the person called when something has to work in the field rather than on a slide.

What I am *not* bringing, and what a PhD is the right environment to add, is the formal control-theoretic background (Lyapunov, MPC theory, ISS, sum-of-squares), the MAPF-literature engagement at thesis depth, and the publishable-result discipline that converts shipped engineering into research contributions. These are gaps I will close in first-year coursework and qualifying-exam preparation, and I am applying to programs whose structure supports that closing.

The fit I am looking for is a group whose work values both — labs where graduate students ship hardware *and* prove things about it, not one or the other.

### Provenance

Every claim above traces to a system I have built, a paper I am on, or a deployment I have personally been part of — see [projects]({{ '/projects/' | relative_url }}) and [publications]({{ '/publications/' | relative_url }}) for the evidence.
