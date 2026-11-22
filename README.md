# Electronic Component Calculator (ElectroCalc)
**Comprehensive ENTC Engineering / Diploma Project Application**

> An interactive, offline-ready, responsive web application for calculating and identifying electronic component values, circuit parameters, and standard commercial component ratings.

---

## 1. Project Objective

In Electronics & Telecommunication Engineering (ENTC), Electrical Engineering, and Diploma lab work, students and hobbyists frequently need to calculate resistor color codes, decode ceramic capacitor markings, design LED current-limiting networks, analyze voltage dividers with load effects, and evaluate Ohm's Law and DC power dissipation.

The objective of **Electronic Component Calculator** is to provide an all-in-one, mathematically rigorous workbench that:
- Eliminates common calculation errors during lab experiments and breadboard prototyping.
- Teaches the underlying engineering equations with step-by-step mathematical breakdowns.
- Recommends standard commercial component values (E12 and E24 series) and safe wattage ratings.
- Provides immediate visual feedback through dynamic schematics and component graphics.
- Functions 100% offline directly in any modern web browser without requiring a backend server or complex build tools.

---

## 2. Key Features

### 1. Resistor Color Code Calculator
- **4-Band, 5-Band, and 6-Band support** with strict validation preventing non-standard color combinations (e.g. black or gold in the 1st band).
- **Interactive Visual Resistor Preview:** updates band colors live with realistic ceramic body rendering and metal leads.
- **Outputs:** Formatted resistance (e.g., $4.7\text{ k}\Omega$), tolerance percentage ($\pm 5\%$), minimum/maximum tolerance boundary range ($4.465\text{ k}\Omega - 4.935\text{ k}\Omega$), and temperature coefficient ($\text{ppm/K}$).
- **Resistor Value Converter (Req. 6):** Bidirectional conversion across $\Omega$, $\text{k}\Omega$, and $\text{M}\Omega$ with nearest E24 standard resistor identification.
- **Reverse Color Band Lookup:** Type a target resistance and view the corresponding color bands.

### 2. Capacitor Calculator
- **3-Digit EIA Ceramic/Film Code Decoder:** Converts codes like `104`, `103`, `102`, `473`, `220`, and `4R7` into Picofarads ($\text{pF}$), Nanofarads ($\text{nF}$), and Microfarads ($\mu\text{F}$).
- **Tolerance Letter Codes:** Decodes suffix letters (J: $\pm 5\%$, K: $\pm 10\%$, M: $\pm 20\%$, F: $\pm 1\%$, Z: $+80\%/-20\%$).
- **Visual Disc Capacitor Preview:** Live capacitor body reflecting the entered code and tolerance.
- **Reverse Capacitor Code Generator:** Enter capacitance in $\text{pF}$, $\text{nF}$, or $\mu\text{F}$ to generate the corresponding EIA 3-digit code.

### 3. LED Series Resistor Calculator
- **Current Limiting Calculation:** Determines required resistance using $R = (V_s - V_{LED}) / I$.
- **Series Array Support:** Allows calculation for multiple LEDs connected in series ($N \times V_f$).
- **Standard E24 Resistor Recommendation:** Matches the calculated resistance to the nearest commercial resistor and calculates the actual operating current.
- **Power Dissipation & Wattage Rating:** Calculates heat dissipation ($P = I^2 R$) and suggests commercial resistor wattage ($1/8\text{ W}$, $1/4\text{ W}$, $1/2\text{ W}$, $1\text{ W}$) with a $2\times$ safety factor.
- **Quick LED Presets:** Instant parameters for Red, Green, Blue, White, Yellow, and UV LEDs.
- **Interactive SVG Circuit Diagram:** Illustrates supply node, resistor, LED, and ground.

### 4. Ohm's Law Calculator
- **Tri-Parameter Solver:** Enter any 2 values among Voltage ($V$), Current ($I$), and Resistance ($R$); automatically computes the third.
- **Multi-Unit Input Support:** Voltage ($\text{mV}$, $\text{V}$, $\text{kV}$), Current ($\mu\text{A}$, $\text{mA}$, $\text{A}$), Resistance ($\Omega$, $\text{k}\Omega$, $\text{M}\Omega$).
- **Simultaneous Power Output:** Automatically computes DC power ($P = V \times I$).
- **Step-by-Step Educational Proof:** Shows formula used, substituted values, and unit conversions.

