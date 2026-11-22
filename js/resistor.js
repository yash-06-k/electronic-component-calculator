/**
 * resistor.js - Resistor Color Code Calculator & Value Converter
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.ResistorCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  // Standard Resistor Color Code Specification
  const COLOR_DATA = {
    black: {
      name: 'Black',
      hex: '#1e2022',
      border: '#3d444b',
      text: '#ffffff',
      digit: 0,
      multiplier: 1, // 10^0
      tolerance: null,
      tempCoeff: 250
    },
    brown: {
      name: 'Brown',
      hex: '#795548',
      border: '#5d4037',
      text: '#ffffff',
      digit: 1,
      multiplier: 10, // 10^1
      tolerance: 1, // ±1%
      tempCoeff: 100
    },
    red: {
      name: 'Red',
      hex: '#e53935',
      border: '#c62828',
      text: '#ffffff',
      digit: 2,
      multiplier: 100, // 10^2
      tolerance: 2, // ±2%
      tempCoeff: 50
    },
    orange: {
      name: 'Orange',
      hex: '#ff9800',
      border: '#ef6c00',
      text: '#000000',
      digit: 3,
      multiplier: 1000, // 10^3
      tolerance: 0.05, // ±0.05%
      tempCoeff: 15
    },
    yellow: {
      name: 'Yellow',
      hex: '#ffeb3b',
      border: '#fbc02d',
      text: '#000000',
      digit: 4,
      multiplier: 10000, // 10^4
      tolerance: 0.02, // ±0.02%
      tempCoeff: 25
    },
    green: {
      name: 'Green',
      hex: '#43a047',
      border: '#2e7d32',
      text: '#ffffff',
      digit: 5,
      multiplier: 100000, // 10^5
      tolerance: 0.5, // ±0.5%
      tempCoeff: 20
    },
    blue: {
      name: 'Blue',
      hex: '#1e88e5',
      border: '#1565c0',
      text: '#ffffff',
      digit: 6,
      multiplier: 1000000, // 10^6
      tolerance: 0.25, // ±0.25%
      tempCoeff: 10
    },
    violet: {
      name: 'Violet',
      hex: '#8e24aa',
      border: '#6a1b9a',
      text: '#ffffff',
      digit: 7,
      multiplier: 10000000, // 10^7
      tolerance: 0.1, // ±0.1%
      tempCoeff: 5
    },
    grey: {
      name: 'Grey',
      hex: '#78909c',
      border: '#546e7a',
      text: '#ffffff',
      digit: 8,
      multiplier: 100000000, // 10^8
      tolerance: 0.01, // ±0.01%
      tempCoeff: 1
    },
    white: {
      name: 'White',
      hex: '#f5f5f5',
      border: '#cccccc',
      text: '#000000',
      digit: 9,
      multiplier: 1000000000, // 10^9
      tolerance: null,
      tempCoeff: null
    },
    gold: {
      name: 'Gold',
      hex: '#d4af37',
      border: '#b89628',
      text: '#000000',
      digit: null,
      multiplier: 0.1, // 10^-1
      tolerance: 5, // ±5%
      tempCoeff: null
    },
    silver: {
      name: 'Silver',
      hex: '#c0c0c0',
      border: '#9e9e9e',
      text: '#000000',
      digit: null,
      multiplier: 0.01, // 10^-2
      tolerance: 10, // ±10%
      tempCoeff: null
    }
  };

  /**
   * Get valid color options for a specific band role.
   * Prevents invalid combinations as required.
   */
  function getValidColorsForBand(bandRole) {
    const list = Object.keys(COLOR_DATA);
    switch (bandRole) {
      case 'first-digit':
        // 1st digit can only be 1-9 (Black, Gold, Silver cannot be 1st digit)
        return list.filter(c => COLOR_DATA[c].digit !== null && COLOR_DATA[c].digit > 0);
      case 'digit':
        // Subsequent digits can be 0-9
        return list.filter(c => COLOR_DATA[c].digit !== null);
      case 'multiplier':
        // Multiplier covers 0.01 to 10^9 (all except none)
        return list.filter(c => COLOR_DATA[c].multiplier !== null);
      case 'tolerance':
        // Valid tolerance bands
        return list.filter(c => COLOR_DATA[c].tolerance !== null);
      case 'tempCoeff':
        // Valid temp coefficient bands (ppm/K)
        return list.filter(c => COLOR_DATA[c].tempCoeff !== null);
      default:
        return list;
    }
  }

  /**
   * Calculate resistance and tolerances from color bands.
   * @param {string[]} bands - Array of color names in order
   * @param {number} bandCount - 4, 5, or 6
   * @returns {Object} Calculated values, ranges, and details
   */
  function calculateResistorColorCode(bands, bandCount = 4) {
    if (!bands || !Array.isArray(bands)) {
      throw new Error('Please select valid resistor color bands.');
    }

    if (bandCount !== 4 && bandCount !== 5 && bandCount !== 6) {
      throw new Error('Supported band counts are 4, 5, or 6 bands.');
    }

    if (bands.length < bandCount) {
      throw new Error(`Please select all ${bandCount} bands for calculation.`);
    }

    // Verify all colors exist
    for (let i = 0; i < bandCount; i++) {
      const color = bands[i];
      if (!COLOR_DATA[color]) {
        throw new Error(`Unknown color band: "${color}" at position ${i + 1}.`);
      }
    }

    let digit1, digit2, digit3 = null, multiplierColor, toleranceColor, tempCoeffColor = null;

    if (bandCount === 4) {
      // 4-band: Digit 1, Digit 2, Multiplier, Tolerance
      const b1 = COLOR_DATA[bands[0]];
      const b2 = COLOR_DATA[bands[1]];
      multiplierColor = COLOR_DATA[bands[2]];
      toleranceColor = COLOR_DATA[bands[3]];

      if (b1.digit === null || b1.digit === 0) {
        throw new Error('The first band of a resistor cannot be black, gold, or silver.');
      }
      if (b2.digit === null) {
        throw new Error('The second band must represent a valid digit (0-9).');
      }
      if (multiplierColor.multiplier === null) {
        throw new Error('The third band must be a valid multiplier.');
      }
      if (toleranceColor.tolerance === null) {
        throw new Error('The fourth band must be a valid tolerance color.');
      }

      digit1 = b1.digit;
      digit2 = b2.digit;
      const baseDigits = digit1 * 10 + digit2;
      const resistanceOhms = baseDigits * multiplierColor.multiplier;
      const tolerancePercent = toleranceColor.tolerance;
      const minOhms = resistanceOhms * (1 - tolerancePercent / 100);
      const maxOhms = resistanceOhms * (1 + tolerancePercent / 100);

      const formatted = Units.formatEngineering(resistanceOhms, 'Ω');
      const minFormatted = Units.formatEngineering(minOhms, 'Ω');
      const maxFormatted = Units.formatEngineering(maxOhms, 'Ω');

      return {
        success: true,
        bandCount: 4,
        bands: bands.slice(0, 4),
        digit1,
        digit2,
        multiplier: multiplierColor.multiplier,
        multiplierLabel: multiplierColor.name,
        tolerancePercent,
        toleranceLabel: `±${tolerancePercent}%`,
        tempCoeff: null,
        tempCoeffLabel: null,
        resistanceOhms,
        formattedResistance: formatted.formatted,
        rawResistanceStr: `${Units.formatNumber(resistanceOhms)} Ω`,
        minOhms,
        maxOhms,
        minFormatted: minFormatted.formatted,
        maxFormatted: maxFormatted.formatted,
        rangeFormatted: `${minFormatted.formatted} – ${maxFormatted.formatted}`,
        explanation: `Resistance = (${digit1}${digit2}) × 10^${Math.round(Math.log10(multiplierColor.multiplier))} = ${formatted.formatted} ±${tolerancePercent}%`
      };
    } else if (bandCount === 5 || bandCount === 6) {
      // 5-band / 6-band: Digit 1, Digit 2, Digit 3, Multiplier, Tolerance, [TempCoeff]
      const b1 = COLOR_DATA[bands[0]];
      const b2 = COLOR_DATA[bands[1]];
      const b3 = COLOR_DATA[bands[2]];
      multiplierColor = COLOR_DATA[bands[3]];
      toleranceColor = COLOR_DATA[bands[4]];

      if (b1.digit === null || b1.digit === 0) {
        throw new Error('The first band cannot be black, gold, or silver.');
      }
      if (b2.digit === null || b3.digit === null) {
        throw new Error('The first 3 bands must represent valid digits (0-9).');
      }
      if (multiplierColor.multiplier === null) {
        throw new Error('The multiplier band is invalid.');
      }
      if (toleranceColor.tolerance === null) {
        throw new Error('The tolerance band is invalid.');
      }

      digit1 = b1.digit;
      digit2 = b2.digit;
      digit3 = b3.digit;

      let tempCoeffVal = null;
      let tempCoeffStr = null;
      if (bandCount === 6) {
        tempCoeffColor = COLOR_DATA[bands[5]];
        if (!tempCoeffColor || tempCoeffColor.tempCoeff === null) {
          throw new Error('The sixth band must be a valid temperature coefficient color.');
        }
        tempCoeffVal = tempCoeffColor.tempCoeff;
        tempCoeffStr = `${tempCoeffVal} ppm/K`;
      }

      const baseDigits = digit1 * 100 + digit2 * 10 + digit3;
      const resistanceOhms = baseDigits * multiplierColor.multiplier;
      const tolerancePercent = toleranceColor.tolerance;
      const minOhms = resistanceOhms * (1 - tolerancePercent / 100);
      const maxOhms = resistanceOhms * (1 + tolerancePercent / 100);

      const formatted = Units.formatEngineering(resistanceOhms, 'Ω');
      const minFormatted = Units.formatEngineering(minOhms, 'Ω');
      const maxFormatted = Units.formatEngineering(maxOhms, 'Ω');

      return {
        success: true,
        bandCount,
        bands: bands.slice(0, bandCount),
        digit1,
        digit2,
        digit3,
        multiplier: multiplierColor.multiplier,
        multiplierLabel: multiplierColor.name,
        tolerancePercent,
        toleranceLabel: `±${tolerancePercent}%`,
        tempCoeff: tempCoeffVal,
        tempCoeffLabel: tempCoeffStr,
        resistanceOhms,
        formattedResistance: formatted.formatted,
        rawResistanceStr: `${Units.formatNumber(resistanceOhms)} Ω`,
        minOhms,
        maxOhms,
        minFormatted: minFormatted.formatted,
        maxFormatted: maxFormatted.formatted,
        rangeFormatted: `${minFormatted.formatted} – ${maxFormatted.formatted}`,
        explanation: `Resistance = (${digit1}${digit2}${digit3}) × 10^${Math.round(Math.log10(multiplierColor.multiplier))} = ${formatted.formatted} ±${tolerancePercent}%${tempCoeffStr ? ` (${tempCoeffStr})` : ''}`
      };
    }
  }

  /**
   * Resistor Value Calculator / Unit Converter (Requirement 6)
   * Converts resistance into Ω, kΩ, MΩ with full validation.
   */
  function convertResistorValue(valInput, unitInput) {
    if (valInput === undefined || valInput === null || valInput === '') {
      throw new Error('Please enter a resistance value.');
    }

    const num = Number(valInput);
    if (isNaN(num)) {
      throw new Error('Resistance value must be a valid number.');
    }
    if (num < 0) {
      throw new Error('Resistance cannot be negative.');
    }
    if (num === 0) {
      throw new Error('Resistance must be greater than zero.');
    }
    if (!isFinite(num)) {
      throw new Error('Resistance value is too large or invalid.');
    }

    const baseOhms = Units.toBaseUnit(num, unitInput);
    const inOhms = Units.fromBaseUnit(baseOhms, 'Ω');
    const inKiloOhms = Units.fromBaseUnit(baseOhms, 'kΩ');
    const inMegaOhms = Units.fromBaseUnit(baseOhms, 'MΩ');
    const formattedSI = Units.formatEngineering(baseOhms, 'Ω');
    const standardE24 = Units.getNearestStandardResistor(baseOhms, 'E24');

    return {
      success: true,
      input: { value: num, unit: unitInput },
      baseOhms,
      inOhms: Units.formatNumber(inOhms, 4),
      inKiloOhms: Units.formatNumber(inKiloOhms, 6),
      inMegaOhms: Units.formatNumber(inMegaOhms, 8),
      formattedSI: formattedSI.formatted,
      nearestStandard: standardE24 ? standardE24.formatted : 'N/A'
    };
  }

  /**
   * Reverse Lookup: Given a resistance in Ohms, find the 4-band or 5-band color sequence.
   * Useful bonus for student demonstrations!
   */
  function resistanceToColorCode(ohms, bandCount = 4, tolerance = 5) {
    if (ohms <= 0 || !isFinite(ohms)) {
      return null;
    }

    const digitColors = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];
    const multEntries = [
      { exp: -2, name: 'silver' },
      { exp: -1, name: 'gold' },
      { exp: 0,  name: 'black' },
      { exp: 1,  name: 'brown' },
      { exp: 2,  name: 'red' },
      { exp: 3,  name: 'orange' },
      { exp: 4,  name: 'yellow' },
      { exp: 5,  name: 'green' },
      { exp: 6,  name: 'blue' },
      { exp: 7,  name: 'violet' },
      { exp: 8,  name: 'grey' },
      { exp: 9,  name: 'white' }
    ];

    let digitsCount = bandCount === 4 ? 2 : 3;
    let exp = Math.floor(Math.log10(ohms)) - (digitsCount - 1);

    // Normalize to integer digits
    let digitsVal = Math.round(ohms / Math.pow(10, exp));
    if (digitsVal >= Math.pow(10, digitsCount)) {
      digitsVal = Math.round(digitsVal / 10);
      exp++;
    }

    const dStr = digitsVal.toString().padStart(digitsCount, '0');
    const bands = [];

    for (let char of dStr) {
      bands.push(digitColors[parseInt(char, 10)]);
    }

    const multMatch = multEntries.find(m => m.exp === exp);
    if (!multMatch) return null;
    bands.push(multMatch.name);

    // Map tolerance
    const tolMap = {
      1: 'brown',
      2: 'red',
      0.5: 'green',
      0.25: 'blue',
      0.1: 'violet',
      5: 'gold',
      10: 'silver'
    };
    bands.push(tolMap[tolerance] || 'gold');

    if (bandCount === 6) {
      bands.push('brown'); // 100 ppm/K default
    }

    return bands;
  }

  return {
    COLOR_DATA,
    getValidColorsForBand,
    calculateResistorColorCode,
    convertResistorValue,
    resistanceToColorCode
  };
}));

