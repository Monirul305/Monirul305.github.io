---
layout: page
title: Indigenous EOD ROV Family — UN Peacekeeping Deployment (Mali, Congo)
description: >
  Jontro Soinik v1 and v2 — Bangladesh's 2nd and 3rd generation EOD ROVs.
  Army-tested, UN-deployed. Star → custom-bus communication evolution,
  S-curve arm motion, differential-drive synchronization, custom PCBs.
img: assets/img/projects/soinik_rov.jpg
importance: 3
category: professional
related_publications: true
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

<div class="row">
  <div class="col-sm-12">
    <div class="alert alert-warning" role="alert">
      <strong>UN Deployment</strong> — Jontro Soinik v1 is deployed under the
      <strong>UN Peacekeeping Mission in the Republic of Mali</strong>
      (gifted to Peruvian Armed Forces by Bangladesh Army, May 5, 2024).
      Jontro Soinik v2 is set for the <strong>Republic of Congo</strong> in 2025.
    </div>
  </div>
</div>

### Platform Overview

The Jontro Soinik family is Bangladesh's 2nd- and 3rd-generation indigenously-developed Explosive Ordnance Disposal ROVs. Both platforms carry a 6-DOF manipulator on a tracked chassis with a multi-camera sensor head; v2 adds IP55 weather protection, a disrupter, and a fully bus-based control architecture.

| | Jontro Soinik v1 | Jontro Soinik v2 |
|---|---|---|
| Generation | 2nd | 3rd |
| Arm DOF | 6 | 6 |
| Comms topology | **Star** (central node ↔ peripherals) | **Custom multi-drop bus** |
| IP Rating | — | **IP55** |
| Speed | 4 km/h | 5 km/h |
| Grip Force | 40 kg | 40 kg |
| Lift Capacity | 20 kg (retracted) | 20 kg (retracted) |
| Battery | 16 Ah, 48 V | 16 Ah, 48 V |
| Endurance | 3–5 hours | 3–5 hours |
| Cameras | IR, thermal, 4× PTZ | IR, thermal, 4× PTZ + claw IR |
| Range (LOS) | 1000 ft | 1000 ft |
| Disrupter | — | ✓ 24 V actuation circuit |

---

### Army Validation — v2

**Disrupter Test — Mirpur Range**
The Bangladesh Army validated the v2 disrupter mechanism — the first locally-built ROV with this capability — using a **350 m/s water projectile**. The disrupter is a standard tool of Explosive Ordnance Disposal teams worldwide, used to safely render unexploded ordnance inert in humanitarian and UN peacekeeping operations.

**IP55 Water Protection Test — Bangladesh Army IE&I**
High-pressure test: water sprayed from all directions at 30 m/s, 12.5 L/min for 3 minutes. v2 passed, confirming resilience in harsh field conditions.

---

### My Contributions

**Communication architecture — v1 star → v2 custom bus**
- **v1** ran a **star topology**: a central control node connected over discrete point-to-point links to every peripheral controller — the drive motors, the 7 arm motors (6 joints + claw), the PTZ camera node, and the rest of the on-vehicle subsystems. Each peripheral terminated on its own dedicated channel back to the centre.
- **v2** replaces the star with a **custom multi-drop bus** developed in-house: all peripherals share a single communication medium, dramatically reducing harness count, simplifying the chassis wiring, and making it cheap to add new nodes without re-routing back to the centre.

**Motion control**
- For v1, I developed an **S-curve-based arm motion profile** that produces jerk-limited, fluent motion across all six degrees of freedom — no perceptible jolt at start / stop, and smooth blending through intermediate via-points. This is what made teleoperated tasks like screw removal and door opening feasible from the operator console.
- In v2, that motion engine was **folded into the bus stack itself** — every peripheral receives time-aligned S-curve setpoints over the shared bus rather than each running its own profile against a position target.

**Differential-drive speed synchronization (v2)**
- Designed v2's **differential-drive synchronization layer**: the bus carries a shared timing reference that keeps the left and right drive motors locked to a common velocity command at every instant of the acceleration / cruise / deceleration profile. The pair never drift relative to each other during transients — the vehicle tracks a straight line under hard accel and stops square under hard brake.
- The underlying BLDC speed-control law (high-bandwidth current loop nested inside a velocity loop) is the subject of a first-author paper currently under review {% cite islam2025gapid %}.

**Other contributions across both platforms**
- **Inter-node RS485 communication** for motion commands and sensor feedback (v1 link layer; carried through into the v2 bus PHY) {% cite tanvir2024rs485 %}
- **Dual-network feedback communication** — fault-tolerant pathways for multi-node unmanned robotic control {% cite tanvir2025dual %}
- **Custom PCB design and in-house CNC milling** for the control and communication subsystems — schematic and layout in Altium Designer / KiCad, then milled on a small 3-axis CNC at the Cybernetics bench by hand. Every controller board on both v1 and v2 came off that machine; no external fab in the loop.
- **48 V power distribution** and energy management for extended field operations

{% include figure.liquid path="assets/img/projects/jontro-soinik-v1-firmware-dev.jpeg" class="project-hero-img rounded z-depth-1" alt="Firmware development bench for Jontro Soinik v1." %}

<p class="text-center"><em>v1 firmware-development bench — central-node controller talking to peripheral controllers over the star fan-out.</em></p>

