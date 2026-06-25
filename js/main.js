document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const themes = ['light', 'dark', 'neon', 'nature', 'ocean'];
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    
    themeToggle.addEventListener('click', function() {
        let index = themes.indexOf(currentTheme);
        index = (index + 1) % themes.length;
        currentTheme = themes[index];
        document.documentElement.setAttribute('data-theme', currentTheme);
        document.cookie = `theme=${currentTheme}; path=/; max-age=${30*24*60*60}`;
        updateThemeIcon();
    });
    
    function updateThemeIcon() {
        const icon = themeToggle.querySelector('i');
        const themeMap = {
            'light': 'fa-moon',
            'dark': 'fa-sun',
            'neon': 'fa-bolt',
            'nature': 'fa-leaf',
            'ocean': 'fa-water'
        };
        icon.className = `fas ${themeMap[currentTheme] || 'fa-moon'}`;
    }
    updateThemeIcon();
    
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            sidebar.classList.remove('open');
        });
    }
    
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    const modeLinks = document.querySelectorAll('.mode-link');
    const modePanels = document.querySelectorAll('.mode-panel');
    const modeTitle = document.getElementById('modeTitle');
    const modeNames = {
        'normal': 'Normal Calculator',
        'scientific': 'Scientific Calculator',
        'weather': 'Weather Calculator',
        'currency': 'Currency Calculator',
        'age': 'Age Calculator',
        'percentage': 'Percentage Calculator',
        'unit': 'Unit Converter',
        'programming': 'Programming Calculator',
        'date': 'Date Calculator',
        'statistics': 'Statistics Calculator'
    };
    
    const modeData = {};
    
    modeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const mode = this.dataset.mode;
            switchMode(mode);
        });
    });

    function initMode(mode) {
        console.log('Initializing mode:', mode);
    }
    
    function switchMode(mode) {
        const currentMode = document.querySelector('.mode-panel.active');
        if (currentMode) {
            const modeId = currentMode.dataset.mode;
            modeData[modeId] = getModeData(modeId);
        }
        
        modeLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.mode === mode);
        });
        
        modePanels.forEach(panel => {
            panel.classList.toggle('active', panel.dataset.mode === mode);
        });

        modeTitle.textContent = modeNames[mode] || mode;
        
        if (modeData[mode]) {
            restoreModeData(mode, modeData[mode]);
        }
        
        //initMode(mode);
        
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }
    
    function getModeData(mode) {
        const data = {};
        switch(mode) {
            case 'normal':
            case 'scientific':
                data.expression = document.getElementById(`${mode}Expression`)?.textContent || '';
                data.result = document.getElementById(`${mode}Result`)?.textContent || '0';
                break;
            case 'weather':
                data.location = document.getElementById('weatherLocation')?.value || '';
                break;
            case 'currency':
                data.amount = document.getElementById('currencyAmount')?.value || '1';
                data.from = document.getElementById('currencyFrom')?.value || 'USD';
                data.to = document.getElementById('currencyTo')?.value || 'EUR';
                break;
            case 'age':
                data.dob = document.getElementById('dobInput')?.value || '';
                break;
            case 'percentage':
                data.value = document.getElementById('percentValue')?.value || '';
                data.rate = document.getElementById('percentRate')?.value || '';
                break;
            case 'unit':
                data.category = document.getElementById('unitCategory')?.value || 'length';
                data.value = document.getElementById('unitValue')?.value || '1';
                data.from = document.getElementById('unitFrom')?.value || '';
                data.to = document.getElementById('unitTo')?.value || '';
                break;
            case 'programming':
                data.input = document.getElementById('progInput')?.value || '';
                data.base = document.getElementById('progBase')?.value || '10';
                break;
            case 'date':
                data.start = document.getElementById('dateStart')?.value || '';
                data.end = document.getElementById('dateEnd')?.value || '';
                break;
            case 'statistics':
                data.data = document.getElementById('statsData')?.value || '';
                break;
        }
        return data;
    }
    
    function restoreModeData(mode, data) {
        switch(mode) {
            case 'normal':
            case 'scientific':
                const expr = document.getElementById(`${mode}Expression`);
                const res = document.getElementById(`${mode}Result`);
                if (expr) expr.textContent = data.expression || '';
                if (res) res.textContent = data.result || '0';
                break;
            case 'weather':
                const loc = document.getElementById('weatherLocation');
                if (loc) loc.value = data.location || '';
                break;
            case 'currency':
                const amt = document.getElementById('currencyAmount');
                const from = document.getElementById('currencyFrom');
                const to = document.getElementById('currencyTo');
                if (amt) amt.value = data.amount || '1';
                if (from) from.value = data.from || 'USD';
                if (to) to.value = data.to || 'EUR';
                break;
            case 'age':
                const dob = document.getElementById('dobInput');
                if (dob) dob.value = data.dob || '';
                break;
            case 'percentage':
                const val = document.getElementById('percentValue');
                const rate = document.getElementById('percentRate');
                if (val) val.value = data.value || '';
                if (rate) rate.value = data.rate || '';
                break;
            case 'unit':
                const cat = document.getElementById('unitCategory');
                const uVal = document.getElementById('unitValue');
                const uFrom = document.getElementById('unitFrom');
                const uTo = document.getElementById('unitTo');
                if (cat) cat.value = data.category || 'length';
                if (uVal) uVal.value = data.value || '1';
                if (uFrom) uFrom.value = data.from || '';
                if (uTo) uTo.value = data.to || '';
                break;
            case 'programming':
                const progIn = document.getElementById('progInput');
                const progBase = document.getElementById('progBase');
                if (progIn) progIn.value = data.input || '';
                if (progBase) progBase.value = data.base || '10';
                break;
            case 'date':
                const dStart = document.getElementById('dateStart');
                const dEnd = document.getElementById('dateEnd');
                if (dStart) dStart.value = data.start || '';
                if (dEnd) dEnd.value = data.end || '';
                break;
            case 'statistics':
                const statsData = document.getElementById('statsData');
                if (statsData) statsData.value = data.data || '';
                break;
        }
    }
    
    const historyToggle = document.getElementById('historyToggle');
    const historyPanel = document.getElementById('historyPanel');
    const historyClose = document.getElementById('historyClose');
    const historyClear = document.getElementById('historyClear');
    const historyList = document.getElementById('historyList');
    
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    
    function renderHistory() {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<p class="history-empty">No calculations yet</p>';
            return;
        }
        history.slice().reverse().forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <span class="expression">${item.expression}</span>
                <span class="result">= ${item.result}</span>
                <button class="btn-text" onclick="removeHistoryItem(${history.length - 1 - index})">×</button>
            `;
            historyList.appendChild(div);
        });
    }
    
    function addHistory(expression, result) {
        history.push({ expression, result, timestamp: new Date().toISOString() });
        if (history.length > 100) history.shift();
        localStorage.setItem('calcHistory', JSON.stringify(history));
        renderHistory();
    }
    
    window.removeHistoryItem = function(index) {
        history.splice(index, 1);
        localStorage.setItem('calcHistory', JSON.stringify(history));
        renderHistory();
    };
    
    historyToggle.addEventListener('click', function() {
        historyPanel.classList.toggle('open');
        renderHistory();
    });
    
    if (historyClose) {
        historyClose.addEventListener('click', function() {
            historyPanel.classList.remove('open');
        });
    }
    
    if (historyClear) {
        historyClear.addEventListener('click', function() {
            if (confirm('Clear all history?')) {
                history = [];
                localStorage.setItem('calcHistory', JSON.stringify(history));
                renderHistory();
            }
        });
    }
    
const keyMap = {
        '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
        '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
        '.': '.', '+': 'add', '-': 'subtract', '*': 'multiply', '/': 'divide',
        'Enter': 'equals', '=': 'equals', 'Escape': 'clear', 'c': 'clear', 'C': 'clear',
        'Backspace': 'backspace', '%': 'percent', '_': 'sign'
    };

    function handleKeyboardInput(key) {
        const activePanel = document.querySelector('.mode-panel.active');
        if (!activePanel) return;

        const mode = activePanel.dataset.mode;
        const keyLower = key.toLowerCase();

        if (keyMap[key] || keyMap[keyLower]) {
            const action = keyMap[key] || keyMap[keyLower];
            handleCalculatorKey(mode, action, key);
        } else if (/^[0-9]$/.test(key)) {
            handleCalculatorKey(mode, 'value', key);
        }
    }

    function handleCalculatorKey(mode, action, key) {
        const display = document.getElementById(`${mode}Expression`);
        const result = document.getElementById(`${mode}Result`);

        if (!display || !result) return;

        if (action === 'value') {
            if (mode === 'normal') {
                normalExpression += key;
                display.textContent = normalExpression;
                normalResult = evalExpression(normalExpression);
                result.textContent = normalResult;
            } else if (mode === 'scientific') {
                sciExpression += key;
                display.textContent = sciExpression;
            }
        } else if (action === 'clear') {
            if (mode === 'normal') {
                normalExpression = '';
                normalResult = '0';
                display.textContent = '';
                result.textContent = '0';
            } else if (mode === 'scientific') {
                sciExpression = '';
                sciResult = '0';
                display.textContent = '';
                result.textContent = '0';
            }
        } else if (action === 'backspace') {
            if (mode === 'normal' && normalExpression) {
                normalExpression = normalExpression.slice(0, -1);
                display.textContent = normalExpression;
            } else if (mode === 'scientific' && sciExpression) {
                sciExpression = sciExpression.slice(0, -1);
                display.textContent = sciExpression;
            }
        } else if (action === 'sign') {
            if (mode === 'normal') {
                if (normalExpression.startsWith('-')) {
                    normalExpression = normalExpression.substring(1);
                } else if (normalExpression) {
                    normalExpression = '-' + normalExpression;
                }
                display.textContent = normalExpression;
            }
        } else if (action === 'percent') {
            if (mode === 'normal') {
                try {
                    const num = eval(normalExpression);
                    normalResult = String(num / 100);
                    result.textContent = normalResult;
                    addHistory(normalExpression + '%', normalResult);
                } catch(e) {}
            }
        } else if (action === 'equals') {
            if (mode === 'normal') {
                try {
                    const resultValue = eval(normalExpression);
                    normalResult = String(resultValue);
                    result.textContent = normalResult;
                    addHistory(normalExpression, normalResult);
                    normalExpression = normalResult;
                    display.textContent = normalExpression;
                } catch(e) {
                    result.textContent = 'Error';
                }
            } else if (mode === 'scientific') {
                try {
                    const resultValue = eval(sciExpression);
                    sciResult = String(resultValue);
                    result.textContent = sciResult;
                    addHistory(sciExpression, sciResult);
                    sciExpression = sciResult;
                    display.textContent = sciExpression;
                } catch(e) {
                    result.textContent = 'Error';
                }
            }
        }

        triggerButtonAnimation(action, key);
    }

    function triggerButtonAnimation(action, key) {
        let selector;
        if (keyMap[action] === action) {
            selector = `[data-action="${action}"]`;
        } else {
            selector = `[data-value="${key}"]`;
        }
        const btn = document.querySelector(`.mode-panel.active ${selector}`);
        if (btn) {
            btn.classList.add('btn-press-effect');
            setTimeout(() => btn.classList.remove('btn-press-effect'), 150);
        }
    }

    function evalExpression(expr) {
        try {
            return String(eval(expr || '0'));
        } catch {
            return 'Error';
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const exprKeys = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','=','%'];
        const specialKeys = ['Enter', 'Escape', 'Backspace'];

        if (exprKeys.includes(e.key) || specialKeys.includes(e.key) || e.key.toLowerCase() === 'c') {
            e.preventDefault();
            handleKeyboardInput(e.key);
        }
    });

    let normalExpression = '';
    let normalResult = '0';

    document.querySelector('.mode-panel[data-mode="normal"]')?.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-calc');
        if (!btn) return;

        const action = btn.dataset.action;
        const value = btn.dataset.value;
        const display = document.getElementById('normalExpression');
        const result = document.getElementById('normalResult');

        if (value) {
            normalExpression += value;
            display.textContent = normalExpression;
            result.textContent = evalExpression(normalExpression);
        } else if (action === 'clear') {
            normalExpression = '';
            normalResult = '0';
            display.textContent = '';
            result.textContent = '0';
        } else if (action === 'sign') {
            if (normalExpression.startsWith('-')) {
                normalExpression = normalExpression.substring(1);
            } else if (normalExpression) {
                normalExpression = '-' + normalExpression;
            }
            display.textContent = normalExpression;
        } else if (action === 'percent') {
            try {
                const num = eval(normalExpression);
                normalResult = String(num / 100);
                result.textContent = normalResult;
                addHistory(normalExpression + '%', normalResult);
            } catch(e) {}
        } else if (action === 'equals') {
            try {
                const resultValue = eval(normalExpression);
                normalResult = String(resultValue);
                result.textContent = normalResult;
                addHistory(normalExpression, normalResult);
                normalExpression = normalResult;
                display.textContent = normalExpression;
            } catch(e) {
                result.textContent = 'Error';
            }
        } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
            const ops = { 'add': '+', 'subtract': '-', 'multiply': '*', 'divide': '/' };
            normalExpression += ops[action];
            display.textContent = normalExpression;
        }
    });
    
    let sciExpression = '';
    let sciResult = '0';
    
    document.querySelector('.mode-panel[data-mode="scientific"]')?.addEventListener('click', function(e) {
        const btn = e.target.closest('.btn-calc');
        if (!btn) return;
        
        const action = btn.dataset.action;
        const value = btn.dataset.value;
        const display = document.getElementById('sciExpression');
        const result = document.getElementById('sciResult');
        
        if (value) {
            sciExpression += value;
            display.textContent = sciExpression;
        } else if (action === 'clear') {
            sciExpression = '';
            sciResult = '0';
            display.textContent = '';
            result.textContent = '0';
        } else if (action === 'equals') {
            try {
                const resultValue = eval(sciExpression);
                sciResult = String(resultValue);
                result.textContent = sciResult;
                addHistory(sciExpression, sciResult);
                sciExpression = sciResult;
                display.textContent = sciExpression;
            } catch(e) {
                result.textContent = 'Error';
            }
        } else if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
            const ops = { 'add': '+', 'subtract': '-', 'multiply': '*', 'divide': '/' };
            sciExpression += ops[action];
            display.textContent = sciExpression;
        } else if (action === 'sin') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(Math.sin(val));
                result.textContent = sciResult;
                addHistory(`sin(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'cos') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(Math.cos(val));
                result.textContent = sciResult;
                addHistory(`cos(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'tan') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(Math.tan(val));
                result.textContent = sciResult;
                addHistory(`tan(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'log') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(Math.log10(val));
                result.textContent = sciResult;
                addHistory(`log(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'ln') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(Math.log(val));
                result.textContent = sciResult;
                addHistory(`ln(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'sqrt') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(Math.sqrt(val));
                result.textContent = sciResult;
                addHistory(`√(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'square') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(val * val);
                result.textContent = sciResult;
                addHistory(`(${sciExpression || '0'})²`, sciResult);
            } catch(e) {}
        } else if (action === 'cube') {
            try {
                const val = eval(sciExpression || '0');
                sciResult = String(val * val * val);
                result.textContent = sciResult;
                addHistory(`(${sciExpression || '0'})³`, sciResult);
            } catch(e) {}
        } else if (action === 'pi') {
            sciExpression += Math.PI.toString();
            display.textContent = sciExpression;
        } else if (action === 'e') {
            sciExpression += Math.E.toString();
            display.textContent = sciExpression;
        }
    });
    
    const weatherSearch = document.getElementById('weatherSearch');
    const weatherLocation = document.getElementById('weatherLocation');
    const weatherLocationBtn = document.getElementById('weatherLocationBtn');
    const weatherResult = document.getElementById('weatherResult');
    
    if (weatherSearch) {
        weatherSearch.addEventListener('click', function() {
            getWeather(weatherLocation.value);
        });
    }
    
    if (weatherLocation) {
        weatherLocation.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') getWeather(this.value);
        });
    }
    
    if (weatherLocationBtn) {
        weatherLocationBtn.addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(pos => {
                    const { latitude, longitude } = pos.coords;
                    getWeatherByCoords(latitude, longitude);
                }, () => {
                    weatherResult.innerHTML = '<p class="weather-placeholder">Unable to get location. Please enter a city.</p>';
                });
            }
        });
    }
    
    function getWeather(city) {
        if (!city) {
            weatherResult.innerHTML = '<p class="weather-placeholder">Please enter a city name</p>';
            return;
        }
        
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`)
            .then(res => {
                if (!res.ok) throw new Error('City not found');
                return res.json();
            })
            .then(data => {
                const temp = data.main.temp;
                const feels = data.main.feels_like;
                const humidity = data.main.humidity;
                const wind = data.wind.speed;
                const desc = data.weather[0].description;
                const icon = data.weather[0].icon;
                
                weatherResult.innerHTML = `
                    <div class="weather-result-content">
                        <div class="result-item">
                            <span class="label">📍 ${data.name}, ${data.sys.country}</span>
                            <span class="value">${temp}°C</span>
                        </div>
                        <div class="result-item">
                            <span class="label">🌡️ Feels like</span>
                            <span class="value">${feels}°C</span>
                        </div>
                        <div class="result-item">
                            <span class="label">💧 Humidity</span>
                            <span class="value">${humidity}%</span>
                        </div>
                        <div class="result-item">
                            <span class="label">💨 Wind</span>
                            <span class="value">${wind} m/s</span>
                        </div>
                        <div class="result-item">
                            <span class="label">${desc}</span>
                            <span class="value"><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather icon" style="width:40px;"></span>
                        </div>
                    </div>
                `;
            })
            .catch(err => {
                weatherResult.innerHTML = `<p class="weather-placeholder">Error: ${err.message}</p>`;
            });
    }
    
    function getWeatherByCoords(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric`)
            .then(res => res.json())
            .then(data => {
                weatherLocation.value = data.name;
                getWeather(data.name);
            })
            .catch(() => {
                weatherResult.innerHTML = '<p class="weather-placeholder">Unable to fetch weather data</p>';
            });
    }
    
    const currencyAmount = document.getElementById('currencyAmount');
    const currencyFrom = document.getElementById('currencyFrom');
    const currencyTo = document.getElementById('currencyTo');
    const currencyConvert = document.getElementById('currencyConvert');
    const currencyResult = document.getElementById('currencyResult');
    
    const currencyList = [
        'AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN',
        'BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BRL',
        'BSD','BTN','BWP','BYN','BZD','CAD','CDF','CHF','CLF','CLP',
        'CNH','CNY','COP','CRC','CUP','CVE','CZK','DJF','DKK','DOP',
        'DZD','EGP','ERN','ETB','EUR','FJD','FKP','FOK','GBP','GEL',
        'GGP','GHS','GIP','GMD','GNF','GTQ','GYD','HKD','HNL','HRK',
        'HTG','HUF','IDR','ILS','IMP','INR','IQD','ISK','JEP','JMD',
        'JOD','JPY','KES','KGS','KHR','KID','KMF','KRW','KWD','KYD',
        'KZT','LAK','LBP','LKR','LRD','LSL','LYD','MAD','MDL','MGA',
        'MKD','MMK','MNT','MOP','MRU','MUR','MVR','MWK','MXN','MYR',
        'MZN','NAD','NGN','NIO','NOK','NPR','NZD','OMR','PAB','PEN',
        'PGK','PHP','PKR','PLN','PYG','QAR','RON','RSD','RUB','RWF',
        'SAR','SBD','SCR','SDG','SEK','SGD','SHP','SLE','SOS','SRD',
        'SSP','STN','SYP','SZL','THB','TJS','TMT','TND','TOP','TRY',
        'TTD','TVD','TWD','TZS','UAH','UGX','USD','UYU','UZS','VES',
        'VND','VUV','WST','XAF','XCD','XDR','XOF','XPF','YER','ZAR',
        'ZMW','ZWL'
    ];
    
    function populateCurrencies() {
        [currencyFrom, currencyTo].forEach(select => {
            select.innerHTML = '';
            currencyList.forEach(curr => {
                const option = document.createElement('option');
                option.value = curr;
                option.textContent = curr;
                select.appendChild(option);
            });
        });
        currencyFrom.value = 'USD';
        currencyTo.value = 'EUR';
    }
    populateCurrencies();
    
    if (currencyConvert) {
        currencyConvert.addEventListener('click', function() {
            const amount = parseFloat(currencyAmount.value) || 1;
            const from = currencyFrom.value;
            const to = currencyTo.value;
            
            if (from === to) {
                currencyResult.innerHTML = `<p class="currency-result-content">${amount} ${from} = ${amount} ${to}</p>`;
                return;
            }
            
            fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
                .then(res => res.json())
                .then(data => {
                    const rate = data.rates[to];
                    if (!rate) throw new Error('Currency not found');
                    const result = amount * rate;
                    currencyResult.innerHTML = `
                        <div class="currency-result-content">
                            <div class="result-item">
                                <span class="label">${amount} ${from}</span>
                                <span class="value">= ${result.toFixed(4)} ${to}</span>
                            </div>
                            <div class="result-item">
                                <span class="label">Exchange Rate</span>
                                <span class="value">1 ${from} = ${rate.toFixed(4)} ${to}</span>
                            </div>
                        </div>
                    `;
                    addHistory(`${amount} ${from} to ${to}`, `${result.toFixed(4)} ${to}`);
                })
                .catch(err => {
                    currencyResult.innerHTML = `<p class="currency-placeholder">Error: ${err.message}</p>`;
                });
        });
    }
    
    const dobInput = document.getElementById('dobInput');
    const calculateAge = document.getElementById('calculateAge');
    const ageResult = document.getElementById('ageResult');
    
    if (calculateAge) {
        calculateAge.addEventListener('click', function() {
            const dob = new Date(dobInput.value);
            if (!dobInput.value || isNaN(dob)) {
                ageResult.innerHTML = '<p class="age-placeholder">Please select a valid date of birth</p>';
                return;
            }
            
            const now = new Date();
            let years = now.getFullYear() - dob.getFullYear();
            let months = now.getMonth() - dob.getMonth();
            let days = now.getDate() - dob.getDate();
            
            if (days < 0) {
                months--;
                const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += lastMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }
            
            ageResult.innerHTML = `
                <div class="age-result-content">
                    <div class="result-item">
                        <span class="label">🎂 Age</span>
                        <span class="value">${years} years, ${months} months, ${days} days</span>
                    </div>
                    <div class="result-item">
                        <span class="label">📅 Total days</span>
                        <span class="value">${Math.floor((now - dob) / (1000 * 60 * 60 * 24))} days</span>
                    </div>
                    <div class="result-item">
                        <span class="label">⏰ Total hours</span>
                        <span class="value">${Math.floor((now - dob) / (1000 * 60 * 60))} hours</span>
                    </div>
                    <div class="result-item">
                        <span class="label">⏱️ Total minutes</span>
                        <span class="value">${Math.floor((now - dob) / (1000 * 60))} minutes</span>
                    </div>
                    <div class="result-item">
                        <span class="label">⚡ Total seconds</span>
                        <span class="value">${Math.floor((now - dob) / 1000)} seconds</span>
                    </div>
                </div>
            `;
        });
    }
    
    const percentValue = document.getElementById('percentValue');
    const percentRate = document.getElementById('percentRate');
    const calculatePercent = document.getElementById('calculatePercent');
    const percentResult = document.getElementById('percentResult');
    let percentType = 'percent-of';
    
    document.querySelectorAll('.percentage-types .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.percentage-types .btn-secondary').forEach(b => b.style.background = '');
            this.style.background = 'var(--primary)';
            this.style.color = 'white';
            percentType = this.dataset.type;
            calculatePercentage();
        });
    });
    
    if (calculatePercent) {
        calculatePercent.addEventListener('click', calculatePercentage);
    }
    
    function calculatePercentage() {
        const val = parseFloat(percentValue.value);
        const rate = parseFloat(percentRate.value);
        
        if (isNaN(val) || isNaN(rate)) {
            percentResult.innerHTML = '<p class="percent-placeholder">Please enter valid numbers</p>';
            return;
        }
        
        let result, label;
        switch(percentType) {
            case 'percent-of':
                result = (val * rate) / 100;
                label = `${rate}% of ${val}`;
                break;
            case 'increase':
                result = val + (val * rate / 100);
                label = `${val} increased by ${rate}%`;
                break;
            case 'decrease':
                result = val - (val * rate / 100);
                label = `${val} decreased by ${rate}%`;
                break;
            case 'ratio':
                result = val / rate;
                label = `Ratio of ${val} to ${rate}`;
                break;
            default:
                result = 0;
                label = '';
        }
        
        percentResult.innerHTML = `
            <div class="percent-result-content">
                <div class="result-item">
                    <span class="label">${label}</span>
                    <span class="value">${result.toFixed(4)}</span>
                </div>
            </div>
        `;
        addHistory(label, result.toFixed(4));
    }
    
    const unitCategory = document.getElementById('unitCategory');
    const unitValue = document.getElementById('unitValue');
    const unitFrom = document.getElementById('unitFrom');
    const unitTo = document.getElementById('unitTo');
    const unitConvert = document.getElementById('unitConvert');
    const unitResult = document.getElementById('unitResult');
    
    const units = {
        length: {
            'Meter': 1,
            'Kilometer': 1000,
            'Centimeter': 0.01,
            'Millimeter': 0.001,
            'Mile': 1609.344,
            'Yard': 0.9144,
            'Foot': 0.3048,
            'Inch': 0.0254
        },
        weight: {
            'Kilogram': 1,
            'Gram': 0.001,
            'Milligram': 0.000001,
            'Pound': 0.453592,
            'Ounce': 0.0283495,
            'Ton': 1000
        },
        temperature: {
            'Celsius': 'C',
            'Fahrenheit': 'F',
            'Kelvin': 'K'
        },
        volume: {
            'Liter': 1,
            'Milliliter': 0.001,
            'Gallon': 3.78541,
            'Quart': 0.946353,
            'Pint': 0.473176,
            'Cup': 0.236588,
            'Fluid Ounce': 0.0295735
        }
    };
    
    function updateUnits() {
        const category = unitCategory.value;
        const unitList = Object.keys(units[category] || {});
        
        [unitFrom, unitTo].forEach(select => {
            const currentVal = select.value;
            select.innerHTML = '';
            unitList.forEach(unit => {
                const option = document.createElement('option');
                option.value = unit;
                option.textContent = unit;
                select.appendChild(option);
            });
            if (unitList.includes(currentVal)) select.value = currentVal;
            if (select === unitFrom && !select.value) select.value = unitList[0] || '';
            if (select === unitTo && !select.value) select.value = unitList[1] || unitList[0] || '';
        });
    }
    
    if (unitCategory) {
        unitCategory.addEventListener('change', updateUnits);
    }
    
    if (unitConvert) {
        unitConvert.addEventListener('click', function() {
            const category = unitCategory.value;
            const val = parseFloat(unitValue.value) || 0;
            const from = unitFrom.value;
            const to = unitTo.value;
            
            if (!from || !to) {
                unitResult.innerHTML = '<p class="unit-placeholder">Please select units</p>';
                return;
            }
            
            let result;
            if (category === 'temperature') {
                result = convertTemperature(val, from, to);
            } else {
                const unitData = units[category];
                if (!unitData) {
                    unitResult.innerHTML = '<p class="unit-placeholder">Invalid category</p>';
                    return;
                }
                const fromVal = unitData[from] || 1;
                const toVal = unitData[to] || 1;
                result = (val * fromVal) / toVal;
            }
            
            unitResult.innerHTML = `
                <div class="unit-result-content">
                    <div class="result-item">
                        <span class="label">${val} ${from}</span>
                        <span class="value">= ${result.toFixed(6)} ${to}</span>
                    </div>
                </div>
            `;
            addHistory(`${val} ${from} to ${to}`, `${result.toFixed(6)} ${to}`);
        });
    }
    
    function convertTemperature(val, from, to) {
        let celsius;
        if (from === 'Celsius') celsius = val;
        else if (from === 'Fahrenheit') celsius = (val - 32) * 5/9;
        else if (from === 'Kelvin') celsius = val - 273.15;
        else return val;
        
        if (to === 'Celsius') return celsius;
        if (to === 'Fahrenheit') return celsius * 9/5 + 32;
        if (to === 'Kelvin') return celsius + 273.15;
        return celsius;
    }
    
    if (unitCategory) {
        updateUnits();
    }
    
    const progInput = document.getElementById('progInput');
    const progBase = document.getElementById('progBase');
    const progConvert = document.getElementById('progConvert');
    const progResult = document.getElementById('progResult');
    
    if (progConvert) {
        progConvert.addEventListener('click', function() {
            const input = progInput.value.trim();
            const base = parseInt(progBase.value);
            if (!input) {
                progResult.innerHTML = '<p class="prog-placeholder">Please enter a number</p>';
                return;
            }
            
            try {
                const decimal = parseInt(input, base);
                if (isNaN(decimal)) throw new Error('Invalid number');
                
                progResult.innerHTML = `
                    <div class="prog-result-content">
                        <div class="result-item">
                            <span class="label">Decimal</span>
                            <span class="value">${decimal}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Binary</span>
                            <span class="value">${decimal.toString(2)}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Octal</span>
                            <span class="value">${decimal.toString(8)}</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Hexadecimal</span>
                            <span class="value">${decimal.toString(16).toUpperCase()}</span>
                        </div>
                    </div>
                `;
            } catch(e) {
                progResult.innerHTML = `<p class="prog-placeholder">Error: Invalid number for base ${base}</p>`;
            }
        });
    }
    
    document.querySelectorAll('.prog-operations .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const op = this.dataset.op;
            const input = progInput.value.trim();
            if (!input) {
                progResult.innerHTML = '<p class="prog-placeholder">Please enter a number</p>';
                return;
            }
            
            try {
                const base = parseInt(progBase.value);
                const num = parseInt(input, base);
                if (isNaN(num)) throw new Error('Invalid number');
                
                let result;
                let label;
                switch(op) {
                    case 'and':
                        result = num & 255;
                        label = `${num} & 255`;
                        break;
                    case 'or':
                        result = num | 255;
                        label = `${num} | 255`;
                        break;
                    case 'xor':
                        result = num ^ 255;
                        label = `${num} ^ 255`;
                        break;
                    case 'not':
                        result = ~num;
                        label = `~${num}`;
                        break;
                    case 'shift-left':
                        result = num << 1;
                        label = `${num} << 1`;
                        break;
                    case 'shift-right':
                        result = num >> 1;
                        label = `${num} >> 1`;
                        break;
                    default:
                        result = num;
                        label = '';
                }
                
                progResult.innerHTML = `
                    <div class="prog-result-content">
                        <div class="result-item">
                            <span class="label">${label}</span>
                            <span class="value">${result} (${result.toString(2)})</span>
                        </div>
                    </div>
                `;
                addHistory(label, result.toString());
            } catch(e) {
                progResult.innerHTML = `<p class="prog-placeholder">Error: ${e.message}</p>`;
            }
        });
    });
    
    const dateStart = document.getElementById('dateStart');
    const dateEnd = document.getElementById('dateEnd');
    const calculateDate = document.getElementById('calculateDate');
    const dateResult = document.getElementById('dateResult');
    let dateType = 'days';
    
    document.querySelectorAll('.date-operations .btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-operations .btn-secondary').forEach(b => b.style.background = '');
            this.style.background = 'var(--primary)';
            this.style.color = 'white';
            dateType = this.dataset.type;
            calculateDateFn();
        });
    });
    
    if (calculateDate) {
        calculateDate.addEventListener('click', calculateDateFn);
    }
    
    function calculateDateFn() {
        const start = dateStart.value;
        const end = dateEnd.value;
        
        if (!start) {
            dateResult.innerHTML = '<p class="date-placeholder">Please select a start date</p>';
            return;
        }
        
        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();
        
        if (dateType === 'days') {
            if (!end) {
                dateResult.innerHTML = '<p class="date-placeholder">Please select an end date</p>';
                return;
            }
            const diff = Math.abs(endDate - startDate);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            dateResult.innerHTML = `
                <div class="date-result-content">
                    <div class="result-item">
                        <span class="label">📅 Days between</span>
                        <span class="value">${days} days</span>
                    </div>
                    <div class="result-item">
                        <span class="label">⏰ Hours</span>
                        <span class="value">${days * 24} hours</span>
                    </div>
                </div>
            `;
        } else if (dateType === 'future') {
            const days = parseInt(end) || 30;
            const future = new Date(startDate);
            future.setDate(future.getDate() + days);
            dateResult.innerHTML = `
                <div class="date-result-content">
                    <div class="result-item">
                        <span class="label">📅 ${days} days from ${start}</span>
                        <span class="value">${future.toDateString()}</span>
                    </div>
                </div>
            `;
        } else if (dateType === 'past') {
            const days = parseInt(end) || 30;
            const past = new Date(startDate);
            past.setDate(past.getDate() - days);
            dateResult.innerHTML = `
                <div class="date-result-content">
                    <div class="result-item">
                        <span class="label">📅 ${days} days before ${start}</span>
                        <span class="value">${past.toDateString()}</span>
                    </div>
                </div>
            `;
        }
    }
    
    const statsData = document.getElementById('statsData');
    const calculateStats = document.getElementById('calculateStats');
    const statsResult = document.getElementById('statsResult');
    
    if (calculateStats) {
        calculateStats.addEventListener('click', function() {
            const text = statsData.value.trim();
            if (!text) {
                statsResult.innerHTML = '<p class="stats-placeholder">Please enter numbers</p>';
                return;
            }
            
            const numbers = text.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
            if (numbers.length === 0) {
                statsResult.innerHTML = '<p class="stats-placeholder">Please enter valid numbers</p>';
                return;
            }
            
            const sorted = [...numbers].sort((a, b) => a - b);
            const sum = numbers.reduce((a, b) => a + b, 0);
            const mean = sum / numbers.length;
            const median = sorted.length % 2 === 0 ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2 : sorted[Math.floor(sorted.length/2)];
            const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
            const stddev = Math.sqrt(variance);
            
            statsResult.innerHTML = `
                <div class="stats-result-content">
                    <div class="result-item">
                        <span class="label">📊 Count</span>
                        <span class="value">${numbers.length}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">📈 Mean</span>
                        <span class="value">${mean.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">📉 Median</span>
                        <span class="value">${median.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">📊 Standard Deviation</span>
                        <span class="value">${stddev.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">📊 Variance</span>
                        <span class="value">${variance.toFixed(4)}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">📊 Min / Max</span>
                        <span class="value">${Math.min(...numbers)} / ${Math.max(...numbers)}</span>
                    </div>
                </div>
            `;
            addHistory(`Stats: ${numbers.join(', ')}`, `Mean: ${mean.toFixed(4)}`);
        });
    }
    
    switchMode('normal');
    
    document.addEventListener('click', function(e) {
        if (historyPanel && !historyPanel.contains(e.target) && !historyToggle.contains(e.target)) {
            historyPanel.classList.remove('open');
        }
    });
    
    console.log('CalcHub loaded successfully!');
});