### 5. DC Power Calculator (Ohm's Power Wheel)
- **Comprehensive 12-Formula Wheel:** Solves all pairwise combinations across $V$, $I$, $R$, and $P$:
  - $P = V \times I$, $P = I^2 R$, $P = V^2 / R$
  - $V = I \times R$, $V = P / I$, $V = \sqrt{P \times R}$
  - $I = V / R$, $I = P / V$, $I = \sqrt{P / R}$
  - $R = V / I$, $R = V^2 / P$, $R = P / I^2$
- **Units:** Watts ($\text{W}$), Milliwatts ($\text{mW}$), Kilowatts ($\text{kW}$).
- **Resistor Wattage Sizing:** Recommends safe resistor power rating.

### 6. Voltage Divider Calculator
- **Unloaded & Loaded Voltage Dividers:** Calculates $V_{out}$, divider current, individual voltage drops across $R_1$ and $R_2$, power dissipation, and divider attenuation ratio.
- **Loading Effect ($R_L$):** Demonstrates how connecting a load across $V_{out}$ lowers the output voltage ($R_2 \parallel R_L$).
- **Live Circuit Schematic:** Displays dynamic voltages and resistance labels on an embedded SVG schematic.

### 7. Series & Parallel Resistor Networks
- **Dynamic Resistor Management:** Add or remove unlimited resistor rows ($R_1, R_2, R_3, \dots, R_n$) with individual unit selectors.
- **Presets:** Quick 2-resistor, 3-resistor, and 4-resistor network templates.
- **Circuit Analysis with Voltage:** Enter optional supply voltage to determine total circuit current, individual resistor voltage drops (series), or branch currents (parallel).
- **Zero-Ohm Safety:** Correctly handles short circuits in parallel networks without throwing errors or infinite loops.

### 8. SMD Resistor Calculator (Surface-Mount Technology)
- **3-Digit Standard (5% tolerance):** Decodes standard codes (e.g. `472` = $4.7\text{ k}\Omega$, `103` = $10\text{ k}\Omega$).
- **4-Digit Precision (1% tolerance):** Decodes precision codes (e.g. `1001` = $1\text{ k}\Omega$, `4702` = $47\text{ k}\Omega$).
- **EIA-96 System (1% High-Precision):** Decodes 2-digit lookup values with letter multipliers (e.g. `01A` = $100\ \Omega$, `68C` = $49.9\text{ k}\Omega$).
- **Decimal & Zero-Ohm Jumpers:** Decodes `4R7` ($4.7\ \Omega$), `R100` ($0.1\ \Omega$), and `000` jumper links.
- **Visual SMD Package:** Realistic surface-mount chip with metal end terminals.

### 9. 555 Timer IC & Passive RC Filter Calculator
- **555 Astable Multivibrator:** Free-running square wave oscillator frequency ($f = \frac{1.44}{(R_1 + 2R_2)C}$), total period $T$, $T_{\text{high}}$, $T_{\text{low}}$, and duty cycle percentage.
- **555 Monostable Multivibrator:** One-shot triggered output pulse width ($T = 1.1 \times R \times C$).
- **Passive RC Filter (-3dB Cutoff):** 1st-order Low-Pass / High-Pass filter cutoff frequency ($f_c = \frac{1}{2\pi R C}$) and time constant ($\tau = R \times C$).
- **DIP-8 Package Visual:** Live IC illustration with Pin 1 notch.

### 10. Official Lab Calculation Report & Print Generator
- Enter Student Name, Roll No./PRN, College/Institute, and Subject.
- Generates a formatted academic laboratory calculation sheet ready to print or save as PDF via `@media print`.

### 11. Electronic Component Quick Reference Guide
- **ENTC Student Reference Directory:** Comprehensive cards for 9 essential electronic components:
  1. Resistor (Fixed, Potentiometer, LDR)
  2. Capacitor (Ceramic, Electrolytic, Film)
  3. Inductor (Coil, Toroid, Choke)
  4. PN Junction Diode (Rectifier 1N4007, Signal 1N4148, Zener)
  5. Light Emitting Diode (LED)
  6. Bipolar Junction Transistor (BJT: NPN BC547, PNP BC557)
  7. MOSFET (N-Channel IRF540N, P-Channel IRF9540)
  8. Integrated Circuit (NE555 Timer, LM741 Op-Amp, 7805 Regulator)
  9. Electrical Transformer (Step-down, Center-tapped)
