function calculateSum(event) {
    event.preventDefault(); // Запобігає відправці форми
    const number1 = document.getElementById("number1").value;
    const number2 = document.getElementById("number2").value;
    const resultElement = document.getElementById("result");
    const resultMessage = document.getElementById("resultMessage");

    // Перевірка, чи введено коректні числа
    if (number1 === "" || number2 === "") {
        resultMessage.innerText = "Будь ласка, заповніть обидва поля!";
        return false;
    }
    const num1 = Number(number1);
    const num2 = Number(number2);
    if (isNaN(num1) || isNaN(num2)) {
        resultMessage.innerText = "Введіть коректні числа!";
        return false;
    }

    const sum = num1 + num2;
    // Виведення результату в поле форми
    resultElement.value = sum;
    // Виведення результату в діалоговому вікні
    alert(`Сума: ${sum}`);

    // Очищення повідомлення про помилку
    resultMessage.innerText = "";
    return false;
}

function clearResult() {
    // Очищення поля результату та повідомлення
    document.getElementById("result").value = "";
    document.getElementById("resultMessage").innerText = "";
}