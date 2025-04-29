<?php
header('Content-Type: text/html; charset=utf-8');

const REGISTER_FILE = __DIR__ . '/register.ser';
const LOG_FILE = __DIR__ . '/log.txt';

/**
 * Отримує всіх зареєстрованих користувачів
 * @return array
 */
function allUsers() {
    return file_exists(REGISTER_FILE) ? unserialize(file_get_contents(REGISTER_FILE)) : [];
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
    $message = mb_convert_encoding($message, 'UTF-8', 'auto');
    file_put_contents(LOG_FILE, date('Y-m-d H:i:s') . " - " . $message . PHP_EOL, FILE_APPEND | LOCK_EX);
}

// Перевірка доступності файлів
if (!is_writable(__DIR__) || (file_exists(REGISTER_FILE) && !is_writable(REGISTER_FILE)) || (file_exists(LOG_FILE) && !is_writable(LOG_FILE))) {
    $message = "Помилка: Файли register.ser або log.txt недоступні для запису.";
    logMessage($message);
} else {
    // Обробка форми
    $message = '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $action = isset($_POST['action']) ? trim($_POST['action']) : '';

        if ($action === 'register') {
            $name = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'], ENT_QUOTES, 'UTF-8')) : '';
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';
            $password = isset($_POST['password']) ? trim($_POST['password']) : '';
            $confirm_password = isset($_POST['confirm_password']) ? trim($_POST['confirm_password']) : '';
            $timestamp = date('Y-m-d H:i:s');
            $userIP = $_SERVER['REMOTE_ADDR'];

            if (!$name || !$email || !$password || !$confirm_password) {
                logMessage("Помилка валідації: Пропущені обов'язкові поля.");
                $message = "Всі поля є обов'язковими!";
            } elseif ($password !== $confirm_password) {
                logMessage("Помилка валідації: Паролі не збігаються.");
                $message = "Паролі не збігаються!";
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                logMessage("Помилка валідації: Невірний формат email.");
                $message = "Невірний формат email!";
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
                    $message = "Цей email вже зареєстровано!";
                } else {
                    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                    $userData = [
                        'name' => $name,
                        'email' => $email,
                        'password' => $hashedPassword,
                        'timestamp' => $timestamp,
                        'user_ip' => $userIP
                    ];
                    addUser($userData);
                    logMessage("Новий користувач зареєстрований: $email");
                    $message = "Реєстрація успішна!";
                }
            }
        } elseif ($action === 'login') {
            $email = isset($_POST['email']) ? trim($_POST['email']) : '';
            $password = isset($_POST['password']) ? trim($_POST['password']) : '';

            if (!$email || !$password) {
                logMessage("Помилка валідації: Пропущені обов'язкові поля.");
                $message = "Всі поля є обов'язковими!";
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                logMessage("Помилка валідації: Невірний формат email.");
                $message = "Невірний формат email!";
            } else {
                $users = allUsers();
                $userFound = false;
                foreach ($users as $user) {
                    if ($user['email'] === $email && password_verify($password, $user['password'])) {
                        $userFound = true;
                        break;
                    }
                }
                if ($userFound) {
                    logMessage("Успішний вхід для email: $email");
                    $message = "Вхід виконано успішно!";
                } else {
                    logMessage("Помилка входу: Невірний email або пароль для $email");
                    $message = "Невірний email або пароль!";
                }
            }
        } else {
            logMessage("Некоректна дія: $action");
            $message = "Некоректна дія!";
        }
    }
}
?>

