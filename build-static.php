<?php
/**
 * Build script: 
 * ------------------------------
 * Pre-renders PHP templates into static HTML for Tauri/Capacitor builds.
 * Usage: php build-static.php
 * Output: dist/ folder with complete static site
 */

$distDir = __DIR__ . '/dist';
$pagesDir = __DIR__ . '/pages';
$includesDir = __DIR__ . '/includes';
$jsDir = __DIR__ . '/js';
$stylesDir = __DIR__ . '/styles';
$imagesDir = __DIR__ . '/images';

// clean the dist.
if (is_dir($distDir)) {
    array_map('unlink', glob("$distDir/*.*"));
    array_map('unlink', glob("$distDir/pages/*.*"));
    @rmdir("$distDir/pages");
} else {
    mkdir($distDir, 0755, true);
}

// copy static.
copyDir($jsDir, "$distDir/js");
copyDir($stylesDir, "$distDir/styles");
copyDir($imagesDir, "$distDir/images");
@mkdir("$distDir/pages", 0755, true);

// Start a temporary PHP server to render pages
$port = 8899;
$pid = startPhpServer($port, __DIR__);
if (!$pid) {
    die("Failed to start PHP server\n");
}
sleep(1); // Wait for server to start

// Render each page
$pages = ['calculator', 'about', 'contact'];
$renderedPages = [];

foreach ($pages as $page) {
    $url = "http://localhost:$port/index.php?page=$page";
    $html = @file_get_contents($url);
    if ($html === false) {
        echo "Warning: Failed to render page '$page'\n";
        continue;
    }
    // Save individual page
    file_put_contents("$distDir/pages/$page.html", $html);
    // Extract just the main content for the SPA
    preg_match('/<main class="main-content">(.*?)<\/main>/s', $html, $match);
    $renderedPages[$page] = $match[1] ?? $html;
    echo "Rendered: $page\n";
}

// Kill PHP server
stopPhpServer($pid);

// Generate the main index.html (SPA with JS routing)
$indexHtml = renderIndexHtml($renderedPages);
file_put_contents("$distDir/index.html", $indexHtml);

echo "\n✓ Build complete! Output in dist/\n";
echo "  - dist/index.html (SPA entry)\n";
echo "  - dist/pages/ (individual page files)\n";
echo "  - dist/js/, dist/styles/, dist/images/\n";

/*
 *
 * Helper Functions
 * 
*/
function startPhpServer(int $port, string $docRoot): ?int {
    $cmd = PHP_BINARY . " -S localhost:$port -t " . escapeshellarg($docRoot) . " > /dev/null 2>&1 & echo $!";
    $output = shell_exec($cmd);
    return $output ? (int) trim($output) : null;
}

function stopPhpServer(int $pid): void {
    if (PHP_OS_FAMILY === 'Windows') {
        exec("taskkill /F /PID $pid 2>nul");
    } else {
        exec("kill $pid 2>/dev/null");
    }
}

function copyDir(string $src, string $dst): void {
    if (!is_dir($src)) return;
    if (!is_dir($dst)) mkdir($dst, 0755, true);
    $dir = opendir($src);
    while (($file = readdir($dir)) !== false) {
        if ($file[0] === '.') continue;
        $srcFile = "$src/$file";
        $dstFile = "$dst/$file";
        if (is_dir($srcFile)) {
            copyDir($srcFile, $dstFile);
        } else {
            copy($srcFile, $dstFile);
        }
    }
    closedir($dir);
}

