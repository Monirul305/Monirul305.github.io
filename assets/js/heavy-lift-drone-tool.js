/* Heavy-Lift Drone Sizing Calculator
 * Pure JS port of the original Python optimizer.
 * Path-agnostic: works under file://, GitHub Pages, or Jekyll.
 *
 * Configure data paths via window.HLDT_CONFIG before this script runs:
 *   window.HLDT_CONFIG = {
 *     motorsBase: '../assets/data/heavy-lift-drone-motors/',
 *     presetsPath: '../assets/data/heavy-lift-drone-presets.json'
 *   };
 */
(function () {
  'use strict';

  const CFG = Object.assign(
    {
      motorsBase: 'assets/data/heavy-lift-drone-motors/',
      presetsPath: 'assets/data/heavy-lift-drone-presets.json',
      localStorageKey: 'hldt_uploaded_motors_v1',
      urlHashPrefix: 'hldt='
    },
    window.HLDT_CONFIG || {}
  );

  const G = 9.80665;

  // ──────────────────────────────────────────────────────────────
  // State
  // ──────────────────────────────────────────────────────────────
  const STATE = {
    motorManifest: null,
    motors: {}, // id -> motor object
    presets: null,
    activeMotorId: null,
    activeMotor: null,
    params: null,
    results: null,
    chart: null
  };

  // ──────────────────────────────────────────────────────────────
  // Math: interpolation
  // ──────────────────────────────────────────────────────────────
  function linearInterp(xs, ys, x) {
    // xs assumed sorted ascending. Returns null if outside [xs[0], xs[end]].
    const n = xs.length;
    if (x < xs[0] || x > xs[n - 1]) return null;
    for (let i = 1; i < n; i++) {
      if (x <= xs[i]) {
        const t = (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
        return ys[i - 1] + t * (ys[i] - ys[i - 1]);
      }
    }
    return ys[n - 1];
  }

  // ──────────────────────────────────────────────────────────────
  // Motor model
  // ──────────────────────────────────────────────────────────────
  function buildMotorModel(motorJson) {
    const rows = [...motorJson.data].sort((a, b) => a.throttle - b.throttle);
    const throttleArr = rows.map((r) => r.throttle);
    const thrustArr = rows.map((r) => r.thrust_g);
    const currentArr = rows.map((r) => r.current);
    const powerArr = rows.map((r) => r.power || null);

    // Sort by thrust for thrust->throttle/current lookups
    const byThrust = rows
      .map((r, i) => ({ t: r.thrust_g, throttle: r.throttle, current: r.current, power: r.power }))
      .sort((a, b) => a.t - b.t);
    const tArr = byThrust.map((r) => r.t);
    const tToThrottle = byThrust.map((r) => r.throttle);
    const tToCurrent = byThrust.map((r) => r.current);
    const tToPower = byThrust.map((r) => r.power);

    // Validate monotonic thrust-vs-throttle
    let monotonic = true;
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].thrust_g < rows[i - 1].thrust_g) {
        monotonic = false;
        break;
      }
    }

    return {
      meta: motorJson,
      maxThrustG: tArr[tArr.length - 1],
      minThrustG: tArr[0],
      maxThrottle: throttleArr[throttleArr.length - 1],
      monotonic,
      throttleAt(thrust_g) {
        return linearInterp(tArr, tToThrottle, thrust_g);
      },
      currentAt(thrust_g) {
        return linearInterp(tArr, tToCurrent, thrust_g);
      },
      powerAt(thrust_g) {
        if (tToPower.some((p) => p == null)) return null;
        return linearInterp(tArr, tToPower, thrust_g);
      }
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Optimizer
  // ──────────────────────────────────────────────────────────────
  function evaluateConfig(s, p, payload, params, motor) {
    const cellWeight = params.cell_weight;
    const cellCap = params.cell_capacity_ahr;
    const cellDischarge = params.cell_discharge_rate;
    const N = params.motor_number;
    const margin = params.thrust_safety_margin;
    const throttleMax = params.throttle_max_value;

    // Voltage compatibility: only evaluate S values the motor was characterised at.
    const sMinMotor = motor.meta.pack_series_min;
    const sMaxMotor = motor.meta.pack_series_max;
    if ((sMinMotor != null && s < sMinMotor) || (sMaxMotor != null && s > sMaxMotor)) {
      return {
        feasible: false,
        status: 'voltage_incompatible',
        s,
        p,
        payload,
        mtow: 0,
        batteryWeight: s * p * cellWeight,
        detail: `Motor data only valid for ${sMinMotor}S${sMinMotor === sMaxMotor ? '' : '–' + sMaxMotor + 'S'}`
      };
    }

    const batteryWeight = s * p * cellWeight;
    const fixedWeight =
      params.frame_weight +
      params.electronics_weight +
      params.cable_weight +
      N * (params.motor_weight_per + params.esc_weight + params.prop_weight);
    const mtow = fixedWeight + batteryWeight + payload;

    // Drag in kg-equivalent (force / g)
    const rhoSea = params.air_density_sea;
    const rhoAlt = params.air_density_alt;
    const Cd = params.drag_coefficient;
    const A = params.frontal_area;
    const vA = params.ascend_velocity;
    const vD = params.descend_velocity;
    const bankRad = (params.banking_angle * Math.PI) / 180;

    // Phase thrust (total drone thrust required, in kg-force)
    const dragAscendKg = (0.5 * rhoSea * vA * vA * Cd * A * (rhoSea / rhoAlt)) / G;
    const dragDescendKg = (0.5 * rhoAlt * vD * vD * Cd * A) / G;

    const thrustHover = mtow;
    const thrustAscend = mtow + dragAscendKg;
    const thrustDescend = Math.max(mtow * 0.6, mtow - dragDescendKg); // clamp at 60% hover
    const thrustForward = mtow / Math.cos(bankRad);

    // Per-motor thrust required (in grams, since motor table is in g-force)
    const perMotorGrams = (totalKg) => (totalKg * margin * 1000) / N;
    const tg = {
      hover: perMotorGrams(thrustHover),
      ascend: perMotorGrams(thrustAscend),
      descend: perMotorGrams(thrustDescend),
      forward: perMotorGrams(thrustForward)
    };

    const maxRequired = Math.max(tg.hover, tg.ascend, tg.forward, tg.descend);

    // Saturation check
    if (maxRequired > motor.maxThrustG) {
      return { feasible: false, status: 'motor_saturated', s, p, payload, mtow, batteryWeight };
    }

    // Lookup throttle and current per phase
    const phases = {};
    for (const phase of ['hover', 'ascend', 'descend', 'forward']) {
      const thr = motor.throttleAt(tg[phase]);
      const cur = motor.currentAt(tg[phase]);
      if (thr == null || cur == null) {
        return {
          feasible: false,
          status: 'extrapolation',
          s,
          p,
          payload,
          mtow,
          batteryWeight,
          detail: `Phase ${phase} thrust ${tg[phase].toFixed(0)}g outside motor data range`
        };
      }
      phases[phase] = { thrust_g: tg[phase], throttle: thr, current_per_motor: cur };
    }

    const maxThrottle = Math.max(
      phases.hover.throttle,
      phases.ascend.throttle,
      phases.descend.throttle,
      phases.forward.throttle
    );
    if (maxThrottle > throttleMax) {
      return {
        feasible: false,
        status: 'throttle_limited',
        s,
        p,
        payload,
        mtow,
        batteryWeight,
        maxThrottle
      };
    }

    // Phase currents (total = N * per_motor + electronics)
    const I = {};
    for (const phase of ['hover', 'ascend', 'descend', 'forward']) {
      I[phase] = N * phases[phase].current_per_motor + params.electronics_current;
    }

    // Mission times (hours)
    const tAscend = params.altitude_m / vA / 3600;
    const tDescend = params.altitude_m / vD / 3600;
    const tTotal = params.flight_time_min / 60;
    const tForward = tTotal - tAscend - tDescend;
    if (tForward <= 0) {
      return {
        feasible: false,
        status: 'mission_time_short',
        s,
        p,
        payload,
        mtow,
        batteryWeight,
        detail: 'Flight time shorter than ascend+descend'
      };
    }

    // Energy (Ah)
    const ahRequired = I.ascend * tAscend + I.forward * tForward + I.descend * tDescend;
    const ahAvailable = p * cellCap;
    const ahWithReserve = ahRequired / params.usable_capacity_fraction;

    // Peak discharge (the worst case current — usually ascend or forward)
    const iPeak = Math.max(I.ascend, I.forward, I.descend);
    const iAvailable = p * cellDischarge;

    const capacityOk = ahWithReserve <= ahAvailable;
    const dischargeOk = iPeak <= iAvailable;

    if (!capacityOk && !dischargeOk) {
      return { feasible: false, status: 'capacity_and_discharge_limited', s, p, payload, mtow, batteryWeight };
    }
    if (!capacityOk) {
      return { feasible: false, status: 'capacity_limited', s, p, payload, mtow, batteryWeight, ahRequired, ahAvailable };
    }
    if (!dischargeOk) {
      return { feasible: false, status: 'discharge_limited', s, p, payload, mtow, batteryWeight, iPeak, iAvailable };
    }

    // Cruise margin: how many extra minutes of cruise the pack delivers beyond
    // what the mission requires. Positive = headroom; near zero = tight.
    const achievableCruiseHr = (p * cellCap * params.usable_capacity_fraction) / I.forward;
    const requiredCruiseHr = tForward; // already net of ascend+descend
    const cruiseMarginMin = (achievableCruiseHr - requiredCruiseHr) * 60;

    // Hover efficiency (g/W) if power data is present
    let hoverEffGW = null;
    const powHover = motor.powerAt(tg.hover);
    if (powHover) hoverEffGW = tg.hover / powHover;

    // Forward velocity (m/s) from banking + drag equilibrium
    const velocity = Math.sqrt(
      (mtow * G * Math.tan(bankRad)) / (0.5 * rhoAlt * Cd * A)
    );

    // Pack metrics
    const packVoltageNominal = s * 3.7;
    const packEnergyWh = s * p * cellCap * 3.7;

    return {
      feasible: true,
      status: 'feasible',
      s,
      p,
      payload,
      mtow,
      batteryWeight,
      throttleHover: phases.hover.throttle,
      throttleForward: phases.forward.throttle,
      throttleAscend: phases.ascend.throttle,
      maxThrottle,
      currentPerMotorHover: phases.hover.current_per_motor,
      currentPerMotorForward: phases.forward.current_per_motor,
      iHover: I.hover,
      iForward: I.forward,
      iAscend: I.ascend,
      iDescend: I.descend,
      iPeak,
      ahRequired,
      ahAvailable,
      cruiseMarginMin,
      hoverEffGW,
      velocity,
      packVoltageNominal,
      packEnergyWh
    };
  }

  function runOptimization(params, motor) {
    const out = [];
    const sMin = params.series_cells_min;
    const sMax = params.series_cells_max;
    const pMin = params.parallel_cells_min;
    const pMax = params.parallel_cells_max;

    // Payload sweep (geometric, like the original — 10% steps)
    const payloads = [];
    let pl = params.min_payload;
    const step = 1 + params.payload_step_pct / 100;
    while (pl <= params.max_payload + 1e-6) {
      payloads.push(+pl.toFixed(3));
      pl *= step;
    }

    for (let s = sMin; s <= sMax; s++) {
      for (let p = pMin; p <= pMax; p++) {
        for (const payload of payloads) {
          out.push(evaluateConfig(s, p, payload, params, motor));
        }
      }
    }
    return out;
  }

  // For each payload, find the (s,p) with the lowest battery weight that's feasible.
  function paretoFront(results) {
    const byPayload = new Map();
    for (const r of results) {
      if (!r.feasible) continue;
      const key = r.payload.toFixed(3);
      const existing = byPayload.get(key);
      if (!existing || r.batteryWeight < existing.batteryWeight) {
        byPayload.set(key, r);
      }
    }
    return [...byPayload.values()].sort((a, b) => a.payload - b.payload);
  }

  // ──────────────────────────────────────────────────────────────
  // Form / DOM
  // ──────────────────────────────────────────────────────────────
  const INPUT_FIELDS = [
    // [id, type, step, group]
    // Mission
    ['flight_time_min', 'number', 0.5, 'mission'],
    ['altitude_m', 'number', 10, 'mission'],
    ['ascend_velocity', 'number', 0.5, 'mission'],
    ['descend_velocity', 'number', 0.5, 'mission'],
    ['banking_angle', 'number', 1, 'mission'],
    ['frontal_area', 'number', 0.05, 'mission'],
    ['drag_coefficient', 'number', 0.05, 'mission'],
    ['air_density_sea', 'number', 0.01, 'mission'],
    ['air_density_alt', 'number', 0.01, 'mission'],
    // Airframe
    ['motor_number', 'number', 1, 'airframe'],
    ['motor_weight_per', 'number', 0.01, 'airframe'],
    ['esc_weight', 'number', 0.01, 'airframe'],
    ['prop_weight', 'number', 0.01, 'airframe'],
    ['frame_weight', 'number', 0.1, 'airframe'],
    ['electronics_weight', 'number', 0.05, 'airframe'],
    ['cable_weight', 'number', 0.05, 'airframe'],
    ['electronics_current', 'number', 0.1, 'airframe'],
    // Battery
    ['cell_capacity_ahr', 'number', 0.5, 'battery'],
    ['cell_discharge_rate', 'number', 5, 'battery'],
    ['cell_weight', 'number', 0.005, 'battery'],
    ['usable_capacity_fraction', 'number', 0.05, 'battery'],
    ['series_cells_min', 'number', 1, 'battery'],
    ['series_cells_max', 'number', 1, 'battery'],
    ['parallel_cells_min', 'number', 1, 'battery'],
    ['parallel_cells_max', 'number', 1, 'battery'],
    // Constraints
    ['throttle_max_value', 'number', 1, 'constraints'],
    ['thrust_safety_margin', 'number', 0.05, 'constraints'],
    ['min_payload', 'number', 0.1, 'constraints'],
    ['max_payload', 'number', 0.5, 'constraints'],
    ['payload_step_pct', 'number', 1, 'constraints']
  ];

  function readForm() {
    const params = {};
    for (const [id] of INPUT_FIELDS) {
      const el = document.getElementById('hldt-' + id);
      if (!el) continue;
      const v = parseFloat(el.value);
      params[id] = isFinite(v) ? v : 0;
    }
    // series_cells_default — exposed as info, not enumerated
    return params;
  }

  function writeForm(params) {
    for (const [id] of INPUT_FIELDS) {
      const el = document.getElementById('hldt-' + id);
      if (!el || params[id] === undefined) continue;
      el.value = params[id];
    }
  }

  // ──────────────────────────────────────────────────────────────
  // Status badges
  // ──────────────────────────────────────────────────────────────
  const STATUS_LABEL = {
    feasible: { text: 'Feasible', cls: 'bg-success' },
    motor_saturated: { text: 'Motor saturated', cls: 'bg-danger' },
    throttle_limited: { text: 'Throttle > cap', cls: 'bg-warning text-dark' },
    capacity_limited: { text: 'Capacity short', cls: 'bg-warning text-dark' },
    discharge_limited: { text: 'Discharge short', cls: 'bg-warning text-dark' },
    capacity_and_discharge_limited: { text: 'Cap + discharge short', cls: 'bg-warning text-dark' },
    mission_time_short: { text: 'Mission too short', cls: 'bg-secondary' },
    extrapolation: { text: 'Outside motor data', cls: 'bg-secondary' },
    voltage_incompatible: { text: 'Voltage incompatible with motor', cls: 'bg-secondary' }
  };

  // ──────────────────────────────────────────────────────────────
  // Render: table
  // ──────────────────────────────────────────────────────────────
  function renderTable(pareto) {
    const tbody = document.getElementById('hldt-results-body');
    tbody.innerHTML = '';
    if (!pareto.length) {
      tbody.innerHTML =
        '<tr><td colspan="9" class="text-center text-muted py-3">No feasible configurations — try relaxing constraints, raising series/parallel range, or selecting a different motor.</td></tr>';
      return;
    }
    for (const r of pareto) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${r.payload.toFixed(2)}</strong></td>
        <td>${r.s}S${r.p}P</td>
        <td>${r.mtow.toFixed(2)}</td>
        <td>${r.batteryWeight.toFixed(2)}</td>
        <td>${r.throttleHover.toFixed(1)}</td>
        <td>${r.throttleForward.toFixed(1)}</td>
        <td>${r.iPeak.toFixed(1)}</td>
        <td>${r.cruiseMarginMin >= 0 ? '+' : ''}${r.cruiseMarginMin.toFixed(1)}</td>
        <td>${r.velocity.toFixed(1)}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  function renderInfeasibleSummary(allResults) {
    const counts = {};
    for (const r of allResults) {
      if (r.feasible) continue;
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    const el = document.getElementById('hldt-infeasible-summary');
    if (!Object.keys(counts).length) {
      el.innerHTML = '';
      return;
    }
    const parts = Object.entries(counts)
      .map(([status, n]) => {
        const label = STATUS_LABEL[status] || { text: status, cls: 'bg-secondary' };
        return `<span class="badge ${label.cls} me-1">${label.text}: ${n}</span>`;
      })
      .join(' ');
    el.innerHTML = `<small class="text-muted">Rejected configurations:</small> ${parts}`;
  }

  // ──────────────────────────────────────────────────────────────
  // Render: chart
  // ──────────────────────────────────────────────────────────────
  function renderChart(pareto) {
    const canvas = document.getElementById('hldt-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    const labels = pareto.map((r) => r.payload.toFixed(2));
    const mtow = pareto.map((r) => +r.mtow.toFixed(2));
    const batt = pareto.map((r) => +r.batteryWeight.toFixed(2));
    const cruiseMargin = pareto.map((r) => +r.cruiseMarginMin.toFixed(1));

    const textColor =
      getComputedStyle(document.documentElement).getPropertyValue('--global-text-color').trim() ||
      '#222';
    const gridColor =
      getComputedStyle(document.documentElement).getPropertyValue('--global-divider-color').trim() ||
      'rgba(0,0,0,0.1)';
    const accentColor =
      getComputedStyle(document.documentElement).getPropertyValue('--global-theme-color').trim() ||
      '#b509ac';

    const data = {
      labels,
      datasets: [
        {
          label: 'MTOW (kg)',
          data: mtow,
          borderColor: accentColor,
          backgroundColor: accentColor,
          yAxisID: 'y',
          tension: 0.2,
          pointRadius: 4
        },
        {
          label: 'Battery weight (kg)',
          data: batt,
          borderColor: '#888',
          backgroundColor: '#888',
          yAxisID: 'y',
          tension: 0.2,
          pointRadius: 3,
          borderDash: [4, 4]
        },
        {
          label: 'Cruise margin (min)',
          data: cruiseMargin,
          borderColor: '#2698ba',
          backgroundColor: '#2698ba',
          yAxisID: 'y1',
          tension: 0.2,
          pointRadius: 3
        }
      ]
    };

    const opts = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        x: {
          title: { display: true, text: 'Payload (kg)', color: textColor },
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y: {
          position: 'left',
          title: { display: true, text: 'Weight (kg)', color: textColor },
          ticks: { color: textColor },
          grid: { color: gridColor }
        },
        y1: {
          position: 'right',
          title: { display: true, text: 'Cruise margin (min)', color: textColor },
          ticks: { color: textColor },
          grid: { drawOnChartArea: false }
        }
      },
      plugins: {
        legend: { labels: { color: textColor } },
        tooltip: { mode: 'index', intersect: false }
      }
    };

    if (STATE.chart) {
      STATE.chart.data = data;
      STATE.chart.options = opts;
      STATE.chart.update();
    } else {
      STATE.chart = new Chart(canvas.getContext('2d'), { type: 'line', data, options: opts });
    }
  }

  // ──────────────────────────────────────────────────────────────
  // CSV export
  // ──────────────────────────────────────────────────────────────
  function downloadCSV(pareto) {
    const header = [
      'payload_kg',
      'battery_config',
      'mtow_kg',
      'battery_weight_kg',
      'throttle_hover_pct',
      'throttle_forward_pct',
      'peak_current_A',
      'cruise_margin_min',
      'forward_velocity_m_s',
      'pack_voltage_nominal_V',
      'pack_energy_Wh'
    ];
    const lines = [header.join(',')];
    for (const r of pareto) {
      lines.push(
        [
          r.payload.toFixed(2),
          `${r.s}S${r.p}P`,
          r.mtow.toFixed(2),
          r.batteryWeight.toFixed(2),
          r.throttleHover.toFixed(1),
          r.throttleForward.toFixed(1),
          r.iPeak.toFixed(1),
          r.cruiseMarginMin.toFixed(1),
          r.velocity.toFixed(1),
          r.packVoltageNominal.toFixed(1),
          r.packEnergyWh.toFixed(0)
        ].join(',')
      );
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `heavy-lift-drone-sizing-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ──────────────────────────────────────────────────────────────
  // URL hash state
  // ──────────────────────────────────────────────────────────────
  function encodeStateToHash(params, motorId) {
    const obj = { motor: motorId, params };
    return CFG.urlHashPrefix + encodeURIComponent(btoa(JSON.stringify(obj)));
  }
  function decodeStateFromHash() {
    const h = window.location.hash.replace(/^#/, '');
    if (!h.startsWith(CFG.urlHashPrefix)) return null;
    try {
      const obj = JSON.parse(atob(decodeURIComponent(h.slice(CFG.urlHashPrefix.length))));
      return obj;
    } catch (e) {
      return null;
    }
  }
  function copyShareableLink() {
    const url = window.location.origin + window.location.pathname + '#' + encodeStateToHash(STATE.params, STATE.activeMotorId);
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('hldt-share-btn');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Copied ✓';
      setTimeout(() => (btn.innerHTML = orig), 1500);
    });
  }

  // ──────────────────────────────────────────────────────────────
  // Motor selection / upload
  // ──────────────────────────────────────────────────────────────
  async function loadMotorById(id) {
    if (STATE.motors[id]) {
      STATE.activeMotor = buildMotorModel(STATE.motors[id]);
      STATE.activeMotorId = id;
      renderMotorInfo();
      syncSeriesRangeToMotor();
      return;
    }
    // Built-in?
    const entry = STATE.motorManifest.motors.find((m) => m.id === id);
    if (entry) {
      const resp = await fetch(CFG.motorsBase + entry.file);
      if (!resp.ok) throw new Error('Failed to load motor data: ' + entry.file);
      const json = await resp.json();
      STATE.motors[id] = json;
      STATE.activeMotor = buildMotorModel(json);
      STATE.activeMotorId = id;
      renderMotorInfo();
      syncSeriesRangeToMotor();
      return;
    }
    // Local upload?
    const uploads = loadUploadedMotors();
    if (uploads[id]) {
      STATE.motors[id] = uploads[id];
      STATE.activeMotor = buildMotorModel(uploads[id]);
      STATE.activeMotorId = id;
      renderMotorInfo();
      syncSeriesRangeToMotor();
      return;
    }
    throw new Error('Motor not found: ' + id);
  }

  function loadUploadedMotors() {
    try {
      return JSON.parse(localStorage.getItem(CFG.localStorageKey) || '{}');
    } catch (e) {
      return {};
    }
  }
  function saveUploadedMotor(motor) {
    const uploads = loadUploadedMotors();
    uploads[motor.id] = motor;
    localStorage.setItem(CFG.localStorageKey, JSON.stringify(uploads));
  }
  function deleteUploadedMotor(id) {
    const uploads = loadUploadedMotors();
    delete uploads[id];
    localStorage.setItem(CFG.localStorageKey, JSON.stringify(uploads));
  }

  function renderMotorInfo() {
    const m = STATE.activeMotor;
    const el = document.getElementById('hldt-motor-info');
    if (!el || !m) return;
    const meta = m.meta;
    const sMin = meta.pack_series_min;
    const sMax = meta.pack_series_max;
    const sLabel =
      sMin != null && sMax != null
        ? sMin === sMax
          ? sMin + 'S'
          : sMin + '–' + sMax + 'S'
        : '?';
    el.innerHTML = `
      <strong>${meta.motor_name}</strong>
      ${meta.manufacturer ? ' — ' + meta.manufacturer : ''}
      <br>
      <small class="text-muted">
        Test voltage: ${meta.test_voltage ?? '?'} V
        · Pack series: <strong>${sLabel}</strong>
        ${meta.kv ? ' · ' + meta.kv + ' KV' : ''}
        · Max thrust: ${(m.maxThrustG / 1000).toFixed(2)} kg
        · Data points: ${meta.data.length}
        ${meta.source ? ' · Source: ' + meta.source : ''}
      </small>
    `;
  }

  // When a motor loads, force the form's series range to match the motor's
  // compatible pack voltage. Optimizer enforces this anyway; the form just
  // makes it visible.
  function syncSeriesRangeToMotor() {
    const m = STATE.activeMotor;
    if (!m) return;
    const sMin = m.meta.pack_series_min;
    const sMax = m.meta.pack_series_max;
    if (sMin != null) {
      const el = document.getElementById('hldt-series_cells_min');
      if (el) el.value = sMin;
    }
    if (sMax != null) {
      const el = document.getElementById('hldt-series_cells_max');
      if (el) el.value = sMax;
    }
  }

  function refreshMotorDropdown() {
    const sel = document.getElementById('hldt-motor-select');
    sel.innerHTML = '';
    const builtinGroup = document.createElement('optgroup');
    builtinGroup.label = 'Built-in datasets';
    for (const m of STATE.motorManifest.motors) {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.name + (m.class ? ' [' + m.class + ']' : '');
      builtinGroup.appendChild(opt);
    }
    sel.appendChild(builtinGroup);
    const uploads = loadUploadedMotors();
    const uploadEntries = Object.values(uploads);
    if (uploadEntries.length) {
      const upGroup = document.createElement('optgroup');
      upGroup.label = 'Your uploads';
      for (const m of uploadEntries) {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.motor_name + ' [uploaded]';
        upGroup.appendChild(opt);
      }
      sel.appendChild(upGroup);
    }
    if (STATE.activeMotorId) sel.value = STATE.activeMotorId;
  }

  // CSV parser for motor uploads
  function parseMotorCSV(text, opts) {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length && !l.startsWith('#'));
    if (lines.length < 3) throw new Error('CSV needs a header + at least 2 data rows.');
    const header = lines[0].split(',').map((s) => s.trim().toLowerCase());

    const idxOf = (names) => {
      for (const n of names) {
        const i = header.findIndex((h) => h === n || h.startsWith(n));
        if (i >= 0) return i;
      }
      return -1;
    };
    const iThrottle = idxOf(['throttle', 'throttle (%)', 'throttle%']);
    const iThrust = idxOf(['thrust', 'thrust (g)', 'thrust(g)', 'thrust_g']);
    const iCurrent = idxOf(['current', 'current (a)', 'current(a)']);
    const iVoltage = idxOf(['voltage', 'voltage (v)']);
    const iPower = idxOf(['power', 'power (w)']);
    const iRpm = idxOf(['rpm']);
    if (iThrottle < 0 || iThrust < 0 || iCurrent < 0) {
      throw new Error('CSV must include Throttle, Thrust, and Current columns.');
    }

    let unitRow = null;
    const peek = lines[1].split(',').map((s) => s.trim().toLowerCase());
    const isUnitRow = peek.some((c) => ['%', 'g', 'kg', 'n', 'a', 'ma', 'v', 'w'].includes(c));
    let dataStart = 1;
    if (isUnitRow) {
      unitRow = peek;
      dataStart = 2;
    }

    const thrustUnit = unitRow ? unitRow[iThrust] : 'g';
    const currentUnit = unitRow ? unitRow[iCurrent] : 'a';

    const data = [];
    for (let i = dataStart; i < lines.length; i++) {
      const parts = lines[i].split(',').map((s) => s.trim());
      const throttle = parseFloat(parts[iThrottle]);
      let thrust_g = parseFloat(parts[iThrust]);
      let current = parseFloat(parts[iCurrent]);
      if (!isFinite(throttle) || !isFinite(thrust_g) || !isFinite(current)) {
        throw new Error(`Row ${i + 1}: non-numeric value.`);
      }
      if (thrustUnit === 'kg') thrust_g *= 1000;
      else if (thrustUnit === 'n') thrust_g = (thrust_g / G) * 1000;
      if (currentUnit === 'ma') current /= 1000;

      const row = { throttle, thrust_g, current };
      if (iVoltage >= 0 && parts[iVoltage]) row.voltage = parseFloat(parts[iVoltage]);
      if (iPower >= 0 && parts[iPower]) row.power = parseFloat(parts[iPower]);
      if (iRpm >= 0 && parts[iRpm]) row.rpm = parseFloat(parts[iRpm]);
      data.push(row);
    }
    if (data.length < 3) throw new Error('Need at least 3 data rows.');

    // Validate monotonic thrust
    const sorted = [...data].sort((a, b) => a.throttle - b.throttle);
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].thrust_g < sorted[i - 1].thrust_g - 1e-6) {
        throw new Error('Thrust must be non-decreasing with throttle.');
      }
    }

    // Infer compatible pack series from test voltage (LiPo nominal 3.7 V/cell).
    // User can override after upload by editing the saved JSON if needed.
    let packSeriesMin = opts.pack_series_min ?? null;
    let packSeriesMax = opts.pack_series_max ?? null;
    if (packSeriesMin == null && opts.test_voltage) {
      const inferred = Math.round(opts.test_voltage / 3.7);
      packSeriesMin = inferred;
      packSeriesMax = inferred;
    }

    return {
      id: 'upload_' + Date.now(),
      motor_name: opts.motor_name || 'Uploaded motor',
      manufacturer: opts.manufacturer || '',
      test_voltage: opts.test_voltage || null,
      kv: opts.kv || null,
      pack_series_min: packSeriesMin,
      pack_series_max: packSeriesMax,
      source: 'User upload',
      data
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Recompute + render orchestration
  // ──────────────────────────────────────────────────────────────
  function recompute() {
    if (!STATE.activeMotor) return;
    STATE.params = readForm();
    const results = runOptimization(STATE.params, STATE.activeMotor);
    STATE.results = results;
    const pareto = paretoFront(results);
    renderTable(pareto);
    renderChart(pareto);
    renderInfeasibleSummary(results);
    // Update URL hash silently (no scroll jump)
    const hash = '#' + encodeStateToHash(STATE.params, STATE.activeMotorId);
    history.replaceState(null, '', hash);
  }

  function debounce(fn, ms) {
    let t = null;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // ──────────────────────────────────────────────────────────────
  // Preset application
  // ──────────────────────────────────────────────────────────────
  async function applyPreset(presetId) {
    const p = STATE.presets.presets.find((x) => x.id === presetId);
    if (!p) return;
    writeForm(p.params);
    await loadMotorById(p.motor_id);
    refreshMotorDropdown();
    recompute();
  }

  // ──────────────────────────────────────────────────────────────
  // Init
  // ──────────────────────────────────────────────────────────────
  async function init() {
    try {
      const [mManifest, presets] = await Promise.all([
        fetch(CFG.motorsBase + 'index.json').then((r) => r.json()),
        fetch(CFG.presetsPath).then((r) => r.json())
      ]);
      STATE.motorManifest = mManifest;
      STATE.presets = presets;
    } catch (e) {
      const banner = document.getElementById('hldt-error-banner');
      if (banner)
        banner.innerHTML =
          '<div class="alert alert-danger">Failed to load motor or preset data. Check paths in window.HLDT_CONFIG.</div>';
      console.error(e);
      return;
    }

    renderPresetButtons();
    refreshMotorDropdown();
    bindEvents();

    // Try URL hash, fall back to default preset
    const fromHash = decodeStateFromHash();
    if (fromHash && fromHash.params) {
      writeForm(fromHash.params);
      try {
        await loadMotorById(fromHash.motor || STATE.motorManifest.default_motor);
      } catch (e) {
        await loadMotorById(STATE.motorManifest.default_motor);
      }
      refreshMotorDropdown();
      recompute();
    } else {
      const defaultPreset = STATE.presets.default_preset;
      await applyPreset(defaultPreset);
    }
  }

  function renderPresetButtons() {
    const wrap = document.getElementById('hldt-presets');
    wrap.innerHTML = '';
    for (const p of STATE.presets.presets) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-outline-primary btn-sm me-2 mb-2';
      btn.textContent = p.name;
      btn.title = p.description;
      btn.addEventListener('click', () => applyPreset(p.id));
      wrap.appendChild(btn);
    }
  }

  function bindEvents() {
    const debouncedRecompute = debounce(recompute, 200);
    document.querySelectorAll('#hldt-form input, #hldt-form select').forEach((el) => {
      el.addEventListener('input', debouncedRecompute);
      el.addEventListener('change', debouncedRecompute);
    });

    document.getElementById('hldt-motor-select').addEventListener('change', async (e) => {
      try {
        await loadMotorById(e.target.value);
        recompute();
      } catch (err) {
        alert(err.message);
      }
    });

    document.getElementById('hldt-upload-btn').addEventListener('click', () => {
      document.getElementById('hldt-upload-input').click();
    });

    document.getElementById('hldt-upload-input').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      const name = prompt('Motor name?', file.name.replace(/\.csv$/i, '')) || file.name;
      const volStr = prompt('Test voltage (V, optional)?', '');
      try {
        const motor = parseMotorCSV(text, {
          motor_name: name,
          test_voltage: volStr ? parseFloat(volStr) : null
        });
        saveUploadedMotor(motor);
        STATE.motors[motor.id] = motor;
        refreshMotorDropdown();
        document.getElementById('hldt-motor-select').value = motor.id;
        await loadMotorById(motor.id);
        recompute();
      } catch (err) {
        alert('Upload failed: ' + err.message);
      }
      e.target.value = '';
    });

    document.getElementById('hldt-share-btn').addEventListener('click', copyShareableLink);
    document.getElementById('hldt-csv-btn').addEventListener('click', () => {
      if (!STATE.results) return;
      downloadCSV(paretoFront(STATE.results));
    });
    document.getElementById('hldt-reset-btn').addEventListener('click', () => {
      applyPreset(STATE.presets.default_preset);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for ad-hoc inspection
  window.HLDT = {
    state: STATE,
    recompute,
    evaluateConfig,
    runOptimization,
    paretoFront
  };
})();
