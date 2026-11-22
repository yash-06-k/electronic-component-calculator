/**
 * ohms-law.js - Ohm's Law and DC Circuit Calculator
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.OhmsLawCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  /**
   * Calculate missing Ohm's Law parameter given any two parameters.
   * @param {Object} params
   * @param {number|string} [params.voltage]
   * @param {string} [params.voltageUnit='V']
   * @param {number|string} [params.current]
   * @param {string} [params.currentUnit='A']
   * @param {number|string} [params.resistance]
   * @param {string} [params.resistanceUnit='Ω']
   * @returns {Object}
   */
  function calculateOhmsLaw(params) {
    const {
      voltage, voltageUnit = 'V',
      current, currentUnit = 'A',
      resistance, resistanceUnit = 'Ω'
    } = params || {};

    const hasV = voltage !== '' && voltage !== null && voltage !== undefined;
    const hasI = current !== '' && current !== null && current !== undefined;
    const hasR = resistance !== '' && resistance !== null && resistance !== undefined;

    const count = (hasV ? 1 : 0) + (hasI ? 1 : 0) + (hasR ? 1 : 0);

    if (count < 2) {
      throw new Error('Please enter any two values (Voltage, Current, or Resistance) to calculate the third.');
    }

    let V = null, I = null, R = null;
    let solvedTarget = '';
    let formulaStr = '';
    let steps = [];

    // Convert supplied inputs to base units
    if (hasV) {
      const vNum = Number(voltage);
      if (isNaN(vNum) || !isFinite(vNum)) {
        throw new Error('Voltage must be a valid number.');
      }
      V = Units.toBaseUnit(vNum, voltageUnit);
    }

    if (hasI) {
      const iNum = Number(current);
      if (isNaN(iNum) || !isFinite(iNum)) {
        throw new Error('Current must be a valid number.');
      }
      I = Units.toBaseUnit(iNum, currentUnit);
    }

    if (hasR) {
      const rNum = Number(resistance);
      if (isNaN(rNum) || !isFinite(rNum)) {
        throw new Error('Resistance must be a valid number.');
      }
      if (rNum < 0) {
        throw new Error('Resistance cannot be negative.');
      }
      R = Units.toBaseUnit(rNum, resistanceUnit);
    }

    // Determine target to solve
    if (hasI && hasR && !hasV) {
      // Solve for Voltage: V = I * R
      solvedTarget = 'Voltage (V)';
      V = I * R;
      formulaStr = 'V = I × R';
      steps = [
        `Formula: V = I × R`,
        `Given: Current (I) = ${Units.formatEngineering(I, 'A').formatted}, Resistance (R) = ${Units.formatEngineering(R, 'Ω').formatted}`,
        `Calculation: V = ${I} A × ${R} Ω = ${V} V`,
        `Result: ${Units.formatEngineering(V, 'V').formatted}`
      ];
    } else if (hasV && hasR && !hasI) {
      // Solve for Current: I = V / R
      if (R === 0) {
        throw new Error('Resistance cannot be zero (Division by zero / Short circuit condition).');
      }
      solvedTarget = 'Current (I)';
      I = V / R;
      formulaStr = 'I = V / R';
      steps = [
        `Formula: I = V / R`,
        `Given: Voltage (V) = ${Units.formatEngineering(V, 'V').formatted}, Resistance (R) = ${Units.formatEngineering(R, 'Ω').formatted}`,
        `Calculation: I = ${V} V / ${R} Ω = ${I} A`,
        `Result: ${Units.formatEngineering(I, 'A').formatted}`
      ];
    } else if (hasV && hasI && !hasR) {
      // Solve for Resistance: R = V / I
      if (I === 0) {
        throw new Error('Current cannot be zero (Division by zero / Open circuit condition).');
      }
      solvedTarget = 'Resistance (R)';
      R = V / I;
      if (R < 0) {
        throw new Error('Calculated resistance cannot be negative.');
      }
      formulaStr = 'R = V / I';
      steps = [
        `Formula: R = V / I`,
        `Given: Voltage (V) = ${Units.formatEngineering(V, 'V').formatted}, Current (I) = ${Units.formatEngineering(I, 'A').formatted}`,
        `Calculation: R = ${V} V / ${I} A = ${R} Ω`,
        `Result: ${Units.formatEngineering(R, 'Ω').formatted}`
      ];
    } else {
      // All 3 provided: verify consistency or re-calculate
      // Calculate V from I and R, or check consistency
      solvedTarget = 'Power and Verification';
      const expectedV = I * R;
      formulaStr = 'P = V × I';
      steps = [
        `All 3 values provided:`,
        `Checked V = I × R: ${I} A × ${R} Ω = ${Units.formatEngineering(expectedV, 'V').formatted}`,
        `Power: P = V × I = ${V * I} W`
      ];
    }

    // Calculate electrical power: P = V * I
    const powerWatts = V * I;
    const powerFormatted = Units.formatEngineering(powerWatts, 'W');

    // Add power step
    steps.push(`Power Dissipation: P = V × I = ${Units.formatEngineering(V, 'V').formatted} × ${Units.formatEngineering(I, 'A').formatted} = ${powerFormatted.formatted}`);

    // Format all results
    const vFormatted = Units.formatEngineering(V, 'V');
    const iFormatted = Units.formatEngineering(I, 'A');
    const rFormatted = Units.formatEngineering(R, 'Ω');
    const standardE24 = R > 0 ? Units.getNearestStandardResistor(R, 'E24') : null;

    return {
      success: true,
      solvedTarget,
      formula: formulaStr,
      voltage: V,
      current: I,
      resistance: R,
      power: powerWatts,
      formattedVoltage: vFormatted.formatted,
      formattedCurrent: iFormatted.formatted,
      formattedResistance: rFormatted.formatted,
      formattedPower: powerFormatted.formatted,
      standardResistor: standardE24 ? standardE24.formatted : 'N/A',
      steps
    };
  }

  return {
    calculateOhmsLaw
  };
}));

