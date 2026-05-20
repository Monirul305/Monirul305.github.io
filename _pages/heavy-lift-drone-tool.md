---
layout: page
permalink: /projects/06_heavy_lift_drone/tool/
title: Drone Battery Optimizer — Heavy-Lift Multirotor Sizing
description: Interactive in-browser battery-pack and motor sizing for a heavy-lift multirotor. Pick a preset, tweak the inputs, and the optimizer reports feasible configurations live.
nav: false
chart:
  chartjs: true
---

<link rel="stylesheet" href="{{ '/assets/css/heavy-lift-drone-tool.css' | relative_url }}">

<div class="hldt-root" id="hldt-error-banner"></div>

<p class="text-muted">
  Interactive battery-pack and motor sizing for a ~30 kg payload heavy-lift
  multirotor. Pick a preset, tweak parameters, and the Pareto curve updates
  live. All math runs in your browser — nothing is sent to a server.
</p>

<div class="hldt-root">

  <div class="hldt-card">
    <div class="hldt-section-title">Presets</div>
    <div id="hldt-presets" class="hldt-presets"></div>
    <small class="text-muted">Each preset reloads every field below.</small>
  </div>

  <div class="hldt-card">
    <div class="hldt-section-title">Motor</div>
    <div class="row g-2 align-items-end">
      <div class="col-md-8">
        <label class="form-label" for="hldt-motor-select">Performance dataset</label>
        <select id="hldt-motor-select" class="form-select"></select>
      </div>
      <div class="col-md-4">
        <button id="hldt-upload-btn" type="button" class="btn btn-outline-primary w-100">Upload CSV…</button>
        <input id="hldt-upload-input" type="file" accept=".csv,text/csv">
      </div>
    </div>
    <div id="hldt-motor-info"></div>
    <details class="mt-2">
      <summary class="text-muted" style="cursor: pointer">CSV upload format (click to expand)</summary>
<pre class="small mt-2 mb-0" style="background: var(--global-code-bg-color, #f6f8fa); padding: 0.75rem; border-radius: 0.25rem;">Throttle,Thrust,Current
%,g,A
40,520,1.8
50,910,3.4
60,1640,6.9
...

