/**
 * series-parallel.js - Series & Parallel Resistor Network Calculator
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.SeriesParallelCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  /**
   * Calculate Series Resistors equivalent resistance.
   * @param {Array<{value: number|string, unit: string}>} resistors
   * @param {number|string} [voltageSupply] - Optional supply voltage for branch calculations
   * @param {string} [voltageUnit='V']
   * @returns {Object}
   */
  function calculateSeriesResistance(resistors, voltageSupply = '', voltageUnit = 'V') {
    if (!resistors || !Array.isArray(resistors) || resistors.length === 0) {
      throw new Error('Please enter at least one resistor value.');
    }

    const parsed = [];
    let rTotal = 0;

    for (let i = 0; i < resistors.length; i++) {
      const item = resistors[i];
      if (item.value === '' || item.value === null || item.value === undefined) {
        throw new Error(`Resistor R${i + 1} cannot be empty.`);
      }
      const num = Number(item.value);
      if (isNaN(num) || !isFinite(num)) {
        throw new Error(`Resistor R${i + 1} must be a valid number.`);
      }
      if (num < 0) {
        throw new Error(`Resistor R${i + 1} cannot be negative.`);
      }

      const baseOhms = Units.toBaseUnit(num, item.unit || 'Ω');
      parsed.push({
        id: i + 1,
        inputVal: num,
        inputUnit: item.unit || 'Ω',
        ohms: baseOhms,
        formatted: Units.formatEngineering(baseOhms, 'Ω').formatted
      });
      rTotal += baseOhms;
    }

    // Optional circuit analysis if supply voltage provided
    let hasVoltage = voltageSupply !== '' && voltageSupply !== null && voltageSupply !== undefined;
    let vSupplyBase = 0;
    let circuitCurrent = 0;
    let branchDetails = [];

    if (hasVoltage) {
      const vNum = Number(voltageSupply);
      if (isNaN(vNum) || !isFinite(vNum)) {
        throw new Error('Supply voltage must be a valid number.');
      }
      vSupplyBase = Units.toBaseUnit(vNum, voltageUnit);
      if (rTotal > 0) {
        circuitCurrent = vSupplyBase / rTotal;
        branchDetails = parsed.map(r => {
          const vDrop = circuitCurrent * r.ohms;
          const power = Math.pow(circuitCurrent, 2) * r.ohms;
          return {
            id: r.id,
            resistance: r.formatted,
            voltageDrop: Units.formatEngineering(vDrop, 'V').formatted,
            power: Units.formatEngineering(power, 'W').formatted
          };
        });
      }
    }

    const formattedTotal = Units.formatEngineering(rTotal, 'Ω');
    const standardE24 = rTotal > 0 ? Units.getNearestStandardResistor(rTotal, 'E24') : null;

    const steps = [
      `Series Formula: R_total = R1 + R2 + ... + Rn`,
      `Values: ${parsed.map(r => r.formatted).join(' + ')}`,
      `Total Equivalent Resistance: R_total = ${formattedTotal.formatted} (${Units.formatNumber(rTotal, 4)} Ω)`
    ];

    if (hasVoltage && rTotal > 0) {
      steps.push(
        `Series Circuit Current: I = V_supply / R_total = ${Units.formatEngineering(vSupplyBase, 'V').formatted} / ${formattedTotal.formatted} = ${Units.formatEngineering(circuitCurrent, 'A').formatted}`
      );
    }

    return {
      success: true,
      networkType: 'series',
      count: parsed.length,
      resistors: parsed,
      rTotal,
      formattedTotal: formattedTotal.formatted,
      inOhms: Units.formatNumber(rTotal, 4),
      inKiloOhms: Units.formatNumber(rTotal / 1e3, 6),
      inMegaOhms: Units.formatNumber(rTotal / 1e6, 8),
      standardResistor: standardE24 ? standardE24.formatted : 'N/A',
      hasVoltage,
      vSupply: vSupplyBase,
      formattedVSupply: hasVoltage ? Units.formatEngineering(vSupplyBase, 'V').formatted : null,
      circuitCurrent,
      formattedCurrent: hasVoltage ? Units.formatEngineering(circuitCurrent, 'A').formatted : null,
      branches: branchDetails,
      steps
    };
  }

  /**
   * Calculate Parallel Resistors equivalent resistance.
   * @param {Array<{value: number|string, unit: string}>} resistors
   * @param {number|string} [voltageSupply] - Optional supply voltage for branch calculations
   * @param {string} [voltageUnit='V']
   * @returns {Object}
   */
  function calculateParallelResistance(resistors, voltageSupply = '', voltageUnit = 'V') {
    if (!resistors || !Array.isArray(resistors) || resistors.length === 0) {
      throw new Error('Please enter at least one resistor value.');
    }

    const parsed = [];
    let sumConductance = 0;
    let hasZeroOhm = false;

    for (let i = 0; i < resistors.length; i++) {
      const item = resistors[i];
      if (item.value === '' || item.value === null || item.value === undefined) {
        throw new Error(`Resistor R${i + 1} cannot be empty.`);
      }
      const num = Number(item.value);
      if (isNaN(num) || !isFinite(num)) {
        throw new Error(`Resistor R${i + 1} must be a valid number.`);
      }
      if (num < 0) {
        throw new Error(`Resistor R${i + 1} cannot be negative.`);
      }

      const baseOhms = Units.toBaseUnit(num, item.unit || 'Ω');
      parsed.push({
        id: i + 1,
        inputVal: num,
        inputUnit: item.unit || 'Ω',
        ohms: baseOhms,
        formatted: Units.formatEngineering(baseOhms, 'Ω').formatted
      });

      if (baseOhms === 0) {
        hasZeroOhm = true;
      } else {
        sumConductance += 1 / baseOhms;
      }
    }

    let rTotal = 0;
    if (hasZeroOhm) {
      // A zero ohm resistor in parallel shorts out the whole network
      rTotal = 0;
    } else if (sumConductance > 0) {
      rTotal = 1 / sumConductance;
    }

    // Optional circuit analysis if supply voltage provided
    let hasVoltage = voltageSupply !== '' && voltageSupply !== null && voltageSupply !== undefined;
    let vSupplyBase = 0;
    let totalCurrent = 0;
    let branchDetails = [];

    if (hasVoltage) {
      const vNum = Number(voltageSupply);
      if (isNaN(vNum) || !isFinite(vNum)) {
        throw new Error('Supply voltage must be a valid number.');
      }
      vSupplyBase = Units.toBaseUnit(vNum, voltageUnit);

      if (hasZeroOhm) {
        totalCurrent = Infinity;
      } else if (rTotal > 0) {
        totalCurrent = vSupplyBase / rTotal;
        branchDetails = parsed.map(r => {
          const bCurrent = r.ohms > 0 ? vSupplyBase / r.ohms : 0;
          const power = vSupplyBase * bCurrent;
          return {
            id: r.id,
            resistance: r.formatted,
            branchCurrent: Units.formatEngineering(bCurrent, 'A').formatted,
            power: Units.formatEngineering(power, 'W').formatted
          };
        });
      }
    }

    const formattedTotal = Units.formatEngineering(rTotal, 'Ω');
    const standardE24 = rTotal > 0 ? Units.getNearestStandardResistor(rTotal, 'E24') : null;

    let formulaStep = '';
    if (parsed.length === 2 && !hasZeroOhm) {
      formulaStep = `Two Resistors Formula: R_total = (R1 × R2) / (R1 + R2) = (${parsed[0].formatted} × ${parsed[1].formatted}) / (${parsed[0].formatted} + ${parsed[1].formatted})`;
    } else {
      formulaStep = `Parallel Formula: 1 / R_total = 1/R1 + 1/R2 + ... + 1/Rn\nSum of Conductances (G_total) = ${Units.formatNumber(sumConductance, 6)} S (Siemens)`;
    }

    const steps = [
      formulaStep,
      hasZeroOhm
        ? 'A 0 Ω resistor creates a short circuit across the parallel branches, pulling R_total to 0 Ω.'
        : `Equivalent Parallel Resistance: R_total = 1 / G_total = ${formattedTotal.formatted} (${Units.formatNumber(rTotal, 4)} Ω)`
    ];

    if (hasVoltage && rTotal > 0) {
      steps.push(
        `Total Parallel Circuit Current: I_total = V_supply / R_total = ${Units.formatEngineering(vSupplyBase, 'V').formatted} / ${formattedTotal.formatted} = ${Units.formatEngineering(totalCurrent, 'A').formatted}`
      );
    }

    return {
      success: true,
      networkType: 'parallel',
      count: parsed.length,
      resistors: parsed,
      rTotal,
      hasZeroOhm,
      formattedTotal: formattedTotal.formatted,
      inOhms: Units.formatNumber(rTotal, 4),
      inKiloOhms: Units.formatNumber(rTotal / 1e3, 6),
      inMegaOhms: Units.formatNumber(rTotal / 1e6, 8),
      standardResistor: standardE24 ? standardE24.formatted : 'N/A',
      hasVoltage,
      vSupply: vSupplyBase,
      formattedVSupply: hasVoltage ? Units.formatEngineering(vSupplyBase, 'V').formatted : null,
      totalCurrent,
      formattedCurrent: hasVoltage && isFinite(totalCurrent) ? Units.formatEngineering(totalCurrent, 'A').formatted : (hasZeroOhm ? 'Infinite (Short circuit)' : null),
      branches: branchDetails,
      steps
    };
  }

  return {
    calculateSeriesResistance,
    calculateParallelResistance
  };
}));

