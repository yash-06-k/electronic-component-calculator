/**
 * units.js - Engineering Unit Conversion and Standard Component Value Utilities
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Units = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Standard E12 Resistor values (10% tolerance standard)
  const E12_SERIES = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];

  // Standard E24 Resistor values (5% tolerance standard)
  const E24_SERIES = [
    1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0,
    3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1
  ];

  // Unit conversion multipliers to SI base units
  const MULTIPLIERS = {
    // Resistance (Base: Ohms Ω)
    'mΩ': 1e-3,
    'Ω': 1,
    'kΩ': 1e3,
    'MΩ': 1e6,
    'GΩ': 1e9,

    // Voltage (Base: Volts V)
    'µV': 1e-6,
    'uV': 1e-6,
    'mV': 1e-3,
    'V': 1,
    'kV': 1e3,

    // Current (Base: Amperes A)
    'pA': 1e-12,
    'nA': 1e-9,
    'µA': 1e-6,
    'uA': 1e-6,
    'mA': 1e-3,
    'A': 1,
    'kA': 1e3,

    // Capacitance (Base: Farads F)
    'pF': 1e-12,
    'nF': 1e-9,
    'µF': 1e-6,
    'uF': 1e-6,
    'mF': 1e-3,
    'F': 1,

    // Power (Base: Watts W)
    'µW': 1e-6,
    'uW': 1e-6,
    'mW': 1e-3,
    'W': 1,
    'kW': 1e3,
    'MW': 1e6,

    // Inductance (Base: Henry H)
    'pH': 1e-12,
    'nH': 1e-9,
    'µH': 1e-6,
    'uH': 1e-6,
    'mH': 1e-3,
    'H': 1,

    // Frequency (Base: Hertz Hz)
    'Hz': 1,
    'kHz': 1e3,
    'MHz': 1e6,
    'GHz': 1e9
  };

  /**
   * Convert any value with a given unit to its SI base unit.
   * @param {number} value
   * @param {string} unit
   * @returns {number}
   */
  function toBaseUnit(value, unit) {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new Error('Value must be a valid number');
    }
    const cleanUnit = (unit || '').trim();
    const mult = MULTIPLIERS[cleanUnit];
    if (mult === undefined) {
      return value;
    }
    return value * mult;
  }

  /**
   * Convert a base unit value into a specific target unit.
   * @param {number} baseValue
   * @param {string} targetUnit
   * @returns {number}
   */
  function fromBaseUnit(baseValue, targetUnit) {
    if (typeof baseValue !== 'number' || isNaN(baseValue)) {
      throw new Error('Base value must be a valid number');
    }
    const cleanUnit = (targetUnit || '').trim();
    const mult = MULTIPLIERS[cleanUnit];
    if (mult === undefined || mult === 0) {
      return baseValue;
    }
    return baseValue / mult;
  }

  /**
   * Format a numerical value using Engineering SI Prefixes.
   * Automatically picks the best prefix (p, n, µ, m, base, k, M, G).
   * @param {number} value - Value in base unit (e.g. Ohms, Farads, Amperes)
   * @param {string} baseSymbol - Base unit symbol ('Ω', 'F', 'A', 'V', 'W', 'H', 'Hz')
   * @param {number} [sigFigs=4] - Significant digits
   * @returns {{ value: number, prefix: string, unit: string, formatted: string }}
   */
  function formatEngineering(value, baseSymbol = '', sigFigs = 4) {
    if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      return {
        value: 0,
        prefix: '',
        unit: baseSymbol,
        formatted: 'Invalid Value'
      };
    }

    if (value === 0) {
      return {
        value: 0,
        prefix: '',
        unit: baseSymbol,
        formatted: `0 ${baseSymbol}`.trim()
      };
    }

    const abs = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    // Standard SI prefixes
    const prefixes = [
      { exp: 1e12, sym: 'T' },
      { exp: 1e9, sym: 'G' },
      { exp: 1e6, sym: 'M' },
      { exp: 1e3, sym: 'k' },
      { exp: 1, sym: '' },
      { exp: 1e-3, sym: 'm' },
      { exp: 1e-6, sym: 'µ' },
      { exp: 1e-9, sym: 'n' },
      { exp: 1e-12, sym: 'p' },
      { exp: 1e-15, sym: 'f' }
    ];

    let chosen = prefixes.find(p => abs >= p.exp * 0.9999);
    if (!chosen) {
      // Extremely small value
      chosen = prefixes[prefixes.length - 1];
    }

    const scaled = value / chosen.exp;
    // Format nicely without redundant trailing zeros
    const rounded = Number(scaled.toPrecision(sigFigs));
    const fullUnit = `${chosen.sym}${baseSymbol}`;

    return {
      value: rounded,
      prefix: chosen.sym,
      unit: fullUnit,
      formatted: `${sign ? '' : ''}${rounded} ${fullUnit}`.trim()
    };
  }

  /**
   * Format a number cleanly without trailing scientific artifacts.
   * @param {number} num
   * @param {number} [decimals=4]
   * @returns {string}
   */
  function formatNumber(num, decimals = 4) {
    if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
      return '0';
    }
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(num * factor) / factor;
    // Remove trailing zeros in decimal representation
    return rounded.toString();
  }

  /**
   * Find nearest standard resistor value from E12 or E24 series.
   * @param {number} ohms - Target resistance in Ohms
   * @param {string} series - 'E12' or 'E24'
   * @returns {{ nearest: number, formatted: string, errorPercent: number, series: string }}
   */
  function getNearestStandardResistor(ohms, series = 'E24') {
    if (ohms <= 0 || !isFinite(ohms)) {
      return null;
    }

    const table = series.toUpperCase() === 'E12' ? E12_SERIES : E24_SERIES;
    const decade = Math.pow(10, Math.floor(Math.log10(ohms)));
    const normalized = ohms / decade;

    let closest = table[0];
    let minDiff = Math.abs(normalized - closest);

    for (let i = 1; i < table.length; i++) {
      const diff = Math.abs(normalized - table[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = table[i];
      }
    }

    // Check boundary with next decade
    const nextDecadeVal = table[0] * 10;
    if (Math.abs(normalized - nextDecadeVal) < minDiff) {
      closest = nextDecadeVal;
    }

    const standardValue = closest * decade;
    const errorPercent = ((standardValue - ohms) / ohms) * 100;

    return {
      nearest: standardValue,
      formatted: formatEngineering(standardValue, 'Ω').formatted,
      errorPercent: Number(errorPercent.toFixed(2)),
      series: series.toUpperCase()
    };
  }

  /**
   * Recommend standard commercial power rating with a 2x safety margin.
   * @param {number} calculatedWatts
   * @returns {{ rating: number, ratingStr: string, safetyFactor: number }}
   */
  function getRecommendedWattage(calculatedWatts) {
    if (calculatedWatts <= 0 || !isFinite(calculatedWatts)) {
      return { rating: 0.25, ratingStr: '1/4 W (0.25 W)', safetyFactor: 2 };
    }

    // Standard commercial ratings in Watts
    const ratings = [
      { watts: 0.125, label: '1/8 W (0.125 W)' },
      { watts: 0.25,  label: '1/4 W (0.25 W)' },
      { watts: 0.5,   label: '1/2 W (0.5 W)' },
      { watts: 1.0,   label: '1 W' },
      { watts: 2.0,   label: '2 W' },
      { watts: 3.0,   label: '3 W' },
      { watts: 5.0,   label: '5 W' },
      { watts: 10.0,  label: '10 W' },
      { watts: 25.0,  label: '25 W' }
    ];

    // Standard engineering practice recommends operating resistors at 50% max rating (2x factor)
    const requiredWithMargin = calculatedWatts * 2;

    for (const r of ratings) {
      if (r.watts >= requiredWithMargin) {
        return {
          rating: r.watts,
          ratingStr: r.label,
          safetyFactor: Number((r.watts / calculatedWatts).toFixed(1))
        };
      }
    }

    // Larger power resistor required
    const customRating = Math.ceil(requiredWithMargin);
    return {
      rating: customRating,
      ratingStr: `${customRating} W (High Power)`,
      safetyFactor: Number((customRating / calculatedWatts).toFixed(1))
    };
  }

  return {
    MULTIPLIERS,
    E12_SERIES,
    E24_SERIES,
    toBaseUnit,
    fromBaseUnit,
    formatEngineering,
    formatNumber,
    getNearestStandardResistor,
    getRecommendedWattage
  };
}));

