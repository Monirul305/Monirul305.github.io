---
layout: page
title: Optical Mark Recognition (OMR) Machine — Built Entirely from Discrete Digital Logic
description: >
  Built an OMR (Optical Mark Recognition) machine for multiple-choice
  answer sheets using only discrete digital logic ICs — no
  microcontroller. Optical sensing, counters, and decoders implement
  the full mark-detection and tally pipeline. BUET EEE coursework.
img: assets/img/projects/omr_machine.jpg
importance: 7
category: lab finals
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

An **Optical Mark Recognition (OMR)** machine — the kind that reads pencil-filled answer sheets for multiple-choice exams — built **entirely from discrete digital logic ICs**, with no microcontroller in the loop. BUET EEE coursework, deliberately constrained to gate-level design.

**The constraint that made this interesting.** Building an OMR reader with a microcontroller is a routine project — read each photodiode, count the dark marks in software, done. The point of this build was to do the same task **without programmable silicon** — using only logic gates, counters, shift registers, comparators, and decoders.

**Mark sensing.** A row of photo-sensors mounted across the sheet detects shaded vs. unshaded marks as the paper is fed past, each sensor producing a clean digital "marked / unmarked" signal after threshold comparison. The sheet's motion through the read head provides the natural time-multiplexing across question rows.

**Digital pipeline.**

- **Synchronisation** — a clock signal derived from the paper-feed sprocket / motor encoder aligns mark reads with the row positions on the sheet.
- **Per-column registers** capture the mark pattern for each question row as it passes the sensor head.
- **Encoders** translate the multi-hot column pattern (which option was filled) into a compact answer code per question.
- **Counters** tally correct vs. incorrect against a stored answer key.
- **Display logic** drives a 7-segment readout with the final score.

The entire data path is purely combinational + sequential logic on the board, with no firmware to debug — what you see on the schematic is what's running on the hardware.

### Demo Video

<div class="row justify-content-center mt-3">
  <div class="col-sm-8">
    <div class="embed-responsive embed-responsive-16by9">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/VxnxKPR5TMw"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-2">
      <em>The machine reading a filled answer sheet and displaying the tallied score — pure discrete-logic data path.</em>
    </p>
  </div>
</div>

### Tech Stack

`Discrete digital logic` · `Photo-sensing` · `Counters / shift registers` · `Encoders / decoders` · `Combinational + sequential design` · `7-segment display`

[**Code on GitHub →**](https://github.com/Monirul305/Implementation-of-OMR-machine-using-digital-logic-circuit)
