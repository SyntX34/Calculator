<?php
?>
<div class="calculator-container">
    <div class="calculator-header">
        <h2 id="modeTitle">Normal Calculator</h2>
        <div class="calculator-history">
            <button id="historyToggle" class="btn-icon" title="History">
                <i class="fas fa-history"></i>
            </button>
        </div>
    </div>
    
    <div class="calculator-mode-content" id="modeContent">
        <div class="mode-panel active" data-mode="normal">
            <div class="calc-display">
                <div class="calc-expression" id="normalExpression"></div>
                <div class="calc-result" id="normalResult">0</div>
            </div>
            <div class="calc-buttons">
                <button class="btn-calc" data-action="clear">AC</button>
                <button class="btn-calc" data-action="sign">±</button>
                <button class="btn-calc" data-action="backspace">⌫</button>
                <button class="btn-calc operator" data-action="divide">÷</button>
                
                <button class="btn-calc" data-value="7">7</button>
                <button class="btn-calc" data-value="8">8</button>
                <button class="btn-calc" data-value="9">9</button>
                <button class="btn-calc operator" data-action="multiply">×</button>
                
                <button class="btn-calc" data-value="4">4</button>
                <button class="btn-calc" data-value="5">5</button>
                <button class="btn-calc" data-value="6">6</button>
                <button class="btn-calc operator" data-action="subtract">−</button>
                
                <button class="btn-calc" data-value="1">1</button>
                <button class="btn-calc" data-value="2">2</button>
                <button class="btn-calc" data-value="3">3</button>
                <button class="btn-calc operator" data-action="add">+</button>
                
                <button class="btn-calc" data-value="0" style="grid-column: span 2;">0</button>
                <button class="btn-calc" data-value=".">.</button>
                <button class="btn-calc equals" data-action="equals">=</button>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="scientific">
            <div class="calc-display">
                <div class="calc-expression" id="sciExpression"></div>
                <div class="calc-result" id="sciResult">0</div>
            </div>
            <div class="calc-buttons sci-buttons">
                <button class="btn-calc sci-btn" data-action="sin">sin</button>
                <button class="btn-calc sci-btn" data-action="cos">cos</button>
                <button class="btn-calc sci-btn" data-action="tan">tan</button>
                <button class="btn-calc sci-btn" data-action="log">log</button>
                <button class="btn-calc sci-btn" data-action="ln">ln</button>
                <button class="btn-calc sci-btn" data-action="sqrt">√</button>
                <button class="btn-calc sci-btn" data-action="square">x²</button>
                <button class="btn-calc sci-btn" data-action="cube">x³</button>
                <button class="btn-calc sci-btn" data-action="power">xʸ</button>
                <button class="btn-calc sci-btn" data-action="factorial">x!</button>
                <button class="btn-calc" data-action="clear">AC</button>
                <button class="btn-calc" data-action="backspace">⌫</button>
                
                <button class="btn-calc" data-value="7">7</button>
                <button class="btn-calc" data-value="8">8</button>
                <button class="btn-calc" data-value="9">9</button>
                <button class="btn-calc operator" data-action="divide">÷</button>
                
                <button class="btn-calc" data-value="4">4</button>
                <button class="btn-calc" data-value="5">5</button>
                <button class="btn-calc" data-value="6">6</button>
                <button class="btn-calc operator" data-action="multiply">×</button>
                
                <button class="btn-calc" data-value="1">1</button>
                <button class="btn-calc" data-value="2">2</button>
                <button class="btn-calc" data-value="3">3</button>
                <button class="btn-calc operator" data-action="subtract">−</button>
                
                <button class="btn-calc" data-value="0" style="grid-column: span 2;">0</button>
                <button class="btn-calc" data-value=".">.</button>
                <button class="btn-calc equals" data-action="equals">=</button>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="weather">
            <div class="weather-container">
                <div class="weather-input">
                    <input type="text" id="weatherLocation" placeholder="Enter city or use my location" class="input-field">
                    <button id="weatherSearch" class="btn-primary"><i class="fas fa-search"></i> Search</button>
                    <button id="weatherLocationBtn" class="btn-secondary"><i class="fas fa-location-dot"></i> My Location</button>
                </div>
                <div id="weatherResult" class="weather-result">
                    <p class="weather-placeholder">Enter a city or use your location to get weather data</p>
                </div>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="currency">
            <div class="currency-container">
                <div class="currency-input">
                    <input type="number" id="currencyAmount" value="1" class="input-field" step="any">
                    <select id="currencyFrom" class="input-field"></select>
                    <span>to</span>
                    <select id="currencyTo" class="input-field"></select>
                    <button id="currencyConvert" class="btn-primary">Convert</button>
                </div>
                <div id="currencyResult" class="currency-result">
                    <p class="currency-placeholder">Enter amount and select currencies</p>
                </div>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="age">
            <div class="age-container">
                <div class="age-input">
                    <label>Date of Birth:</label>
                    <input type="date" id="dobInput" class="input-field">
                    <button id="calculateAge" class="btn-primary">Calculate Age</button>
                </div>
                <div id="ageResult" class="age-result">
                    <p class="age-placeholder">Enter your date of birth to calculate age</p>
                </div>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="percentage">
            <div class="percentage-container">
                <div class="percentage-input">
                    <div class="input-group">
                        <label>Value:</label>
                        <input type="number" id="percentValue" class="input-field" step="any">
                    </div>
                    <div class="input-group">
                        <label>Percentage:</label>
                        <input type="number" id="percentRate" class="input-field" step="any">
                    </div>
                    <button id="calculatePercent" class="btn-primary">Calculate</button>
                </div>
                <div class="percentage-types">
                    <button class="btn-secondary" data-type="percent-of">% of</button>
                    <button class="btn-secondary" data-type="increase">Increase</button>
                    <button class="btn-secondary" data-type="decrease">Decrease</button>
                    <button class="btn-secondary" data-type="ratio">Ratio</button>
                </div>
                <div id="percentResult" class="percent-result">
                    <p class="percent-placeholder">Enter values and select calculation type</p>
                </div>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="unit">
            <div class="unit-container">
                <div class="unit-input">
                    <select id="unitCategory" class="input-field">
                        <option value="length">Length</option>
                        <option value="weight">Weight</option>
                        <option value="temperature">Temperature</option>
                        <option value="volume">Volume</option>
                    </select>
                    <input type="number" id="unitValue" value="1" class="input-field" step="any">
                    <select id="unitFrom" class="input-field"></select>
                    <span>to</span>
                    <select id="unitTo" class="input-field"></select>
                    <button id="unitConvert" class="btn-primary">Convert</button>
                </div>
                <div id="unitResult" class="unit-result">
                    <p class="unit-placeholder">Select category, enter value, and choose units</p>
                </div>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="programming">
            <div class="programming-container">
                <div class="prog-input">
                    <input type="text" id="progInput" class="input-field" placeholder="Enter number">
                    <select id="progBase" class="input-field">
                        <option value="10">Decimal</option>
                        <option value="2">Binary</option>
                        <option value="8">Octal</option>
                        <option value="16">Hexadecimal</option>
                    </select>
                    <button id="progConvert" class="btn-primary">Convert</button>
                </div>
                <div class="prog-operations">
                    <button class="btn-secondary" data-op="and">AND</button>
                    <button class="btn-secondary" data-op="or">OR</button>
                    <button class="btn-secondary" data-op="xor">XOR</button>
                    <button class="btn-secondary" data-op="not">NOT</button>
                    <button class="btn-secondary" data-op="shift-left">&lt;&lt;</button>
                    <button class="btn-secondary" data-op="shift-right">&gt;&gt;</button>
                </div>
                <div id="progResult" class="prog-result">
                    <p class="prog-placeholder">Enter a number and select base to see conversions</p>
                </div>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="date">
            <div class="date-container">
                <div class="date-input">
                    <label>Start Date:</label>
                    <input type="date" id="dateStart" class="input-field">
                    <label>End Date:</label>
                    <input type="date" id="dateEnd" class="input-field">
                    <button id="calculateDate" class="btn-primary">Calculate</button>
                </div>
                <div class="date-operations">
                    <button class="btn-secondary" data-type="days">Days Between</button>
                    <button class="btn-secondary" data-type="future">Future Date</button>
                    <button class="btn-secondary" data-type="past">Past Date</button>
                </div>
                <div id="dateResult" class="date-result">
                    <p class="date-placeholder">Select dates and operation type</p>
                </div>
            </div>
        </div>
        
        <div class="mode-panel" data-mode="statistics">
            <div class="stats-container">
                <div class="stats-input">
                    <textarea id="statsData" class="input-field" placeholder="Enter numbers separated by commas (e.g., 1,2,3,4,5)"></textarea>
                    <button id="calculateStats" class="btn-primary">Calculate Statistics</button>
                </div>
                <div id="statsResult" class="stats-result">
                    <p class="stats-placeholder">Enter a list of numbers to calculate statistics</p>
                </div>
            </div>
        </div>

        <div class="mode-panel" data-mode="color">
            <div class="color-container">
                <div class="color-picker-section">
                    <div class="color-picker-wrap">
                        <label>Pick a Color</label>
                        <input type="color" id="colorPicker" value="#3b82f6" class="color-input-native">
                    </div>
                    <div class="color-preview-box" id="colorPreviewBox"></div>
                </div>
                <div class="color-manual-input">
                    <div class="input-group">
                        <label>HEX</label>
                        <input type="text" id="colorHex" class="input-field" placeholder="#3b82f6" maxlength="7">
                    </div>
                    <div class="input-group">
                        <label>RGB</label>
                        <input type="text" id="colorRgb" class="input-field" placeholder="rgb(59, 130, 246)" readonly>
                    </div>
                    <div class="input-group">
                        <label>RGBA</label>
                        <div class="rgba-row">
                            <input type="text" id="colorRgba" class="input-field" placeholder="rgba(59, 130, 246, 1)" readonly>
                            <input type="range" id="colorAlpha" min="0" max="100" value="100" class="alpha-slider">
                            <span id="colorAlphaVal">100%</span>
                        </div>
                    </div>
                    <div class="input-group">
                        <label>HSL</label>
                        <input type="text" id="colorHsl" class="input-field" placeholder="hsl(217, 91%, 60%)" readonly>
                    </div>
                </div>
                <div class="color-swatches-section">
                    <label>Palette Suggestions</label>
                    <div id="colorSwatches" class="color-swatches"></div>
                </div>
                <div class="color-copy-btns">
                    <button class="btn-secondary copy-color-btn" data-target="colorHex"><i class="fas fa-copy"></i> Copy HEX</button>
                    <button class="btn-secondary copy-color-btn" data-target="colorRgb"><i class="fas fa-copy"></i> Copy RGB</button>
                    <button class="btn-secondary copy-color-btn" data-target="colorRgba"><i class="fas fa-copy"></i> Copy RGBA</button>
                    <button class="btn-secondary copy-color-btn" data-target="colorHsl"><i class="fas fa-copy"></i> Copy HSL</button>
                </div>
            </div>
        </div>

        <div class="mode-panel" data-mode="distance">
            <div class="distance-container">
                <div class="distance-tabs">
                    <button class="btn-secondary dist-tab active" data-tab="converter">Unit Converter</button>
                    <button class="btn-secondary dist-tab" data-tab="speed">Speed Calculator</button>
                    <button class="btn-secondary dist-tab" data-tab="travel">Travel Time</button>
                </div>

                <div class="dist-panel active" id="dist-converter">
                    <div class="distance-input">
                        <input type="number" id="distValue" value="1" class="input-field" step="any" placeholder="Distance">
                        <select id="distFrom" class="input-field">
                            <option value="km">Kilometers (km)</option>
                            <option value="miles">Miles (mi)</option>
                            <option value="meters">Meters (m)</option>
                            <option value="feet">Feet (ft)</option>
                            <option value="yards">Yards (yd)</option>
                            <option value="nautical">Nautical Miles (nmi)</option>
                            <option value="lightyear">Light Years (ly)</option>
                        </select>
                        <button id="distConvert" class="btn-primary">Convert All</button>
                    </div>
                    <div id="distResult" class="dist-result">
                        <p class="dist-placeholder">Enter a distance value to convert</p>
                    </div>
                </div>

                <div class="dist-panel" id="dist-speed">
                    <div class="speed-input">
                        <div class="input-group">
                            <label>Speed</label>
                            <div class="speed-row">
                                <input type="number" id="speedValue" class="input-field" step="any" placeholder="Speed value">
                                <select id="speedUnit" class="input-field">
                                    <option value="kmh">km/h</option>
                                    <option value="mph">mph</option>
                                    <option value="ms">m/s</option>
                                    <option value="knots">knots</option>
                                </select>
                            </div>
                        </div>
                        <button id="speedConvert" class="btn-primary">Convert Speed</button>
                    </div>
                    <div id="speedResult" class="dist-result">
                        <p class="dist-placeholder">Enter a speed to convert between units</p>
                    </div>
                </div>

                <div class="dist-panel" id="dist-travel">
                    <div class="travel-input">
                        <div class="input-group">
                            <label>Distance</label>
                            <div class="speed-row">
                                <input type="number" id="travelDist" class="input-field" step="any" placeholder="Distance">
                                <select id="travelDistUnit" class="input-field">
                                    <option value="km">km</option>
                                    <option value="miles">miles</option>
                                    <option value="meters">meters</option>
                                </select>
                            </div>
                        </div>
                        <div class="input-group">
                            <label>Speed</label>
                            <div class="speed-row">
                                <input type="number" id="travelSpeed" class="input-field" step="any" placeholder="Speed">
                                <select id="travelSpeedUnit" class="input-field">
                                    <option value="kmh">km/h</option>
                                    <option value="mph">mph</option>
                                    <option value="ms">m/s</option>
                                </select>
                            </div>
                        </div>
                        <button id="travelCalc" class="btn-primary">Calculate Time</button>
                    </div>
                    <div id="travelResult" class="dist-result">
                        <p class="dist-placeholder">Enter distance and speed to calculate travel time</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <div class="history-panel" id="historyPanel">
        <div class="history-header">
            <h3>History</h3>
            <button id="historyClose" class="btn-icon"><i class="fas fa-times"></i></button>
            <button id="historyClear" class="btn-text">Clear All</button>
        </div>
        <div class="history-list" id="historyList">
            <p class="history-empty">No calculations yet</p>
        </div>
    </div>
</div>