/**
 * reference.js - Electronic Component Reference & Quick Guide
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ComponentReference = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const COMPONENTS = [
    {
      id: 'resistor',
      name: 'Resistor',
      category: 'passive',
      unit: 'Ohm (Ω)',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="Resistor Symbol">
        <path d="M 5 20 L 25 20 L 30 10 L 40 30 L 50 10 L 60 30 L 70 10 L 75 20 L 95 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
      functionDesc: 'Opposes and limits the flow of electrical current, produces voltage drops, and dissipates electrical energy as heat.',
      terminals: 'Two non-polarized terminals (Leads)',
      formula: 'V = I × R &nbsp;|&nbsp; P = I²R = V²/R',
      commonParts: 'Carbon Film (1/4W, 1/2W), Metal Film 1%, Wirewound, SMD 0805/0603',
      applications: [
        'Current limiting for LEDs and transistors',
        'Voltage division in sensor interfaces',
        'Pull-up and pull-down in digital logic',
        'Biasing active semiconductor devices'
      ]
    },
    {
      id: 'capacitor',
      name: 'Capacitor',
      category: 'passive',
      unit: 'Farad (F, µF, nF, pF)',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="Capacitor Symbol">
        <line x1="5" y1="20" x2="44" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="44" y1="6" x2="44" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <line x1="56" y1="6" x2="56" y2="34" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
        <line x1="56" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
      functionDesc: 'Stores electrical potential energy in an electrostatic field between two conductive plates separated by a dielectric medium. Blocks DC and passes AC.',
      terminals: 'Electrolytic: Anode (+ longer lead), Cathode (- stripe). Ceramic/Film: Non-polarized.',
      formula: 'Q = C × V &nbsp;|&nbsp; X_c = 1 / (2πfC) &nbsp;|&nbsp; E = ½ C V²',
      commonParts: 'Ceramic Disc (104 = 100nF), Aluminum Electrolytic (10µF, 100µF, 1000µF 25V), Tantalum, Polyester Film',
      applications: [
        'Power supply filtering and ripple smoothing',
        'AC signal coupling and DC blocking',
        'Timing networks (RC filters, 555 oscillator)',
        'Decoupling high-frequency digital noise near ICs'
      ]
    },
    {
      id: 'inductor',
      name: 'Inductor (Choke / Coil)',
      category: 'passive',
      unit: 'Henry (H, mH, µH)',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="Inductor Symbol">
        <path d="M 5 24 L 20 24 A 8 8 0 0 1 36 24 A 8 8 0 0 1 52 24 A 8 8 0 0 1 68 24 A 8 8 0 0 1 84 24 L 95 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
      functionDesc: 'Stores electrical energy in a magnetic field when electric current flows through it. Resists sudden changes in current and opposes high-frequency signals.',
      terminals: 'Two non-polarized terminals',
      formula: 'V = L × (di/dt) &nbsp;|&nbsp; X_L = 2πfL &nbsp;|&nbsp; E = ½ L I²',
      commonParts: 'Toroidal Choke, Axial Lead Inductor (color coded), SMD Power Inductors (10µH, 100µH)',
      applications: [
        'Buck/Boost DC-DC switching power converters',
        'EMI / RF noise suppression and choke filters',
        'LC resonant tuned circuits in radio transmitters/receivers',
        'Relay coils and solenoids'
      ]
    },
    {
      id: 'diode',
      name: 'PN Junction Diode',
      category: 'semiconductor',
      unit: 'Forward Voltage (V_f ≈ 0.7V for Silicon, 0.3V for Germanium)',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="Diode Symbol">
        <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" stroke-width="2.5"/>
        <polygon points="35,8 35,32 65,20" fill="currentColor"/>
        <line x1="65" y1="8" x2="65" y2="32" stroke="currentColor" stroke-width="3"/>
        <line x1="65" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="2.5"/>
      </svg>`,
      functionDesc: 'Two-terminal semiconductor device that allows electric current to flow predominantly in one direction (forward bias) while blocking current in reverse bias.',
      terminals: 'Anode (A, triangle base) and Cathode (K, marked by silver/black cathode band line)',
      formula: 'I = I_s × (e^(V_D / nV_T) - 1) &nbsp;|&nbsp; V_barrier ≈ 0.7 V (Si)',
      commonParts: '1N4007 (1A, 1000V Rectifier), 1N4148 (High-speed signal diode), 1N5819 (Schottky), 1N4733A (Zener 5.1V)',
      applications: [
        'Half-wave and full-wave bridge rectifiers (AC to DC conversion)',
        'Reverse battery polarity protection',
        'Flyback / freewheeling diode across inductive coils',
        'Voltage clamping and clipping'
      ]
    },
    {
      id: 'led',
      name: 'Light Emitting Diode (LED)',
      category: 'semiconductor',
      unit: 'Forward Voltage V_f (1.8V - 3.4V), Current I_f (20mA)',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="LED Symbol">
        <line x1="5" y1="20" x2="32" y2="20" stroke="currentColor" stroke-width="2.5"/>
        <polygon points="32,8 32,32 58,20" fill="currentColor"/>
        <line x1="58" y1="8" x2="58" y2="32" stroke="currentColor" stroke-width="3"/>
        <line x1="58" y1="20" x2="95" y2="20" stroke="currentColor" stroke-width="2.5"/>
        <line x1="52" y1="8" x2="64" y2="0" stroke="currentColor" stroke-width="2"/>
        <polygon points="66,0 60,0 64,4" fill="currentColor"/>
        <line x1="60" y1="12" x2="72" y2="4" stroke="currentColor" stroke-width="2"/>
        <polygon points="74,4 68,4 72,8" fill="currentColor"/>
      </svg>`,
      functionDesc: 'Optoelectronic semiconductor diode that emits photons of incoherent light through electroluminescence when forward biased by current.',
      terminals: 'Anode (+ longer lead, round side) and Cathode (- shorter lead, flat edge on rim)',
      formula: 'R_series = (V_supply - V_f) / I_f &nbsp;|&nbsp; E_photon = h × ν = hc / λ',
      commonParts: '3mm / 5mm Through-hole LEDs (Red, Green, Blue, White), SMD 5050 RGB, 1W Star LED',
      applications: [
        'Power and logic status indicators',
        'Seven segment displays and alpha-numeric panels',
        'Optical isolators (Optocouplers e.g. PC817)',
        'Energy efficient general illumination and backlighting'
      ]
    },
    {
      id: 'bjt',
      name: 'Bipolar Junction Transistor (BJT)',
      category: 'semiconductor',
      unit: 'Current Gain (h_FE or β ≈ 100 - 400)',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="NPN Transistor Symbol">
        <line x1="10" y1="20" x2="40" y2="20" stroke="currentColor" stroke-width="2.5"/>
        <line x1="40" y1="6" x2="40" y2="34" stroke="currentColor" stroke-width="3.5"/>
        <line x1="40" y1="12" x2="68" y2="3" stroke="currentColor" stroke-width="2.5"/>
        <line x1="68" y1="3" x2="85" y2="3" stroke="currentColor" stroke-width="2.5"/>
        <line x1="40" y1="28" x2="68" y2="37" stroke="currentColor" stroke-width="2.5"/>
        <polygon points="68,37 54,32 59,26" fill="currentColor"/>
        <line x1="68" y1="37" x2="85" y2="37" stroke="currentColor" stroke-width="2.5"/>
      </svg>`,
      functionDesc: 'Current-controlled three-terminal active semiconductor device used to amplify weak electrical signals or operate as an electronic switch.',
      terminals: 'Base (B), Collector (C), Emitter (E)',
      formula: 'I_C = β × I_B &nbsp;|&nbsp; I_E = I_B + I_C &nbsp;|&nbsp; V_BE ≈ 0.7V (ON)',
      commonParts: 'BC547 / 2N2222 / 2N3904 (NPN General Purpose), BC557 / 2N3906 (PNP Complement), BD139 (Medium Power)',
      applications: [
        'Digital switching for relays, buzzers, and microcontrollers',
        'Audio frequency small-signal pre-amplification',
        'Oscillator and pulse generator circuits',
        'Differential amplifiers and sensor buffers'
      ]
    },
    {
      id: 'mosfet',
      name: 'MOSFET (Field-Effect Transistor)',
      category: 'semiconductor',
      unit: 'Gate Threshold V_GS(th), On-Resistance R_DS(on) in mΩ',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="N-Channel MOSFET Symbol">
        <line x1="10" y1="28" x2="36" y2="28" stroke="currentColor" stroke-width="2.5"/>
        <line x1="36" y1="12" x2="36" y2="34" stroke="currentColor" stroke-width="2.5"/>
        <line x1="44" y1="6" x2="44" y2="34" stroke="currentColor" stroke-width="3.5" stroke-dasharray="6,4"/>
        <line x1="44" y1="10" x2="80" y2="10" stroke="currentColor" stroke-width="2.5"/>
        <line x1="44" y1="30" x2="80" y2="30" stroke="currentColor" stroke-width="2.5"/>
        <line x1="44" y1="20" x2="62" y2="20" stroke="currentColor" stroke-width="2.5"/>
        <polygon points="44,20 54,16 54,24" fill="currentColor"/>
        <line x1="62" y1="20" x2="62" y2="30" stroke="currentColor" stroke-width="2.5"/>
      </svg>`,
      functionDesc: 'Voltage-controlled semiconductor device with an insulated metal oxide gate. High input impedance draws virtually zero DC gate current.',
      terminals: 'Gate (G), Drain (D), Source (S) [often substrate tied to Source]',
      formula: 'I_D = k × (V_GS - V_th)² &nbsp;|&nbsp; P_loss = I_D² × R_DS(on)',
      commonParts: 'IRF540N (N-Channel 100V 33A), IRFZ44N (55V 49A), 2N7000 (Small Signal N-Ch), IRF9540 (P-Channel)',
      applications: [
        'High-efficiency DC motor PWM speed control (H-Bridge)',
        'SMPS (Switched Mode Power Supplies) and Inverters',
        'High-side and low-side power load switching',
        'CMOS VLSI microprocessor logic gates'
      ]
    },
    {
      id: 'ic',
      name: 'Integrated Circuit (IC)',
      category: 'ic',
      unit: 'DIP / SOIC / QFP Package, Supply Voltage (e.g. 5V, ±15V)',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="IC Symbol">
        <rect x="25" y="6" width="50" height="28" rx="3" fill="none" stroke="currentColor" stroke-width="2.5"/>
        <circle cx="34" cy="14" r="2.5" fill="currentColor"/>
        <line x1="10" y1="12" x2="25" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="10" y1="20" x2="25" y2="20" stroke="currentColor" stroke-width="2"/>
        <line x1="10" y1="28" x2="25" y2="28" stroke="currentColor" stroke-width="2"/>
        <line x1="75" y1="12" x2="90" y2="12" stroke="currentColor" stroke-width="2"/>
        <line x1="75" y1="20" x2="90" y2="20" stroke="currentColor" stroke-width="2"/>
        <line x1="75" y1="28" x2="90" y2="28" stroke="currentColor" stroke-width="2"/>
      </svg>`,
      functionDesc: 'A micro-miniaturized electronic circuit consisting of millions of transistors, diodes, resistors, and capacitors fabricated onto a single semiconductor wafer.',
      terminals: 'Multi-pin DIP/SMD package with Pin 1 notch/dot alignment',
      formula: 'Op-Amp: V_out = A_OL × (V+ - V-) &nbsp;|&nbsp; 555: f = 1.44 / ((R1 + 2R2) × C)',
      commonParts: 'NE555 (Precision Timer), LM741 / LM358 (Operational Amplifiers), LM7805 / LM7812 (Linear Regulators), ATmega328P (Microcontroller)',
      applications: [
        'Astable, monostable, and bistable timers & clock generators',
        'Analog signal filtering, mathematical summing, and instrumentation',
        'Stable regulated DC voltage generation',
        'Digital computing, automation, and sensor acquisition'
      ]
    },
    {
      id: 'transformer',
      name: 'Electrical Transformer',
      category: 'magnetic',
      unit: 'Turns Ratio (N_p : N_s), VA / kVA Rating, Henries',
      symbolSvg: `<svg viewBox="0 0 100 40" class="comp-symbol-svg" aria-label="Transformer Symbol">
        <path d="M 10 8 L 22 8 A 6 6 0 0 1 22 16 A 6 6 0 0 1 22 24 A 6 6 0 0 1 22 32 L 10 32" fill="none" stroke="currentColor" stroke-width="2.2"/>
        <line x1="46" y1="6" x2="46" y2="34" stroke="currentColor" stroke-width="2.5"/>
        <line x1="54" y1="6" x2="54" y2="34" stroke="currentColor" stroke-width="2.5"/>
        <path d="M 90 8 L 78 8 A 6 6 0 0 0 78 16 A 6 6 0 0 0 78 24 A 6 6 0 0 0 78 32 L 90 32" fill="none" stroke="currentColor" stroke-width="2.2"/>
      </svg>`,
      functionDesc: 'Static electromagnetic device that transfers alternating electrical energy between two or more circuits through mutual magnetic induction while maintaining constant frequency.',
      terminals: 'Primary Winding (P1, P2) and Secondary Winding (S1, S2, optional Center Tap)',
      formula: 'V_s / V_p = N_s / N_p = I_p / I_s &nbsp;|&nbsp; P_in ≈ P_out (Ideal)',
      commonParts: 'Step-Down (230V AC to 12-0-12V AC, 1A Center Tapped), Isolation Transformer 1:1, Audio Impedance Matching Transformer',
      applications: [
        'Mains linear power supplies (stepping 230V/110V AC down to safe low voltage)',
        'Galvanic isolation between high-voltage mains and low-voltage user controls',
        'Audio impedance matching and balanced line driving',
        'Electrical grid transmission and substation distribution'
      ]
    }
  ];

  function getAllComponents() {
    return COMPONENTS;
  }

  function getComponentById(id) {
    return COMPONENTS.find(c => c.id === id) || null;
  }

  function filterComponents(query = '', category = 'all') {
    const q = query.trim().toLowerCase();
    return COMPONENTS.filter(c => {
      const matchCat = category === 'all' || c.category === category;
      const matchQuery = !q ||
        c.name.toLowerCase().includes(q) ||
        c.functionDesc.toLowerCase().includes(q) ||
        c.commonParts.toLowerCase().includes(q) ||
        c.unit.toLowerCase().includes(q) ||
        c.applications.some(app => app.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }

  return {
    COMPONENTS,
    getAllComponents,
    getComponentById,
    filterComponents
  };
}));

