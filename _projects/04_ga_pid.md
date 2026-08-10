---
layout: page
title: GA-Tuned Multi-Rate Cross-Coupled BLDC Synchronization on a Dual-MCU Architecture (First-Author Paper)
description: >
  Speed-synchronization controller for a 120 kg tracked skid-steer vehicle
  driven by two mismatched BLDC motors. One microcontroller per motor, a
  1 kHz cross-coupled difference loop, and every gain tuned by a genetic
  algorithm on the assembled vehicle. First-author manuscript submitted.
importance: 1
category: research
related_publications: true
---

### Motivation

Differential-drive and skid-steer ground vehicles steer by the relative speed of their left and right drives, so any uncommanded difference between the two track speeds degrades path-holding and integrates over distance into heading drift. Two things drive that difference continuously. **Electrically**, low-cost BLDC motors — like the auto-rickshaw motors used here — vary unit-to-unit in winding resistance and back-EMF constant; the two deployed units differ by ≈10 % in line-to-line resistance and ≈2 % in back-EMF constant, a persistent structured bias over the whole run. **Mechanically**, and on a 120 kg tracked platform usually more strongly, the two sides differ in belt tension, running-gear friction and wear, and one track can meet terrain resistance or a one-sided load the other does not.

Neither disturbance is visible to a single drive's own speed loop — both bias one track *relative* to the other — so tuning each loop more tightly cannot remove them. Rejecting them in real time is the job of an inter-drive synchronization controller.

### Approach

I designed a **distributed, multi-rate bilateral cross-coupled speed-synchronization controller**:

- Each motor is regulated by its **own STM32G431KB** running a local **PID with per-motor feedforward** (velocity feedforward seeded from that drive's own inverse DC gain, plus an acceleration term).
- A **bilateral cross-coupled term** on the inter-motor speed difference is evaluated identically on both nodes from a dedicated **1 ms DMA UART speed exchange** (2 Mbaud, ≈75 µs measured transport latency), and each node applies **half of the correction with opposite sign** — so neither motor is a fixed master.
- The loops are **multi-rate**: the per-motor loops run at **200 Hz**, the synchronization loop and the duty command at **1 kHz**, matched to the encoder sample rate.
- Speed feedback is a **second-order tracking observer** on a 12-bit capacitive absolute encoder, with a per-drive **integral-non-linearity calibration** that cuts estimate noise from 3.24 to 2.49 rpm at an ≈80 Hz observer bandwidth.
- A separate **master node** (STM32F446RE) broadcasts only the speed command over a custom **RS-485** bus, keeping the shared bus out of the synchronization path.

**Tuning is done online, on the assembled vehicle**, by a genetic algorithm over a twelve-gene chromosome (both per-motor PIDs, the synchronization PI–D, its integrator preload, and the two feedforward gains). This is a requirement rather than a convenience: the dominant inter-drive differences are mechanical and drift with wear and terrain, so a model-tuned coupling gain would be mistuned on the real coupled plant. Stage 1 tunes the per-motor loops with the vehicle raised off-ground; Stage 2 re-optimizes the full chromosome jointly — first on the floating vehicle, then in the field where the terrain differential the loop exists to reject is actually present.

### Validation

Gains are frozen and evaluated on an **out-of-training** test set: different speed steps from the ones the tuner scored (0 → 2800 → 800 → 2200 → 1200 rpm), plus an ≈80 kg one-sided load that was never part of tuning. Everything is reported as mean ± SD over **three independent GA seeds**, each a full commissioning plus its own evaluation battery.

Against an independent-drive baseline — itself tuned to convergence by the same GA harness, so the only architectural difference is the coupling layer:

| Metric (out-of-training) | Sync OFF | Ours | Improvement |
|---|---|---|---|
| Clean-tracking RMSE | 10.67 ± 1.24 rpm | **6.26 ± 1.03 rpm** | **41 %** (3.9σ) |
| Clean-tracking peak | 83.6 ± 15.5 rpm | **51.5 ± 17.6 rpm** | 38 % |
| ≈80 kg one-sided load | 24.9 ± 15.8 rpm | **8.7 ± 2.8 rpm** | 65 % |
| Heading drift | 1.23 ± 1.14° | **0.84 ± 0.55°** | 32 % |

The clean-tracking RMSE reduction clears twice the pooled run-to-run SD; the remaining rows are consistent trends at three seeds rather than statistically separated results, and the paper reports them that way.

**The same-plant controller comparison is the point of the paper.** Four arms were run on the identical plant, operating points and disturbances, each tuned to convergence by the same GA: independent PID, conventional single-rate cross-coupling (Koren), a single-rate linear ADRC on the difference channel, and the proposed multi-rate controller. The multi-rate loop is the only arm that clearly beats no synchronization on clean tracking (6.26 rpm vs 10.67; single-rate cross-coupling reaches 11.44 rpm and single-rate ADRC 9.54 rpm), and it has the lowest mean on every metric.

A difference-channel loop-transfer analysis explains why. At the deployed gains the 1 kHz loop crosses over at ≈39 Hz with ≈86° phase margin; running the *same* gains at 200 Hz costs ≈28° from the extra hold delay and ≈24° from the rate-scaled derivative filter, leaving ≈34°. Restoring the margin forces the coupling gain down to ≈0.65×, which drops the crossover to ≈21 Hz. That is the concrete cost of a single-rate loop — and the useful rate is bounded above by the ≈80 Hz speed-estimate bandwidth, so the low-latency observer is what makes the fast loop usable at all.

### Status

**First-author manuscript submitted** {% cite islam2025gapid %} — conceptualization, methodology, firmware, experiments, and original draft. The work sits in the Cybernetics R&D programme and the synchronization layer runs on the company's tracked EOD platform; the paper itself reports the controller on the 120 kg assembled test vehicle.

---

### Tech Stack

`STM32 (HAL)` · `Embedded C` · `Multi-rate control` · `Cross-coupled synchronization` · `Genetic Algorithm tuning (on-vehicle)` · `Tracking observer / encoder INL calibration` · `BLDC motors` · `Dual-MCU DMA UART link` · `RS-485 master bus` · `Python (analysis & loop-transfer)`
