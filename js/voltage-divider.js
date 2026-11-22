/**
 * voltage-divider.js - Voltage Divider Circuit Calculator & Visualizer
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.VoltageDividerCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  /**
   * Calculate Voltage Divider values with optional Load Resistance (RL).
   * @param {Object} params
   * @param {number|string} params.vin - Input voltage
   * @param {string} [params.vinUnit='V']
   * @param {number|string} params.r1 - Top resistor
   * @param {string} [params.r1Unit='Ω']
   * @param {number|string} params.r2 - Bottom resistor
   * @param {string} [params.r2Unit='Ω']
   * @param {number|string} [params.rl] - Optional load resistor
   * @param {string} [params.rlUnit='Ω']
   * @returns {Object}
   */
  function calculateVoltageDivider(params) {
    const {
      vin, vinUnit = 'V',
      r1, r1Unit = 'Ω',
      r2, r2Unit = 'Ω',
      rl, rlUnit = 'Ω'
    } = params || {};

    if (vin === '' || vin === null || vin === undefined) {
      throw new Error('Please enter the input voltage (V_in).');
    }
    if (r1 === '' || r1 === null || r1 === undefined) {
      throw new Error('Please enter resistor R1 value.');
    }
    if (r2 === '' || r2 === null || r2 === undefined) {
      throw new Error('Please enter resistor R2 value.');
    }

    const vinNum = Number(vin);
    const r1Num = Number(r1);
    const r2Num = Number(r2);

    if (isNaN(vinNum) || !isFinite(vinNum)) {
      throw new Error('Input voltage must be a valid number.');
    }
    if (isNaN(r1Num) || !isFinite(r1Num)) {
      throw new Error('R1 must be a valid number.');
    }
    if (isNaN(r2Num) || !isFinite(r2Num)) {
      throw new Error('R2 must be a valid number.');
    }

    if (r1Num < 0 || r2Num < 0) {
      throw new Error('Resistor values cannot be negative.');
    }

    const vinBase = Units.toBaseUnit(vinNum, vinUnit);
    const r1Base = Units.toBaseUnit(r1Num, r1Unit);
    const r2Base = Units.toBaseUnit(r2Num, r2Unit);

    if (r1Base === 0 && r2Base === 0) {
      throw new Error('Both R1 and R2 cannot be zero (short circuit to ground).');
    }

    // Check if Load Resistor RL is specified
    const hasLoad = rl !== '' && rl !== null && rl !== undefined;
    let rlBase = null;
    let r2Equivalent = r2Base;

    if (hasLoad) {
      const rlNum = Number(rl);
      if (isNaN(rlNum) || !isFinite(rlNum) || rlNum <= 0) {
        throw new Error('Load resistor RL must be a positive number.');
      }
      rlBase = Units.toBaseUnit(rlNum, rlUnit);
      // Parallel combination of R2 and RL: (R2 * RL) / (R2 + RL)
      r2Equivalent = (r2Base * rlBase) / (r2Base + rlBase);
    }

    const rTotal = r1Base + r2Equivalent;
    if (rTotal === 0) {
      throw new Error('Total resistance across divider is zero.');
    }

    // Calculations
    const vout = vinBase * (r2Equivalent / rTotal);
    const dividerCurrent = vinBase / rTotal;
    const vDropR1 = vinBase - vout;
    const vDropR2 = vout;
    const powerR1 = Math.pow(dividerCurrent, 2) * r1Base;
    const powerR2 = Math.pow(dividerCurrent, 2) * r2Equivalent;
    const totalPower = vinBase * dividerCurrent;
    const divisionRatio = vinBase !== 0 ? vout / vinBase : 0;

    // Standard resistor recommendations for R1 and R2
    const standardR1 = Units.getNearestStandardResistor(r1Base, 'E24');
    const standardR2 = Units.getNearestStandardResistor(r2Base, 'E24');

    const steps = [
      `1. Equivalent Bottom Resistance: ${hasLoad ? `R_eq = (R2 × RL) / (R2 + RL) = ${Units.formatEngineering(r2Equivalent, 'Ω').formatted}` : `R2 = ${Units.formatEngineering(r2Base, 'Ω').formatted}`}`,
      `2. Total Resistance: R_total = R1 + ${hasLoad ? 'R_eq' : 'R2'} = ${Units.formatEngineering(rTotal, 'Ω').formatted}`,
      `3. Divider Current: I = V_in / R_total = ${Units.formatEngineering(vinBase, 'V').formatted} / ${Units.formatEngineering(rTotal, 'Ω').formatted} = ${Units.formatEngineering(dividerCurrent, 'A').formatted}`,
      `4. Output Voltage: V_out = V_in × [R2 / (R1 + R2)] = ${Units.formatEngineering(vout, 'V').formatted}`,
      `5. Voltage drop across R1: V_R1 = ${Units.formatEngineering(vDropR1, 'V').formatted} | Power P_R1: ${Units.formatEngineering(powerR1, 'W').formatted}`,
      `6. Voltage drop across R2: V_R2 = ${Units.formatEngineering(vDropR2, 'V').formatted} | Power P_R2: ${Units.formatEngineering(powerR2, 'W').formatted}`
    ];

    return {
      success: true,
      hasLoad,
      vin: vinBase,
      r1: r1Base,
      r2: r2Base,
      rl: rlBase,
      r2Equivalent,
      rTotal,
      vout,
      dividerCurrent,
      vDropR1,
      vDropR2,
      powerR1,
      powerR2,
      totalPower,
      divisionRatio: Number(divisionRatio.toFixed(4)),
      ratioPercent: Number((divisionRatio * 100).toFixed(2)),
      formatted: {
        vin: Units.formatEngineering(vinBase, 'V').formatted,
        vout: Units.formatEngineering(vout, 'V').formatted,
        dividerCurrent: Units.formatEngineering(dividerCurrent, 'A').formatted,
        vDropR1: Units.formatEngineering(vDropR1, 'V').formatted,
        vDropR2: Units.formatEngineering(vDropR2, 'V').formatted,
        r1: Units.formatEngineering(r1Base, 'Ω').formatted,
        r2: Units.formatEngineering(r2Base, 'Ω').formatted,
        rl: rlBase ? Units.formatEngineering(rlBase, 'Ω').formatted : 'None',
        rTotal: Units.formatEngineering(rTotal, 'Ω').formatted,
        powerR1: Units.formatEngineering(powerR1, 'W').formatted,
        powerR2: Units.formatEngineering(powerR2, 'W').formatted,
        totalPower: Units.formatEngineering(totalPower, 'W').formatted,
        standardR1: standardR1 ? standardR1.formatted : 'N/A',
        standardR2: standardR2 ? standardR2.formatted : 'N/A'
      },
      steps
    };
  }

  return {
    calculateVoltageDivider
  };
}));

