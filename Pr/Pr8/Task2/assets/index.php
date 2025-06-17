<?php
// Отримання змінних з GET
$a = isset($_GET['a']) && is_numeric($_GET['a']) ? (int)$_GET['a'] : null;
$b = isset($_GET['b']) && is_numeric($_GET['b']) ? (int)$_GET['b'] : null;
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Visit cards</title>
        <link href="http://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
        <link href="css/styles.css" rel="stylesheet" type="text/css">
    </head>
    <body>
        <h1>Результати обчислень</h1>
        <?php
        // Перевірка, чи введено обидва числа
        if ($a === null || $b === null) {
            echo "<p>Введіть два цілих числа в адресний рядок, наприклад: ?a=5&b=3</p>";
        } else {
            // Обчислення
            $sum = $a + $b;
            $product = $a * $b;
            $difference = $a - $b;
            $quotient = $b != 0 ? $a / $b : "Ділення на нуль неможливе";

            // Виведення результатів
            echo "<p>Числа: a = $a, b = $b</p>";
            echo "<p>Сума: $a + $b = $sum</p>";
            echo "<p>Добуток: $a * $b = $product</p>";
            echo "<p>Різниця: $a - $b = $difference</p>";
            echo "<p>Частка: $a / $b = " . (is_numeric($quotient) ? $quotient : $quotient) . "</p>";
        }
        ?>

    <script src="scripts/main.js"></script>
    </body>
</html>