<?php

/**
 * Detect if the user is on a mobile device using User-Agent.
 */
function isMobile(): bool {
    if (isset($_SERVER['HTTP_USER_AGENT'])) {
        $ua = $_SERVER['HTTP_USER_AGENT'];
        return preg_match('/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|WPDesktop/i', $ua) === 1;
    }
    return false;
}

function handleCookieConsent() {
    $action = $_POST['cookie_action'] ?? '';
    if (in_array($action, ['accepted', 'declined', 'customized'])) {
        setcookie('cookie_consent', $action, time() + 3600 * 24 * 30, '/');
        $_COOKIE['cookie_consent'] = $action;
    }
}

function detectTheme() {
    $theme = $_COOKIE['theme'] ?? 'system';
    if ($theme === 'system') {
        return 'light';
    }
    return $theme;
}
?>