- **Detailed Specifications:** High-resolution SVG schematic symbols, operational functions, SI units, terminal pinouts, key formulas, standard part numbers, and practical applications.
- **Search & Category Filter:** Live search bar and category filters (All, Passive, Semiconductors, ICs, Magnetics).

### 9. User Experience & Accessibility
- **Dark / Light Theme Toggle:** Clean slate/PCB engineering dark theme and crisp high-contrast light theme.
- **One-Click Clipboard Copying:** Formatted text output ready to paste directly into lab journals and project reports.
- **Responsive Navigation:** Desktop sidebar layout and collapsible slide-over drawer on mobile devices.
- **Reset Button on Every Calculator:** Completely clears inputs, errors, and resets to defaults.
- **Safe Input Validation:** User-friendly alerts replace browser crashes; prevents negative values, empty fields, and division by zero.

---

## 3. Technologies Used

- **HTML5:** Semantic markup (`<aside>`, `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`), ARIA accessibility labels.
- **CSS3:** Custom properties (CSS variables) for dynamic themes, Flexbox, CSS Grid layouts, SVG styling, responsive media queries.
- **JavaScript (ES6+):** Pure modular JavaScript (UMD pattern compatible with both web browsers and Node.js test runners), zero external npm/CDN runtime dependencies.
- **Vector Graphics:** Custom inline SVG schematics and electronic component symbols.

---

## 4. Project Structure

```
electronic-component-calculator/
│
├── index.html                  # Main application shell and UI views
│
├── css/
│   └── style.css               # Responsive design, themes, typography, cards
│
├── js/
│   ├── units.js                # Core unit conversions & E12/E24 resistor lookups
│   ├── resistor.js             # Resistor color codes (4/5/6 bands) & value converter
│   ├── capacitor.js            # 3-digit EIA capacitor decoder & reverse generator
│   ├── led.js                  # LED series resistor, power & commercial wattage
│   ├── ohms-law.js             # Ohm's Law solver (V, I, R) & power calculation
│   ├── power.js                # DC Power wheel (12 formula combinations)
│   ├── voltage-divider.js      # Unloaded & loaded voltage divider analysis
│   ├── series-parallel.js      # Dynamic series & parallel resistor network solver
│   ├── reference.js            # Component reference database with SVG symbols
│   └── app.js                  # Application controller, DOM events, and UI glue
│
├── assets/
│   └── icons/                  # Vector SVG icons
│       ├── home.svg
│       ├── resistor.svg
│       ├── capacitor.svg
│       ├── led.svg
│       ├── ohms.svg
│       ├── power.svg
│       ├── divider.svg
│       ├── circuit.svg
│       └── book.svg
│
├── tests/
│   └── test-calculations.js    # Automated unit test suite verifying 42 test cases
│
└── README.md                   # Complete project documentation
```

---

## 5. How to Run the Project

### Option A: Direct Local Execution (No Server Needed)
1. Navigate to the project directory:
   ```
   C:\Users\ompra\.gemini\antigravity\scratch\electronic-component-calculator
   ```
2. Double-click `index.html` to open it in Google Chrome, Microsoft Edge, Mozilla Firefox, or any modern web browser.
3. The application runs immediately without any installation or internet connection.

### Option B: Running via a Local Web Server (Optional)
If running inside a development environment or web server:
```powershell
# Using Python
python -m http.server 8000

# Using Node.js npx serve
npx serve .
```
Then visit `http://localhost:8000` in your browser.

### Option C: Running the Automated Test Suite
To verify mathematical formulas, unit conversions, and edge cases via Node.js:
```powershell
node tests/test-calculations.js
```

---

## 6. Mathematical Formulas

