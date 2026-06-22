---
layout: page
title: RV32I Multicycle Processor with Wishbone Memory Controller (Verilog · FPGA · TSMC 180 nm)
description: >
  From-scratch RV32I multicycle processor in Verilog with a custom
  Wishbone-interfaced memory controller, full testbench-based
  verification, FPGA validation, and a TSMC 180 nm physical-design
  flow in Cadence. Supervised by Dr. A. B. M. Harun-Ur-Rashid (BUET EEE).
img: assets/img/projects/riscv.jpg
importance: 1
category: lab finals
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

A from-scratch implementation of an **RV32I multicycle processor** in Verilog, paired with a custom **Wishbone-interface memory controller** — built as a digital-design capstone at BUET EEE under the supervision of **Dr. A. B. M. Harun-Ur-Rashid** (Professor, EEE).

**Datapath and control.** The processor implements the **RV32I integer instruction subset** with a classic multicycle datapath — separate fetch, decode, execute, memory, and write-back stages sharing a single ALU and memory port across cycles. The control unit is a finite-state machine, decoding each instruction and stepping it through the correct number of cycles for its type (R / I / S / B / U / J).

**Memory interface.** A **Wishbone-compatible memory controller** abstracts the processor's load / store ports from the underlying memory technology, exposing a standard handshake protocol (`CYC`, `STB`, `ACK`, `ADR`, `DAT_I/O`). This makes the processor portable across memory backends — a behavioural SRAM model for simulation, block RAM on the FPGA, or a foundry-process memory in the physical-design flow.

**Verification.** A **testbench suite** was developed in parallel with the RTL — directed instruction-level tests for each opcode class, plus longer integration tests running short RV32I programs. Coverage was tracked at the opcode and control-state level to confirm every datapath path was exercised.

**Implementation flow.** The verified RTL was synthesised to an **FPGA** for hardware-level validation, then run through a **TSMC 180 nm physical-design flow** in Cadence — the same process node I had hands-on exposure to during my **Ulkasemi internship**. The flow covered logical synthesis, placement, routing, and basic timing closure against a representative target frequency.

This project is what grounds my interest in robotics now — building the substrate that real-time control loops actually run on, not just the software layer.

### Tech Stack

`Verilog` · `RV32I` · `Multicycle datapath` · `Wishbone bus` · `Cadence` · `FPGA` · `TSMC 180 nm` · `Testbench verification`

[**Code on GitHub →**](https://github.com/Monirul305/Design-and-Verification-of-a-RISC--V-Multicycle-Processor-and-a-Memory-Controller-with-Wishbone-Inte)
