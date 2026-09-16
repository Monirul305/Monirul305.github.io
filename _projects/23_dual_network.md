---
layout: page
title: Dual-Network Feedback Communication for a Tele-Operated Multi-Node Vehicle (Co-Author Paper)
description: >
  One bare-metal STM32 masters an RS-485 bus over eleven nodes while
  terminating a W5500 TCP/IP uplink. A discrete-event model built from the
  firmware's own scheduling logic identifies the uplink reply format, not
  the bus, as what dominates telemetry age. Co-author manuscript submitted.
importance: 2
category: research
related_publications: true
---

### The Problem

A tele-operated multi-node robot has to satisfy two communication requirements that are hard to reconcile on one network. **Inside** the chassis, command and telemetry must reach many actuator nodes on a predictable schedule, over short distances, in an electrically hostile environment. **Outside** it, a far larger volume of video and status traffic has to cross a wireless hop to an operator console that may be arbitrarily distant, using routable commodity transport. A bus optimised for the first requirement is a poor fit for the second.

Splitting the two across separate networks is not new — plenty of platforms pair an internal serial bus with an external IP link. What that body of work does not provide is **characterisation**. Where per-node telemetry is returned to an operator, its freshness at the console is typically neither modelled nor reported, and where a liveness indication exists at all, its false-alarm behaviour goes unexamined. The paper claims no novelty for the architecture as such; the contribution is the model of its feedback path.

### The Architecture

Two networks join at a single master node, which is the only element present on both.

| Network | Carries | Detail |
|---|---|---|
| **RS-485 fieldbus** | Command and feedback, inside the vehicle | 115.2 kbps, 8N1, half-duplex daisy-chained multidrop, 120 Ω terminated at both ends, MAX485 converter with automatic direction control |
| **TCP/IP uplink** | Telemetry outward to the console | WIZnet W5500 hardwired TCP/IP controller on the master's SPI bus |

The master is an **STM32F446RE**; the eleven addressed nodes are STM32G431GB devices — six manipulator joints, two drive motors, two pan-tilt-zoom camera mounts, and a sensor node reporting battery and temperature. The master broadcasts a 96-byte command frame to all nodes every 19.73 ms, and the single addressed node returns a 28-byte feedback frame that every other node also latches. The combined 124-byte exchange occupies 10.76 ms of the cycle — 54 % of it; the rest is idle time.

What makes the arrangement worth reporting is that **one bare-metal microcontroller does both jobs at once**. Because the W5500 implements the TCP state machine, retransmission and address resolution in silicon, the microcontroller handles application payload only — which is what permits a single device to terminate the uplink while still meeting the bus schedule. Comparable tele-operated platforms interpose a single-board computer and a separate radio module between fieldbus and network; this design removes both. Six cameras share the onboard switch and the same wireless hop, but video never traverses the master.

### What the Model Found

The feedback path is analysed with a **discrete-event model whose structure is taken from the master firmware and the client software rather than from the design description** — it executes the firmware's counter logic verbatim, including its behaviour at mode transitions.

The decisive step is separating the intra-vehicle polling schedule from the uplink terms, which prior latency models could not do. The bus bounds a node's telemetry age at **217 ms** in idle mode. But the operator client opens one TCP socket, sends a command, waits for the reply, then sleeps 25 ms — so the reply *as built*, carrying only the latest single node's feedback per exchange, delivers just the fraction of node replies that happen to be serviced within the corresponding cycle.

| Uplink reply | Node replies delivered | 99th-percentile age at console | Longest gap between updates |
|---|---|---|---|
| **As built** — one node per exchange | 63 % wired · **38 % wireless** · 18 % congested | 1.5 s · **2.1 s** · 5.3 s | over 3 s on every class |
| **Full state** — all eleven nodes, 264 B | 100 % wired · **100 % wireless** · 98 % congested | 242 ms · **273 ms** · 457 ms | under 0.9 s worst case |

So the **uplink reply format, not the bus schedule, dominates telemetry age**: the bus contributes 217 ms of a 2.1 s figure and the reply format accounts for the remainder. The remedy is confined to the master's reply assembly — no change to the bus, the schedule, or the nodes.

### Liveness, and Why the Threshold Was Unusable

The console flags a node when no counter value has been displayed for θ idle poll periods. Under the as-built reply **no threshold works at all**: healthy nodes are routinely skipped for several poll rounds, so θ = 2 raises over three thousand false alarms per node-hour, and in 35 % of injected faults the node had already been falsely flagged before the fault occurred. Under the full-state reply a healthy node's update interval is bounded by one poll period plus one client period, so **θ = 1.5 poll periods is free of false alarms across nine node-hours** while still detecting a silent node in **260 ± 67 ms** on average and **435 ms** at worst.

### Status — What Is and Is Not Established

**Every figure above is a prediction of the model. None is a measurement.** The paper is explicit about this and specifies the three-test protocol by which the numbers are to be verified on the vehicle: timestamp-echo round-trip measurement with the wireless hop first isolated by wired loopback, logic-analyser capture of node sample times on the bus, and twenty injected silent faults per type weighed against the false-alarm count from a healthy run.

The qualitative conclusion — that a single-node reply sampled by a client slower than the bus cannot deliver every node's telemetry — does not depend on the model's assumed constants. The quantitative figures do, and the paper is equally explicit about which three constants those are.

### My Role

**Co-author** {% cite tanvir2025dual %}. The platform is a tracked EOD ROV from the [Jontro Soinik family]({{ '/projects/03_soinik_rov/' | relative_url }}), and the bus timing parameters are inherited from our earlier [ICCIT 2024 RS-485 measurement work]({{ '/publications/' | relative_url }}) on the same platform rather than re-measured for this build — which is why the broadcast period is also carried through as a sensitivity case.

---

### Tech Stack

`Embedded C` · `STM32F446RE / STM32G431GB` · `RS-485 multidrop` · `WIZnet W5500` · `TCP/IP` · `Discrete-event simulation` · `PyQt operator client` · `SBUS fallback control`
