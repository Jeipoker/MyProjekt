function validateForm() {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const resultElement = document.getElementById("result");

    // Перевірка заповнення всіх полів
    if (!firstName || !lastName || !email || !username || !password || !confirmPassword) {
        resultElement.innerText = "Будь ласка, заповніть усі поля!";
        return false;
    }

    // Перевірка формату email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        resultElement.innerText = "Введіть коректний email!";
        return false;
    }

    // Перевірка довжини пароля
    if (password.length < 6) {
        resultElement.innerText = "Пароль має містити щонайменше 6 символів!";
        return false;
    }

    // Перевірка збігу паролів
    if (password !== confirmPassword) {
        resultElement.innerText = "Паролі не збігаються!";
        return false;
    }

    resultElement.innerText = "";
    return true;
}