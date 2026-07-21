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

    function isMobileView() {
        return window.innerWidth <= 900;
    }

    function openSidebar() {
        if (!isMobileView()) return;
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-overlay-active');
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-overlay-active');
    }

    sidebarToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (!isMobileView()) return;
        sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function() {
            closeSidebar();
        });
    }

    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            closeSidebar();
        }
    });

    // Header nav toggle for mobile
    const navToggle = document.getElementById('navToggle');
    const headerNav = document.querySelector('.header-nav');

    if (navToggle && headerNav) {
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            headerNav.classList.toggle('open');
            // Toggle icon between ellipsis and times
            const icon = this.querySelector('i');
            icon.className = headerNav.classList.contains('open') ? 'fas fa-times' : 'fas fa-ellipsis-v';
        });

        // Close nav when clicking outside
        document.addEventListener('click', function(e) {
            if (headerNav.classList.contains('open') &&
                !headerNav.contains(e.target) &&
                !navToggle.contains(e.target)) {
                headerNav.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.className = 'fas fa-ellipsis-v';
            }
        });

        // Close nav when a link is clicked
        headerNav.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                headerNav.classList.remove('open');
                const icon = navToggle.querySelector('i');
                icon.className = 'fas fa-ellipsis-v';
            });
        });
    } else {
        // Fallback: if no navToggle, hide navToggle button
        if (navToggle) navToggle.style.display = 'none';
    }

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
    }, { passive: true });

    document.addEventListener('touchmove', function(e) {
        // Prevent pull-to-refresh when sidebar is open
        if (sidebar && sidebar.classList.contains('open')) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', function(e) {
        if (!isMobileView()) return;

        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
        const dt = Date.now() - touchStartTime;

        // Ignore if swiped too vertically or too slow
        if (dy > Math.abs(dx) * 0.7 || dt > 400) return;

        // Swipe right from left edge to open sidebar
        if (dx > 50 && touchStartX < 40 && sidebar && !sidebar.classList.contains('open')) {
            openSidebar();
        }
        // Swipe left to close sidebar
        else if (dx < -50 && sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    }, { passive: true });

    // Close sidebar on back gesture (mobile browsers)
    window.addEventListener('popstate', function() {
        if (sidebar && sidebar.classList.contains('open')) {
            closeSidebar();
        }
    });

    // Re-check on resize so sidebar resets properly
    window.addEventListener('resize', function() {
        if (sidebar.classList.contains('open') && !isMobileView()) {
            closeSidebar();
        }
    });

    const modeLinks = document.querySelectorAll('.mode-link');
    const modePanels = document.querySelectorAll('.mode-panel');
    const modeTitle = document.getElementById('modeTitle');
    const modeNames = {
        'normal': 'Normal Calculator',
        'scientific': 'Scientific Calculator',
        'weather': 'Weather Calculator',
        'currency': 'Currency Converter',
        'age': 'Age Calculator',
        'percentage': 'Percentage Calculator',
        'unit': 'Unit Converter',
        'programming': 'Programming Calculator',
        'date': 'Date Calculator',
        'statistics': 'Statistics Calculator',
        'color': 'Color Code Calculator',
        'distance': 'Distance & Speed'
    };

    const modeData = {};

    modeLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const mode = this.dataset.mode;
            switchMode(mode);
        });
    });

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
            panel.classList.remove('active');
        });

        const targetPanel = document.querySelector(`.mode-panel[data-mode="${mode}"]`);
        if (targetPanel) {
            targetPanel.classList.add('active');
        }

        if (modeTitle) modeTitle.textContent = modeNames[mode] || mode;

        if (modeData[mode]) {
            restoreModeData(mode, modeData[mode]);
        }

        if (isMobileView()) {
            closeSidebar();
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
            case 'scientific': {
                const expr = document.getElementById(`${mode}Expression`);
                const res = document.getElementById(`${mode}Result`);
                if (expr) expr.textContent = data.expression || '';
                if (res) res.textContent = data.result || '0';
                break;
            }
            case 'weather': {
                const loc = document.getElementById('weatherLocation');
                if (loc) loc.value = data.location || '';
                break;
            }
            case 'currency': {
                const amt = document.getElementById('currencyAmount');
                const from = document.getElementById('currencyFrom');
                const to = document.getElementById('currencyTo');
                if (amt) amt.value = data.amount || '1';
                if (from) from.value = data.from || 'USD';
                if (to) to.value = data.to || 'EUR';
                break;
            }
            case 'age': {
                const dob = document.getElementById('dobInput');
                if (dob) dob.value = data.dob || '';
                break;
            }
            case 'percentage': {
                const val = document.getElementById('percentValue');
                const rate = document.getElementById('percentRate');
                if (val) val.value = data.value || '';
                if (rate) rate.value = data.rate || '';
                break;
            }
            case 'unit': {
                const cat = document.getElementById('unitCategory');
                const uVal = document.getElementById('unitValue');
                const uFrom = document.getElementById('unitFrom');
                const uTo = document.getElementById('unitTo');
                if (cat) cat.value = data.category || 'length';
                if (uVal) uVal.value = data.value || '1';
                if (uFrom) uFrom.value = data.from || '';
                if (uTo) uTo.value = data.to || '';
                break;
            }
            case 'programming': {
                const progIn = document.getElementById('progInput');
                const progBase = document.getElementById('progBase');
                if (progIn) progIn.value = data.input || '';
                if (progBase) progBase.value = data.base || '10';
                break;
            }
            case 'date': {
                const dStart = document.getElementById('dateStart');
                const dEnd = document.getElementById('dateEnd');
                if (dStart) dStart.value = data.start || '';
                if (dEnd) dEnd.value = data.end || '';
                break;
            }
            case 'statistics': {
                const statsData = document.getElementById('statsData');
                if (statsData) statsData.value = data.data || '';
                break;
            }
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

    if (historyToggle) {
        historyToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            historyPanel.classList.toggle('open');
            renderHistory();
        });
    }

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
        if (mode !== 'normal' && mode !== 'scientific') return;

        if (keyMap[key] !== undefined) {
            const action = keyMap[key];
            handleCalculatorKey(mode, action, key);
        } else if (/^[0-9.]$/.test(key)) {
            handleCalculatorKey(mode, 'value', key);
        }
    }

    function handleCalculatorKey(mode, action, key) {
        const display = document.getElementById(`${mode}Expression`);
        const result = document.getElementById(`${mode}Result`);

        if (!display || !result) return;

        if (action === 'value' || /^[0-9.]$/.test(action)) {
            const char = /^[0-9.]$/.test(action) ? action : key;
            if (mode === 'normal') {
                normalExpression += char;
                display.textContent = normalExpression;
                result.textContent = evalExpression(normalExpression);
            } else if (mode === 'scientific') {
                sciExpression += char;
                display.textContent = sciExpression;
                result.textContent = evalExpression(sciExpression);
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
                result.textContent = normalExpression ? evalExpression(normalExpression) : '0';
            } else if (mode === 'scientific' && sciExpression) {
                sciExpression = sciExpression.slice(0, -1);
                display.textContent = sciExpression;
                result.textContent = sciExpression ? evalExpression(sciExpression) : '0';
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
        } else if (['add','subtract','multiply','divide'].includes(action)) {
            const ops = { 'add': '+', 'subtract': '-', 'multiply': '*', 'divide': '/' };
            if (mode === 'normal') {
                normalExpression += ops[action];
                display.textContent = normalExpression;
            } else if (mode === 'scientific') {
                sciExpression += ops[action];
                display.textContent = sciExpression;
            }
        }

        triggerButtonAnimation(action, key);
    }

    function triggerButtonAnimation(action, key) {
        let btn;
        const panel = document.querySelector('.mode-panel.active');
        if (!panel) return;
        btn = panel.querySelector(`[data-action="${action}"]`) || panel.querySelector(`[data-value="${key}"]`);
        if (btn) {
            btn.classList.add('btn-press-effect');
            setTimeout(() => btn.classList.remove('btn-press-effect'), 150);
        }
    }

    function evalExpression(expr) {
        try {
            const result = Function('"use strict"; return (' + expr + ')')();
            if (!isFinite(result)) return 'Error';
            return String(result);
        } catch {
            return '';
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

        const activePanel = document.querySelector('.mode-panel.active');
        if (!activePanel) return;
        const mode = activePanel.dataset.mode;
        if (mode !== 'normal' && mode !== 'scientific') return;

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

        if (value !== undefined) {
            normalExpression += value;
            display.textContent = normalExpression;
            result.textContent = evalExpression(normalExpression) || normalExpression;
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
        } else if (action === 'backspace') {
            normalExpression = normalExpression.slice(0, -1);
            display.textContent = normalExpression;
            result.textContent = normalExpression ? (evalExpression(normalExpression) || normalExpression) : '0';
        } else if (action === 'percent') {
            try {
                const num = Function('"use strict"; return (' + normalExpression + ')')();
                normalResult = String(num / 100);
                result.textContent = normalResult;
                addHistory(normalExpression + '%', normalResult);
            } catch(e) {}
        } else if (action === 'equals') {
            try {
                const resultValue = Function('"use strict"; return (' + normalExpression + ')')();
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

        if (value !== undefined) {
            sciExpression += value;
            display.textContent = sciExpression;
            result.textContent = evalExpression(sciExpression) || sciExpression;
        } else if (action === 'clear') {
            sciExpression = '';
            sciResult = '0';
            display.textContent = '';
            result.textContent = '0';
        } else if (action === 'backspace') {
            sciExpression = sciExpression.slice(0, -1);
            display.textContent = sciExpression;
            result.textContent = sciExpression ? (evalExpression(sciExpression) || sciExpression) : '0';
        } else if (action === 'equals') {
            try {
                const resultValue = Function('"use strict"; return (' + sciExpression + ')')();
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
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(Math.sin(val));
                result.textContent = sciResult;
                addHistory(`sin(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'cos') {
            try {
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(Math.cos(val));
                result.textContent = sciResult;
                addHistory(`cos(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'tan') {
            try {
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(Math.tan(val));
                result.textContent = sciResult;
                addHistory(`tan(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'log') {
            try {
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(Math.log10(val));
                result.textContent = sciResult;
                addHistory(`log(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'ln') {
            try {
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(Math.log(val));
                result.textContent = sciResult;
                addHistory(`ln(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'sqrt') {
            try {
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(Math.sqrt(val));
                result.textContent = sciResult;
                addHistory(`√(${sciExpression || '0'})`, sciResult);
            } catch(e) {}
        } else if (action === 'square') {
            try {
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(val * val);
                result.textContent = sciResult;
                addHistory(`(${sciExpression || '0'})²`, sciResult);
            } catch(e) {}
        } else if (action === 'cube') {
            try {
                const val = Function('"use strict"; return (' + (sciExpression || '0') + ')')();
                sciResult = String(val * val * val);
                result.textContent = sciResult;
                addHistory(`(${sciExpression || '0'})³`, sciResult);
            } catch(e) {}
        } else if (action === 'power') {
            sciExpression += '**';
            display.textContent = sciExpression;
        } else if (action === 'factorial') {
            try {
                const val = parseInt(Function('"use strict"; return (' + (sciExpression || '0') + ')')());
                let f = 1;
                for (let i = 2; i <= val; i++) f *= i;
                sciResult = String(f);
                result.textContent = sciResult;
                addHistory(`${sciExpression || '0'}!`, sciResult);
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

        weatherResult.innerHTML = '<p class="weather-placeholder">Loading...</p>';

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

    const currencyData = [
        { code: 'AED', name: 'UAE Dirham' },
        { code: 'AFN', name: 'Afghan Afghani' },
        { code: 'ALL', name: 'Albanian Lek' },
        { code: 'AMD', name: 'Armenian Dram' },
        { code: 'ANG', name: 'Netherlands Antillean Guilder' },
        { code: 'AOA', name: 'Angolan Kwanza' },
        { code: 'ARS', name: 'Argentine Peso' },
        { code: 'AUD', name: 'Australian Dollar' },
        { code: 'AWG', name: 'Aruban Florin' },
        { code: 'AZN', name: 'Azerbaijani Manat' },
        { code: 'BAM', name: 'Bosnia-Herzegovina Convertible Mark' },
        { code: 'BBD', name: 'Barbadian Dollar' },
        { code: 'BDT', name: 'Bangladeshi Taka' },
        { code: 'BGN', name: 'Bulgarian Lev' },
        { code: 'BHD', name: 'Bahraini Dinar' },
        { code: 'BIF', name: 'Burundian Franc' },
        { code: 'BMD', name: 'Bermudan Dollar' },
        { code: 'BND', name: 'Brunei Dollar' },
        { code: 'BOB', name: 'Bolivian Boliviano' },
        { code: 'BRL', name: 'Brazilian Real' },
        { code: 'BSD', name: 'Bahamian Dollar' },
        { code: 'BTN', name: 'Bhutanese Ngultrum' },
        { code: 'BWP', name: 'Botswanan Pula' },
        { code: 'BYN', name: 'Belarusian Ruble' },
        { code: 'BZD', name: 'Belize Dollar' },
        { code: 'CAD', name: 'Canadian Dollar' },
        { code: 'CDF', name: 'Congolese Franc' },
        { code: 'CHF', name: 'Swiss Franc' },
        { code: 'CLP', name: 'Chilean Peso' },
        { code: 'CNY', name: 'Chinese Yuan' },
        { code: 'COP', name: 'Colombian Peso' },
        { code: 'CRC', name: 'Costa Rican Colón' },
        { code: 'CUP', name: 'Cuban Peso' },
        { code: 'CVE', name: 'Cape Verdean Escudo' },
        { code: 'CZK', name: 'Czech Koruna' },
        { code: 'DJF', name: 'Djiboutian Franc' },
        { code: 'DKK', name: 'Danish Krone' },
        { code: 'DOP', name: 'Dominican Peso' },
        { code: 'DZD', name: 'Algerian Dinar' },
        { code: 'EGP', name: 'Egyptian Pound' },
        { code: 'ERN', name: 'Eritrean Nakfa' },
        { code: 'ETB', name: 'Ethiopian Birr' },
        { code: 'EUR', name: 'Euro' },
        { code: 'FJD', name: 'Fijian Dollar' },
        { code: 'FKP', name: 'Falkland Islands Pound' },
        { code: 'GBP', name: 'British Pound Sterling' },
        { code: 'GEL', name: 'Georgian Lari' },
        { code: 'GHS', name: 'Ghanaian Cedi' },
        { code: 'GIP', name: 'Gibraltar Pound' },
        { code: 'GMD', name: 'Gambian Dalasi' },
        { code: 'GNF', name: 'Guinean Franc' },
        { code: 'GTQ', name: 'Guatemalan Quetzal' },
        { code: 'GYD', name: 'Guyanaese Dollar' },
        { code: 'HKD', name: 'Hong Kong Dollar' },
        { code: 'HNL', name: 'Honduran Lempira' },
        { code: 'HTG', name: 'Haitian Gourde' },
        { code: 'HUF', name: 'Hungarian Forint' },
        { code: 'IDR', name: 'Indonesian Rupiah' },
        { code: 'ILS', name: 'Israeli New Shekel' },
        { code: 'INR', name: 'Indian Rupee' },
        { code: 'IQD', name: 'Iraqi Dinar' },
        { code: 'ISK', name: 'Icelandic Króna' },
        { code: 'JMD', name: 'Jamaican Dollar' },
        { code: 'JOD', name: 'Jordanian Dinar' },
        { code: 'JPY', name: 'Japanese Yen' },
        { code: 'KES', name: 'Kenyan Shilling' },
        { code: 'KGS', name: 'Kyrgystani Som' },
        { code: 'KHR', name: 'Cambodian Riel' },
        { code: 'KMF', name: 'Comorian Franc' },
        { code: 'KRW', name: 'South Korean Won' },
        { code: 'KWD', name: 'Kuwaiti Dinar' },
        { code: 'KYD', name: 'Cayman Islands Dollar' },
        { code: 'KZT', name: 'Kazakhstani Tenge' },
        { code: 'LAK', name: 'Laotian Kip' },
        { code: 'LBP', name: 'Lebanese Pound' },
        { code: 'LKR', name: 'Sri Lankan Rupee' },
        { code: 'LRD', name: 'Liberian Dollar' },
        { code: 'LSL', name: 'Lesotho Loti' },
        { code: 'LYD', name: 'Libyan Dinar' },
        { code: 'MAD', name: 'Moroccan Dirham' },
        { code: 'MDL', name: 'Moldovan Leu' },
        { code: 'MGA', name: 'Malagasy Ariary' },
        { code: 'MKD', name: 'Macedonian Denar' },
        { code: 'MMK', name: 'Myanmar Kyat' },
        { code: 'MNT', name: 'Mongolian Tugrik' },
        { code: 'MOP', name: 'Macanese Pataca' },
        { code: 'MRU', name: 'Mauritanian Ouguiya' },
        { code: 'MUR', name: 'Mauritian Rupee' },
        { code: 'MVR', name: 'Maldivian Rufiyaa' },
        { code: 'MWK', name: 'Malawian Kwacha' },
        { code: 'MXN', name: 'Mexican Peso' },
        { code: 'MYR', name: 'Malaysian Ringgit' },
        { code: 'MZN', name: 'Mozambican Metical' },
        { code: 'NAD', name: 'Namibian Dollar' },
        { code: 'NGN', name: 'Nigerian Naira' },
        { code: 'NIO', name: 'Nicaraguan Córdoba' },
        { code: 'NOK', name: 'Norwegian Krone' },
        { code: 'NPR', name: 'Nepalese Rupee' },
        { code: 'NZD', name: 'New Zealand Dollar' },
        { code: 'OMR', name: 'Omani Rial' },
        { code: 'PAB', name: 'Panamanian Balboa' },
        { code: 'PEN', name: 'Peruvian Sol' },
        { code: 'PGK', name: 'Papua New Guinean Kina' },
        { code: 'PHP', name: 'Philippine Peso' },
        { code: 'PKR', name: 'Pakistani Rupee' },
        { code: 'PLN', name: 'Polish Zloty' },
        { code: 'PYG', name: 'Paraguayan Guarani' },
        { code: 'QAR', name: 'Qatari Rial' },
        { code: 'RON', name: 'Romanian Leu' },
        { code: 'RSD', name: 'Serbian Dinar' },
        { code: 'RUB', name: 'Russian Ruble' },
        { code: 'RWF', name: 'Rwandan Franc' },
        { code: 'SAR', name: 'Saudi Riyal' },
        { code: 'SBD', name: 'Solomon Islands Dollar' },
        { code: 'SCR', name: 'Seychellois Rupee' },
        { code: 'SDG', name: 'Sudanese Pound' },
        { code: 'SEK', name: 'Swedish Krona' },
        { code: 'SGD', name: 'Singapore Dollar' },
        { code: 'SHP', name: 'Saint Helena Pound' },
        { code: 'SLE', name: 'Sierra Leonean Leone' },
        { code: 'SOS', name: 'Somali Shilling' },
        { code: 'SRD', name: 'Surinamese Dollar' },
        { code: 'SSP', name: 'South Sudanese Pound' },
        { code: 'STN', name: 'São Tomé & Príncipe Dobra' },
        { code: 'SYP', name: 'Syrian Pound' },
        { code: 'SZL', name: 'Swazi Lilangeni' },
        { code: 'THB', name: 'Thai Baht' },
        { code: 'TJS', name: 'Tajikistani Somoni' },
        { code: 'TMT', name: 'Turkmenistani Manat' },
        { code: 'TND', name: 'Tunisian Dinar' },
        { code: 'TOP', name: 'Tongan Paʻanga' },
        { code: 'TRY', name: 'Turkish Lira' },
        { code: 'TTD', name: 'Trinidad & Tobago Dollar' },
        { code: 'TWD', name: 'New Taiwan Dollar' },
        { code: 'TZS', name: 'Tanzanian Shilling' },
        { code: 'UAH', name: 'Ukrainian Hryvnia' },
        { code: 'UGX', name: 'Ugandan Shilling' },
        { code: 'USD', name: 'US Dollar' },
        { code: 'UYU', name: 'Uruguayan Peso' },
        { code: 'UZS', name: 'Uzbekistani Som' },
        { code: 'VES', name: 'Venezuelan Bolívar' },
        { code: 'VND', name: 'Vietnamese Dong' },
        { code: 'VUV', name: 'Vanuatu Vatu' },
        { code: 'WST', name: 'Samoan Tala' },
        { code: 'XAF', name: 'Central African CFA Franc' },
        { code: 'XCD', name: 'East Caribbean Dollar' },
        { code: 'XOF', name: 'West African CFA Franc' },
        { code: 'XPF', name: 'CFP Franc' },
        { code: 'YER', name: 'Yemeni Rial' },
        { code: 'ZAR', name: 'South African Rand' },
        { code: 'ZMW', name: 'Zambian Kwacha' },
        { code: 'ZWL', name: 'Zimbabwean Dollar' }
    ];

    function populateCurrencies() {
        [currencyFrom, currencyTo].forEach(select => {
            if (!select) return;
            select.innerHTML = '';
            currencyData.forEach(curr => {
                const option = document.createElement('option');
                option.value = curr.code;
                option.textContent = `${curr.code} — ${curr.name}`;
                select.appendChild(option);
            });
        });
        if (currencyFrom) currencyFrom.value = 'USD';
        if (currencyTo) currencyTo.value = 'EUR';
    }
    populateCurrencies();

    if (currencyConvert) {
        currencyConvert.addEventListener('click', function() {
            const amount = parseFloat(currencyAmount.value) || 1;
            const from = currencyFrom.value;
            const to = currencyTo.value;
            const fromName = currencyData.find(c => c.code === from)?.name || from;
            const toName = currencyData.find(c => c.code === to)?.name || to;

            if (from === to) {
                currencyResult.innerHTML = `<p class="currency-result-content">${amount} ${from} = ${amount} ${to}</p>`;
                return;
            }

            currencyResult.innerHTML = '<p class="currency-placeholder">Fetching rate...</p>';

            fetch(`https://api.exchangerate-api.com/v4/latest/${from}`)
                .then(res => res.json())
                .then(data => {
                    const rate = data.rates[to];
                    if (!rate) throw new Error('Currency not found');
                    const result = amount * rate;
                    currencyResult.innerHTML = `
                        <div class="currency-result-content">
                            <div class="result-item">
                                <span class="label">${amount} ${from} (${fromName})</span>
                                <span class="value">= ${result.toFixed(4)} ${to}</span>
                            </div>
                            <div class="result-item">
                                <span class="label">To Currency</span>
                                <span class="value">${toName}</span>
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
            document.querySelectorAll('.percentage-types .btn-secondary').forEach(b => {
                b.style.background = '';
                b.style.color = '';
            });
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
            'Meter': 1, 'Kilometer': 1000, 'Centimeter': 0.01,
            'Millimeter': 0.001, 'Mile': 1609.344, 'Yard': 0.9144,
            'Foot': 0.3048, 'Inch': 0.0254
        },
        weight: {
            'Kilogram': 1, 'Gram': 0.001, 'Milligram': 0.000001,
            'Pound': 0.453592, 'Ounce': 0.0283495, 'Ton': 1000
        },
        temperature: { 'Celsius': 'C', 'Fahrenheit': 'F', 'Kelvin': 'K' },
        volume: {
            'Liter': 1, 'Milliliter': 0.001, 'Gallon': 3.78541,
            'Quart': 0.946353, 'Pint': 0.473176, 'Cup': 0.236588, 'Fluid Ounce': 0.0295735
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

    if (unitCategory) unitCategory.addEventListener('change', updateUnits);

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
                if (!unitData) { unitResult.innerHTML = '<p class="unit-placeholder">Invalid category</p>'; return; }
                result = (val * unitData[from]) / unitData[to];
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

    if (unitCategory) updateUnits();

    const progInput = document.getElementById('progInput');
    const progBase = document.getElementById('progBase');
    const progConvert = document.getElementById('progConvert');
    const progResult = document.getElementById('progResult');

    if (progConvert) {
        progConvert.addEventListener('click', function() {
            const input = progInput.value.trim();
            const base = parseInt(progBase.value);
            if (!input) { progResult.innerHTML = '<p class="prog-placeholder">Please enter a number</p>'; return; }

            try {
                const decimal = parseInt(input, base);
                if (isNaN(decimal)) throw new Error('Invalid number');

                progResult.innerHTML = `
                    <div class="prog-result-content">
                        <div class="result-item"><span class="label">Decimal</span><span class="value">${decimal}</span></div>
                        <div class="result-item"><span class="label">Binary</span><span class="value">${decimal.toString(2)}</span></div>
                        <div class="result-item"><span class="label">Octal</span><span class="value">${decimal.toString(8)}</span></div>
                        <div class="result-item"><span class="label">Hexadecimal</span><span class="value">${decimal.toString(16).toUpperCase()}</span></div>
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
            if (!input) { progResult.innerHTML = '<p class="prog-placeholder">Please enter a number</p>'; return; }

            try {
                const base = parseInt(progBase.value);
                const num = parseInt(input, base);
                if (isNaN(num)) throw new Error('Invalid number');

                let result, label;
                switch(op) {
                    case 'and': result = num & 255; label = `${num} & 255`; break;
                    case 'or': result = num | 255; label = `${num} | 255`; break;
                    case 'xor': result = num ^ 255; label = `${num} ^ 255`; break;
                    case 'not': result = ~num; label = `~${num}`; break;
                    case 'shift-left': result = num << 1; label = `${num} << 1`; break;
                    case 'shift-right': result = num >> 1; label = `${num} >> 1`; break;
                    default: result = num; label = '';
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
            document.querySelectorAll('.date-operations .btn-secondary').forEach(b => { b.style.background = ''; b.style.color = ''; });
            this.style.background = 'var(--primary)';
            this.style.color = 'white';
            dateType = this.dataset.type;
            calculateDateFn();
        });
    });

    if (calculateDate) calculateDate.addEventListener('click', calculateDateFn);

    function calculateDateFn() {
        const start = dateStart.value;
        const end = dateEnd.value;

        if (!start) { dateResult.innerHTML = '<p class="date-placeholder">Please select a start date</p>'; return; }

        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date();

        if (dateType === 'days') {
            if (!end) { dateResult.innerHTML = '<p class="date-placeholder">Please select an end date</p>'; return; }
            const diff = Math.abs(endDate - startDate);
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            dateResult.innerHTML = `
                <div class="date-result-content">
                    <div class="result-item"><span class="label">📅 Days between</span><span class="value">${days} days</span></div>
                    <div class="result-item"><span class="label">⏰ Hours</span><span class="value">${days * 24} hours</span></div>
                </div>
            `;
        } else if (dateType === 'future') {
            const days = parseInt(end) || 30;
            const future = new Date(startDate);
            future.setDate(future.getDate() + days);
            dateResult.innerHTML = `
                <div class="date-result-content">
                    <div class="result-item"><span class="label">📅 ${days} days from ${start}</span><span class="value">${future.toDateString()}</span></div>
                </div>
            `;
        } else if (dateType === 'past') {
            const days = parseInt(end) || 30;
            const past = new Date(startDate);
            past.setDate(past.getDate() - days);
            dateResult.innerHTML = `
                <div class="date-result-content">
                    <div class="result-item"><span class="label">📅 ${days} days before ${start}</span><span class="value">${past.toDateString()}</span></div>
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
            if (!text) { statsResult.innerHTML = '<p class="stats-placeholder">Please enter numbers</p>'; return; }

            const numbers = text.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
            if (numbers.length === 0) { statsResult.innerHTML = '<p class="stats-placeholder">Please enter valid numbers</p>'; return; }

            const sorted = [...numbers].sort((a, b) => a - b);
            const sum = numbers.reduce((a, b) => a + b, 0);
            const mean = sum / numbers.length;
            const median = sorted.length % 2 === 0
                ? (sorted[sorted.length/2 - 1] + sorted[sorted.length/2]) / 2
                : sorted[Math.floor(sorted.length/2)];
            const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
            const stddev = Math.sqrt(variance);

            statsResult.innerHTML = `
                <div class="stats-result-content">
                    <div class="result-item"><span class="label">📊 Count</span><span class="value">${numbers.length}</span></div>
                    <div class="result-item"><span class="label">📈 Mean</span><span class="value">${mean.toFixed(4)}</span></div>
                    <div class="result-item"><span class="label">📉 Median</span><span class="value">${median.toFixed(4)}</span></div>
                    <div class="result-item"><span class="label">📊 Std Dev</span><span class="value">${stddev.toFixed(4)}</span></div>
                    <div class="result-item"><span class="label">📊 Variance</span><span class="value">${variance.toFixed(4)}</span></div>
                    <div class="result-item"><span class="label">📊 Min / Max</span><span class="value">${Math.min(...numbers)} / ${Math.max(...numbers)}</span></div>
                </div>
            `;
            addHistory(`Stats: ${numbers.join(', ')}`, `Mean: ${mean.toFixed(4)}`);
        });
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
        return { r, g, b };
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    }

    function generatePalette(hex) {
        const { r, g, b } = hexToRgb(hex);
        const { h, s } = rgbToHsl(r, g, b);
        const shades = [10, 20, 35, 50, 65, 80, 90];
        return shades.map(l => {
            const c = `hsl(${h}, ${s}%, ${l}%)`;
            return c;
        });
    }

    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const a = s * Math.min(l, 1 - l);
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    function updateColorOutputs(hex, alpha) {
        const { r, g, b } = hexToRgb(hex);
        const { h, s, l } = rgbToHsl(r, g, b);
        const a = (alpha / 100).toFixed(2);

        const colorHexEl = document.getElementById('colorHex');
        const colorRgbEl = document.getElementById('colorRgb');
        const colorRgbaEl = document.getElementById('colorRgba');
        const colorHslEl = document.getElementById('colorHsl');
        const previewBox = document.getElementById('colorPreviewBox');
        const swatches = document.getElementById('colorSwatches');

        if (colorHexEl) colorHexEl.value = hex.toUpperCase();
        if (colorRgbEl) colorRgbEl.value = `rgb(${r}, ${g}, ${b})`;
        if (colorRgbaEl) colorRgbaEl.value = `rgba(${r}, ${g}, ${b}, ${a})`;
        if (colorHslEl) colorHslEl.value = `hsl(${h}, ${s}%, ${l}%)`;
        if (previewBox) {
            previewBox.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
        }

        if (swatches) {
            const palette = generatePalette(hex);
            swatches.innerHTML = palette.map(color => {
                const hexColor = color.startsWith('hsl') ? (() => {
                    const m = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
                    return m ? hslToHex(+m[1], +m[2], +m[3]) : color;
                })() : color;
                return `<div class="color-swatch" style="background:${color}" title="${hexColor}" onclick="document.getElementById('colorPicker').value='${hexColor}'; document.getElementById('colorPicker').dispatchEvent(new Event('input'));"></div>`;
            }).join('');
        }
    }

    const colorPicker = document.getElementById('colorPicker');
    const colorAlpha = document.getElementById('colorAlpha');
    const colorAlphaVal = document.getElementById('colorAlphaVal');

    if (colorPicker) {
        colorPicker.addEventListener('input', function() {
            const alpha = colorAlpha ? parseInt(colorAlpha.value) : 100;
            updateColorOutputs(this.value, alpha);
            const hexInput = document.getElementById('colorHex');
            if (hexInput) hexInput.value = this.value.toUpperCase();
        });
        updateColorOutputs(colorPicker.value, 100);
    }

    if (colorAlpha) {
        colorAlpha.addEventListener('input', function() {
            if (colorAlphaVal) colorAlphaVal.textContent = this.value + '%';
            if (colorPicker) updateColorOutputs(colorPicker.value, parseInt(this.value));
        });
    }

    const colorHexInput = document.getElementById('colorHex');
    if (colorHexInput) {
        colorHexInput.addEventListener('input', function() {
            const val = this.value.trim();
            if (/^#[0-9a-fA-F]{6}$/.test(val)) {
                if (colorPicker) colorPicker.value = val;
                const alpha = colorAlpha ? parseInt(colorAlpha.value) : 100;
                updateColorOutputs(val, alpha);
            }
        });
    }

    document.querySelectorAll('.copy-color-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const el = document.getElementById(targetId);
            if (el) {
                navigator.clipboard.writeText(el.value).then(() => {
                    const orig = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    this.style.background = 'var(--success)';
                    this.style.color = 'white';
                    setTimeout(() => { this.innerHTML = orig; this.style.background = ''; this.style.color = ''; }, 1500);
                });
            }
        });
    });

    const distConvert = document.getElementById('distConvert');
    const distValue = document.getElementById('distValue');
    const distFrom = document.getElementById('distFrom');
    const distResult = document.getElementById('distResult');

    const distFactors = {
        km: 1,
        miles: 1.60934,
        meters: 0.001,
        feet: 0.0003048,
        yards: 0.0009144,
        nautical: 1.852,
        lightyear: 9.461e12
    };

    const distNames = {
        km: 'Kilometers (km)',
        miles: 'Miles (mi)',
        meters: 'Meters (m)',
        feet: 'Feet (ft)',
        yards: 'Yards (yd)',
        nautical: 'Nautical Miles (nmi)',
        lightyear: 'Light Years (ly)'
    };

    if (distConvert) {
        distConvert.addEventListener('click', function() {
            const val = parseFloat(distValue.value) || 0;
            const from = distFrom.value;
            const baseKm = val * distFactors[from];

            const rows = Object.entries(distFactors).map(([unit, factor]) => {
                const converted = baseKm / factor;
                const display = converted > 1e10 ? converted.toExponential(4) : converted.toFixed(6).replace(/\.?0+$/, '');
                return `<div class="result-item"><span class="label">${distNames[unit]}</span><span class="value">${display}</span></div>`;
            }).join('');

            distResult.innerHTML = `<div class="dist-result-content">${rows}</div>`;
            addHistory(`${val} ${distNames[from]}`, `${(baseKm / distFactors['miles']).toFixed(4)} mi`);
        });
    }

    const speedConvert = document.getElementById('speedConvert');
    const speedValue = document.getElementById('speedValue');
    const speedUnit = document.getElementById('speedUnit');
    const speedResult = document.getElementById('speedResult');

    const speedToKmh = { kmh: 1, mph: 1.60934, ms: 3.6, knots: 1.852 };
    const speedNames = { kmh: 'km/h', mph: 'mph', ms: 'm/s', knots: 'knots' };

    if (speedConvert) {
        speedConvert.addEventListener('click', function() {
            const val = parseFloat(speedValue.value) || 0;
            const from = speedUnit.value;
            const baseKmh = val * speedToKmh[from];

            const rows = Object.entries(speedToKmh).map(([unit, factor]) => {
                const converted = baseKmh / factor;
                return `<div class="result-item"><span class="label">${speedNames[unit]}</span><span class="value">${converted.toFixed(4)}</span></div>`;
            }).join('');

            speedResult.innerHTML = `<div class="dist-result-content">${rows}</div>`;
            addHistory(`${val} ${speedNames[from]}`, `${(baseKmh / speedToKmh['mph']).toFixed(4)} mph`);
        });
    }

    const travelCalc = document.getElementById('travelCalc');
    const travelDist = document.getElementById('travelDist');
    const travelDistUnit = document.getElementById('travelDistUnit');
    const travelSpeed = document.getElementById('travelSpeed');
    const travelSpeedUnit = document.getElementById('travelSpeedUnit');
    const travelResult = document.getElementById('travelResult');

    const travelDistToKm = { km: 1, miles: 1.60934, meters: 0.001 };
    const travelSpeedToKmh = { kmh: 1, mph: 1.60934, ms: 3.6 };

    if (travelCalc) {
        travelCalc.addEventListener('click', function() {
            const dist = parseFloat(travelDist.value) || 0;
            const spd = parseFloat(travelSpeed.value) || 0;

            if (!dist || !spd) {
                travelResult.innerHTML = '<p class="dist-placeholder">Please enter both distance and speed</p>';
                return;
            }

            const distKm = dist * travelDistToKm[travelDistUnit.value];
            const spdKmh = spd * travelSpeedToKmh[travelSpeedUnit.value];
            const hours = distKm / spdKmh;
            const h = Math.floor(hours);
            const m = Math.floor((hours - h) * 60);
            const s = Math.floor(((hours - h) * 60 - m) * 60);

            travelResult.innerHTML = `
                <div class="dist-result-content">
                    <div class="result-item"><span class="label">⏱️ Travel Time</span><span class="value">${h}h ${m}m ${s}s</span></div>
                    <div class="result-item"><span class="label">📍 Distance</span><span class="value">${distKm.toFixed(2)} km</span></div>
                    <div class="result-item"><span class="label">🚀 Speed</span><span class="value">${spdKmh.toFixed(2)} km/h</span></div>
                </div>
            `;
            addHistory(`${dist} ${travelDistUnit.value} at ${spd} ${travelSpeedUnit.value}`, `${h}h ${m}m ${s}s`);
        });
    }

    document.querySelectorAll('.dist-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.dist-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.querySelectorAll('.dist-panel').forEach(p => p.classList.remove('active'));
            const target = document.getElementById(`dist-${tabId}`);
            if (target) target.classList.add('active');
        });
    });

    switchMode('normal');

    document.addEventListener('click', function(e) {
        if (historyPanel && !historyPanel.contains(e.target) && historyToggle && !historyToggle.contains(e.target)) {
            historyPanel.classList.remove('open');
        }
    });
});