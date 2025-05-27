<?php
session_start();

const LOG_FILE = __DIR__ . '/log.txt';
const ORDERS_FILE = __DIR__ . '/orders.txt';

function logMessage($message) {
    file_put_contents(LOG_FILE, date('Y-m-d H:i:s') . " - " . $message . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// Перевірка, чи авторизований адміністратор
if (!isset($_SESSION['admin'])) {
    logMessage("Доступ до адмін-панелі заборонено: адміністратор не авторизований.");
    header('Location: /MyProject/KA/storage/index.php');
    exit;
}

// Зчитування замовлень із orders.txt
$orders = [];
if (file_exists(ORDERS_FILE)) {
    $lines = file(ORDERS_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $order = json_decode($line, true);
        if ($order) {
            $orders[] = $order;
        } else {
            logMessage("Помилка розпарсингу JSON у рядку: " . $line);
        }
    }
} else {
    logMessage("Файл orders.txt не знайдено.");
}
?>

<!DOCTYPE html>
<html>
    <head lang="uk">
        <meta charset="utf-8">
        <title>TeaLand</title>
        <meta name="keywords" content="">
        <meta name="description" content="">
        <meta name="format-detection" content="telephone=no">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link type="text/css" rel="stylesheet" href="../assets/fonts/fonts.css">
        <link type="text/css" rel="stylesheet" href="../assets/css/admin.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    </head>
    <body>
        <h1>Замовлення клієнтів</h1>
        <table>
            <thead>
                <tr>
                    <th>№</th>
                    <th>Email</th>
                    <th>Товари</th>
                    <th>Загальна сума</th>
                    <th>Час замовлення</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($orders)): ?>
                    <tr>
                        <td colspan="5" style="text-align: center;">Замовлення відсутні</td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($orders as $index => $order): ?>
                        <tr>
                            <td><?php echo $index + 1; ?></td>
                            <td><?php echo htmlspecialchars($order['email'] ?? 'Невідомо'); ?></td>
                            <td>
                                <?php
                                $items = $order['items'] ?? [];
                                $itemsList = [];
                                foreach ($items as $item) {
                                    $name = htmlspecialchars($item['name'] ?? 'Невідомий товар');
                                    $quantity = $item['quantity'] ?? 1;
                                    $itemsList[] = "$name ($quantity шт.)";
                                }
                                echo implode(', ', $itemsList) ?: 'Товари відсутні';
                                ?>
                            </td>
                            <td><?php echo htmlspecialchars($order['total'] ?? 0); ?> грн</td>
                            <td><?php echo htmlspecialchars($order['timestamp'] ?? 'Невідомо'); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
        <a href="?action=logout" class="logout">Вийти</a>

        <script>
            // Запобігаємо поверненню назад через стрілку браузера
            window.history.replaceState(null, null, '/MyProject/KA/storage/index.php');
                                
            // Обробка кнопки виходу
            document.addEventListener('DOMContentLoaded', function () {
                const logoutButton = document.querySelector('.logout-btn');
                if (logoutButton) {
                    logoutButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        // Виконуємо вихід через GET-запит
                        window.location.replace('/MyProject/KA/storage/index.php?action=logout');
                    });
                }
            });
        </script>
    </body>
</html>