function renderIndexHtml(array $pages): string {
    $pageJson = json_encode($pages, JSON_HEX_TAG | JSON_HEX_AMP);

    return <<<HTML
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.5">
    <title>Calculator Hub - All-in-One Calculator</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <script>
        // Restore theme from localStorage
        (function() {
            try {
                var theme = localStorage.getItem('calcHubTheme');
                if (theme) document.documentElement.setAttribute('data-theme', theme);
            } catch(e) {}
        })();
    </script>
</head>
<body>
    <header class="header">
        <div class="header-container">
            <div class="logo">
                <a href="index.html">
                    <img src="images/logo.svg" alt="CalcHub Logo" class="logo-img">
                    <span>Calculator Hub</span>
                </a>
            </div>
            <nav class="header-nav" id="headerNav">
                <a href="?page=calculator" class="nav-link active" data-page="calculator">
                    <i class="fas fa-calculator"></i> Calculator
                </a>
                <a href="?page=about" class="nav-link" data-page="about">
                    <i class="fas fa-info-circle"></i> About
                </a>
                <a href="?page=contact" class="nav-link" data-page="contact">
                    <i class="fas fa-envelope"></i> Contact
                </a>
            </nav>
            <div class="header-controls">
                <button id="themeToggle" class="theme-toggle" title="Toggle Theme">
                    <i class="fas fa-moon"></i>
                </button>
                <button id="navToggle" class="sidebar-toggle" title="Toggle Navigation" aria-label="Toggle navigation menu">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
                <button id="sidebarToggle" class="sidebar-toggle" title="Toggle Modes" aria-label="Toggle calculator modes sidebar">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
    </header>

    <div class="app-container">
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h3><i class="fas fa-th-large"></i> Modes</h3>
                <button class="sidebar-close" id="sidebarClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <nav class="sidebar-nav">
                <a href="#" class="mode-link active" data-mode="normal"><i class="fas fa-calculator"></i> Normal</a>
                <a href="#" class="mode-link" data-mode="scientific"><i class="fas fa-square-root-variable"></i> Scientific</a>
                <a href="#" class="mode-link" data-mode="weather"><i class="fas fa-cloud-sun"></i> Weather</a>
                <a href="#" class="mode-link" data-mode="currency"><i class="fas fa-dollar-sign"></i> Currency</a>
                <a href="#" class="mode-link" data-mode="age"><i class="fas fa-calendar-alt"></i> Age</a>
                <a href="#" class="mode-link" data-mode="percentage"><i class="fas fa-percent"></i> Percentage</a>
                <a href="#" class="mode-link" data-mode="unit"><i class="fas fa-ruler"></i> Unit Converter</a>
                <a href="#" class="mode-link" data-mode="programming"><i class="fas fa-code"></i> Programming</a>
                <a href="#" class="mode-link" data-mode="date"><i class="fas fa-clock"></i> Date</a>
                <a href="#" class="mode-link" data-mode="statistics"><i class="fas fa-chart-bar"></i> Statistics</a>
                <a href="#" class="mode-link" data-mode="color"><i class="fas fa-palette"></i> Color Codes</a>
                <a href="#" class="mode-link" data-mode="distance"><i class="fas fa-route"></i> Distance & Speed</a>
            </nav>
        </aside>

        <main class="main-content" id="mainContent">
            <!-- Injected by JS -->
        </main>
    </div>

    <footer class="footer">
        <div class="footer-container">
            <div class="footer-info">
                <p>&copy; 2026-<span id="footerYear">2026</span> Calculator Hub. All rights reserved.</p>
            </div>
            <div class="footer-author">
                <span>Developed by <strong>Samir Neupane</strong></span>
                <div class="social-links">
                    <a href="mailto:samirneupane66@gmail.com" title="Email">
                        <img src="images/email.svg" alt="Email" class="social-icon">
                    </a>
                    <a href="https://github.com/SyntX34" target="_blank" title="GitHub Profile">
                        <img src="images/github.svg" alt="GitHub" class="social-icon">
                    </a>
                    <a href="https://github.com/SyntX34/Calculator" target="_blank" title="Calculator Repository">
                        <img src="images/github_repo.svg" alt="Calculator Repository" class="social-icon">
                    </a>
                    <a href="https://steamcommunity.com/id/SyntX34" target="_blank" title="Steam">
                        <img src="images/steam.svg" alt="Steam" class="social-icon">
                    </a>
                    <a href="https://discord.com/users/nh_syntx" target="_blank" title="Discord">
                        <img src="images/discord.svg" alt="Discord" class="social-icon">
                    </a>
                </div>
            </div>
        </div>
    </footer>

    <script src="js/main.js"></script>
    <script>
        /*
         * 
         * Static SPA Router
         * 
        */
        var pages = $pageJson;

        function getPageFromUrl() {
            var params = new URLSearchParams(window.location.search);
            return params.get('page') || 'calculator';
        }

        function navigateTo(page) {
            if (!pages[page]) page = 'calculator';
            var content = pages[page] || '<p>Page not found</p>';

            // Wrap calculator content in container if it's the calculator page
            if (page === 'calculator') {
                content = '<div class="calculator-container">' + content + '</div>';
            } else {
                content = '<div class="page-content">' + content + '</div>';
            }

            document.getElementById('mainContent').innerHTML = content;

            // Update nav links
            document.querySelectorAll('.nav-link').forEach(function(link) {
                link.classList.toggle('active', link.dataset.page === page);
            });

            // Update URL without reload
            if (history.pushState) {
                var url = '?page=' + page;
                history.pushState({page: page}, '', url);
            }

            // Re-trigger calculator JS if needed
            if (window.pageChanged) window.pageChanged(page);
        }

        // Handle browser back/forward
        window.addEventListener('popstate', function(e) {
            navigateTo(getPageFromUrl());
        });

        // Nav link clicks
        document.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                navigateTo(this.dataset.page);
            });
        });

        // Initial load
        navigateTo(getPageFromUrl());

        // Update footer year
        document.getElementById('footerYear').textContent = new Date().getFullYear();

        /*
         * 
         * Cookie Consent 
         * 
        */
        (function() {
            if (localStorage.getItem('calcHubCookieConsent')) return;
            var banner = document.createElement('div');
            banner.id = 'cookie-banner';
            banner.className = 'cookie-banner';
            banner.innerHTML = '<div class="cookie-content">' +
                '<p>🍪 This site uses cookies to enhance your experience.</p>' +
                '<div class="cookie-actions">' +
                '<button class="btn-primary" onclick="acceptCookies()">Accept All</button>' +
                '<button class="btn-secondary" onclick="declineCookies()">Decline</button>' +
                '</div></div>';
            document.body.appendChild(banner);
        })();

        window.acceptCookies = function() {
            localStorage.setItem('calcHubCookieConsent', 'accepted');
            document.getElementById('cookie-banner').remove();
        };
        window.declineCookies = function() {
            localStorage.setItem('calcHubCookieConsent', 'declined');
            document.getElementById('cookie-banner').remove();
        };
    </script>
</body>
</html>
HTML;
}
