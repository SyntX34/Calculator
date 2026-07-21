<?php
session_start();
require_once 'includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cookie_action'])) {
    handleCookieConsent();
}

$page = isset($_GET['page']) ? $_GET['page'] : 'calculator';
$allowedPages = ['calculator', 'about', 'contact'];
if (!in_array($page, $allowedPages)) {
    $page = 'calculator';
}

$theme = detectTheme();
$isMobile = isMobile();
?>
<!DOCTYPE html>
<html lang="en" data-theme="<?php echo $theme; ?>">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Calculator Hub - All-in-One Calculator</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
</head>
<body class="<?php echo $isMobile ? 'mobile-device' : ''; ?> page-<?php echo $page; ?>">
    <?php include 'includes/header.php'; ?>

    <div class="app-container <?php echo ($isMobile && $page === 'calculator') ? 'mobile-calc' : ''; ?>">
        <?php include 'includes/sidebar.php'; ?>

        <main class="main-content <?php echo ($isMobile && $page === 'calculator') ? 'mobile-calc-full' : ''; ?>">
            <?php
            switch ($page) {
                case 'calculator':
                    include 'pages/calculator.php';
                    break;
                case 'about':
                    include 'pages/about.php';
                    break;
                case 'contact':
                    include 'pages/contact.php';
                    break;
                default:
                    include 'pages/calculator.php';
            }
            ?>
        </main>
    </div>

    <?php include 'includes/footer.php'; ?>

    <?php if (!$isMobile && (!isset($_COOKIE['cookie_consent']) || $_COOKIE['cookie_consent'] === 'pending')): ?>
    <div id="cookie-banner" class="cookie-banner">
        <div class="cookie-content">
            <p>🍪 This site uses cookies to enhance your experience. By continuing, you agree to our use of cookies.</p>
            <div class="cookie-actions">
                <button onclick="acceptCookies()" class="btn-primary">Accept All</button>
                <button onclick="declineCookies()" class="btn-secondary">Decline</button>
                <button onclick="customizeCookies()" class="btn-text">Customize</button>
            </div>
        </div>
    </div>
    <?php endif; ?>
    
    <script src="js/main.js"></script>
    <script>
        function acceptCookies() {
            setCookieConsent('accepted');
        }
        function declineCookies() {
            setCookieConsent('declined');
        }
        function customizeCookies() {
            setCookieConsent('customized');
        }
        function setCookieConsent(status) {
            fetch('includes/cookie-handler.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: 'action=' + status
            }).then(() => {
                document.getElementById('cookie-banner').style.display = 'none';
                location.reload();
            });
        }
    </script>
</body>
</html>