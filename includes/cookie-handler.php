<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if (in_array($action, ['accepted', 'declined', 'customized'])) {
        setcookie('cookie_consent', $action, time() + 3600 * 24 * 30, '/');
        echo json_encode(['status' => 'success']);
        exit;
    }
}
echo json_encode(['status' => 'error']);
?>