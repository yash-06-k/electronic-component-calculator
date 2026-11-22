/**
 * smd-resistor.js - Surface Mount (SMD) Resistor Marking Code Calculator
 * Supports 3-Digit (5%), 4-Digit (1%), and EIA-96 (1% Precision) Standards
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.SmdResistorCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  // Standard EIA-96 Value Lookup Table (Indices 01 to 96)
  const EIA96_TABLE = {
    '01': 100, '02': 102, '03': 105, '04': 107, '05': 110, '06': 113, '07': 115, '08': 118,
    '09': 121, '10': 124, '11': 127, '12': 130, '13': 133, '14': 137, '15': 140, '16': 143,
    '17': 147, '18': 150, '19': 154, '20': 158, '21': 162, '22': 165, '23': 169, '24': 174,
    '25': 178, '26': 182, '27': 187, '28': 191, '29': 196, '30': 200, '31': 205, '32': 210,
    '33': 215, '34': 221, '35': 226, '36': 232, '37': 237, '38': 243, '39': 249, '40': 255,
    '41': 261, '42': 267, '43': 274, '44': 280, '45': 287, '46': 294, '47': 301, '48': 309,
    '49': 316, '50': 324, '51': 332, '52': 340, '53': 348, '54': 357, '55': 365, '56': 374,
    '57': 383, '58': 392, '59': 402, '60': 412, '61': 422, '62': 432, '63': 442, '64': 453,
    '65': 464, '66': 475, '67': 487, '68': 499, '69': 511, '70': 523, '71': 536, '72': 549,
    '73': 562, '74': 576, '75': 590, '76': 604, '77': 619, '78': 634, '79': 649, '80': 665,
    '81': 681, '82': 698, '83': 715, '84': 732, '85': 750, '86': 768, '87': 787, '88': 806,
    '89': 825, '90': 845, '91': 866, '92': 887, '93': 909, '94': 931, '95': 953, '96': 976
  };

  // EIA-96 Multiplier Letter Codes
  const EIA96_MULTIPLIERS = {
    'Z': 0.001,
    'Y': 0.01,
    'R': 0.01,
    'X': 0.1,
    'S': 0.1,
    'A': 1,
    'B': 10,
    'C': 100,
    'D': 1000,
    'E': 10000,
    'F': 100000
  };

  /**
   * Calculate resistance from an SMD resistor marking code.
   * Auto-detects 3-digit, 4-digit, or EIA-96 systems.
   * @param {string} code
   * @returns {Object}
   */
  function calculateSmdResistor(code) {
    if (!code || typeof code !== 'string') {
      throw new Error('Please enter an SMD resistor code (e.g. 472, 1001, 01A, 4R7).');
    }

    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      throw new Error('SMD resistor code cannot be empty.');
    }

    // Zero Ohm Jumper
    if (trimmed === '0' || trimmed === '00' || trimmed === '000' || trimmed === '0000') {
      return {
        success: true,
        code: trimmed,
        standard: 'Zero-Ohm Jumper',
        tolerance: '0% (Jumper)',
        ohms: 0,
        formatted: '0 Ω (Jumper)',
        inOhms: '0',
        inKiloOhms: '0',
        inMegaOhms: '0',
        explanation: `Code "${trimmed}" denotes a 0 Ω surface-mount jumper link used to bridge PCB traces.`
      };
    }

    // 1. EIA-96 System (2 digits + 1 letter, e.g. 01A, 68C, 12X)
    const eia96Match = trimmed.match(/^([0-9]{2})([A-Z])$/);
    if (eia96Match) {
      const numCode = eia96Match[1];
      const letter = eia96Match[2];

      const baseVal = EIA96_TABLE[numCode];
      const multVal = EIA96_MULTIPLIERS[letter];

      if (baseVal === undefined) {
        throw new Error(`Invalid EIA-96 code digits "${numCode}". Valid EIA-96 digits range from 01 to 96.`);
      }
      if (multVal === undefined) {
        throw new Error(`Invalid EIA-96 multiplier letter "${letter}". Valid letters are Z, Y, R, X, S, A, B, C, D, E, F.`);
      }

      const resistanceOhms = baseVal * multVal;
      const formatted = Units.formatEngineering(resistanceOhms, 'Ω');

      return {
        success: true,
        code: trimmed,
        standard: 'EIA-96 Precision SMD (1%)',
        tolerance: '±1%',
        ohms: resistanceOhms,
        formatted: formatted.formatted,
        inOhms: Units.formatNumber(resistanceOhms, 4),
        inKiloOhms: Units.formatNumber(resistanceOhms / 1e3, 6),
        inMegaOhms: Units.formatNumber(resistanceOhms / 1e6, 8),
        explanation: `EIA-96 Code "${trimmed}":\n` +
          `• Digits "${numCode}" lookup in EIA-96 table = ${baseVal}\n` +
          `• Multiplier letter "${letter}" = ×${multVal}\n` +
          `• Resistance = ${baseVal} × ${multVal} = ${formatted.formatted} (±1% tolerance)`
      };
    }

    // 2. Contains 'R' as decimal separator (e.g. 4R7 = 4.7 Ω, R100 = 0.100 Ω, 0R22 = 0.22 Ω)
    if (trimmed.includes('R')) {
      const rReplaced = trimmed.replace('R', '.');
      const parsedNum = parseFloat(rReplaced);

      if (isNaN(parsedNum) || parsedNum < 0) {
        throw new Error(`Invalid decimal SMD code "${trimmed}".`);
      }

      const isFourDigit = trimmed.length >= 4;
      const standard = isFourDigit ? '4-Digit High Precision SMD (1%)' : '3-Digit Standard SMD (5%)';
      const tolerance = isFourDigit ? '±1%' : '±5%';
      const formatted = Units.formatEngineering(parsedNum, 'Ω');

      return {
        success: true,
        code: trimmed,
        standard,
        tolerance,
        ohms: parsedNum,
        formatted: formatted.formatted,
        inOhms: Units.formatNumber(parsedNum, 4),
        inKiloOhms: Units.formatNumber(parsedNum / 1e3, 6),
        inMegaOhms: Units.formatNumber(parsedNum / 1e6, 8),
        explanation: `Code "${trimmed}" uses 'R' as a decimal point: ${parsedNum} Ω (${tolerance}).`
      };
    }

    // 3. Standard 3-Digit Code (e.g. 472 -> 47 * 10^2 = 4.7 kΩ)
    if (/^\d{3}$/.test(trimmed)) {
      const d1 = parseInt(trimmed[0], 10);
      const d2 = parseInt(trimmed[1], 10);
      const mult = parseInt(trimmed[2], 10);

      const baseDigits = d1 * 10 + d2;
      const resistanceOhms = baseDigits * Math.pow(10, mult);
      const formatted = Units.formatEngineering(resistanceOhms, 'Ω');

      return {
        success: true,
        code: trimmed,
        standard: '3-Digit Standard SMD (5%)',
        tolerance: '±5%',
        ohms: resistanceOhms,
        formatted: formatted.formatted,
        inOhms: Units.formatNumber(resistanceOhms, 4),
        inKiloOhms: Units.formatNumber(resistanceOhms / 1e3, 6),
        inMegaOhms: Units.formatNumber(resistanceOhms / 1e6, 8),
        explanation: `3-Digit SMD Code "${trimmed}":\n` +
          `• First 2 digits: ${d1}${d2}\n` +
          `• Multiplier: 10^${mult} = ${Math.pow(10, mult).toLocaleString()}\n` +
          `• Resistance: ${d1}${d2} × 10^${mult} = ${formatted.formatted} (±5% tolerance)`
      };
    }

    // 4. Standard 4-Digit Code (e.g. 1001 -> 100 * 10^1 = 1 kΩ)
    if (/^\d{4}$/.test(trimmed)) {
      const d1 = parseInt(trimmed[0], 10);
      const d2 = parseInt(trimmed[1], 10);
      const d3 = parseInt(trimmed[2], 10);
      const mult = parseInt(trimmed[3], 10);

      const baseDigits = d1 * 100 + d2 * 10 + d3;
      const resistanceOhms = baseDigits * Math.pow(10, mult);
      const formatted = Units.formatEngineering(resistanceOhms, 'Ω');

      return {
        success: true,
        code: trimmed,
        standard: '4-Digit Precision SMD (1%)',
        tolerance: '±1%',
        ohms: resistanceOhms,
        formatted: formatted.formatted,
        inOhms: Units.formatNumber(resistanceOhms, 4),
        inKiloOhms: Units.formatNumber(resistanceOhms / 1e3, 6),
        inMegaOhms: Units.formatNumber(resistanceOhms / 1e6, 8),
        explanation: `4-Digit SMD Code "${trimmed}":\n` +
          `• First 3 digits: ${d1}${d2}${d3}\n` +
          `• Multiplier: 10^${mult} = ${Math.pow(10, mult).toLocaleString()}\n` +
          `• Resistance: ${d1}${d2}${d3} × 10^${mult} = ${formatted.formatted} (±1% tolerance)`
      };
    }

    throw new Error(`Unrecognized SMD resistor marking "${trimmed}". Please enter a valid 3-digit, 4-digit, or EIA-96 code (e.g. 472, 1001, 01A, 4R7).`);
  }

  return {
    EIA96_TABLE,
    EIA96_MULTIPLIERS,
    calculateSmdResistor
  };
}));

