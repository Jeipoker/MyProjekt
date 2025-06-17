<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>Visit cards</title>
        <link href="http://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
        <link href="css/styles.css" rel="stylesheet" type="text/css">
    </head>
    <body>
        <h2>Введіть два рядки</h2>
        <form method="post" action="">
            <label>Рядок e: <input type="text" name="e" required></label><br><br>
            <label>Рядок f: <input type="text" name="f" required></label><br><br>
            <input type="submit" value="Обробити">
        </form>

        <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $e = $_POST['e'];
            $f = $_POST['f'];

            echo "<h3>Результати:</h3>";
            echo "а) " . htmlspecialchars($e) . ", " . htmlspecialchars($f) . "<br>";
            echo "б) " . htmlspecialchars($f) . ", " . htmlspecialchars($e) . "<br>";
        }
        ?>

    <script src="scripts/main.js"></script>
    </body>
</html>