• Header row required. Synonyms accepted ("Throttle (%)", "Thrust (g)", "Current (A)").
• Optional units row right under the header (g/kg/N for thrust, A/mA for current).
• Optional columns: Voltage, Power, RPM — used for display only.
• Minimum 3 data rows; thrust must be non-decreasing with throttle.</pre>
    </details>
  </div>

  <form id="hldt-form" onsubmit="return false;">

    <div class="hldt-card">
      <div class="hldt-section-title">Mission profile</div>
      <div class="hldt-grid">
        <div class="hldt-field"><label for="hldt-flight_time_min">Mission duration (min)</label><input class="form-control" id="hldt-flight_time_min" type="number" step="0.5"><small class="form-text text-muted">Required airborne time. e.g., <code>20</code>.</small></div>
        <div class="hldt-field"><label for="hldt-altitude_m">Cruise altitude (m)</label><input class="form-control" id="hldt-altitude_m" type="number" step="10"><small class="form-text text-muted">Above takeoff. e.g., <code>100</code>.</small></div>
        <div class="hldt-field"><label for="hldt-ascend_velocity">Ascend velocity (m/s)</label><input class="form-control" id="hldt-ascend_velocity" type="number" step="0.5"><small class="form-text text-muted">Climb rate. e.g., <code>5</code>.</small></div>
        <div class="hldt-field"><label for="hldt-descend_velocity">Descend velocity (m/s)</label><input class="form-control" id="hldt-descend_velocity" type="number" step="0.5"><small class="form-text text-muted">Descent rate. e.g., <code>5</code>.</small></div>
        <div class="hldt-field"><label for="hldt-banking_angle">Banking angle (°)</label><input class="form-control" id="hldt-banking_angle" type="number" step="1"><small class="form-text text-muted">Forward tilt in cruise. e.g., <code>20</code>.</small></div>
        <div class="hldt-field"><label for="hldt-frontal_area">Frontal area (m²)</label><input class="form-control" id="hldt-frontal_area" type="number" step="0.05"><small class="form-text text-muted">Projected area for drag. e.g., <code>0.6</code>.</small></div>
        <div class="hldt-field"><label for="hldt-drag_coefficient">Drag coefficient</label><input class="form-control" id="hldt-drag_coefficient" type="number" step="0.05"><small class="form-text text-muted">Airframe Cd. e.g., <code>1.0–1.2</code>.</small></div>
        <div class="hldt-field"><label for="hldt-air_density_sea">Air density, sea (kg/m³)</label><input class="form-control" id="hldt-air_density_sea" type="number" step="0.01"><small class="form-text text-muted">ISA sea level: <code>1.225</code>.</small></div>
        <div class="hldt-field"><label for="hldt-air_density_alt">Air density, alt (kg/m³)</label><input class="form-control" id="hldt-air_density_alt" type="number" step="0.01"><small class="form-text text-muted">At 1000 m ≈ <code>1.11</code>.</small></div>
      </div>
    </div>

    <div class="hldt-card">
      <div class="hldt-section-title">Airframe</div>
      <div class="hldt-grid">
        <div class="hldt-field"><label for="hldt-motor_number">Motor count</label><input class="form-control" id="hldt-motor_number" type="number" step="1"><small class="form-text text-muted">e.g., <code>4</code> quad, <code>6</code> hexa, <code>8</code> octo.</small></div>
        <div class="hldt-field"><label for="hldt-motor_weight_per">Motor weight, each (kg)</label><input class="form-control" id="hldt-motor_weight_per" type="number" step="0.01"><small class="form-text text-muted">e.g., <code>0.085</code> hobby, <code>1.2</code> heavy-lift.</small></div>
        <div class="hldt-field"><label for="hldt-esc_weight">ESC weight, each (kg)</label><input class="form-control" id="hldt-esc_weight" type="number" step="0.01"><small class="form-text text-muted">e.g., <code>0.05</code> hobby, <code>0.3</code> heavy-lift.</small></div>
        <div class="hldt-field"><label for="hldt-prop_weight">Propeller weight, each (kg)</label><input class="form-control" id="hldt-prop_weight" type="number" step="0.01"><small class="form-text text-muted">e.g., <code>0.02</code> small, <code>0.3</code> large carbon.</small></div>
        <div class="hldt-field"><label for="hldt-frame_weight">Frame (kg)</label><input class="form-control" id="hldt-frame_weight" type="number" step="0.1"><small class="form-text text-muted">Structure mass. e.g., <code>0.6</code> quad, <code>10</code> heavy-lift.</small></div>
        <div class="hldt-field"><label for="hldt-electronics_weight">Electronics (kg)</label><input class="form-control" id="hldt-electronics_weight" type="number" step="0.05"><small class="form-text text-muted">FC + GPS + telemetry, lumped. e.g., <code>0.3–1.5</code>.</small></div>
        <div class="hldt-field"><label for="hldt-cable_weight">Cabling (kg)</label><input class="form-control" id="hldt-cable_weight" type="number" step="0.05"><small class="form-text text-muted">Harness + connectors. e.g., <code>0.1–1.2</code>.</small></div>
        <div class="hldt-field"><label for="hldt-electronics_current">Electronics current (A)</label><input class="form-control" id="hldt-electronics_current" type="number" step="0.1"><small class="form-text text-muted">Non-propulsion draw. e.g., <code>1–3</code>.</small></div>
      </div>
    </div>

    <div class="hldt-card">
      <div class="hldt-section-title">Battery cell</div>
      <div class="hldt-grid">
        <div class="hldt-field"><label for="hldt-cell_capacity_ahr">Cell capacity (Ah)</label><input class="form-control" id="hldt-cell_capacity_ahr" type="number" step="0.5"><small class="form-text text-muted">Per cell. e.g., <code>4.75</code> hobby, <code>16</code> heavy-lift.</small></div>
        <div class="hldt-field"><label for="hldt-cell_discharge_rate">Continuous discharge (A)</label><input class="form-control" id="hldt-cell_discharge_rate" type="number" step="5"><small class="form-text text-muted">Per cell, sustained. e.g., <code>15</code> / <code>160</code>.</small></div>
        <div class="hldt-field"><label for="hldt-cell_weight">Cell weight (kg)</label><input class="form-control" id="hldt-cell_weight" type="number" step="0.005"><small class="form-text text-muted">Per cell. e.g., <code>0.075</code> / <code>0.24</code>.</small></div>
        <div class="hldt-field"><label for="hldt-usable_capacity_fraction">Usable capacity fraction</label><input class="form-control" id="hldt-usable_capacity_fraction" type="number" step="0.05" min="0.1" max="1"><small class="form-text text-muted">Drainable fraction. e.g., <code>0.8</code>.</small></div>
        <div class="hldt-field"><label for="hldt-series_cells_min">Series cells — min</label><input class="form-control" id="hldt-series_cells_min" type="number" step="1"><small class="form-text text-muted">Lowest S to try. e.g., <code>3</code>.</small></div>
        <div class="hldt-field"><label for="hldt-series_cells_max">Series cells — max</label><input class="form-control" id="hldt-series_cells_max" type="number" step="1"><small class="form-text text-muted">Highest S to try. e.g., <code>24</code>.</small></div>
        <div class="hldt-field"><label for="hldt-parallel_cells_min">Parallel cells — min</label><input class="form-control" id="hldt-parallel_cells_min" type="number" step="1"><small class="form-text text-muted">Lowest P to try. e.g., <code>1</code>.</small></div>
        <div class="hldt-field"><label for="hldt-parallel_cells_max">Parallel cells — max</label><input class="form-control" id="hldt-parallel_cells_max" type="number" step="1"><small class="form-text text-muted">Highest P to try. e.g., <code>20</code>.</small></div>
      </div>
    </div>

    <div class="hldt-card">
      <div class="hldt-section-title">Constraints &amp; sweep</div>
      <div class="hldt-grid">
        <div class="hldt-field"><label for="hldt-throttle_max_value">Throttle max (%)</label><input class="form-control" id="hldt-throttle_max_value" type="number" step="1"><small class="form-text text-muted">Per-motor cap. e.g., <code>80</code>.</small></div>
        <div class="hldt-field"><label for="hldt-thrust_safety_margin">Thrust safety margin</label><input class="form-control" id="hldt-thrust_safety_margin" type="number" step="0.05"><small class="form-text text-muted">Thrust multiplier. e.g., <code>1.2</code> calm, <code>1.4</code> cargo.</small></div>
        <div class="hldt-field"><label for="hldt-min_payload">Payload sweep — min (kg)</label><input class="form-control" id="hldt-min_payload" type="number" step="0.1"><small class="form-text text-muted">Lightest to try. e.g., <code>5</code>.</small></div>
        <div class="hldt-field"><label for="hldt-max_payload">Payload sweep — max (kg)</label><input class="form-control" id="hldt-max_payload" type="number" step="0.5"><small class="form-text text-muted">Heaviest to try. e.g., <code>50</code>.</small></div>
        <div class="hldt-field"><label for="hldt-payload_step_pct">Payload step (%)</label><input class="form-control" id="hldt-payload_step_pct" type="number" step="1"><small class="form-text text-muted">Geometric step. e.g., <code>10</code>.</small></div>
      </div>
    </div>

  </form>

  <div class="hldt-action-bar">
    <button id="hldt-reset-btn" type="button" class="btn btn-outline-secondary btn-sm">Reset to default preset</button>
    <button id="hldt-share-btn" type="button" class="btn btn-outline-secondary btn-sm">Copy shareable link</button>
    <button id="hldt-csv-btn" type="button" class="btn btn-outline-secondary btn-sm">Download CSV</button>
  </div>

  <div class="hldt-card">
    <div class="hldt-section-title">Pareto curve</div>
    <div class="hldt-chart-wrap">
      <canvas id="hldt-chart"></canvas>
    </div>
    <div class="mt-3 small">
      <p class="mb-1">
        Lightest feasible battery per payload. Infeasible configs (motor saturated, throttle
        over cap, capacity short, discharge short) are excluded.
      </p>
      <p class="mb-1">
        <strong>MTOW</strong> (purple) and <strong>battery weight</strong> (grey dashed) on
        the left axis; <strong>cruise margin</strong> (cyan) on the right.
      </p>
      <p class="text-muted mb-0">
        Saw-tooth in cruise margin is expected: margin jumps when parallel count steps up,
        then erodes as payload climbs. Flat segments on battery weight are pack “sweet
        spots.”
      </p>
    </div>
  </div>

  <div class="hldt-card">
    <div class="hldt-section-title">Feasible configurations</div>
    <div class="table-responsive">
      <table id="hldt-results-table" class="table table-sm table-striped align-middle">
        <thead>
          <tr>
            <th>Payload (kg)</th>
            <th>Pack</th>
            <th>MTOW (kg)</th>
            <th>Battery (kg)</th>
            <th>Throttle hover (%)</th>
            <th>Throttle fwd (%)</th>
            <th>Peak current (A)</th>
            <th>Cruise margin (min)</th>
            <th>Fwd vel. (m/s)</th>
          </tr>
        </thead>
        <tbody id="hldt-results-body"></tbody>
      </table>
    </div>
    <div id="hldt-infeasible-summary"></div>
  </div>

</div>

<script>
  window.HLDT_CONFIG = {
    motorsBase: '{{ "/assets/data/heavy-lift-drone-motors/" | relative_url }}',
    presetsPath: '{{ "/assets/data/heavy-lift-drone-presets.json" | relative_url }}'
  };
</script>
<script defer src="{{ '/assets/js/heavy-lift-drone-tool.js' | relative_url }}"></script>
