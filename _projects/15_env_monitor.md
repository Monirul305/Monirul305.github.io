---
layout: page
title: Solar-Powered Remote Environmental Monitor (Arduino · GSM · ThingSpeak · Relay-Switched Battery Bank)
description: >
  Self-sustaining outdoor environmental node — Arduino UNO + GSM
  cellular uplink to ThingSpeak, powered by a solar-charged battery
  bank with a relay-switched series-on-discharge / parallel-on-charge
  topology to feed the GSM modem's high transient current.
  EEE 416 group project at BUET.
img: assets/img/projects/env_monitor.jpg
importance: 6
category: undergraduate
---

A self-sustaining environmental monitoring node designed for unattended outdoor deployment — built as a four-person group project for **EEE 416** at BUET, with teammates Fariza Siddiqua, A. F. M. Mahfuzul Kabir, and Shuvro Chowdhury.

The node continuously measures **air quality, temperature, and humidity**, and uploads the readings to a **ThingSpeak** cloud dashboard over the **GSM cellular network** — giving real-time visibility into a remote site without any local infrastructure beyond sunlight.

**Sensing and uplink.** An **Arduino UNO** drives the sensor reads, formats the payload, and pushes it to ThingSpeak through a GSM module. The cellular uplink is the part of the system that constrains the rest of the design: a GSM modem draws very high transient current during network registration — far exceeding what any single onboard battery can sustain.

**Power architecture — the interesting engineering bit.** The system carries **three batteries** managed by a relay-switched reconfiguration circuit:

- During **discharge mode** (sensing + uplink), two batteries are configured in **series** to provide the voltage and current the GSM modem demands, while the third powers the Arduino independently through a regulator so the MCU stays alive when the modem rail droops.
- During **charge mode**, the same three batteries are reconfigured into a **parallel** topology by the relays, where a solar panel + charging modules top all three up simultaneously without the series-string mismatch problem.
- A duty-cycle loop in the firmware alternates between modes (e.g. 5 minutes charging, 2 minutes discharging), guaranteeing the node never runs the GSM modem on a depleted bus.

This series-on-discharge / parallel-on-charge architecture is what makes the node deployable as a solar-only field unit, not just a benchtop demo.

### Tech Stack

`Arduino UNO` · `GSM cellular` · `ThingSpeak` · `Solar charging` · `Relay-switched battery bank` · `Voltage regulation` · `Air-quality / temp / humidity sensing`

[**Code on GitHub →**](https://github.com/Monirul305/Real-Time-Environmental-Monitoring-System)
