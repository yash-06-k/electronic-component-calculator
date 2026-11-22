/**
 * app.js - Main Application Controller & UI Logic
 * Electronic Component Calculator - ENTC Engineering Project
 */

(function () {
  'use strict';

  // State
  let currentResistorBands = 4;
  let currentNetworkMode = 'series'; // 'series' or 'parallel'
  let resistorRowCount = 2;

  // DOM Elements - Navigation & Shell
  const sidebar = document.getElementById('appSidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const currentBreadcrumb = document.getElementById('currentBreadcrumb');
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.calc-view');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIconDark = document.getElementById('themeIconDark');
  const themeIconLight = document.getElementById('themeIconLight');

  /* ===================================================================
     1. INITIALIZATION & ROUTING
     =================================================================== */
  function init() {
    initTheme();
    initNavigation();
    initResistorCalculator();
    initSmdCalculator();
    initCapacitorCalculator();
    initLedCalculator();
    initTimerCalculator();
    initOhmsLawCalculator();
    initPowerCalculator();
    initVoltageDividerCalculator();
    initSeriesParallelCalculator();
    initComponentReference();
    initLabReportModal();
    initCopyButtons();
  }

  // Safe localStorage helper
  function getStoredItem(key, fallback = null) {
    try {
      return localStorage.getItem(key) || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStoredItem(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch (e) {
      // Ignored if localStorage blocked
    }
  }

  // Dark/Light Theme Handler
  function initTheme() {
    const savedTheme = getStoredItem('electro_theme', 'dark');
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
      setStoredItem('electro_theme', next);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      themeIconDark.style.display = 'none';
      themeIconLight.style.display = 'block';
    } else {
      themeIconDark.style.display = 'block';
      themeIconLight.style.display = 'none';
    }
  }

  // Navigation
  function initNavigation() {
    // Menu mobile toggle
    menuToggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('active');
    });

    sidebarOverlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('active');
    });

    // Sidebar items
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const viewId = item.getAttribute('data-view');
        switchView(viewId);
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
      });
    });

    // Home card buttons
    document.querySelectorAll('.card-open-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetView = btn.getAttribute('data-target');
        switchView(targetView);
      });
    });
  }

  function switchView(viewId) {
    views.forEach(v => {
      v.classList.remove('active');
      if (v.id === viewId) {
        v.classList.add('active');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-view') === viewId) {
        item.classList.add('active');
        const label = item.querySelector('span:last-child').textContent;
        currentBreadcrumb.textContent = label;
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Error Banner Helper
  function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (message) {
      el.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>${message}</span>
      `;
      el.classList.add('active');
    } else {
      el.innerHTML = '';
      el.classList.remove('active');
    }
  }

  /* ===================================================================
     2. RESISTOR CALCULATOR CONTROLLER
     =================================================================== */
  function initResistorCalculator() {
    const bandGroup = document.getElementById('resistorBandCountGroup');
    const b1Sel = document.getElementById('resBand1Select');
    const b2Sel = document.getElementById('resBand2Select');
    const b3Sel = document.getElementById('resBand3Select');
    const bMultSel = document.getElementById('resBandMultSelect');
    const bTolSel = document.getElementById('resBandTolSelect');
    const bTempSel = document.getElementById('resBandTempSelect');

    const colBand3 = document.getElementById('colBand3');
    const colBandTemp = document.getElementById('colBandTemp');
    const vBand3 = document.getElementById('vBand3');
    const vBandTemp = document.getElementById('vBandTemp');
    const resTempCoeffRow = document.getElementById('resTempCoeffRow');

    // Populate dropdown options strictly with valid colors per role
    function populateBandSelect(selectEl, role, defaultColor) {
      const validColors = ResistorCalc.getValidColorsForBand(role);
      selectEl.innerHTML = '';
      validColors.forEach(colorKey => {
        const item = ResistorCalc.COLOR_DATA[colorKey];
        const opt = document.createElement('option');
        opt.value = colorKey;
        opt.textContent = `${item.name}${getSuffix(role, item)}`;
        if (colorKey === defaultColor) opt.selected = true;
        selectEl.appendChild(opt);
      });
    }

    function getSuffix(role, item) {
      if (role === 'first-digit' || role === 'digit') return ` (${item.digit})`;
      if (role === 'multiplier') {
        const exp = Math.round(Math.log10(item.multiplier));
        return ` (×10^${exp})`;
      }
      if (role === 'tolerance') return ` (±${item.tolerance}%)`;
      if (role === 'tempCoeff') return ` (${item.tempCoeff} ppm/K)`;
      return '';
    }

    function setupBandDropdowns() {
      populateBandSelect(b1Sel, 'first-digit', 'yellow'); // 4
      populateBandSelect(b2Sel, 'digit', 'violet');        // 7
      populateBandSelect(b3Sel, 'digit', 'black');         // 0
      populateBandSelect(bMultSel, 'multiplier', 'red');   // 10^2
      populateBandSelect(bTolSel, 'tolerance', 'gold');    // ±5%
      populateBandSelect(bTempSel, 'tempCoeff', 'brown');  // 100 ppm/K
    }

    setupBandDropdowns();

    // Band count toggle buttons (4, 5, 6 bands)
    bandGroup.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        bandGroup.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentResistorBands = parseInt(btn.getAttribute('data-bands'), 10);

        if (currentResistorBands === 4) {
          colBand3.style.display = 'none';
          colBandTemp.style.display = 'none';
          vBand3.style.display = 'none';
          vBandTemp.style.display = 'none';
          resTempCoeffRow.style.display = 'none';
        } else if (currentResistorBands === 5) {
          colBand3.style.display = 'flex';
          colBandTemp.style.display = 'none';
          vBand3.style.display = 'block';
          vBandTemp.style.display = 'none';
          resTempCoeffRow.style.display = 'none';
        } else if (currentResistorBands === 6) {
          colBand3.style.display = 'flex';
          colBandTemp.style.display = 'flex';
          vBand3.style.display = 'block';
          vBandTemp.style.display = 'block';
          resTempCoeffRow.style.display = 'block';
        }

        updateResistorVisual();
        calcResistorColor();
      });
    });

    // Live visual updates on select changes
    [b1Sel, b2Sel, b3Sel, bMultSel, bTolSel, bTempSel].forEach(sel => {
      sel.addEventListener('change', () => {
        updateResistorVisual();
        calcResistorColor();
      });
    });

    function updateResistorVisual() {
      const c1 = ResistorCalc.COLOR_DATA[b1Sel.value];
      const c2 = ResistorCalc.COLOR_DATA[b2Sel.value];
      const c3 = ResistorCalc.COLOR_DATA[b3Sel.value];
      const cm = ResistorCalc.COLOR_DATA[bMultSel.value];
      const ct = ResistorCalc.COLOR_DATA[bTolSel.value];
      const cTemp = ResistorCalc.COLOR_DATA[bTempSel.value];

      document.getElementById('vBand1').style.backgroundColor = c1.hex;
      document.getElementById('vBand2').style.backgroundColor = c2.hex;
      document.getElementById('vBand3').style.backgroundColor = c3.hex;
      document.getElementById('vBandMult').style.backgroundColor = cm.hex;
      document.getElementById('vBandTol').style.backgroundColor = ct.hex;
      if (cTemp) document.getElementById('vBandTemp').style.backgroundColor = cTemp.hex;
    }

    function calcResistorColor() {
      showError('resistorColorError', null);
      try {
        let bands = [];
        if (currentResistorBands === 4) {
          bands = [b1Sel.value, b2Sel.value, bMultSel.value, bTolSel.value];
        } else if (currentResistorBands === 5) {
          bands = [b1Sel.value, b2Sel.value, b3Sel.value, bMultSel.value, bTolSel.value];
        } else {
          bands = [b1Sel.value, b2Sel.value, b3Sel.value, bMultSel.value, bTolSel.value, bTempSel.value];
        }

        const res = ResistorCalc.calculateResistorColorCode(bands, currentResistorBands);

        document.getElementById('resResultValue').textContent = res.formattedResistance;
        document.getElementById('resResultTolBadge').textContent = res.toleranceLabel;
        document.getElementById('resResultBase').textContent = res.rawResistanceStr;
        document.getElementById('resResultRange').textContent = res.rangeFormatted;
        document.getElementById('resResultMin').textContent = res.minFormatted;
        document.getElementById('resResultMax').textContent = res.maxFormatted;

        if (res.tempCoeffLabel) {
          document.getElementById('resResultTemp').textContent = res.tempCoeffLabel;
          resTempCoeffRow.style.display = 'block';
        } else {
          resTempCoeffRow.style.display = 'none';
        }

        document.getElementById('resResultExplanation').textContent = res.explanation;
        document.getElementById('resConverterOutputs').style.display = 'none';
      } catch (err) {
        showError('resistorColorError', err.message);
      }
    }

    document.getElementById('btnCalcResColor').addEventListener('click', calcResistorColor);

    document.getElementById('btnResetResColor').addEventListener('click', () => {
      showError('resistorColorError', null);
      setupBandDropdowns();
      currentResistorBands = 4;
      bandGroup.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      bandGroup.querySelector('[data-bands="4"]').classList.add('active');
      colBand3.style.display = 'none';
      colBandTemp.style.display = 'none';
      vBand3.style.display = 'none';
      vBandTemp.style.display = 'none';
      resTempCoeffRow.style.display = 'none';
      updateResistorVisual();
      calcResistorColor();
    });

    // Resistor Value Converter (Requirement 6)
    const valInput = document.getElementById('resValInput');
    const unitSel = document.getElementById('resValUnitSelect');

    function calcResistorValue() {
      showError('resistorValueError', null);
      try {
        const res = ResistorCalc.convertResistorValue(valInput.value, unitSel.value);
        document.getElementById('resResultValue').textContent = res.formattedSI;
        document.getElementById('resResultTolBadge').textContent = 'SI Converted';
        document.getElementById('resResultBase').textContent = `${res.inOhms} Ω`;
        document.getElementById('resResultRange').textContent = `Nearest Standard E24: ${res.nearestStandard}`;
        document.getElementById('resResultMin').textContent = `${res.inKiloOhms} kΩ`;
        document.getElementById('resResultMax').textContent = `${res.inMegaOhms} MΩ`;

        document.getElementById('resOutOhms').textContent = res.inOhms;
        document.getElementById('resOutKilo').textContent = res.inKiloOhms;
        document.getElementById('resOutMega').textContent = res.inMegaOhms;
        document.getElementById('resOutE24').textContent = res.nearestStandard;
        document.getElementById('resConverterOutputs').style.display = 'block';

        document.getElementById('resResultExplanation').innerHTML =
          `Base Resistance: ${res.baseOhms.toLocaleString()} Ω<br>` +
          `• In Ohms: ${res.inOhms} Ω<br>` +
          `• In Kilo-ohms: ${res.inKiloOhms} kΩ<br>` +
          `• In Mega-ohms: ${res.inMegaOhms} MΩ<br>` +
          `• Standard E24 Commercial Resistor: ${res.nearestStandard}`;

        // Attempt reverse color matching to update graphic
        const autoBands = ResistorCalc.resistanceToColorCode(res.baseOhms, currentResistorBands);
        if (autoBands) {
          b1Sel.value = autoBands[0];
          b2Sel.value = autoBands[1];
          if (currentResistorBands >= 5) b3Sel.value = autoBands[2];
          bMultSel.value = currentResistorBands >= 5 ? autoBands[3] : autoBands[2];
          updateResistorVisual();
        }
      } catch (err) {
        showError('resistorValueError', err.message);
      }
    }

    document.getElementById('btnCalcResVal').addEventListener('click', calcResistorValue);
    valInput.addEventListener('keydown', e => { if (e.key === 'Enter') calcResistorValue(); });

    document.getElementById('btnResetResVal').addEventListener('click', () => {
      valInput.value = '4.7';
      unitSel.value = 'kΩ';
      showError('resistorValueError', null);
      document.getElementById('resConverterOutputs').style.display = 'none';
      calcResistorColor();
    });

    // Initial calculation
    calcResistorColor();
  }

  /* ===================================================================
     3. CAPACITOR CALCULATOR CONTROLLER
     =================================================================== */
  function initCapacitorCalculator() {
    const codeInput = document.getElementById('capCodeInput');
    const tolSelect = document.getElementById('capTolSelect');
    const vCode = document.getElementById('capVisualCode');
    const vTol = document.getElementById('capVisualTol');

    // Preset chips
    document.querySelectorAll('[data-capcode]').forEach(chip => {
      chip.addEventListener('click', () => {
        codeInput.value = chip.getAttribute('data-capcode');
        calcCapCode();
      });
    });

    codeInput.addEventListener('input', () => {
      vCode.textContent = codeInput.value.trim().toUpperCase() || '---';
    });

    tolSelect.addEventListener('change', () => {
      const selOpt = tolSelect.options[tolSelect.selectedIndex].text;
      vTol.textContent = selOpt;
    });

    function calcCapCode() {
      showError('capDecodeError', null);
      try {
        const fullCode = codeInput.value.trim() + (tolSelect.value || '');
        const res = CapacitorCalc.calculateCapacitor(fullCode);

        vCode.textContent = codeInput.value.trim().toUpperCase();
        vTol.textContent = res.toleranceInfo;

        document.getElementById('capResultSI').textContent = res.formattedSI;
        document.getElementById('capResultTol').textContent = res.toleranceInfo;
        document.getElementById('capResultPf').textContent = `${Number(res.pF).toLocaleString()} pF`;
        document.getElementById('capResultNf').textContent = `${res.nF} nF`;
        document.getElementById('capResultUf').textContent = `${res.uF} µF`;
        document.getElementById('capResultCodeDisplay').textContent = res.code;
        document.getElementById('capResultExplanation').innerHTML = res.explanation.replace(/\n/g, '<br>');
      } catch (err) {
        showError('capDecodeError', err.message);
      }
    }

    document.getElementById('btnCalcCapCode').addEventListener('click', calcCapCode);
    codeInput.addEventListener('keydown', e => { if (e.key === 'Enter') calcCapCode(); });

    document.getElementById('btnResetCapCode').addEventListener('click', () => {
      codeInput.value = '104';
      tolSelect.value = 'K';
      showError('capDecodeError', null);
      calcCapCode();
    });

    // Reverse Capacitor Calculator
    const revVal = document.getElementById('capReverseValInput');
    const revUnit = document.getElementById('capReverseUnitSelect');

    function calcCapReverse() {
      showError('capReverseError', null);
      try {
        const res = CapacitorCalc.valueToCapacitorCode(revVal.value, revUnit.value);
        codeInput.value = res.code.replace(/[^0-9]/g, '');
        vCode.textContent = res.code;

        document.getElementById('capResultSI').textContent = res.formattedSI;
        document.getElementById('capResultTol').textContent = 'Generated EIA Code';
        document.getElementById('capResultPf').textContent = `${Number(res.pF).toLocaleString()} pF`;
        document.getElementById('capResultNf').textContent = `${res.nF} nF`;
        document.getElementById('capResultUf').textContent = `${res.uF} µF`;
        document.getElementById('capResultCodeDisplay').textContent = res.code;
        document.getElementById('capResultExplanation').innerHTML = res.explanation;
      } catch (err) {
        showError('capReverseError', err.message);
      }
    }

    document.getElementById('btnCalcCapReverse').addEventListener('click', calcCapReverse);
    revVal.addEventListener('keydown', e => { if (e.key === 'Enter') calcCapReverse(); });

    document.getElementById('btnResetCapReverse').addEventListener('click', () => {
      revVal.value = '100';
      revUnit.value = 'nF';
      showError('capReverseError', null);
      calcCapCode();
    });

    // Initial run
    calcCapCode();
  }

  /* ===================================================================
     4. LED SERIES RESISTOR CALCULATOR CONTROLLER
     =================================================================== */
  function initLedCalculator() {
    const vsInput = document.getElementById('ledSupplyVolt');
    const vfInput = document.getElementById('ledForwardVolt');
    const ifInput = document.getElementById('ledCurrent');
    const countInput = document.getElementById('ledCountInput');
    const schematicRes = document.getElementById('schematicResVal');

    // Preset buttons
    document.querySelectorAll('[data-led]').forEach(chip => {
      chip.addEventListener('click', () => {
        const ledId = chip.getAttribute('data-led');
        const preset = LedCalc.LED_PRESETS.find(p => p.id === ledId);
        if (preset) {
          vfInput.value = preset.vf;
          ifInput.value = preset.if_mA;
          calcLed();
        }
      });
    });

    function calcLed() {
      showError('ledCalcError', null);
      try {
        const res = LedCalc.calculateLedResistor(
          vsInput.value,
          vfInput.value,
          ifInput.value,
          countInput.value
        );

        document.getElementById('ledResultOhms').textContent = res.formattedResistance;
        document.getElementById('ledResultStandard').textContent = res.standardE24;
        document.getElementById('ledResultPower').textContent = res.formattedPower;
        document.getElementById('ledResultWattage').textContent = res.recommendedWattage;
        document.getElementById('ledResultActualCurrent').textContent = `${res.actualCurrent_mA} mA`;
        schematicRes.textContent = res.formattedResistance;

        document.getElementById('ledResultExplanation').innerHTML = res.steps.join('<br>');
      } catch (err) {
        showError('ledCalcError', err.message);
      }
    }

    document.getElementById('btnCalcLed').addEventListener('click', calcLed);
    [vsInput, vfInput, ifInput, countInput].forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') calcLed(); });
    });

    document.getElementById('btnResetLed').addEventListener('click', () => {
      vsInput.value = '5';
      vfInput.value = '2.0';
      ifInput.value = '20';
      countInput.value = '1';
      showError('ledCalcError', null);
      calcLed();
    });

    // Initial run
    calcLed();
  }

  /* ===================================================================
     5. OHM'S LAW CALCULATOR CONTROLLER
     =================================================================== */
  function initOhmsLawCalculator() {
    const vInp = document.getElementById('ohmsVoltInput');
    const vUnit = document.getElementById('ohmsVoltUnit');
    const iInp = document.getElementById('ohmsCurrentInput');
    const iUnit = document.getElementById('ohmsCurrentUnit');
    const rInp = document.getElementById('ohmsResInput');
    const rUnit = document.getElementById('ohmsResUnit');

    function calcOhms() {
      showError('ohmsCalcError', null);
      try {
        const res = OhmsLawCalc.calculateOhmsLaw({
          voltage: vInp.value,
          voltageUnit: vUnit.value,
          current: iInp.value,
          currentUnit: iUnit.value,
          resistance: rInp.value,
          resistanceUnit: rUnit.value
        });

        document.getElementById('ohmsSolvedLabel').textContent = `Target: ${res.solvedTarget}`;
        document.getElementById('ohmsFormulaBadge').textContent = res.formula;

        if (res.solvedTarget.includes('Voltage')) {
          document.getElementById('ohmsSolvedValue').textContent = res.formattedVoltage;
        } else if (res.solvedTarget.includes('Current')) {
          document.getElementById('ohmsSolvedValue').textContent = res.formattedCurrent;
        } else if (res.solvedTarget.includes('Resistance')) {
          document.getElementById('ohmsSolvedValue').textContent = res.formattedResistance;
        } else {
          document.getElementById('ohmsSolvedValue').textContent = res.formattedPower;
        }

        document.getElementById('ohmsResV').textContent = res.formattedVoltage;
        document.getElementById('ohmsResI').textContent = res.formattedCurrent;
        document.getElementById('ohmsResR').textContent = res.formattedResistance;
        document.getElementById('ohmsResP').textContent = res.formattedPower;

        document.getElementById('ohmsResultExplanation').innerHTML = res.steps.join('<br>');
      } catch (err) {
        showError('ohmsCalcError', err.message);
      }
    }

    document.getElementById('btnCalcOhms').addEventListener('click', calcOhms);
    [vInp, iInp, rInp].forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') calcOhms(); });
    });

    document.getElementById('btnResetOhms').addEventListener('click', () => {
      vInp.value = '12';
      iInp.value = '';
      rInp.value = '6';
      vUnit.value = 'V';
      iUnit.value = 'A';
      rUnit.value = 'Ω';
      showError('ohmsCalcError', null);
      calcOhms();
    });

    // Initial run
    calcOhms();
  }

  /* ===================================================================
     6. POWER CALCULATOR CONTROLLER
     =================================================================== */
  function initPowerCalculator() {
    const vInp = document.getElementById('powerVoltInput');
    const vUnit = document.getElementById('powerVoltUnit');
    const iInp = document.getElementById('powerCurrentInput');
    const iUnit = document.getElementById('powerCurrentUnit');
    const rInp = document.getElementById('powerResInput');
    const rUnit = document.getElementById('powerResUnit');
    const pInp = document.getElementById('powerWattInput');
    const pUnit = document.getElementById('powerWattUnit');

    function calcPower() {
      showError('powerCalcError', null);
      try {
        const res = PowerCalc.calculatePower({
          voltage: vInp.value,
          voltageUnit: vUnit.value,
          current: iInp.value,
          currentUnit: iUnit.value,
          resistance: rInp.value,
          resistanceUnit: rUnit.value,
          power: pInp.value,
          powerUnit: pUnit.value
        });

        document.getElementById('powerResVal').textContent = res.formatted.power;
        document.getElementById('powerOutV').textContent = res.formatted.voltage;
        document.getElementById('powerOutI').textContent = res.formatted.current;
        document.getElementById('powerOutR').textContent = res.formatted.resistance;
        document.getElementById('powerOutWattage').textContent = res.formatted.recommendedWattage;

        document.getElementById('powerResultExplanation').innerHTML = res.steps.join('<br>');
      } catch (err) {
        showError('powerCalcError', err.message);
      }
    }

    document.getElementById('btnCalcPower').addEventListener('click', calcPower);
    [vInp, iInp, rInp, pInp].forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') calcPower(); });
    });

    document.getElementById('btnResetPower').addEventListener('click', () => {
      vInp.value = '12';
      iInp.value = '2';
      rInp.value = '';
      pInp.value = '';
      vUnit.value = 'V';
      iUnit.value = 'A';
      rUnit.value = 'Ω';
      pUnit.value = 'W';
      showError('powerCalcError', null);
      calcPower();
    });

    // Initial run
    calcPower();
  }

  /* ===================================================================
     7. VOLTAGE DIVIDER CALCULATOR CONTROLLER
     =================================================================== */
  function initVoltageDividerCalculator() {
    const vinInp = document.getElementById('divVinInput');
    const vinUnit = document.getElementById('divVinUnit');
    const r1Inp = document.getElementById('divR1Input');
    const r1Unit = document.getElementById('divR1Unit');
    const r2Inp = document.getElementById('divR2Input');
    const r2Unit = document.getElementById('divR2Unit');
    const rlInp = document.getElementById('divRlInput');
    const rlUnit = document.getElementById('divRlUnit');

    // Diagram elements
    const dVin = document.getElementById('diagVin');
    const dR1 = document.getElementById('diagR1');
    const dR2 = document.getElementById('diagR2');
    const dVout = document.getElementById('diagVout');

    function calcDivider() {
      showError('divCalcError', null);
      try {
        const res = VoltageDividerCalc.calculateVoltageDivider({
          vin: vinInp.value,
          vinUnit: vinUnit.value,
          r1: r1Inp.value,
          r1Unit: r1Unit.value,
          r2: r2Inp.value,
          r2Unit: r2Unit.value,
          rl: rlInp.value,
          rlUnit: rlUnit.value
        });

        document.getElementById('divResultVout').textContent = res.formatted.vout;
        document.getElementById('divResultRatio').textContent = `Ratio: ${res.divisionRatio} (${res.ratioPercent}%)`;
        document.getElementById('divResultCurrent').textContent = res.formatted.dividerCurrent;
        document.getElementById('divResultRtotal').textContent = res.formatted.rTotal;
        document.getElementById('divResultDropR1').textContent = res.formatted.vDropR1;
        document.getElementById('divResultDropR2').textContent = res.formatted.vDropR2;
        document.getElementById('divResultPowerR1').textContent = res.formatted.powerR1;
        document.getElementById('divResultPowerR2').textContent = res.formatted.powerR2;

        // Update circuit schematic text
        dVin.textContent = `Vin = ${res.formatted.vin}`;
        dR1.textContent = `R1: ${res.formatted.r1}`;
        dR2.textContent = res.hasLoad ? `R2||RL: ${Units.formatEngineering(res.r2Equivalent, 'Ω').formatted}` : `R2: ${res.formatted.r2}`;
        dVout.textContent = `Vout = ${res.formatted.vout}`;

        document.getElementById('divResultExplanation').innerHTML = res.steps.join('<br>');
      } catch (err) {
        showError('divCalcError', err.message);
      }
    }

    document.getElementById('btnCalcDivider').addEventListener('click', calcDivider);
    [vinInp, r1Inp, r2Inp, rlInp].forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') calcDivider(); });
    });

    document.getElementById('btnResetDivider').addEventListener('click', () => {
      vinInp.value = '10';
      r1Inp.value = '10';
      r2Inp.value = '10';
      rlInp.value = '';
      vinUnit.value = 'V';
      r1Unit.value = 'kΩ';
      r2Unit.value = 'kΩ';
      rlUnit.value = 'kΩ';
      showError('divCalcError', null);
      calcDivider();
    });

    // Initial run
    calcDivider();
  }

  /* ===================================================================
     8. SERIES & PARALLEL RESISTOR CALCULATOR CONTROLLER
     =================================================================== */
  function initSeriesParallelCalculator() {
    const modeGroup = document.getElementById('networkModeGroup');
    const rowsList = document.getElementById('resistorRowsList');
    const networkTitle = document.getElementById('networkTitle');
    const vSupplyInput = document.getElementById('networkVoltSupply');
    const vSupplyUnit = document.getElementById('networkVoltUnit');
    const btnAddRow = document.getElementById('btnAddResistorRow');

    modeGroup.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modeGroup.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentNetworkMode = btn.getAttribute('data-mode');
        networkTitle.textContent = currentNetworkMode === 'series' ? 'Series Resistors List' : 'Parallel Resistors List';
        document.getElementById('networkModeBadge').textContent = currentNetworkMode === 'series' ? 'Series Network' : 'Parallel Network';
        calcNetwork();
      });
    });

    function createRow(index, value = '', unit = 'Ω') {
      const row = document.createElement('div');
      row.className = 'resistor-input-row';
      row.innerHTML = `
        <span class="resistor-row-label">R${index}</span>
        <input type="number" step="any" class="resistor-row-val" placeholder="Value" value="${value}">
        <select class="unit-select row-unit">
          <option value="Ω"${unit === 'Ω' ? ' selected' : ''}>Ω</option>
          <option value="kΩ"${unit === 'kΩ' ? ' selected' : ''}>kΩ</option>
          <option value="MΩ"${unit === 'MΩ' ? ' selected' : ''}>MΩ</option>
        </select>
        <button type="button" class="row-delete-btn" title="Remove Resistor">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      `;

      const deleteBtn = row.querySelector('.row-delete-btn');
      deleteBtn.addEventListener('click', () => {
        const allRows = rowsList.querySelectorAll('.resistor-input-row');
        if (allRows.length > 1) {
          row.remove();
          renumberRows();
          calcNetwork();
        }
      });

      return row;
    }

    function renumberRows() {
      const allRows = rowsList.querySelectorAll('.resistor-input-row');
      allRows.forEach((r, idx) => {
        r.querySelector('.resistor-row-label').textContent = `R${idx + 1}`;
        const delBtn = r.querySelector('.row-delete-btn');
        if (allRows.length === 1) {
          delBtn.style.visibility = 'hidden';
        } else {
          delBtn.style.visibility = 'visible';
        }
      });
      resistorRowCount = allRows.length;
    }

    btnAddRow.addEventListener('click', () => {
      resistorRowCount++;
      const newRow = createRow(resistorRowCount, '100', 'Ω');
      rowsList.appendChild(newRow);
      renumberRows();
      newRow.querySelector('.resistor-row-val').focus();
    });

    // Preset buttons
    document.getElementById('btnPreset2Res').addEventListener('click', () => setPresetRows([100, 200]));
    document.getElementById('btnPreset3Res').addEventListener('click', () => setPresetRows([100, 200, 300]));
    document.getElementById('btnPreset4Res').addEventListener('click', () => setPresetRows([100, 220, 470, 1000]));

    function setPresetRows(values) {
      rowsList.innerHTML = '';
      values.forEach((v, i) => {
        rowsList.appendChild(createRow(i + 1, v, 'Ω'));
      });
      renumberRows();
      calcNetwork();
    }

    // Attach row events
    rowsList.addEventListener('keydown', e => {
      if (e.key === 'Enter') calcNetwork();
    });

    function getResistorsData() {
      const rows = rowsList.querySelectorAll('.resistor-input-row');
      const list = [];
      rows.forEach(r => {
        const val = r.querySelector('.resistor-row-val').value;
        const unit = r.querySelector('.row-unit').value;
        list.push({ value: val, unit });
      });
      return list;
    }

    function calcNetwork() {
      showError('networkCalcError', null);
      try {
        const resistors = getResistorsData();
        const vSupply = vSupplyInput.value;
        const vUnit = vSupplyUnit.value;

        let res;
        if (currentNetworkMode === 'series') {
          res = SeriesParallelCalc.calculateSeriesResistance(resistors, vSupply, vUnit);
        } else {
          res = SeriesParallelCalc.calculateParallelResistance(resistors, vSupply, vUnit);
        }

        document.getElementById('networkResultTotal').textContent = res.formattedTotal;
        document.getElementById('networkResultOhms').textContent = `${res.inOhms} Ω`;
        document.getElementById('networkResultKilo').textContent = `${res.inKiloOhms} kΩ`;
        document.getElementById('networkResultMega').textContent = `${res.inMegaOhms} MΩ`;
        document.getElementById('networkResultStandard').textContent = res.standardResistor;

        const branchContainer = document.getElementById('networkBranchContainer');
        const branchList = document.getElementById('networkBranchList');

        if (res.hasVoltage && res.branches && res.branches.length > 0) {
          branchContainer.style.display = 'block';
          document.getElementById('networkBranchHeader').textContent =
            currentNetworkMode === 'series'
              ? `Circuit Current: ${res.formattedCurrent} | Branch Voltage Drops`
              : `Total Current: ${res.formattedCurrent} | Branch Currents`;

          branchList.innerHTML = res.branches.map(b => {
            if (currentNetworkMode === 'series') {
              return `<div>• R${b.id} (${b.resistance}): Voltage Drop = <strong>${b.voltageDrop}</strong> | Power = ${b.power}</div>`;
            } else {
              return `<div>• R${b.id} (${b.resistance}): Current = <strong>${b.branchCurrent}</strong> | Power = ${b.power}</div>`;
            }
          }).join('');
        } else {
          branchContainer.style.display = 'none';
        }

        document.getElementById('networkResultExplanation').innerHTML = res.steps.join('<br>');
      } catch (err) {
        showError('networkCalcError', err.message);
      }
    }

    document.getElementById('btnCalcNetwork').addEventListener('click', calcNetwork);

    document.getElementById('btnResetNetwork').addEventListener('click', () => {
      setPresetRows([100, 200]);
      vSupplyInput.value = '';
      showError('networkCalcError', null);
    });

    // Wire up initial delete button
    renumberRows();
    calcNetwork();
  }

  /* ===================================================================
     9. COMPONENT REFERENCE CONTROLLER
     =================================================================== */
  function initComponentReference() {
    const grid = document.getElementById('refComponentsGrid');
    const searchInp = document.getElementById('refSearchInput');
    const filterGroup = document.getElementById('refCategoryFilters');

    let currentCategory = 'all';

    filterGroup.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterGroup.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-category');
        renderComponents();
      });
    });

    searchInp.addEventListener('input', () => {
      renderComponents();
    });

    function renderComponents() {
      const query = searchInp.value;
      const list = ComponentReference.filterComponents(query, currentCategory);

      if (list.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align:center; padding: 48px; color: var(--text-muted);">
            <p style="font-size: 1.1rem; font-weight:600;">No electronic components found matching "${query}".</p>
            <p style="font-size: 0.85rem; margin-top: 6px;">Try searching for Resistor, Diode, BJT, or 555.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = list.map(comp => `
        <div class="ref-card">
          <div class="ref-card-header">
            <h3>${comp.name}</h3>
            <span class="ref-category-tag">${comp.category}</span>
          </div>

          <div class="ref-symbol-wrapper">
            ${comp.symbolSvg}
          </div>

          <div class="ref-meta-row">
            <strong>Function:</strong>
            <span>${comp.functionDesc}</span>
          </div>

          <div class="ref-meta-row">
            <strong>SI Unit:</strong>
            <span class="text-cyan">${comp.unit}</span>
          </div>

          <div class="ref-meta-row">
            <strong>Terminals:</strong>
            <span>${comp.terminals}</span>
          </div>

          <div class="ref-meta-row">
            <strong>Common Parts:</strong>
            <span>${comp.commonParts}</span>
          </div>

          <div class="ref-formula-box">
            ${comp.formula}
          </div>

          <div>
            <strong style="font-size: 0.78rem; text-transform:uppercase; color:var(--text-dim); letter-spacing:0.05em;">Typical Applications:</strong>
            <ul class="ref-apps-list" style="margin-top:6px;">
              ${comp.applications.map(app => `<li>${app}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('');
    }

    renderComponents();
  }

  /* ===================================================================
     10. SMD RESISTOR CALCULATOR CONTROLLER
     =================================================================== */
  function initSmdCalculator() {
    const smdInput = document.getElementById('smdCodeInput');
    const smdVisual = document.getElementById('smdVisualMarking');

    document.querySelectorAll('[data-smd]').forEach(chip => {
      chip.addEventListener('click', () => {
        smdInput.value = chip.getAttribute('data-smd');
        calcSmd();
      });
    });

    smdInput.addEventListener('input', () => {
      smdVisual.textContent = smdInput.value.trim().toUpperCase() || '---';
    });

    function calcSmd() {
      showError('smdCalcError', null);
      try {
        const code = smdInput.value.trim().toUpperCase();
        const res = SmdResistorCalc.calculateSmdResistor(code);

        smdVisual.textContent = code;
        document.getElementById('smdResultVal').textContent = res.formatted;
        document.getElementById('smdResultTol').textContent = `${res.tolerance} (${res.standard})`;
        document.getElementById('smdResultOhms').textContent = `${res.inOhms} Ω`;
        document.getElementById('smdResultKilo').textContent = `${res.inKiloOhms} kΩ`;
        document.getElementById('smdResultMega').textContent = `${res.inMegaOhms} MΩ`;
        document.getElementById('smdResultStandard').textContent = res.standard;
        document.getElementById('smdResultExplanation').innerHTML = res.explanation.replace(/\n/g, '<br>');
      } catch (err) {
        showError('smdCalcError', err.message);
      }
    }

    document.getElementById('btnCalcSmd').addEventListener('click', calcSmd);
    smdInput.addEventListener('keydown', e => { if (e.key === 'Enter') calcSmd(); });

    document.getElementById('btnResetSmd').addEventListener('click', () => {
      smdInput.value = '472';
      smdVisual.textContent = '472';
      showError('smdCalcError', null);
      calcSmd();
    });

    // Initial run
    calcSmd();
  }

  /* ===================================================================
     11. 555 TIMER & RC FILTER CONTROLLER
     =================================================================== */
  function initTimerCalculator() {
    let timerMode = 'astable'; // 'astable', 'monostable', 'filter'
    const modeGroup = document.getElementById('timerModeGroup');
    const grpAstable = document.getElementById('groupAstableInputs');
    const grpMonoFilter = document.getElementById('groupMonoFilterInputs');
    const astableMetrics = document.getElementById('timerAstableMetrics');
    const filterMetrics = document.getElementById('timerFilterMetrics');
    const visualSub = document.getElementById('timerVisualSub');
    const presetsContainer = document.getElementById('timerPresetsContainer');

    modeGroup.querySelectorAll('.pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modeGroup.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        timerMode = btn.getAttribute('data-timermode');

        if (timerMode === 'astable') {
          grpAstable.style.display = 'block';
          grpMonoFilter.style.display = 'none';
          astableMetrics.style.display = 'grid';
          filterMetrics.style.display = 'none';
          visualSub.textContent = 'Astable Mode';
          document.getElementById('timerModeBadge').textContent = 'f = 1.44 / (R1+2R2)C';
          presetsContainer.style.display = 'flex';
        } else if (timerMode === 'monostable') {
          grpAstable.style.display = 'none';
          grpMonoFilter.style.display = 'block';
          astableMetrics.style.display = 'none';
          filterMetrics.style.display = 'none';
          document.getElementById('lblSingleR').textContent = 'Timing Resistor R (VCC to Pin 7/6)';
          document.getElementById('lblSingleC').textContent = 'Timing Capacitor C';
          visualSub.textContent = 'Monostable Pulse';
          document.getElementById('timerModeBadge').textContent = 'T = 1.1 × R × C';
          presetsContainer.style.display = 'none';
        } else if (timerMode === 'filter') {
          grpAstable.style.display = 'none';
          grpMonoFilter.style.display = 'block';
          astableMetrics.style.display = 'none';
          filterMetrics.style.display = 'grid';
          document.getElementById('lblSingleR').textContent = 'Filter Resistor R';
          document.getElementById('lblSingleC').textContent = 'Filter Capacitor C';
          visualSub.textContent = 'RC Filter Cutoff';
          document.getElementById('timerModeBadge').textContent = 'fc = 1 / (2πRC)';
          presetsContainer.style.display = 'none';
        }

        calcTimer();
      });
    });

    // Preset buttons
    document.getElementById('btnPresetAstable1k').addEventListener('click', () => {
      document.getElementById('timerR1Input').value = '1';
      document.getElementById('timerR1Unit').value = 'kΩ';
      document.getElementById('timerR2Input').value = '10';
      document.getElementById('timerR2Unit').value = 'kΩ';
      document.getElementById('timerCInput').value = '68';
      document.getElementById('timerCUnit').value = 'nF';
      calcTimer();
    });

    document.getElementById('btnPresetAstable1Hz').addEventListener('click', () => {
      document.getElementById('timerR1Input').value = '1';
      document.getElementById('timerR1Unit').value = 'kΩ';
      document.getElementById('timerR2Input').value = '68';
      document.getElementById('timerR2Unit').value = 'kΩ';
      document.getElementById('timerCInput').value = '10';
      document.getElementById('timerCUnit').value = 'µF';
      calcTimer();
    });

    function calcTimer() {
      showError('timerCalcError', null);
      try {
        if (timerMode === 'astable') {
          const res = Timer555Calc.calculate555Astable({
            r1: document.getElementById('timerR1Input').value,
            r1Unit: document.getElementById('timerR1Unit').value,
            r2: document.getElementById('timerR2Input').value,
            r2Unit: document.getElementById('timerR2Unit').value,
            c: document.getElementById('timerCInput').value,
            cUnit: document.getElementById('timerCUnit').value
          });

          document.getElementById('timerPrimaryLabel').textContent = 'Oscillation Frequency (f)';
          document.getElementById('timerPrimaryVal').textContent = res.formattedFreq;
          document.getElementById('timerPeriodVal').textContent = res.formattedPeriod;
          document.getElementById('timerDutyVal').textContent = `${res.dutyCycle}%`;
          document.getElementById('timerHighVal').textContent = res.formattedHigh;
          document.getElementById('timerLowVal').textContent = res.formattedLow;
          document.getElementById('timerResultExplanation').innerHTML = res.steps.join('<br>');
        } else if (timerMode === 'monostable') {
          const res = Timer555Calc.calculate555Monostable({
            r: document.getElementById('timerSingleRInput').value,
            rUnit: document.getElementById('timerSingleRUnit').value,
            c: document.getElementById('timerSingleCInput').value,
            cUnit: document.getElementById('timerSingleCUnit').value
          });

          document.getElementById('timerPrimaryLabel').textContent = 'Pulse Duration (T)';
          document.getElementById('timerPrimaryVal').textContent = res.formattedPulse;
          document.getElementById('timerResultExplanation').innerHTML = res.steps.join('<br>');
        } else if (timerMode === 'filter') {
          const res = Timer555Calc.calculateRcFilter({
            r: document.getElementById('timerSingleRInput').value,
            rUnit: document.getElementById('timerSingleRUnit').value,
            c: document.getElementById('timerSingleCInput').value,
            cUnit: document.getElementById('timerSingleCUnit').value
          });

          document.getElementById('timerPrimaryLabel').textContent = 'Cutoff Frequency (-3dB)';
          document.getElementById('timerPrimaryVal').textContent = res.formattedFreq;
          document.getElementById('timerFilterFcVal').textContent = res.formattedFreq;
          document.getElementById('timerFilterTauVal').textContent = res.formattedTau;
          document.getElementById('timerResultExplanation').innerHTML = res.steps.join('<br>');
        }
      } catch (err) {
        showError('timerCalcError', err.message);
      }
    }

    document.getElementById('btnCalcTimer').addEventListener('click', calcTimer);
    document.querySelectorAll('#groupAstableInputs input, #groupMonoFilterInputs input').forEach(inp => {
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') calcTimer(); });
    });

    document.getElementById('btnResetTimer').addEventListener('click', () => {
      document.getElementById('timerR1Input').value = '1';
      document.getElementById('timerR2Input').value = '10';
      document.getElementById('timerCInput').value = '10';
      document.getElementById('timerCUnit').value = 'µF';
      showError('timerCalcError', null);
      calcTimer();
    });

    // Initial run
    calcTimer();
  }

  /* ===================================================================
     12. LAB REPORT EXPORT & PRINT CONTROLLER
     =================================================================== */
  function initLabReportModal() {
    const modal = document.getElementById('labReportModal');
    const btnOpen = document.getElementById('btnOpenLabReport');
    const btnClose = document.getElementById('btnCloseLabReport');
    const btnPrint = document.getElementById('btnPrintReportAction');
    const btnCopy = document.getElementById('btnCopyReportText');
    const previewEl = document.getElementById('reportPreviewContent');

    const inpName = document.getElementById('reportStudentName');
    const inpRoll = document.getElementById('reportRollNo');
    const inpCollege = document.getElementById('reportCollege');
    const selSubject = document.getElementById('reportSubject');

    function updatePreview() {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];

      // Pull current live values
      const resVal = document.getElementById('resResultValue')?.textContent || '4.7 kΩ';
      const resTol = document.getElementById('resResultTolBadge')?.textContent || '±5%';
      const resRange = document.getElementById('resResultRange')?.textContent || '4.465 kΩ – 4.935 kΩ';

      const capSI = document.getElementById('capResultSI')?.textContent || '100 nF';
      const capCode = document.getElementById('capResultCodeDisplay')?.textContent || '104K';

      const ledR = document.getElementById('ledResultOhms')?.textContent || '150 Ω';
      const ledP = document.getElementById('ledResultPower')?.textContent || '60 mW';
      const ledWattage = document.getElementById('ledResultWattage')?.textContent || '1/4 W (0.25 W)';

      const vout = document.getElementById('divResultVout')?.textContent || '5 V';
      const idiv = document.getElementById('divResultCurrent')?.textContent || '500 µA';

      const report = [
        '================================================================================',
        '           ELECTRONIC COMPONENT CALCULATION & LAB JOURNAL REPORT',
        '================================================================================',
        `Generated via ElectroCalc ENTC Workbench`,
        `Date: ${dateStr}`,
        `Student: ${inpName.value.trim() || 'ENTC Student'} | Roll: ${inpRoll.value.trim() || 'N/A'}`,
        `Institute: ${inpCollege.value.trim() || 'Department of Electronics & Telecommunication'}`,
        `Subject: ${selSubject.value}`,
        '--------------------------------------------------------------------------------',
        '1. RESISTOR COLOR CODE & TOLERANCE:',
        `   • Nominal Resistance: ${resVal} (${resTol})`,
        `   • Boundary Range: ${resRange}`,
        '',
        '2. CAPACITOR VALUE & EIA CODE:',
        `   • Decoded EIA Code: ${capCode}`,
        `   • Nominal Capacitance: ${capSI}`,
        '',
        '3. LED CURRENT-LIMITING RESISTOR & SIZING:',
        `   • Limiting Resistor Required: ${ledR}`,
        `   • Resistor Power Dissipation: ${ledP}`,
        `   • Recommended Commercial Rating: ${ledWattage} (2x safety de-rating factor)`,
        '',
        '4. VOLTAGE DIVIDER CIRCUIT ANALYSIS:',
        `   • Output Voltage (Vout): ${vout}`,
        `   • Total Divider Current: ${idiv}`,
        '--------------------------------------------------------------------------------',
        'Faculty / Evaluator Signature: ________________________   Grade / Marks: _______',
        '================================================================================'
      ].join('\n');

      previewEl.textContent = report;
    }

    btnOpen.addEventListener('click', () => {
      updatePreview();
      modal.classList.add('active');
    });

    btnClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });

    [inpName, inpRoll, inpCollege, selSubject].forEach(el => {
      el.addEventListener('input', updatePreview);
    });

    btnPrint.addEventListener('click', () => {
      window.print();
    });

    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(previewEl.textContent).then(() => {
        const orig = btnCopy.textContent;
        btnCopy.textContent = 'Copied!';
        setTimeout(() => { btnCopy.textContent = orig; }, 1800);
      });
    });
  }

  /* ===================================================================
     13. CLIPBOARD COPY UTILITY
     =================================================================== */
  function initCopyButtons() {
    function copyCardContent(cardId, buttonId) {
      const btn = document.getElementById(buttonId);
      const card = document.getElementById(cardId);
      if (!btn || !card) return;

      btn.addEventListener('click', () => {
        // Build clean formatted text from the card
        const textToCopy = extractCardText(card);
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalHtml = btn.innerHTML;
          btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Copied!</span>
          `;
          btn.style.borderColor = 'var(--accent-green)';
          btn.style.color = 'var(--accent-green)';

          setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.style.borderColor = '';
            btn.style.color = '';
          }, 1800);
        }).catch(err => {
          console.error('Clipboard copy error: ', err);
        });
      });
    }

    function extractCardText(card) {
      const lines = [];
      const title = card.querySelector('.result-title')?.textContent || 'Result';
      lines.push(`=== ${title.toUpperCase()} ===`);
      const mainVal = card.querySelector('.result-val-large')?.textContent;
      if (mainVal) lines.push(`Primary Value: ${mainVal}`);

      const metrics = card.querySelectorAll('.metric-item');
      metrics.forEach(m => {
        const lbl = m.querySelector('.metric-label')?.textContent;
        const val = m.querySelector('.metric-value')?.textContent;
        if (lbl && val) lines.push(`${lbl}: ${val}`);
      });

      const explanation = card.querySelector('.explanation-steps')?.textContent;
      if (explanation) lines.push(`\nCalculations / Notes:\n${explanation.trim()}`);

      lines.push('\n[Calculated via Electronic Component Calculator]');
      return lines.join('\n');
    }

    copyCardContent('resistorResultCard', 'btnCopyResResult');
    copyCardContent('capResultCard', 'btnCopyCapResult');
    copyCardContent('ledResultCard', 'btnCopyLedResult');
    copyCardContent('ohmsResultCard', 'btnCopyOhmsResult');
    copyCardContent('powerResultCard', 'btnCopyPowerResult');
    copyCardContent('divResultCard', 'btnCopyDivResult');
    copyCardContent('networkResultCard', 'btnCopyNetworkResult');
    copyCardContent('smdResultCard', 'btnCopySmdResult');
    copyCardContent('timerResultCard', 'btnCopyTimerResult');
  }

  // Boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