| Calculator | Formulas Used |
| :--- | :--- |
| **Resistor Color Code** | 4-Band: $R = (D_1 \times 10 + D_2) \times 10^M \pm \text{Tol}\%$<br>5-Band / 6-Band: $R = (D_1 \times 100 + D_2 \times 10 + D_3) \times 10^M \pm \text{Tol}\%$ |
| **Capacitor 3-Digit Code** | $C_{\text{pF}} = (D_1 \times 10 + D_2) \times 10^M$<br>$C_{\text{nF}} = C_{\text{pF}} / 1,000$<br>$C_{\mu\text{F}} = C_{\text{pF}} / 1,000,000$ |
| **LED Current Limiter** | $V_{\text{drop}} = V_{\text{supply}} - (N \times V_{\text{LED}})$<br>$R = V_{\text{drop}} / I_{\text{LED}}$<br>$P_R = V_{\text{drop}} \times I_{\text{LED}} = I_{\text{LED}}^2 \times R$ |
| **Ohm's Law** | $V = I \times R \quad\Longleftrightarrow\quad I = \frac{V}{R} \quad\Longleftrightarrow\quad R = \frac{V}{I}$<br>$P = V \times I$ |
| **DC Power Wheel** | $P = V \times I = I^2 R = \frac{V^2}{R}$<br>$V = I R = \frac{P}{I} = \sqrt{P R}$<br>$I = \frac{V}{R} = \frac{P}{V} = \sqrt{\frac{P}{R}}$<br>$R = \frac{V}{I} = \frac{V^2}{P} = \frac{P}{I^2}$ |
| **Voltage Divider** | $V_{\text{out}} = V_{\text{in}} \times \frac{R_2}{R_1 + R_2}$ (Unloaded)<br>$R_{2\text{eq}} = \frac{R_2 \times R_L}{R_2 + R_L} \implies V_{\text{out}} = V_{\text{in}} \times \frac{R_{2\text{eq}}}{R_1 + R_{2\text{eq}}}$ (Loaded)<br>$I_{\text{div}} = \frac{V_{\text{in}}}{R_1 + R_{2\text{eq}}}$ |
| **Series Resistors** | $R_{\text{total}} = R_1 + R_2 + R_3 + \dots + R_n$<br>$V_i = I \times R_i$ |
| **Parallel Resistors** | $\frac{1}{R_{\text{total}}} = \frac{1}{R_1} + \frac{1}{R_2} + \dots + \frac{1}{R_n} \implies R_{\text{total}} = \frac{1}{\sum (1/R_i)}$<br>Two resistors: $R_{\text{total}} = \frac{R_1 \times R_2}{R_1 + R_2}$<br>$I_i = \frac{V}{R_i}$ |
| **SMD Resistor (EIA-96)** | $R = \text{TableValue}(\text{Digits}) \times \text{Multiplier}(\text{Letter}) \pm 1\%$ |
| **555 Astable Oscillator** | $f = \frac{1.44}{(R_1 + 2R_2)C}$<br>$T_{\text{high}} = 0.693(R_1 + R_2)C$<br>$T_{\text{low}} = 0.693 R_2 C$<br>$\text{Duty \%} = \frac{R_1 + R_2}{R_1 + 2R_2} \times 100\%$ |
| **555 Monostable Pulse** | $T = 1.1 \times R \times C$ |
| **Passive RC Filter** | $f_c = \frac{1}{2\pi R C} \quad (\text{Cutoff at } -3\text{dB})$<br>$\tau = R \times C$ |

---

## 7. Test Cases & Verification

All test cases specified in the project requirements were evaluated through automated tests (`tests/test-calculations.js`):

