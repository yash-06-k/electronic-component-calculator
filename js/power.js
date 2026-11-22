/**
 * power.js - Electrical Power and Ohm's Law Wheel Calculator
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.PowerCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  /**
   * Calculate all 4 DC circuit parameters (V, I, R, P) given any two known parameters.
   * Solves using P = V*I, P = I^2*R, P = V^2/R, V = I*R.
   * @param {Object} params
   * @param {number|string} [params.voltage]
   * @param {string} [params.voltageUnit='V']
   * @param {number|string} [params.current]
   * @param {string} [params.currentUnit='A']
   * @param {number|string} [params.resistance]
   * @param {string} [params.resistanceUnit='Ω']
   * @param {number|string} [params.power]
   * @param {string} [params.powerUnit='W']
   * @returns {Object}
   */
  function calculatePower(params) {
    const {
      voltage, voltageUnit = 'V',
      current, currentUnit = 'A',
      resistance, resistanceUnit = 'Ω',
      power, powerUnit = 'W'
    } = params || {};

    const hasV = voltage !== '' && voltage !== null && voltage !== undefined;
    const hasI = current !== '' && current !== null && current !== undefined;
    const hasR = resistance !== '' && resistance !== null && resistance !== undefined;
    const hasP = power !== '' && power !== null && power !== undefined;

    const count = (hasV ? 1 : 0) + (hasI ? 1 : 0) + (hasR ? 1 : 0) + (hasP ? 1 : 0);

    if (count < 2) {
      throw new Error('Please enter any two parameters (from Voltage, Current, Resistance, or Power) to calculate the remaining parameters.');
    }

    let V = null, I = null, R = null, P = null;
    let formulasUsed = [];
    let pairName = '';

    // Convert supplied values to base units
    if (hasV) {
      const num = Number(voltage);
      if (isNaN(num) || !isFinite(num)) throw new Error('Voltage must be a valid number.');
      V = Units.toBaseUnit(num, voltageUnit);
    }
    if (hasI) {
      const num = Number(current);
      if (isNaN(num) || !isFinite(num)) throw new Error('Current must be a valid number.');
      I = Units.toBaseUnit(num, currentUnit);
    }
    if (hasR) {
      const num = Number(resistance);
      if (isNaN(num) || !isFinite(num)) throw new Error('Resistance must be a valid number.');
      if (num < 0) throw new Error('Resistance cannot be negative.');
      R = Units.toBaseUnit(num, resistanceUnit);
    }
    if (hasP) {
      const num = Number(power);
      if (isNaN(num) || !isFinite(num)) throw new Error('Power must be a valid number.');
      if (num < 0) throw new Error('Power cannot be negative in passive DC circuits.');
      P = Units.toBaseUnit(num, powerUnit);
    }

    // 1. Given V and I
    if (hasV && hasI && !hasR && !hasP) {
      pairName = 'Voltage & Current';
      P = V * I;
      if (I === 0) throw new Error('Current is zero; resistance is infinite (open circuit).');
      R = V / I;
      formulasUsed = ['P = V × I', 'R = V / I'];
    }
    // 2. Given V and R
    else if (hasV && hasR && !hasI && !hasP) {
      pairName = 'Voltage & Resistance';
      if (R === 0) throw new Error('Resistance cannot be zero (short circuit / division by zero).');
      I = V / R;
      P = (V * V) / R;
      formulasUsed = ['I = V / R', 'P = V² / R'];
    }
    // 3. Given V and P
    else if (hasV && hasP && !hasI && !hasR) {
      pairName = 'Voltage & Power';
      if (V === 0) throw new Error('Voltage cannot be zero when power is specified.');
      I = P / V;
      if (P === 0) throw new Error('Power is zero.');
      R = (V * V) / P;
      formulasUsed = ['I = P / V', 'R = V² / P'];
    }
    // 4. Given I and R
    else if (hasI && hasR && !hasV && !hasP) {
      pairName = 'Current & Resistance';
      V = I * R;
      P = I * I * R;
      formulasUsed = ['V = I × R', 'P = I² × R'];
    }
    // 5. Given I and P
    else if (hasI && hasP && !hasV && !hasR) {
      pairName = 'Current & Power';
      if (I === 0) throw new Error('Current cannot be zero when power is specified.');
      V = P / I;
      R = P / (I * I);
      formulasUsed = ['V = P / I', 'R = P / I²'];
    }
    // 6. Given R and P
    else if (hasR && hasP && !hasV && !hasI) {
      pairName = 'Resistance & Power';
      if (R === 0) throw new Error('Resistance cannot be zero.');
      V = Math.sqrt(P * R);
      I = Math.sqrt(P / R);
      formulasUsed = ['V = √(P × R)', 'I = √(P / R)'];
    }
    // Fallback if user filled 3 or 4: calculate consistent pair (e.g. V and I)
    else {
      pairName = 'Selected Parameters';
      if (hasV && hasI) {
        P = V * I;
        R = I !== 0 ? V / I : 0;
        formulasUsed = ['P = V × I', 'R = V / I'];
      } else if (hasV && hasR) {
        I = R !== 0 ? V / R : 0;
        P = (V * V) / R;
        formulasUsed = ['I = V / R', 'P = V² / R'];
      } else if (hasI && hasR) {
        V = I * R;
        P = I * I * R;
        formulasUsed = ['V = I × R', 'P = I² × R'];
      }
    }

    if (!isFinite(V) || !isFinite(I) || !isFinite(R) || !isFinite(P)) {
      throw new Error('Calculation resulted in non-finite value. Please check inputs.');
    }

    // Recommended commercial wattage rating for the resistor
    const recommendedWattage = Units.getRecommendedWattage(P);
    const standardResistor = Units.getNearestStandardResistor(R, 'E24');

    return {
      success: true,
      pairName,
      formulasUsed,
      values: {
        voltage: V,
        current: I,
        resistance: R,
        power: P
      },
      formatted: {
        voltage: Units.formatEngineering(V, 'V').formatted,
        current: Units.formatEngineering(I, 'A').formatted,
        resistance: Units.formatEngineering(R, 'Ω').formatted,
        power: Units.formatEngineering(P, 'W').formatted,
        recommendedWattage: recommendedWattage.ratingStr,
        standardResistor: standardResistor ? standardResistor.formatted : 'N/A'
      },
      steps: [
        `Given Parameters: ${pairName}`,
        ...formulasUsed.map((f, i) => `Step ${i + 1}: Apply formula ${f}`),
        `Resulting Power: ${Units.formatEngineering(P, 'W').formatted}`,
        `Resulting Resistance: ${Units.formatEngineering(R, 'Ω').formatted}`,
        `Resulting Voltage: ${Units.formatEngineering(V, 'V').formatted}`,
        `Resulting Current: ${Units.formatEngineering(I, 'A').formatted}`
      ]
    };
  }

  return {
    calculatePower
  };
}));

