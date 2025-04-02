// перенесення по кнопках
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btn_text_AboutUs').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#about-us').scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.btn_text_AboutUs2').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#about-us').scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.btn_text_Home').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.btn_text_Home2').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    });

    // пошук
    // рекурсивний пошук
    function findTextInDOM(node, query) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                return node.parentElement;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                const match = findTextInDOM(child, query);
                if (match) return match;
            }
        }
        return null;
    }
    // прокрутка до першого збігу
    function scrollToFirstMatch(query) {
        if (!query) return;
        const root = document.body;
        const matchedElement= findTextInDOM(root, query);
        if (matchedElement) {
            matchedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const originalHTML = matchedElement.innerHTML;
            matchedElement.innerHTML = originalHTML.replace(
                new RegExp(query, 'gi'),
                `<span style="background-color: yellow;">${query}</span>`
            );
            // зникнення підсвітки
            setTimeout(() => {
                matchedElement.innerHTML = originalHTML;
            }, 6000);
        } else {
            console.log('Збігів не знайдено');
        }
    }
    // обробка введення в основному пошуку
    // const mainInput = document.getElementById('main-search-input');
    // const mainButton = document.getElementById('main-search-btn');
    // const mainForm = document.getElementById('main-search-form');
    // mainInput.addEventListener('input', function() {
    //     const query = this.value.trim();
    //     mainButton.style.display = query ? 'inline-block' : 'none'; // Показуємо/ховаємо кнопку
    // });
    // mainForm.addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     const query = mainInput.value.trim();
    //     if (query) {
    //         scrollToFirstMatch(query);
    //     }
    // });
    // // обробка введення в малому пошуку
    // const smallInput = document.getElementById('small-search-input');
    // const smallButton = document.getElementById('small-search-btn');
    // const smallForm = document.getElementById('small-search-form');
    // smallInput.addEventListener('input', function() {
    //     const query = this.value.trim();
    //     smallButton.style.display = query ? 'inline-block' : 'none'; // Показуємо/ховаємо кнопку
    // });
    // smallForm.addEventListener('submit', function(event) {
    //     event.preventDefault();
    //     const query = smallInput.value.trim();
    //     if (query) {
    //         scrollToFirstMatch(query);
    //     }
    // });
    // Функція для ініціалізації пошуку
    function initializeSearch(inputId, buttonId, formId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const form = document.getElementById(formId);

        if (input && button && form) {
            input.addEventListener('input', function() {
                const query = this.value.trim();
                button.style.display = query ? 'inline-block' : 'none';
                console.log(`Введено в ${inputId}:`, query); // Діагностика
            });

            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const query = input.value.trim();
                console.log(`Submit для ${formId}:`, query); // Діагностика
                if (query) {
                    scrollToFirstMatch(query);
                }
            });
        } else {
            console.error(`Елементи для ${formId} не знайдені:`, { input, button, form });
        }
    }
    initializeSearch('main-search-input', 'main-search-btn', 'main-search-form');

    // Ініціалізація малого пошуку
    initializeSearch('small-search-input', 'small-search-btn', 'small-search-form');

    // Перевірка при зміні розміру вікна
    window.addEventListener('resize', function() {
        const smallForm = document.getElementById('small-search-form');
        if (smallForm && window.getComputedStyle(smallForm).display !== 'none') {
            console.log('Малий пошук видимий');
        }
    });
});