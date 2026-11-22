/**
 * timer555.js - NE555 Timer IC & RC Filter Frequency Calculator
 * Astable, Monostable, and 1st-Order Passive RC Low/High Pass Filter
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.Timer555Calc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  /**
   * Calculate 555 Astable Multivibrator parameters.
   * f = 1.44 / ((R1 + 2*R2) * C)
   * Thigh = 0.693 * (R1 + R2) * C
   * Tlow  = 0.693 * R2 * C
   * Duty Cycle % = ((R1 + R2) / (R1 + 2*R2)) * 100%
   */
  function calculate555Astable(params) {
    const {
      r1, r1Unit = 'kΩ',
      r2, r2Unit = 'kΩ',
      c, cUnit = 'µF'
    } = params || {};

    if (r1 === '' || r1 === null || r1 === undefined) throw new Error('Please enter resistor R1 value.');
    if (r2 === '' || r2 === null || r2 === undefined) throw new Error('Please enter resistor R2 value.');
    if (c === '' || c === null || c === undefined) throw new Error('Please enter timing capacitor C value.');

    const r1Num = Number(r1);
    const r2Num = Number(r2);
    const cNum = Number(c);

    if (isNaN(r1Num) || r1Num <= 0) throw new Error('R1 must be greater than 0.');
    if (isNaN(r2Num) || r2Num <= 0) throw new Error('R2 must be greater than 0.');
    if (isNaN(cNum) || cNum <= 0) throw new Error('Capacitor C must be greater than 0.');

    const r1Ohms = Units.toBaseUnit(r1Num, r1Unit);
    const r2Ohms = Units.toBaseUnit(r2Num, r2Unit);
    const cFarads = Units.toBaseUnit(cNum, cUnit);

    const tHigh = 0.693 * (r1Ohms + r2Ohms) * cFarads;
    const tLow = 0.693 * r2Ohms * cFarads;
    const totalPeriod = tHigh + tLow;
    const frequency = 1.44 / ((r1Ohms + 2 * r2Ohms) * cFarads);
    const dutyCycle = ((r1Ohms + r2Ohms) / (r1Ohms + 2 * r2Ohms)) * 100;

    return {
      success: true,
      mode: 'astable',
      frequency,
      totalPeriod,
      tHigh,
      tLow,
      dutyCycle: Number(dutyCycle.toFixed(2)),
      formattedFreq: Units.formatEngineering(frequency, 'Hz').formatted,
      formattedPeriod: Units.formatEngineering(totalPeriod, 's').formatted,
      formattedHigh: Units.formatEngineering(tHigh, 's').formatted,
      formattedLow: Units.formatEngineering(tLow, 's').formatted,
      steps: [
        `1. High Time (Charging): T_high = ln(2) × (R1 + R2) × C = 0.693 × (${Units.formatEngineering(r1Ohms, 'Ω').formatted} + ${Units.formatEngineering(r2Ohms, 'Ω').formatted}) × ${Units.formatEngineering(cFarads, 'F').formatted} = ${Units.formatEngineering(tHigh, 's').formatted}`,
        `2. Low Time (Discharging): T_low = ln(2) × R2 × C = 0.693 × ${Units.formatEngineering(r2Ohms, 'Ω').formatted} × ${Units.formatEngineering(cFarads, 'F').formatted} = ${Units.formatEngineering(tLow, 's').formatted}`,
        `3. Total Period: T = T_high + T_low = ${Units.formatEngineering(totalPeriod, 's').formatted}`,
        `4. Oscillation Frequency: f = 1.44 / ((R1 + 2×R2) × C) = ${Units.formatEngineering(frequency, 'Hz').formatted}`,
        `5. Duty Cycle: D = (T_high / T) × 100% = ${dutyCycle.toFixed(2)}%`
      ]
    };
  }

  /**
   * Calculate 555 Monostable Multivibrator pulse duration.
   * T = 1.1 * R * C
   */
  function calculate555Monostable(params) {
    const {
      r, rUnit = 'kΩ',
      c, cUnit = 'µF'
    } = params || {};

    if (r === '' || r === null || r === undefined) throw new Error('Please enter timing resistor R value.');
    if (c === '' || c === null || c === undefined) throw new Error('Please enter timing capacitor C value.');

    const rNum = Number(r);
    const cNum = Number(c);

    if (isNaN(rNum) || rNum <= 0) throw new Error('Resistor R must be greater than 0.');
    if (isNaN(cNum) || cNum <= 0) throw new Error('Capacitor C must be greater than 0.');

    const rOhms = Units.toBaseUnit(rNum, rUnit);
    const cFarads = Units.toBaseUnit(cNum, cUnit);

    const pulseDuration = 1.1 * rOhms * cFarads;

    return {
      success: true,
      mode: 'monostable',
      pulseDuration,
      formattedPulse: Units.formatEngineering(pulseDuration, 's').formatted,
      steps: [
        `1. Monostable Pulse Width Formula: T = 1.1 × R × C`,
        `2. Substituted Values: T = 1.1 × ${Units.formatEngineering(rOhms, 'Ω').formatted} × ${Units.formatEngineering(cFarads, 'F').formatted}`,
        `3. Output Pulse Duration: T = ${Units.formatEngineering(pulseDuration, 's').formatted}`
      ]
    };
  }

  /**
   * Calculate 1st-Order Passive RC Filter Cutoff Frequency (-3dB).
   * fc = 1 / (2 * pi * R * C)
   * tau = R * C
   */
  function calculateRcFilter(params) {
    const {
      r, rUnit = 'kΩ',
      c, cUnit = 'nF'
    } = params || {};

    if (r === '' || r === null || r === undefined) throw new Error('Please enter filter resistor R value.');
    if (c === '' || c === null || c === undefined) throw new Error('Please enter filter capacitor C value.');

    const rNum = Number(r);
    const cNum = Number(c);

    if (isNaN(rNum) || rNum <= 0) throw new Error('Resistor R must be greater than 0.');
    if (isNaN(cNum) || cNum <= 0) throw new Error('Capacitor C must be greater than 0.');

    const rOhms = Units.toBaseUnit(rNum, rUnit);
    const cFarads = Units.toBaseUnit(cNum, cUnit);

    const cutoffFreq = 1 / (2 * Math.PI * rOhms * cFarads);
    const tau = rOhms * cFarads;

    return {
      success: true,
      cutoffFreq,
      tau,
      formattedFreq: Units.formatEngineering(cutoffFreq, 'Hz').formatted,
      formattedTau: Units.formatEngineering(tau, 's').formatted,
      steps: [
        `1. Cutoff Frequency Formula (-3dB point): f_c = 1 / (2 × π × R × C)`,
        `2. Substituted Values: f_c = 1 / (2 × π × ${Units.formatEngineering(rOhms, 'Ω').formatted} × ${Units.formatEngineering(cFarads, 'F').formatted})`,
        `3. Cutoff Frequency: f_c = ${Units.formatEngineering(cutoffFreq, 'Hz').formatted}`,
        `4. RC Time Constant: τ = R × C = ${Units.formatEngineering(tau, 's').formatted}`
      ]
    };
  }

  return {
    calculate555Astable,
    calculate555Monostable,
    calculateRcFilter
  };
}));