| Test Case | Inputs | Expected Output | Status |
| :--- | :--- | :--- | :--- |
| **Ohm's Law** | $V = 12\text{ V}, R = 6\ \Omega$ | $I = 2\text{ A}, P = 24\text{ W}$ | **PASS** |
| **LED Resistor** | $V_s = 5\text{ V}, V_f = 2\text{ V}, I = 20\text{ mA}$ | $R = 150\ \Omega, P_R = 60\text{ mW}$ | **PASS** |
| **Voltage Divider** | $V_{\text{in}} = 10\text{ V}, R_1 = 10\text{ k}\Omega, R_2 = 10\text{ k}\Omega$ | $V_{\text{out}} = 5\text{ V}, I = 0.5\text{ mA}$ | **PASS** |
| **Series Resistors** | $R_1 = 100\ \Omega, R_2 = 200\ \Omega$ | $R_{\text{total}} = 300\ \Omega$ | **PASS** |
| **Parallel Resistors** | $R_1 = 100\ \Omega, R_2 = 100\ \Omega$ | $R_{\text{total}} = 50\ \Omega$ | **PASS** |
| **Capacitor 104** | Code `104` | $100\text{ nF}$ ($100,000\text{ pF}, 0.1\ \mu\text{F}$) | **PASS** |
| **Capacitor 103** | Code `103` | $10\text{ nF}$ ($10,000\text{ pF}, 0.01\ \mu\text{F}$) | **PASS** |
| **Capacitor 102** | Code `102` | $1\text{ nF}$ ($1,000\text{ pF}, 0.001\ \mu\text{F}$) | **PASS** |
| **Reverse Capacitor**| Capacitance = $100\text{ nF}$ | EIA Code: `104` | **PASS** |
| **4-Band Resistor** | Yellow, Violet, Red, Gold | $4.7\text{ k}\Omega \pm 5\%$ ($4.465\text{ k}\Omega - 4.935\text{ k}\Omega$) | **PASS** |
| **SMD 3-Digit** | Code `472` | $4.7\text{ k}\Omega \pm 5\%$ | **PASS** |
| **SMD 4-Digit** | Code `1001` | $1.0\text{ k}\Omega \pm 1\%$ | **PASS** |
| **SMD EIA-96** | Code `01A` | $100\ \Omega \pm 1\%$ | **PASS** |
| **SMD Precision**| Code `68C` | $49.9\text{ k}\Omega \pm 1\%$ | **PASS** |
| **555 Astable** | $R_1 = 1\text{ k}\Omega, R_2 = 10\text{ k}\Omega, C = 10\ \mu\text{F}$ | $f \approx 6.86\text{ Hz}, D \approx 52.38\%$ | **PASS** |
| **555 Monostable**| $R = 10\text{ k}\Omega, C = 10\ \mu\text{F}$ | $T \approx 0.11\text{ s}$ | **PASS** |
| **RC Filter Cutoff**| $R = 10\text{ k}\Omega, C = 100\text{ nF}$ | $f_c \approx 159.15\text{ Hz}$ | **PASS** |
| **LED Invalidation** | $V_s = 3\text{ V}, V_f = 3.2\text{ V}$ | Friendly Error: $V_s \le V_f$ prevented | **PASS** |
| **Division by Zero** | $V = 12\text{ V}, I = 0\text{ A}$ | Friendly Error: Division by zero avoided | **PASS** |
| **LED Invalidation** | $V_s = 3\text{ V}, V_f = 3.2\text{ V}$ | Friendly Error: $V_s \le V_f$ prevented | **PASS** |
| **Division by Zero** | $V = 12\text{ V}, I = 0\text{ A}$ | Friendly Error: Division by zero avoided | **PASS** |

---

## 8. Viva Questions & Project Defense Guide

For academic project evaluations and vivas, students can explain:
1. **Why does the LED calculator recommend a resistor wattage higher than the calculated dissipation?**
   - *Answer:* Standard engineering practice applies a $2\times$ safety de-rating factor to prevent excessive thermal stress, thermal drift, and premature resistor failure.
2. **What is the loading effect in a voltage divider?**
   - *Answer:* When a finite load resistance ($R_L$) is connected to $V_{out}$, it forms a parallel combination with $R_2$, reducing the bottom equivalent resistance to $(R_2 \cdot R_L)/(R_2 + R_L)$, causing $V_{out}$ to drop below the ideal unloaded value.
3. **What is the difference between E12 and E24 resistor series?**
   - *Answer:* E12 offers 12 logarithmically spaced values per decade (typical for $10\%$ tolerance), while E24 offers 24 values per decade (standard for $5\%$ tolerance metal/carbon film resistors).
4. **How are negative values and division by zero handled?**
   - *Answer:* Every input is filtered through defensive input validation routines before computation, catching zero resistances, non-numeric strings, and physical impossibilities, rendering friendly explanatory alerts rather than `NaN` or application crashes.

---

## 9. Future Scope

1. **SMD Resistor Code Calculator:** Adding support for 3-digit, 4-digit, and EIA-96 SMD resistor markings.
2. **555 Timer Astable/Monostable Calculator:** Calculating frequency, period, and duty cycle.
3. **Zener Diode Shunt Regulator Calculator:** Sizing current and power dissipation for Zener regulation.
4. **Filter Circuit Calculator:** Passive low-pass and high-pass RC/RL filter cutoff frequency ($f_c = 1 / (2\pi RC)$).
5. **PWA (Progressive Web App) Manifest:** Providing one-click installation on Android, iOS, and Windows desktop homescreens.

---

## 10. License & Credits

Developed for **Electronics & Telecommunication Engineering (ENTC)** diploma and degree coursework.
Open source, designed for academic learning, laboratory sessions, and circuit prototyping.

