<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Visit cards</title>
        <link href="http://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
        <link href="css/styles.css" rel="stylesheet" type="text/css">
    </head>
    <body>
        <h1>Суперглобальні змінні PHP</h1>
        <table>
            <tr>
                <th>Позначення змінної</th>
                <th>Характеристика</th>
                <th>Отримане значення</th>
            </tr>
            <tr>
                <td>$GLOBALS</td>
                <td>Містить усі глобальні змінні, доступні в поточному скрипті.</td>
                <td><pre><?php echo htmlspecialchars(print_r($GLOBALS, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_SERVER</td>
                <td>Містить інформацію про сервер і оточення (наприклад, IP, шлях до файлу).</td>
                <td><pre><?php echo htmlspecialchars(print_r($_SERVER, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_GET</td>
                <td>Дані, передані через URL-параметри (метод GET).</td>
                <td><pre><?php echo htmlspecialchars(print_r($_GET, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_POST</td>
                <td>Дані, передані через форму (метод POST).</td>
                <td><pre><?php echo htmlspecialchars(print_r($_POST, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_FILES</td>
                <td>Дані про завантажені файли через форму.</td>
                <td><pre><?php echo htmlspecialchars(print_r($_FILES, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_COOKIE</td>
                <td>Дані cookie, встановлені для поточного домену.</td>
                <td><pre><?php echo htmlspecialchars(print_r($_COOKIE, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_SESSION</td>
                <td>Дані сесії для поточного користувача (потребує session_start()).</td>
                <td><pre><?php echo htmlspecialchars(print_r($_SESSION, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_REQUEST</td>
                <td>Комбінація даних із $_GET, $_POST і $_COOKIE.</td>
                <td><pre><?php echo htmlspecialchars(print_r($_REQUEST, true)); ?></pre></td>
            </tr>
            <tr>
                <td>$_ENV</td>
                <td>Змінні оточення, передані серверу.</td>
                <td><pre><?php echo htmlspecialchars(print_r($_ENV, true)); ?></pre></td>
            </tr>
        </table>
    <script src="scripts/main.js"></script>
    </body>
</html>