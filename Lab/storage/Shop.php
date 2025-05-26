<?php
header('Content-Type: text/html; charset=utf-8');

// Запускаємо сесію
session_start();

const REGISTER_FILE = __DIR__ . '/register.txt';
const LOG_FILE = __DIR__ . '/log.txt';

/**
 * Отримує всіх зареєстрованих користувачів
 * @return array
 */
function allUsers() {
    if (!file_exists(REGISTER_FILE)) {
        return [];
    }

    $data = file_get_contents(REGISTER_FILE);
    $users = @unserialize($data);

    return is_array($users) ? $users : [];
}

/**
 * Додає нового користувача
 * @param array $params
 */
function addUser($params) {
    $users = allUsers();
    $users[] = $params;
    file_put_contents(REGISTER_FILE, serialize($users));
}

/**
 * Логує повідомлення для налагодження
 * @param string $message
 */
function logMessage($message) {
    file_put_contents(LOG_FILE, date('Y-m-d H:i:s') . " - " . $message . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// Перевірка доступності файлів
if (!is_writable(__DIR__) || (file_exists(REGISTER_FILE) && !is_writable(REGISTER_FILE)) || (file_exists(LOG_FILE) && !is_writable(LOG_FILE))) {
    logMessage("Помилка: Файли register.txt або log.txt недоступні для запису.");
    exit;
}

// Ініціалізація $loggedInUser із сесії
$loggedInUser = isset($_SESSION['user']) ? $_SESSION['user'] : null;

// Обробка GET-запиту для logout
if (isset($_GET['action']) && $_GET['action'] === 'logout' && $loggedInUser) {
    session_destroy();
    $loggedInUser = null;
    unset($_SESSION['user']);
    logMessage("Користувач вийшов.");
    header('Location: ' . $_SERVER['PHP_SELF']);
    exit;
}

// Обробка форми
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? trim($_POST['action']) : '';

    if ($action === 'register') {
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';
        $confirm_password = isset($_POST['confirm_password']) ? trim($_POST['confirm_password']) : '';
        $name = isset($_POST['name']) ? trim($_POST['name']) : '';

        if (!$email || !$password || !$confirm_password || !$name) {
            logMessage("Помилка валідації: Пропущені обов'язкові поля.");
        } elseif ($password !== $confirm_password) {
            logMessage("Помилка валідації: Паролі не збігаються.");
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            logMessage("Помилка валідації: Невірний формат email.");
        } else {
            $users = allUsers();
            $emailExists = false;
            foreach ($users as $user) {
                if ($user['email'] === $email) {
                    $emailExists = true;
                    break;
                }
            }
            if ($emailExists) {
                logMessage("Помилка: Email $email вже зареєстровано.");
            } else {
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $userData = [
                    'email' => $email,
                    'name' => $name,
                    'password' => $hashedPassword
                ];
                addUser($userData);
                logMessage("Новий користувач зареєстрований: $email");
                $_SESSION['user'] = [
                    'email' => $email,
                    'name' => $name
                ];
                $loggedInUser = $_SESSION['user'];
                header('Location: ' . $_SERVER['PHP_SELF']);
                exit;
            }
        }
    } elseif ($action === 'login') {
        $email = isset($_POST['email']) ? trim($_POST['email']) : '';
        $password = isset($_POST['password']) ? trim($_POST['password']) : '';

        if (!$email || !$password) {
            logMessage("Помилка валідації: Пропущені обов'язкові поля.");
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            logMessage("Помилка валідації: Невірний формат email.");
        } else {
            $users = allUsers();
            $userFound = false;
            $passwordCorrect = false;
            foreach ($users as $user) {
                if ($user['email'] === $email) {
                    $userFound = true;
                    if (password_verify($password, $user['password'])) {
                        $passwordCorrect = true;
                        $_SESSION['user'] = [
                            'email' => $user['email'],
                            'name' => $user['name'] ?? ''
                        ];
                        $loggedInUser = $_SESSION['user'];
                    }
                    break;
                }
            }
            if (!$userFound) {
                logMessage("Помилка входу: Email $email не знайдено.");
            } elseif (!$passwordCorrect) {
                logMessage("Помилка входу: Невірний пароль для $email");
            } else {
                logMessage("Успішний вхід для email: $email");
                header('Location: ' . $_SERVER['PHP_SELF']);
                exit;
            }
        }
    } else {
        logMessage("Некоректна дія: $action");
    }
}

?>
<!DOCTYPE html>
<html>
<head lang="uk">
    <meta charset="utf-8">
    <title>Shop</title>
    <meta name="keywords" content="">
    <meta name="description" content="">
    <meta name="format-detection" content="telephone=no">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <link type="text/css" rel="stylesheet" href="../assets/fonts/fonts.css">
    <link type="text/css" rel="stylesheet" href="../assets/css/Shop.css">
    <link type="text/css" rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body class="Shop_body">
    <div class="container">
        <div>
            <header>
                <div class="frame1">
                    <h1 class="name">TeaLand</h1>
                    <div class="frame1_profile_line_cart">
                        <div class="profile_line">
                            <div class="prifile">
                                <a class="btn_profile" href="#" id="openProfileModal">
                                    <div class="circle1"></div>
                                    <div class="vector1"></div>
                                </a>
                            </div>
                            <div class="vertical_line"></div>
                        </div>
                        <div class="cart">
                            <button class="btn_cart">
                                <img src="../assets/images/cart.png" alt="Cart">
                                <span class="cart-count">0</span>
                            </button>
                            <div class="cart-modal">
                                <div class="cart-dropdown" style="display: none;">
                                    <div class="cart-header">
                                        <h3>Кошик</h3>
                                        <button class="cart-close">×</button>
                                    </div>
                                    <div class="cart-items"></div>
                                    <div class="cart-footer">
                                        <p class="cart-total">Загалом: 0 грн</p>
                                        <button class="cart-clear">Очистити кошик</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tea_cup">
                        <img src="../assets/images/tea_cup.png" alt="Tea Cup">
                    </div>
                    <div class="frame1_search_string">
                        <form class="btn_search" id="main-search-form">
                            <div class="searchtext_dandruff">
                                <div class="dandruff">
                                    <img src="../assets/images/dandruff.png" alt="Search">
                                </div>
                                <input
                                    type="text"
                                    class="searchtext"
                                    id="main-search-input"
                                    placeholder="Search for tea, leaves">
                            </div>
                        </form>
                        <form class="btn_search small_search" id="small-search-form">
                            <div class="searchtext_dandruff">
                                <div class="dandruff">
                                    <img src="../assets/images/dandruff.png" alt="Search">
                                </div>
                                <input
                                    type="text"
                                    class="searchtext"
                                    id="small-search-input"
                                    placeholder="Search">
                            </div>
                        </form>
                    </div>
                    <div class="frame1_pages">
                        <div class="pages">
                            <a class="btn_text_Contact" href="#footer">Contact</a>
                            <a class="btn_text_AboutUs" href="index.php#about-us">About Us</a>
                            <a class="btn_text_Shop" href="Shop.php">Shop</a>
                            <a class="btn_text_Home" href="index.php">Home</a>
                        </div>
                    </div>
                    <div class="menu_container">
                        <button class="menu_button">☰</button>
                        <div class="menu_content">
                            <a class="btn_text_Contact2" href="#footer">Contact</a>
                            <a class="btn_text_AboutUs2" href="index.php#about-us">About Us</a>
                            <a class="btn_text_Shop2" href="Shop.php">Shop</a>
                            <a class="btn_text_Home2" href="index.php">Home</a>
                        </div>
                    </div>
                </div>
            </header>
            <main class="Shop_main">
                <div class="Frame_Shop_main">
                    <h2 class="Shop_h2">Our Shop</h2>
                    <div class="Goods_container">
                        <div class="product_card">
                            <img src="../assets/images/black.carp.png" alt="Карпатський Чорний">
                            <h3>Карпатський Чорний</h3>
                            <p class="description">Класичний чорний чай із Цейлону з насиченим смаком і легкими нотами карамелі. Ідеальний для ранкового ритуалу. Походить із найкращих плантацій Шрі-Ланки.</p>
                            <p class="price">Ціна: 60 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Карпатський Чорний" data-price="60">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/Sun.green.png" alt="Сонячний Зелений">
                            <h3>Сонячний Зелений</h3>
                            <p class="description">Ніжний китайський зелений чай Dragon Well із трав’яним ароматом і нотками свіжого горіха. Освіжає та заряджає енергією.</p>
                            <p class="price">Ціна: 75 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Сонячний Зелений" data-price="75">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/SlavaUkr.png" alt="Слава Україні">
                            <h3>Слава Україні</h3>
                            <p class="description">Унікальний бленд чорного чаю з Грузії з гречкою, медом і пелюстками соняшника. Солодкуватий смак із горіховими нотами.</p>
                            <p class="price">Ціна: 90 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Слава Україні" data-price="90">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/TivanUlun.png" alt="Лавандовий Улун">
                            <h3>Лавандовий Улун</h3>
                            <p class="description">Тайванський улун із легкою оксидацією та ароматом лаванди. Має квітковий смак із вершковим післясмаком.</p>
                            <p class="price">Ціна: 110 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Лавандовий Улун" data-price="110">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/CarpYag.png" alt="Ягідний Карпатський">
                            <h3>Ягідний Карпатський</h3>
                            <p class="description">Фруктовий бленд на основі ройбуша з ягодами малини, ожини та карпатськими травами. Без кофеїну, зігріває та освіжає.</p>
                            <p class="price">Ціна: 80 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Ягідний Карпатський" data-price="80">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/Dardjiling.png" alt="М'ятний Дарджилінг">
                            <h3>М'ятний Дарджилінг</h3>
                            <p class="description">Індійський чорний чай Дарджилінг із додаванням свіжої м’яти. Легкий, ароматний, із нотками мускатного винограду.</p>
                            <p class="price">Ціна: 85 грн/100 г</p>
                            <button class="add_to_cart" data-tea="М'ятний Дарджилінг" data-price="85">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/Pion.png" alt="Білий Піон">
                            <h3>Білий Піон</h3>
                            <p class="description">Делікатний білий чай із провінції Фуцзянь із м’яким квітковим смаком і легкою солодкістю. Мінімальна обробка.</p>
                            <p class="price">Ціна: 120 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Білий Піон" data-price="120">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/ceremonial_new.png" alt="Матча Ceremonial">
                            <h3>Матча Ceremonial</h3>
                            <p class="description">Японська матча преміум-класу з яскравим зеленим кольором і багатим умамі-смаком. Ідеальна для церемоній.</p>
                            <p class="price">Ціна: 150 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Матча Ceremonial" data-price="150">Додати до кошика</button>
                        </div>
                        <div class="product_card">
                            <img src="../assets/images/Imbur.png" alt="Імбирний Лайм">
                            <h3>Імбирний Лайм</h3>
                            <p class="description">Чорний чай із Цейлону з додаванням імбиру та цедри лайма. Пряний, освіжаючий, зігріває в холодні дні.</p>
                            <p class="price">Ціна: 65 грн/100 г</p>
                            <button class="add_to_cart" data-tea="Імбирний Лайм" data-price="65">Додати до кошика</button>
                        </div>
                    </div>
                </div>
            </main>
            <footer class="footer" id="footer">
                <div class="footer_elements">
                    <div class="author">
                        <h2 class="footer_author_title">Author</h2>
                        <div class="author_name_groop">
                            <h3>Кушнеров Андрій</h3>
                            <p>КІ2-24-3</p>
                        </div>
                        <div class="author_photo">
                            <img src="../assets/images/MyPhoto.png" alt="Author Photo">
                        </div>
                    </div>
                    <div class="support">
                        <h2 class="footer_support_title">Support</h2>
                        <div class="support_email_tel">
                            <a class="support_email" href="mailto:kusnerovandrij802@gmail.com">kusnerovandrij@gmail.com</a>
                            <a class="support_tel" href="tel:+380960016333">+38 (096) 001-63-33</a>
                        </div>
                    </div>
                    <div class="account">
                        <h2 class="footer_account_title">Account</h2>
                        <div class="account_elements">
                            <a class="account_MyAccount" href="#">My Account</a>
                            <a class="account_LoginRegister" href="#">Login / Register</a>
                            <a class="account_Logout <?php echo isset($loggedInUser) ? '' : 'disabled'; ?>" 
                               <?php echo isset($loggedInUser) ? 'href="?action=logout"' : 'title="Увійдіть, щоб вийти"'; ?>>Logout</a>
                        </div>
                    </div>
                    <div class="findUs">
                        <h2 class="footer_findUs_title">Find Us</h2>
                        <div class="findUs_socialIcons">
                            <a href="https://www.instagram.com/kushnir.andrij" target="_blank">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="https://twitter.com/AndrijKusnerov" target="_blank">
                                <i class="fab fa-x-twitter"></i>
                            </a>
                            <a href="https://www.facebook.com/kusnerovandrij" target="_blank">
                                <i class="fab fa-facebook"></i>
                            </a>
                            <a href="https://t.me/Jeypoker0" target="_blank">
                                <i class="fab fa-telegram"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    </div>
    <!-- Модальне вікно профілю -->
    <div id="profileModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" data-modal-id="profileModal">×</span>
            <div id="profileContent">
                <!-- Контент вставляється JS-ом -->
            </div>
        </div>
    </div>
    <!-- Модальне вікно входу -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" data-modal-id="loginModal">×</span>
            <h2>Sign in</h2>
            <form id="loginForm" method="POST" action="">
                <input type="hidden" name="action" value="login">
                <input type="email" name="email" placeholder="E-mail" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Sign in</button>
            </form>
        </div>
    </div>
    <!-- Модальне вікно реєстрації -->
    <div id="registerModal" class="modal">
        <div class="modal-content">
            <span class="close-btn" data-modal-id="registerModal">×</span>
            <h2>Registration</h2>
            <form id="registerForm" method="POST" action="">
                <input type="hidden" name="action" value="register">
                <input type="text" name="name" placeholder="Name" required>
                <input type="email" name="email" placeholder="E-mail" required>
                <input type="password" name="password" placeholder="Password" required>
                <input type="password" name="confirm_password" placeholder="Repeat the password" required>
                <button type="submit">Register</button>
            </form>
        </div>
    </div>

    <?php if (isset($loggedInUser)): ?>
        <script>
            window.loggedInUser = <?= json_encode($loggedInUser) ?>;
        </script>
    <?php endif; ?>

    <script src="../assets/scripts/main.js"></script>
    <script src="../assets/scripts/Shop.js"></script>
</body>
</html>