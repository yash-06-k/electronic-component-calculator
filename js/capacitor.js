/**
 * capacitor.js - Capacitor Code Converter & Value Calculator
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('./units.js'));
  } else {
    root.CapacitorCalc = factory(root.Units);
  }
}(typeof self !== 'undefined' ? self : this, function (Units) {
  'use strict';

  // Standard tolerance letter codes for capacitors
  const TOLERANCE_CODES = {
    'B': { code: 'B', desc: '±0.1 pF', percent: null, absolute: 0.1 },
    'C': { code: 'C', desc: '±0.25 pF', percent: null, absolute: 0.25 },
    'D': { code: 'D', desc: '±0.5 pF', percent: null, absolute: 0.5 },
    'F': { code: 'F', desc: '±1%', percent: 1, absolute: null },
    'G': { code: 'G', desc: '±2%', percent: 2, absolute: null },
    'J': { code: 'J', desc: '±5%', percent: 5, absolute: null },
    'K': { code: 'K', desc: '±10%', percent: 10, absolute: null },
    'M': { code: 'M', desc: '±20%', percent: 20, absolute: null },
    'Z': { code: 'Z', desc: '+80% / -20%', percent: 80, absolute: null }
  };

  /**
   * Decode a 3-digit capacitor EIA code (e.g., '104', '103', '472', '220', '4R7').
   * Supports optional tolerance letter suffix (e.g., '104J', '103K').
   * @param {string} codeInput
   * @returns {Object}
   */
  function calculateCapacitor(codeInput) {
    if (!codeInput || typeof codeInput !== 'string') {
      throw new Error('Please enter a 3-digit capacitor code (e.g. 104, 103, 472).');
    }

    const trimmed = codeInput.trim().toUpperCase();
    if (!trimmed) {
      throw new Error('Capacitor code cannot be empty.');
    }

    // Check for 'R' decimal representation (e.g. 4R7 = 4.7 pF)
    const rMatch = trimmed.match(/^([0-9])R([0-9])([A-Z])?$/);
    if (rMatch) {
      const valPicofarad = parseFloat(`${rMatch[1]}.${rMatch[2]}`);
      const tolLetter = rMatch[3] || null;
      const tolInfo = tolLetter && TOLERANCE_CODES[tolLetter] ? TOLERANCE_CODES[tolLetter] : null;

      const pF = valPicofarad;
      const nF = pF / 1000;
      const uF = pF / 1000000;
      const baseFarads = pF * 1e-12;

      return {
        success: true,
        code: trimmed,
        firstDigit: parseInt(rMatch[1], 10),
        secondDigit: parseInt(rMatch[2], 10),
        multiplierPower: 0,
        multiplierVal: 1,
        toleranceCode: tolLetter,
        toleranceInfo: tolInfo ? tolInfo.desc : 'Not specified',
        baseFarads,
        pF: Units.formatNumber(pF, 4),
        nF: Units.formatNumber(nF, 6),
        uF: Units.formatNumber(uF, 9),
        formattedSI: Units.formatEngineering(baseFarads, 'F').formatted,
        explanation: `Code "${trimmed}" uses 'R' as a decimal point: ${rMatch[1]}.${rMatch[2]} pF.`
      };
    }

    // Standard 3-digit numeric code with optional tolerance letter: e.g. 104, 104K
    const match = trimmed.match(/^(\d{3})([A-Z])?$/);
    if (!match) {
      throw new Error('Invalid capacitor code. Please enter 3 digits (e.g. 104, 103, 222) with optional tolerance letter (e.g. 104K).');
    }

    const digits = match[1];
    const tolLetter = match[2] || null;
    const tolInfo = tolLetter && TOLERANCE_CODES[tolLetter] ? TOLERANCE_CODES[tolLetter] : null;

    const d1 = parseInt(digits[0], 10);
    const d2 = parseInt(digits[1], 10);
    const multDigit = parseInt(digits[2], 10);

    // Multiplier calculation in pF:
    // multDigit 0-6: 10^multDigit
    // multDigit 8: 0.01 (EIA-198)
    // multDigit 9: 0.1 (EIA-198)
    let multiplierVal;
    let multExplanation;

    if (multDigit >= 0 && multDigit <= 6) {
      multiplierVal = Math.pow(10, multDigit);
      multExplanation = `10^${multDigit} = ${multiplierVal.toLocaleString()}`;
    } else if (multDigit === 8) {
      multiplierVal = 0.01;
      multExplanation = '0.01 (EIA multiplier code 8)';
    } else if (multDigit === 9) {
      multiplierVal = 0.1;
      multExplanation = '0.1 (EIA multiplier code 9)';
    } else {
      multiplierVal = Math.pow(10, multDigit);
      multExplanation = `10^${multDigit}`;
    }

    const baseDigits = d1 * 10 + d2;
    const pF = baseDigits * multiplierVal;
    const nF = pF / 1000;
    const uF = pF / 1000000;
    const baseFarads = pF * 1e-12;

    const formattedSI = Units.formatEngineering(baseFarads, 'F');

    let explanation = `1st & 2nd digits (${d1}${d2}) × Multiplier (${multExplanation}) = ${pF.toLocaleString()} pF\n` +
      `• Convert to nF: ${pF.toLocaleString()} pF ÷ 1,000 = ${Units.formatNumber(nF, 6)} nF\n` +
      `• Convert to µF: ${pF.toLocaleString()} pF ÷ 1,000,000 = ${Units.formatNumber(uF, 9)} µF`;

    if (tolInfo) {
      explanation += `\n• Tolerance '${tolLetter}': ${tolInfo.desc}`;
    }

    return {
      success: true,
      code: trimmed,
      firstDigit: d1,
      secondDigit: d2,
      multiplierPower: multDigit,
      multiplierVal,
      toleranceCode: tolLetter,
      toleranceInfo: tolInfo ? tolInfo.desc : 'Not specified',
      baseFarads,
      pF: Units.formatNumber(pF, 4),
      nF: Units.formatNumber(nF, 6),
      uF: Units.formatNumber(uF, 9),
      formattedSI: formattedSI.formatted,
      explanation
    };
  }

  /**
   * Reverse Calculator: Converts a capacitance value (with unit pF, nF, µF) into a 3-digit EIA code.
   * @param {number} value
   * @param {string} unit - 'pF', 'nF', or 'µF'
   * @param {string} [tolerance=''] - optional letter e.g. 'J', 'K'
   * @returns {Object}
   */
  function valueToCapacitorCode(value, unit = 'nF', tolerance = '') {
    if (value === undefined || value === null || value === '') {
      throw new Error('Please enter a capacitance value.');
    }

    const num = Number(value);
    if (isNaN(num)) {
      throw new Error('Capacitance must be a valid number.');
    }
    if (num <= 0) {
      throw new Error('Capacitance must be greater than zero.');
    }
    if (!isFinite(num)) {
      throw new Error('Capacitance value is too large or invalid.');
    }

    // Convert to pF
    let pF;
    const cleanUnit = (unit || 'nF').trim();
    if (cleanUnit === 'µF' || cleanUnit === 'uF') {
      pF = num * 1e6;
    } else if (cleanUnit === 'nF') {
      pF = num * 1e3;
    } else if (cleanUnit === 'pF') {
      pF = num;
    } else if (cleanUnit === 'F') {
      pF = num * 1e12;
    } else {
      throw new Error(`Unsupported capacitance unit: ${cleanUnit}`);
    }

    const baseFarads = pF * 1e-12;
    const nF = pF / 1e3;
    const uF = pF / 1e6;

    // Small values with decimal pF
    if (pF < 10) {
      const roundedPf = Number(pF.toFixed(1));
      const code = roundedPf.toString().replace('.', 'R') + (tolerance || '');
      return {
        success: true,
        code,
        pF: Units.formatNumber(pF, 4),
        nF: Units.formatNumber(nF, 6),
        uF: Units.formatNumber(uF, 9),
        formattedSI: Units.formatEngineering(baseFarads, 'F').formatted,
        explanation: `${num} ${cleanUnit} = ${roundedPf} pF. Capacitance < 10 pF uses 'R' as decimal separator: Code is "${code}".`
      };
    }

    // Standard 3-digit calculation:
    // pF = (d1*10 + d2) * 10^multiplier
    // log10(pF) = log10(twoDigits) + multiplier
    const exp = Math.floor(Math.log10(pF)) - 1;
    let twoDigits = Math.round(pF / Math.pow(10, exp));

    let multiplier = exp;
    if (twoDigits >= 100) {
      twoDigits = Math.round(twoDigits / 10);
      multiplier += 1;
    }

    if (multiplier < 0 || multiplier > 9) {
      // Out of typical 3-digit ceramic capacitor code range
      return {
        success: true,
        code: 'N/A (Exceeds ceramic 3-digit code range)',
        pF: Units.formatNumber(pF, 4),
        nF: Units.formatNumber(nF, 6),
        uF: Units.formatNumber(uF, 9),
        formattedSI: Units.formatEngineering(baseFarads, 'F').formatted,
        explanation: `Value is ${Units.formatEngineering(baseFarads, 'F').formatted}. Typically printed directly on large electrolytic/film capacitors instead of a 3-digit code.`
      };
    }

    const dStr = twoDigits.toString().padStart(2, '0');
    const fullCode = `${dStr}${multiplier}${tolerance || ''}`;

    return {
      success: true,
      code: fullCode,
      pF: Units.formatNumber(pF, 4),
      nF: Units.formatNumber(nF, 6),
      uF: Units.formatNumber(uF, 9),
      formattedSI: Units.formatEngineering(baseFarads, 'F').formatted,
      explanation: `${num} ${cleanUnit} = ${pF.toLocaleString()} pF = ${twoDigits} × 10^${multiplier} pF → EIA Code: ${fullCode}`
    };
  }

  return {
    TOLERANCE_CODES,
    calculateCapacitor,
    valueToCapacitorCode
  };
}));

