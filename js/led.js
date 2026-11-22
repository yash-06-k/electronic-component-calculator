/**
 * led.js - LED Series Resistor and Power Calculator
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.LedCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  // Common LED presets (Forward voltage and recommended current)
  const LED_PRESETS = [
    { id: 'red', name: 'Red (Standard)', vf: 2.0, if_mA: 20, color: '#f44336' },
    { id: 'green', name: 'Green (Standard)', vf: 2.2, if_mA: 20, color: '#4caf50' },
    { id: 'yellow', name: 'Yellow / Amber', vf: 2.1, if_mA: 20, color: '#ffb300' },
    { id: 'blue', name: 'Blue (Standard)', vf: 3.2, if_mA: 20, color: '#2196f3' },
    { id: 'white', name: 'White (Ultra Bright)', vf: 3.2, if_mA: 20, color: '#ffffff' },
    { id: 'warm-white', name: 'Warm White', vf: 3.0, if_mA: 20, color: '#fff9c4' },
    { id: 'uv', name: 'UV / Purple', vf: 3.4, if_mA: 20, color: '#9c27b0' },
    { id: 'ir', name: 'Infrared (IR LED)', vf: 1.4, if_mA: 20, color: '#795548' },
    { id: 'high-power-1w', name: 'High Power 1W White', vf: 3.4, if_mA: 300, color: '#e0e0e0' }
  ];

  /**
   * Calculate LED Series Resistor, Standard E24 Resistor, and Power Dissipation.
   * @param {number|string} vSupply - Supply voltage (V)
   * @param {number|string} vLed - LED forward voltage (V)
   * @param {number|string} iLed_mA - LED forward current (mA)
   * @param {number} [ledCount=1] - Number of LEDs in series (default 1)
   * @returns {Object}
   */
  function calculateLedResistor(vSupply, vLed, iLed_mA, ledCount = 1) {
    // Validate existence
    if (vSupply === '' || vSupply === null || vSupply === undefined) {
      throw new Error('Please enter the supply voltage (V_supply).');
    }
    if (vLed === '' || vLed === null || vLed === undefined) {
      throw new Error('Please enter the LED forward voltage (V_LED).');
    }
    if (iLed_mA === '' || iLed_mA === null || iLed_mA === undefined) {
      throw new Error('Please enter the LED current (I_LED).');
    }

    const Vs = Number(vSupply);
    const Vf = Number(vLed);
    const ImA = Number(iLed_mA);
    const count = parseInt(ledCount, 10) || 1;

    // Numerical checks
    if (isNaN(Vs) || !isFinite(Vs)) {
      throw new Error('Supply voltage must be a valid number.');
    }
    if (isNaN(Vf) || !isFinite(Vf)) {
      throw new Error('LED forward voltage must be a valid number.');
    }
    if (isNaN(ImA) || !isFinite(ImA)) {
      throw new Error('LED current must be a valid number.');
    }
    if (count < 1) {
      throw new Error('Number of series LEDs must be at least 1.');
    }

    // Physical constraint validations
    if (Vs <= 0) {
      throw new Error('Supply voltage must be greater than 0 V.');
    }
    if (Vf <= 0) {
      throw new Error('LED forward voltage must be greater than 0 V.');
    }
    if (ImA <= 0) {
      throw new Error('LED current must be greater than 0 mA.');
    }

    const totalVf = Vf * count;

    if (Vs < totalVf) {
      throw new Error(
        `Supply voltage (${Vs} V) is less than the required LED forward voltage (${totalVf} V for ${count} LED${count > 1 ? 's' : ''}). The LED cannot turn on without sufficient voltage.`
      );
    }

    if (Vs === totalVf) {
      throw new Error(
        `Supply voltage (${Vs} V) is exactly equal to LED forward voltage (${totalVf} V). Without a voltage drop across the resistor, current cannot be stabilized. Use a supply voltage higher than ${totalVf} V.`
      );
    }

    if (ImA > 10000) {
      throw new Error('LED current cannot exceed 10,000 mA (10 A) for standard circuits.');
    }

    // Calculations
    const vDrop = Vs - totalVf; // Voltage drop across resistor (V)
    const iAmperes = ImA / 1000; // Current in Amperes (A)
    const exactResistance = vDrop / iAmperes; // Ohms (Ω)
    const resistorPowerWatts = vDrop * iAmperes; // Watts (W) = I^2 * R
    const ledPowerWatts = totalVf * iAmperes; // Watts (W) = Vf * I
    const totalPowerWatts = Vs * iAmperes; // Watts (W) = Vs * I

    // Standard resistor recommendations
    const standardE24 = Units.getNearestStandardResistor(exactResistance, 'E24');
    const standardE12 = Units.getNearestStandardResistor(exactResistance, 'E12');
    const wattageRec = Units.getRecommendedWattage(resistorPowerWatts);

    // Actual current if standard E24 resistor is used:
    const actualCurrentAmps = standardE24 ? vDrop / standardE24.nearest : iAmperes;
    const actualCurrent_mA = actualCurrentAmps * 1000;

    // Formatting
    const resFormatted = Units.formatEngineering(exactResistance, 'Ω');
    const pResFormatted = Units.formatEngineering(resistorPowerWatts, 'W');
    const pLedFormatted = Units.formatEngineering(ledPowerWatts, 'W');

    const steps = [
      `1. Total LED Forward Voltage Drop: V_total_LED = ${count} × ${Vf} V = ${Units.formatNumber(totalVf)} V`,
      `2. Resistor Voltage Drop: V_resistor = V_supply - V_total_LED = ${Vs} V - ${Units.formatNumber(totalVf)} V = ${Units.formatNumber(vDrop, 3)} V`,
      `3. Resistor Value: R = V_resistor / I = ${Units.formatNumber(vDrop, 3)} V / ${iAmperes} A = ${resFormatted.formatted}`,
      `4. Resistor Power Dissipated: P_R = V_resistor × I = ${Units.formatNumber(vDrop, 3)} V × ${iAmperes} A = ${pResFormatted.formatted}`,
      `5. Recommended Rating: ${wattageRec.ratingStr} (providing safety factor ~${wattageRec.safetyFactor}x to prevent overheating)`
    ];

    return {
      success: true,
      inputs: {
        vSupply: Vs,
        vLed: Vf,
        iLed_mA: ImA,
        ledCount: count
      },
      vDrop: Units.formatNumber(vDrop, 3),
      totalVf: Units.formatNumber(totalVf, 3),
      exactResistanceOhms: exactResistance,
      formattedResistance: resFormatted.formatted,
      rawResistanceStr: `${Units.formatNumber(exactResistance, 2)} Ω`,
      standardE24: standardE24 ? standardE24.formatted : 'N/A',
      standardE12: standardE12 ? standardE12.formatted : 'N/A',
      standardE24Ohms: standardE24 ? standardE24.nearest : null,
      actualCurrent_mA: Units.formatNumber(actualCurrent_mA, 2),
      resistorPowerWatts,
      formattedPower: pResFormatted.formatted,
      ledPowerWatts,
      formattedLedPower: pLedFormatted.formatted,
      totalPowerWatts,
      recommendedWattage: wattageRec.ratingStr,
      steps
    };
  }

  return {
    LED_PRESETS,
    calculateLedResistor
  };
}));