<!DOCTYPE html>
<html>
    <head lang="en">
        <meta charset="utf-8">
        <title>Lab</title>
        <meta name="keywords" content="">
        <meta name="description" content="">
        <meta name="format-detection" content="telephone=no">
        <meta name="viewport" content="width=device-width, initial-scale=1.0.">
        
        <link type="text/css" rel="stylesheet" href="../assets/fonts/fonts.css">
        <link type="text/css" rel="stylesheet" href="../assets/css/styles.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    </head>
    <body>
        <?php if ($message): ?>
            <div style="padding: 10px; background: <?php echo strpos($message, 'успішн') !== false ? '#d4edda' : '#f8d7da'; ?>; color: <?php echo strpos($message, 'успішн') !== false ? '#155724' : '#721c24'; ?>; border: 1px solid <?php echo strpos($message, 'успішн') !== false ? '#c3e6cb' : '#f5c6cb'; ?>; margin: 10px;">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
        <div class="container">
            <header>
                <div class="frame1">
                    <h1 class="name">TeaLand</h1>
                    <div class="frame1_profile_line_cart">
                        <div class="profile_line">
                            <div class="prifile">
                                <a class="btn_profile" href="#">
                                    <div class="circle1"></div>
                                    <div class="vector1"></div>
                                </a>
                            </div>
                            <div class="vertical_line"></div>
                        </div>
                        <div class="cart">
                            <a class="btn_cart" href="#">
                                <img src="../assets/images/cart.png" alt="">
                            </a>
                        </div>
                    </div>
                    <div class="tea_cup">
                        <img src="../assets/images/tea_cup.png" alt="">
                    </div>
                    <div class="frame1_search_string">
                        <form class="btn_search" id="main-search-form">
                            <div class="searchtext_dandruff">
                                <div class="dandruff">
                                    <img src="../assets/images/dandruff.png" alt="">
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
                                    <img src="../assets/images/dandruff.png" alt="">
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
                            <a class="btn_text_Contact" href="Contact">Contact</a>
                            <a class="btn_text_AboutUs" href="#about-us">About Us</a>
                            <a class="btn_text_Offers" href="Offers">Offers</a>
                            <a class="btn_text_Shop" href="Shop">Shop</a>
                            <a class="btn_text_Home" href="Home">Home</a>
                        </div>
                    </div>
                    <div class="menu_container">
                        <button class="menu_button">☰</button>
                        <div class="menu_content">
                            <a class="btn_text_Contact2" href="Contact">Contact</a>
                            <a class="btn_text_AboutUs2" href="#about-us">About Us</a>
                            <a class="btn_text_Offers2" href="Offers">Offers</a>
                            <a class="btn_text_Shop2" href="Shop">Shop</a>
                            <a class="btn_text_Home2" href="Home">Home</a>
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div class="frame2">
                    <div class="frame2_text_btn">
                        <p class="frame2_text">Explore our products and win rewards for each and every purchase, only limited deals available!</p>
                        <a class="btn_frame2" href="#">
                            <p class="btn_frame2_text">Claim now</p>
                        </a>
                    </div>
                </div>
                <div class="frame3">
                    <h1 class="frame3_text1">PLANT TO CUP</h1>
                    <h1 class="frame3_text2">
                        Fresh From Our Tea <br/>
                        Gardens To Your ☕
                    </h1>
                    <img class="frame3_herbal1" src="../assets/images/herbal1.png" alt="">
                    <img class="frame3_herbal2" src="../assets/images/herbal2.png" alt="">
                    <img class="frame3_herbal3" src="../assets/images/herbal3.png" alt="">
                    <div class="frame3_button">
                        <div class="text_btn">
                            <p class="frame3_text">Take a Detour</p>
                            <a class="btn_arrow" href="#">
                                <img src="../assets/images/arrow.png" alt="">
                            </a>
                        </div>
                    </div>
                    <img class="Big_tea_img" src="../assets/images/Big.image.tea.png" alt="">
                    <img class="Big_tea_img_2" src="../assets/images/Big.image.tea (2).png" alt="">
                    <img class="Tea_small" src="../assets/images/Tea2.jpg" alt="">
                </div>
                <div class="frame_AboutUs" id="about-us">
                    <div class="frame_AboutUs_Padding">
                        <h2 class="frame_AboutUs_Title">About Us</h2>
                        <div class="frame_AboutUs_TextImg">
                            <div class="frame_AboutUs_Text">
                                <p>
                                    Ми — компанія, яка спеціалізується на продажу імпортних чаїв
                                    преміального класу. Наша мета — познайомити справжніх поціновувачів 
                                    цього благородного напою з найкращими сортами, що мають глибокі 
                                    традиції та унікальні смаки. Кожен чай у нашому асортименті — це
                                    не просто заварка, а справжня подорож до країн, де чайна культура 
                                    є частиною життя, де її шанують і вдосконалюють століттями.
                                </p>
                                <p>
                                    Наші чаї походять із різних куточків світу — від мальовничих 
                                    плантацій Японії та Китаю до сонячних схилів Індії й Шрі-Ланки. 
                                    Ми ретельно відбираємо постачальників, які поділяють нашу пристрасть 
                                    до якості та автентичності. У кожній упаковці — не просто листя, 
                                    а історія, що відображає клімат, ґрунт і турботу майстрів, які 
                                    створюють ці шедеври для вашої чашки.
                                </p>
                                <p>
                                    Ми віримо, що чай — це більше, ніж напій. Це ритуал, момент спокою 
                                    і насолоди, який об’єднує людей і дозволяє відчути гармонію. 
                                    Саме тому наш магазин створений для тих, хто цінує не лише смак, 
                                    а й культуру, що стоїть за кожним ковтком. Незалежно від того, 
                                    чи ви досвідчений знавець, чи тільки починаєте відкривати для себе 
                                    світ чаю, у нас знайдеться щось особливе саме для вас.
                                </p>
                                <p>
                                    Ласкаво просимо до нашого інтернет-магазину, де ви можете прямо зараз 
                                    обрати свій ідеальний чай із преміального асортименту. Кожен сорт у 
                                    нашому каталозі — це можливість знайти смак, який стане вашим щоденним 
                                    супутником або особливим подарунком для близької людини. Ми зібрали 
                                    для вас багатство чайних традицій світу, і воно вже чекає — від першого 
                                    аромату до останньої краплі.
                                </p>
                            </div>
                            <div class="frame_AboutUs_Img">
                                <div class="AboutUs_LeftColumn">
                                    <img src="../assets/images/Tea_plantation.png" alt="">
                                    <img src="../assets/images/Tea_cup2.jpg" alt="">
                                </div>
                                <div class="AboutUs_RightColumn">
                                    <img src="../assets/images/Tea_Leaves.jpg" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer class="footer">
                <div class="footer_elements">
                    <div class="author">
                        <h2 class="footer_author_title">Author</h2>
                        <div class="author_name_groop">
                            <h3>Кушнеров Андрій</h3>
                            <p>КІ2-24-3</p>
                        </div>
                        <div class="author_photo">
                            <img src="../assets/images/MyPhoto.png" alt="">
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
                            <a class="account_MyAccount" href="">My Account</a>
                            <a class="account_LoginRegister" href="">Login / Register</a>
                            <a class="account_Logout" href="">Logout</a>
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
        <!-- Модальні вікна-->
        <div id="choiceModal" class="modal">
            <div class="modal-content">
                <span class="close-btn" data-modal-id="choiceModal">×</span>
                <h2>Select an action</h2>
                <button id="loginButton">Sign in</button>
                <button id="registerButton">Register</button>
            </div>
        </div>
        <div id="loginModal" class="modal">
            <div class="modal-content">
                <span class="close-btn" data-modal-id="loginModal">×</span>
                <h2>Sign in</h2>
                <form id="loginForm">
                    <input type="email" placeholder="E-mail" required>
                    <input type="password" placeholder="Password" required>
                    <button type="submit">Sign in</button>
                </form>
            </div>
        </div>
        <div id="registerModal" class="modal">
            <div class="modal-content">
                <span class="close-btn" data-modal-id="registerModal">×</span>
                <h2>Registration</h2>
                <form id="registerForm">
                    <input type="text" placeholder="Name" required>
                    <input type="email" placeholder="E-mail" required>
                    <input type="password" placeholder="Password" required>
                    <input type="password" placeholder="Repeat the password" required>
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
        <script src="../assets/scripts/main.js"></script>
    </body>
</html>