---

### PCB Design & In-House CNC Milling

Every controller and communication board on both ROVs was designed and milled in-house. I drew the schematics and layouts in Altium Designer / KiCad, then ran the boards off on a small 3-axis CNC at the bench — drilling, isolation routing, and outline cut all done myself. Keeping the fab loop inside the room shortened a typical board-spin from days to hours and let the design iterate at the pace the firmware needed.

{% include figure.liquid path="assets/img/projects/jontro-soinik-pcb-cnc.jpeg" class="project-hero-img rounded z-depth-1" alt="Hand-milled PCBs for the Jontro Soinik ROV control electronics." %}

<p class="text-center"><em>Hand-milled control PCBs straight off the 3-axis CNC.</em></p>

<div class="row justify-content-center mt-3">
  <div class="col-sm-8">
    <video class="hover-autoplay-video img-fluid rounded z-depth-1" controls muted loop preload="metadata" playsinline style="width: 100%;">
      <source src="{{ '/assets/video/jontro-soinik-pcb-cnc.mp4' | relative_url }}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
    <p class="text-center mt-2"><em>3-axis CNC isolation-routing a controller board for the ROV. <small class="text-muted">(hover to play)</small></em></p>
  </div>
</div>

---

### Key Specifications

**Arm range of motion:**
Turret 200° · Shoulder 100° · Elbow 150° · Wrist 270° · Claw 360° continuous

**Reach envelope:**
Vertical 150 cm · Horizontal 100 cm · Beneath 25 cm · Gripper opening 18 cm

**Electrical subsystems:**
GPS locator · Wireless HCU · Laser range finder (10 cm – 40 m) · 2+ proximity sensors ·
Thermal camera · Self-diagnostics · Active/passive overload protection · RF extender to 152 m ·
Initiator circuit: 4× 24 V shock-tube sets · Deployment time ≤ 5 min

---

### Field Operation & Test Videos

<p class="text-center text-muted"><small>Hover over any video to start playback (muted). Move the cursor away to pause.</small></p>

<div class="row mt-3">
  <div class="col-sm-6">
    <div class="embed-responsive embed-responsive-16by9 hover-autoplay-yt" data-yt-id="Mi29-6XXE8M">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/Mi29-6XXE8M?mute=1&enablejsapi=1"
        allow="autoplay; encrypted-media"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-1"><em>Door-opening operation — Jontro Soinik v2</em></p>
  </div>
  <div class="col-sm-6">
    <div class="embed-responsive embed-responsive-16by9 hover-autoplay-yt" data-yt-id="K-sZqb6KH98">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/K-sZqb6KH98?mute=1&enablejsapi=1"
        allow="autoplay; encrypted-media"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-1"><em>Screw-removal operation — Jontro Soinik v2</em></p>
  </div>
</div>

<div class="row mt-3">
  <div class="col-sm-6">
    <div class="embed-responsive embed-responsive-16by9 hover-autoplay-yt" data-yt-id="symk5vmXX-Q">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/symk5vmXX-Q?mute=1&enablejsapi=1"
        allow="autoplay; encrypted-media"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-1"><em>IP55 water-protection test (Bangladesh Army IE&amp;I)</em></p>
  </div>
  <div class="col-sm-6">
    <div class="embed-responsive embed-responsive-16by9 hover-autoplay-yt" data-yt-id="Mipwd6lcz5s">
      <iframe class="embed-responsive-item"
        src="https://www.youtube.com/embed/Mipwd6lcz5s?mute=1&enablejsapi=1"
        allow="autoplay; encrypted-media"
        allowfullscreen></iframe>
    </div>
    <p class="text-center mt-1"><em>Jontro Soinik v2 — Cybernetics promo</em></p>
  </div>
</div>

<script>
(function () {
  // YouTube iframes: swap src on hover-enter to add autoplay; revert on hover-leave.
  // mouseenter/mouseleave on the WRAPPER do not fire when crossing into the iframe child,
  // so they reliably bound the hover region around each embed.
  document.querySelectorAll('.hover-autoplay-yt').forEach(function (wrap) {
    var id = wrap.dataset.ytId;
    var iframe = wrap.querySelector('iframe');
    if (!id || !iframe) return;
    var baseSrc    = 'https://www.youtube.com/embed/' + id + '?mute=1&enablejsapi=1';
    var playSrc    = 'https://www.youtube.com/embed/' + id + '?autoplay=1&mute=1&enablejsapi=1';
    wrap.addEventListener('mouseenter', function () { iframe.src = playSrc; });
    wrap.addEventListener('mouseleave', function () { iframe.src = baseSrc; });
  });

  // HTML5 <video>: play on hover, pause + rewind on leave.
  document.querySelectorAll('.hover-autoplay-video').forEach(function (v) {
    v.addEventListener('mouseenter', function () {
      var p = v.play();
      if (p && typeof p.catch === 'function') { p.catch(function () {}); }
    });
    v.addEventListener('mouseleave', function () { v.pause(); v.currentTime = 0; });
  });
})();
</script>

---

### Tech Stack

`STM32` · `Embedded C` · `RS-485` · `Custom multi-drop bus` · `S-curve motion profiling` · `BLDC motor control` · `Differential-drive sync` · `Altium Designer` · `KiCad` · `48 V power system` · `Thermal imaging` · `IR night vision`
