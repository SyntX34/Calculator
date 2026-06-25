<?php
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