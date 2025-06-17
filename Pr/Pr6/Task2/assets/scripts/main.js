function checkAnswer() {
    const selectElement = document.getElementById("answerSelect");
    const selectedValue = selectElement.value;
    const correctValue = "1"; // Для A=1, B=0, результат XOR = 1
    const resultElement = document.getElementById("result");

    if (selectedValue === correctValue) {
        resultElement.innerText = "Правильно! Для A=1, B=0, або A=0, B=1: A XOR B = 1";
        resultElement.style.color = "green";
    } else {
        resultElement.innerText = "Неправильно. Спробуйте ще раз!";
        resultElement.style.color = "red";
    }
}