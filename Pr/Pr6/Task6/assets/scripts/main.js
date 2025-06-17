function validateForm() {
    const email = document.getElementById("email").value;
    const resultMessage = document.getElementById("resultMessage");

    // Перевірка формату email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        resultMessage.innerText = "Введіть коректний email!";
        return false;
    }

    // Діагностика: виведення в консоль для перевірки
    console.log("Форма валідна, відкривається поштовий клієнт з email:", email);
            
    // Очищення повідомлення про помилку
    resultMessage.innerText = "";
    return true;
}

function clearMessage() {
    // Очищення повідомлення при натисканні "Очистити"
    document.getElementById("resultMessage").innerText = "";
}