/**
 * test-calculations.js - Automated Test Suite for Electronic Component Calculator
 * Verifies all formulas, test cases, and edge cases specified in Section 23 of requirements.
 */

const assert = require('assert');
const Units = require('../js/units.js');
const ResistorCalc = require('../js/resistor.js');
const CapacitorCalc = require('../js/capacitor.js');
const LedCalc = require('../js/led.js');
const OhmsLawCalc = require('../js/ohms-law.js');
const PowerCalc = require('../js/power.js');
const VoltageDividerCalc = require('../js/voltage-divider.js');
const SeriesParallelCalc = require('../js/series-parallel.js');
const ComponentReference = require('../js/reference.js');
const SmdResistorCalc = require('../js/smd-resistor.js');
const Timer555Calc = require('../js/timer555.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    passedTests++;
    console.log(`  ✓ PASS: ${name}`);
  } catch (err) {
    failedTests++;
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    ${err.message}`);
  }
}

console.log('\n======================================================');
console.log('ELECTRONIC COMPONENT CALCULATOR - TEST SUITE RUNNER');
console.log('======================================================\n');

// ---------------------------------------------------------------------
// 1. UNIT CONVERSIONS & ENGINEERING FORMATTING
// ---------------------------------------------------------------------
console.log('--- 1. Testing Units and Conversions ---');

test('1 kΩ = 1000 Ω', () => {
  assert.strictEqual(Units.toBaseUnit(1, 'kΩ'), 1000);
});

test('1 MΩ = 1,000,000 Ω', () => {
  assert.strictEqual(Units.toBaseUnit(1, 'MΩ'), 1000000);
});

test('1 mA = 0.001 A', () => {
  assert.strictEqual(Units.toBaseUnit(1, 'mA'), 0.001);
});

test('1 µA = 0.000001 A', () => {
  assert.strictEqual(Units.toBaseUnit(1, 'µA'), 0.000001);
});

test('1 nF = 1e-9 F', () => {
  assert.strictEqual(Units.toBaseUnit(1, 'nF'), 1e-9);
});

test('1 µF = 1e-6 F', () => {
  assert.strictEqual(Units.toBaseUnit(1, 'µF'), 1e-6);
});

test('formatEngineering: 4700 Ω -> "4.7 kΩ"', () => {
  const res = Units.formatEngineering(4700, 'Ω');
  assert.strictEqual(res.formatted, '4.7 kΩ');
});

test('formatEngineering: 0.000001 F -> "1 µF"', () => {
  const res = Units.formatEngineering(0.000001, 'F');
  assert.strictEqual(res.formatted, '1 µF');
});

test('formatEngineering: 0.002 A -> "2 mA"', () => {
  const res = Units.formatEngineering(0.002, 'A');
  assert.strictEqual(res.formatted, '2 mA');
});

// ---------------------------------------------------------------------
// 2. RESISTOR COLOR CODE & VALUE CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 2. Testing Resistor Color Code & Value Calculator ---');

test('4-Band: Yellow, Violet, Red, Gold -> 4.7 kΩ ±5% [4.465 kΩ - 4.935 kΩ]', () => {
  const result = ResistorCalc.calculateResistorColorCode(['yellow', 'violet', 'red', 'gold'], 4);
  assert.strictEqual(result.resistanceOhms, 4700);
  assert.strictEqual(result.tolerancePercent, 5);
  assert.strictEqual(result.minOhms, 4465);
  assert.strictEqual(result.maxOhms, 4935);
  assert.strictEqual(result.formattedResistance, '4.7 kΩ');
});

test('5-Band: Brown, Black, Black, Red, Brown -> 10.0 kΩ ±1%', () => {
  // 1, 0, 0 * 10^2 = 10,000 Ω = 10 kΩ
  const result = ResistorCalc.calculateResistorColorCode(['brown', 'black', 'black', 'red', 'brown'], 5);
  assert.strictEqual(result.resistanceOhms, 10000);
  assert.strictEqual(result.tolerancePercent, 1);
  assert.strictEqual(result.formattedResistance, '10 kΩ');
});

test('6-Band: Orange, Orange, White, Brown, Blue, Red -> 3.39 kΩ ±0.25%, 50 ppm/K', () => {
  // 3, 3, 9 * 10 = 3390 Ω
  const result = ResistorCalc.calculateResistorColorCode(['orange', 'orange', 'white', 'brown', 'blue', 'red'], 6);
  assert.strictEqual(result.resistanceOhms, 3390);
  assert.strictEqual(result.tolerancePercent, 0.25);
  assert.strictEqual(result.tempCoeff, 50);
});

test('Resistor validation: rejects black as 1st band', () => {
  assert.throws(() => {
    ResistorCalc.calculateResistorColorCode(['black', 'red', 'orange', 'gold'], 4);
  }, /first band/i);
});

test('Resistor Value Converter: 4.7 kΩ -> 4700 Ω, 4.7 kΩ, 0.0047 MΩ', () => {
  const result = ResistorCalc.convertResistorValue(4.7, 'kΩ');
  assert.strictEqual(result.baseOhms, 4700);
  assert.strictEqual(result.inOhms, '4700');
  assert.strictEqual(result.inKiloOhms, '4.7');
  assert.strictEqual(result.inMegaOhms, '0.0047');
});

test('Resistor Value Converter: rejects negative resistance', () => {
  assert.throws(() => {
    ResistorCalc.convertResistorValue(-100, 'Ω');
  }, /negative/i);
});

test('Resistor Value Converter: rejects zero resistance', () => {
  assert.throws(() => {
    ResistorCalc.convertResistorValue(0, 'Ω');
  }, /greater than zero/i);
});

// ---------------------------------------------------------------------
// 3. CAPACITOR CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 3. Testing Capacitor Calculator ---');

test('Capacitor Code 104 -> 100 nF (100,000 pF, 0.1 µF)', () => {
  const res = CapacitorCalc.calculateCapacitor('104');
  assert.strictEqual(res.pF, '100000');
  assert.strictEqual(res.nF, '100');
  assert.strictEqual(res.uF, '0.1');
});

test('Capacitor Code 103 -> 10 nF (10,000 pF, 0.01 µF)', () => {
  const res = CapacitorCalc.calculateCapacitor('103');
  assert.strictEqual(res.pF, '10000');
  assert.strictEqual(res.nF, '10');
  assert.strictEqual(res.uF, '0.01');
});

test('Capacitor Code 102 -> 1 nF (1,000 pF, 0.001 µF)', () => {
  const res = CapacitorCalc.calculateCapacitor('102');
  assert.strictEqual(res.pF, '1000');
  assert.strictEqual(res.nF, '1');
  assert.strictEqual(res.uF, '0.001');
});

test('Capacitor Code 104J with tolerance: J is ±5%', () => {
  const res = CapacitorCalc.calculateCapacitor('104J');
  assert.strictEqual(res.toleranceCode, 'J');
  assert.strictEqual(res.toleranceInfo, '±5%');
  assert.strictEqual(res.nF, '100');
});

test('Reverse Capacitor: 100 nF -> Code 104', () => {
  const res = CapacitorCalc.valueToCapacitorCode(100, 'nF');
  assert.strictEqual(res.code, '104');
});

test('Capacitor Code validation: rejects invalid code "XYZ"', () => {
  assert.throws(() => {
    CapacitorCalc.calculateCapacitor('XYZ');
  }, /invalid/i);
});

// ---------------------------------------------------------------------
// 4. LED SERIES RESISTOR CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 4. Testing LED Series Resistor Calculator ---');

test('LED: Vs = 5 V, Vf = 2 V, I = 20 mA -> R = 150 Ω', () => {
  const res = LedCalc.calculateLedResistor(5, 2, 20, 1);
  assert.strictEqual(res.exactResistanceOhms, 150);
  assert.strictEqual(res.formattedResistance, '150 Ω');
  // Power in resistor = (5 - 2) * 0.02 = 0.06 W = 60 mW
  assert.strictEqual(res.resistorPowerWatts, 0.06);
  assert.strictEqual(res.formattedPower, '60 mW');
});

test('LED validation: rejects Vs <= Vf', () => {
  assert.throws(() => {
    LedCalc.calculateLedResistor(3, 3.2, 20, 1);
  }, /less than/i);
});

test('LED validation: rejects zero or negative current', () => {
  assert.throws(() => {
    LedCalc.calculateLedResistor(5, 2, 0, 1);
  }, /greater than 0/i);
});

// ---------------------------------------------------------------------
// 5. OHM\'S LAW CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 5. Testing Ohm\'s Law Calculator ---');

test('Ohm\'s Law: V = 12 V, R = 6 Ω -> I = 2 A, P = 24 W', () => {
  const res = OhmsLawCalc.calculateOhmsLaw({
    voltage: 12, voltageUnit: 'V',
    resistance: 6, resistanceUnit: 'Ω'
  });
  assert.strictEqual(res.current, 2);
  assert.strictEqual(res.formattedCurrent, '2 A');
  assert.strictEqual(res.power, 24);
  assert.strictEqual(res.formattedPower, '24 W');
});

test('Ohm\'s Law: V = 10 V, I = 2 mA (0.002 A) -> R = 5000 Ω (5 kΩ)', () => {
  const res = OhmsLawCalc.calculateOhmsLaw({
    voltage: 10, voltageUnit: 'V',
    current: 2, currentUnit: 'mA'
  });
  assert.strictEqual(res.resistance, 5000);
  assert.strictEqual(res.formattedResistance, '5 kΩ');
});

test('Ohm\'s Law: I = 500 mA, R = 200 Ω -> V = 100 V', () => {
  const res = OhmsLawCalc.calculateOhmsLaw({
    current: 500, currentUnit: 'mA',
    resistance: 200, resistanceUnit: 'Ω'
  });
  assert.strictEqual(res.voltage, 100);
  assert.strictEqual(res.formattedVoltage, '100 V');
});

test('Ohm\'s Law validation: division by zero current rejects safely', () => {
  assert.throws(() => {
    OhmsLawCalc.calculateOhmsLaw({
      voltage: 12, voltageUnit: 'V',
      current: 0, currentUnit: 'A'
    });
  }, /zero/i);
});

// ---------------------------------------------------------------------
// 6. POWER CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 6. Testing Power Calculator ---');

test('Power: Given V = 12 V, I = 2 A -> P = 24 W, R = 6 Ω', () => {
  const res = PowerCalc.calculatePower({
    voltage: 12, voltageUnit: 'V',
    current: 2, currentUnit: 'A'
  });
  assert.strictEqual(res.values.power, 24);
  assert.strictEqual(res.values.resistance, 6);
});

test('Power: Given I = 3 A, R = 10 Ω -> P = 90 W (I²R), V = 30 V', () => {
  const res = PowerCalc.calculatePower({
    current: 3, currentUnit: 'A',
    resistance: 10, resistanceUnit: 'Ω'
  });
  assert.strictEqual(res.values.power, 90);
  assert.strictEqual(res.values.voltage, 30);
});

test('Power: Given V = 24 V, R = 12 Ω -> P = 48 W (V²/R), I = 2 A', () => {
  const res = PowerCalc.calculatePower({
    voltage: 24, voltageUnit: 'V',
    resistance: 12, resistanceUnit: 'Ω'
  });
  assert.strictEqual(res.values.power, 48);
  assert.strictEqual(res.values.current, 2);
});

test('Power: Given R = 50 Ω, P = 200 W -> V = 100 V, I = 2 A', () => {
  const res = PowerCalc.calculatePower({
    resistance: 50, resistanceUnit: 'Ω',
    power: 200, powerUnit: 'W'
  });
  assert.strictEqual(res.values.voltage, 100);
  assert.strictEqual(res.values.current, 2);
});

// ---------------------------------------------------------------------
// 7. VOLTAGE DIVIDER CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 7. Testing Voltage Divider Calculator ---');

test('Voltage Divider: Vin = 10 V, R1 = 10 kΩ, R2 = 10 kΩ -> Vout = 5 V', () => {
  const res = VoltageDividerCalc.calculateVoltageDivider({
    vin: 10, vinUnit: 'V',
    r1: 10, r1Unit: 'kΩ',
    r2: 10, r2Unit: 'kΩ'
  });
  assert.strictEqual(res.vout, 5);
  assert.strictEqual(res.vDropR1, 5);
  assert.strictEqual(res.vDropR2, 5);
  assert.strictEqual(res.formatted.vout, '5 V');
  assert.strictEqual(res.dividerCurrent, 0.0005); // 0.5 mA
});

test('Voltage Divider: Vin = 12 V, R1 = 1 kΩ, R2 = 2 kΩ -> Vout = 8 V', () => {
  const res = VoltageDividerCalc.calculateVoltageDivider({
    vin: 12, vinUnit: 'V',
    r1: 1, r1Unit: 'kΩ',
    r2: 2, r2Unit: 'kΩ'
  });
  assert.strictEqual(res.vout, 8);
});

test('Voltage Divider with Load RL: Vin = 10 V, R1 = 10k, R2 = 10k, RL = 10k -> Req = 5k -> Vout = 3.333 V', () => {
  const res = VoltageDividerCalc.calculateVoltageDivider({
    vin: 10, vinUnit: 'V',
    r1: 10, r1Unit: 'kΩ',
    r2: 10, r2Unit: 'kΩ',
    rl: 10, rlUnit: 'kΩ'
  });
  // R2 || RL = 5 kΩ. Vout = 10 * 5 / 15 = 3.333 V
  assert.strictEqual(Number(res.vout.toFixed(2)), 3.33);
});

test('Voltage Divider validation: rejects negative resistors', () => {
  assert.throws(() => {
    VoltageDividerCalc.calculateVoltageDivider({
      vin: 10, r1: -100, r2: 100
    });
  }, /negative/i);
});

// ---------------------------------------------------------------------
// 8. SERIES AND PARALLEL CALCULATORS
// ---------------------------------------------------------------------
console.log('\n--- 8. Testing Series and Parallel Calculators ---');

test('Series: R1 = 100 Ω, R2 = 200 Ω -> Rtotal = 300 Ω', () => {
  const res = SeriesParallelCalc.calculateSeriesResistance([
    { value: 100, unit: 'Ω' },
    { value: 200, unit: 'Ω' }
  ]);
  assert.strictEqual(res.rTotal, 300);
  assert.strictEqual(res.formattedTotal, '300 Ω');
});

test('Parallel: R1 = 100 Ω, R2 = 100 Ω -> Rtotal = 50 Ω', () => {
  const res = SeriesParallelCalc.calculateParallelResistance([
    { value: 100, unit: 'Ω' },
    { value: 100, unit: 'Ω' }
  ]);
  assert.strictEqual(res.rTotal, 50);
  assert.strictEqual(res.formattedTotal, '50 Ω');
});

test('Parallel 3 Resistors: 10k, 20k, 20k -> 5 kΩ', () => {
  // 1/10 + 1/20 + 1/20 = 1/10 + 2/20 = 2/10 = 1/5 -> 5k
  const res = SeriesParallelCalc.calculateParallelResistance([
    { value: 10, unit: 'kΩ' },
    { value: 20, unit: 'kΩ' },
    { value: 20, unit: 'kΩ' }
  ]);
  assert.strictEqual(res.rTotal, 5000);
  assert.strictEqual(res.formattedTotal, '5 kΩ');
});

test('Series with Voltage: 12V across R1=100Ω, R2=200Ω -> I = 40 mA, VR1=4V, VR2=8V', () => {
  const res = SeriesParallelCalc.calculateSeriesResistance(
    [
      { value: 100, unit: 'Ω' },
      { value: 200, unit: 'Ω' }
    ],
    12, 'V'
  );
  assert.strictEqual(res.circuitCurrent, 0.04);
  assert.strictEqual(res.formattedCurrent, '40 mA');
  assert.strictEqual(res.branches[0].voltageDrop, '4 V');
  assert.strictEqual(res.branches[1].voltageDrop, '8 V');
});

// ---------------------------------------------------------------------
// 9. COMPONENT REFERENCE
// ---------------------------------------------------------------------
console.log('\n--- 9. Testing Component Reference ---');

test('Reference has all required components', () => {
  const all = ComponentReference.getAllComponents();
  const required = ['resistor', 'capacitor', 'inductor', 'diode', 'led', 'bjt', 'mosfet', 'ic', 'transformer'];
  for (const req of required) {
    const found = all.find(c => c.id === req);
    assert.ok(found, `Missing required component in reference: ${req}`);
    assert.ok(found.symbolSvg, `Missing symbol SVG for: ${req}`);
    assert.ok(found.functionDesc, `Missing function description for: ${req}`);
    assert.ok(found.unit, `Missing unit for: ${req}`);
    assert.ok(found.applications && found.applications.length > 0, `Missing applications for: ${req}`);
  }
});

// ---------------------------------------------------------------------
// 10. SMD RESISTOR CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 10. Testing SMD Resistor Calculator ---');

test('SMD 3-Digit: 472 -> 4.7 kΩ ±5%', () => {
  const res = SmdResistorCalc.calculateSmdResistor('472');
  assert.strictEqual(res.ohms, 4700);
  assert.strictEqual(res.formatted, '4.7 kΩ');
  assert.strictEqual(res.tolerance, '±5%');
});

test('SMD 4-Digit: 1001 -> 1 kΩ ±1%', () => {
  const res = SmdResistorCalc.calculateSmdResistor('1001');
  assert.strictEqual(res.ohms, 1000);
  assert.strictEqual(res.formatted, '1 kΩ');
  assert.strictEqual(res.tolerance, '±1%');
});

test('SMD EIA-96: 01A -> 100 Ω ±1%', () => {
  const res = SmdResistorCalc.calculateSmdResistor('01A');
  assert.strictEqual(res.ohms, 100);
  assert.strictEqual(res.formatted, '100 Ω');
  assert.strictEqual(res.tolerance, '±1%');
});

test('SMD EIA-96: 68C -> 49.9 kΩ ±1%', () => {
  // 68 in table = 499, C = 100 -> 49,900 Ω = 49.9 kΩ
  const res = SmdResistorCalc.calculateSmdResistor('68C');
  assert.strictEqual(res.ohms, 49900);
  assert.strictEqual(res.formatted, '49.9 kΩ');
});

test('SMD Decimal: 4R7 -> 4.7 Ω', () => {
  const res = SmdResistorCalc.calculateSmdResistor('4R7');
  assert.strictEqual(res.ohms, 4.7);
  assert.strictEqual(res.formatted, '4.7 Ω');
});

test('SMD Zero Ohm Jumper: 000 -> 0 Ω Jumper', () => {
  const res = SmdResistorCalc.calculateSmdResistor('000');
  assert.strictEqual(res.ohms, 0);
  assert.ok(res.formatted.includes('0 Ω'));
});

// ---------------------------------------------------------------------
// 11. 555 TIMER & RC FILTER CALCULATOR
// ---------------------------------------------------------------------
console.log('\n--- 11. Testing 555 Timer & RC Filter Calculator ---');

test('555 Astable: R1=1k, R2=10k, C=10µF -> f ≈ 6.85 Hz, D ≈ 52.38%', () => {
  const res = Timer555Calc.calculate555Astable({
    r1: 1, r1Unit: 'kΩ',
    r2: 10, r2Unit: 'kΩ',
    c: 10, cUnit: 'µF'
  });
  // f = 1.44 / ((1000 + 20000) * 1e-5) = 1.44 / (21000 * 1e-5) = 1.44 / 0.21 ≈ 6.857 Hz
  assert.strictEqual(Number(res.frequency.toFixed(2)), 6.86);
  assert.strictEqual(res.dutyCycle, 52.38);
});

test('555 Monostable: R=10k, C=10µF -> T = 1.1 * 10,000 * 10e-6 = 0.11 s', () => {
  const res = Timer555Calc.calculate555Monostable({
    r: 10, rUnit: 'kΩ',
    c: 10, cUnit: 'µF'
  });
  assert.strictEqual(Number(res.pulseDuration.toFixed(2)), 0.11);
});

test('RC Filter Cutoff: R=10k, C=100nF -> fc ≈ 159.15 Hz', () => {
  const res = Timer555Calc.calculateRcFilter({
    r: 10, rUnit: 'kΩ',
    c: 100, cUnit: 'nF'
  });
  // fc = 1 / (2 * pi * 10000 * 100e-9) = 1 / (2 * pi * 0.001) = 159.15 Hz
  assert.strictEqual(Number(res.cutoffFreq.toFixed(2)), 159.15);
});

// ---------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------
console.log('\n======================================================');
console.log(`TOTAL TESTS:  ${totalTests}`);
console.log(`PASSED TESTS: ${passedTests}`);
console.log(`FAILED TESTS: ${failedTests}`);
console.log('======================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL ENGINE CALCULATIONS PASSED PERFECTLY!\n');
}

