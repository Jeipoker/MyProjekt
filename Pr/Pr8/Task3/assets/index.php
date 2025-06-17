

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Visit cards</title>
        <link href="http://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
        <link href="css/styles.css" rel="stylesheet" type="text/css">
    </head>
    <body>
        <h2>Введіть два цілих числа</h2>
        <form method="post" action="">
            <label>Число c: <input type="number" name="c" required></label><br><br>
            <label>Число d: <input type="number" name="d" required></label><br><br>
            <input type="submit" value="Обчислити">
        </form>

        <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $c = (int)$_POST['c'];
            $d = (int)$_POST['d'];
        
            echo "<h3>Результати обчислень:</h3>";
            echo "Сума: " . ($c + $d) . "<br>";
            echo "Добуток: " . ($c * $d) . "<br>";
            echo "Різниця: " . abs($c - $d) . "<br>";
            
            if ($d != 0) {
                echo "Частка: " . ($c / $d) . "<br>";
            } else {
                echo "Частка: Ділення на нуль неможливе<br>";
            }
        }
        ?>
    <script src="scripts/main.js"></script>
    </body>
</html>