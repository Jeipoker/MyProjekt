document.addEventListener('DOMContentLoaded', function () {
    // Підсвічування кнопок
    const navButtons = document.querySelectorAll('.pages a, .menu_content a:not(.account_LoginRegister)');
    const sections = {
        'Home': document.querySelector('.container'),
        'AboutUs': document.querySelector('#about-us'),
        'Contact': document.querySelector('.footer')
    };

    function removeActiveClass() {
        navButtons.forEach(button => button.classList.remove('active'));
    }

    function setActiveButton(sectionId) {
        removeActiveClass();
        const buttons = document.querySelectorAll(`.btn_text_${sectionId}, .btn_text_${sectionId}2`);
        buttons.forEach(button => button.classList.add('active'));
    }

    function checkVisibleSection() {
        let currentSectionId = null;
        let maxVisibleHeight = 0;

        Object.entries(sections).forEach(([sectionId, section]) => {
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

            if (visibleHeight > maxVisibleHeight && visibleHeight > 0) {
                maxVisibleHeight = visibleHeight;
                currentSectionId = sectionId;
            }
        });

        if (currentSectionId) {
            setActiveButton(currentSectionId);
        } else {
            setActiveButton('Home');
        }
    }

    const handleNavClick = (sectionId, selector) => {
        return function (event) {
            event.preventDefault();
            setActiveButton(sectionId);
            document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
        };
    };

    document.querySelector('.btn_text_Home')?.addEventListener('click', handleNavClick('Home', '.container'));
    document.querySelector('.btn_text_Home2')?.addEventListener('click', handleNavClick('Home', '.container'));
    document.querySelector('.btn_text_AboutUs')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    document.querySelector('.btn_text_AboutUs2')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    document.querySelector('.btn_text_Contact')?.addEventListener('click', handleNavClick('Contact', '.footer'));
    document.querySelector('.btn_text_Contact2')?.addEventListener('click', handleNavClick('Contact', '.footer'));

    window.addEventListener('scroll', checkVisibleSection);
    checkVisibleSection();

    // Пошук
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

    function scrollToFirstMatch(query) {
        if (!query) return;
        const root = document.body;
        const matchedElement = findTextInDOM(root, query);
        if (matchedElement) {
            matchedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const originalHTML = matchedElement.innerHTML;
            matchedElement.innerHTML = originalHTML.replace(
                new RegExp(query, 'gi'),
                `<span style="background-color: yellow;">${query}</span>`
            );
            setTimeout(() => {
                matchedElement.innerHTML = originalHTML;
            }, 6000);
        } else {
            console.log('Збігів не знайдено');
        }
    }

    function initializeSearch(inputId, formId) {
        const input = document.getElementById(inputId);
        const form = document.getElementById(formId);

        if (input && form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                const query = input.value.trim();
                if (query) {
                    scrollToFirstMatch(query);
                }
            });
        } else {
            console.error(`Елементи для ${formId} не знайдені:`, { input, form });
        }
    }

    initializeSearch('main-search-input', 'main-search-form');
    initializeSearch('small-search-input', 'small-search-form');

    window.addEventListener('resize', function () {
        const smallForm = document.getElementById('small-search-form');
        if (smallForm && window.getComputedStyle(smallForm).display !== 'none') {
            console.log('Малий пошук видимий');
        }
    });

    // Бургер-меню
    const menuButton = document.querySelector(".menu_button");
    const menuContent = document.querySelector(".menu_content");

    menuButton.addEventListener("click", function (event) {
        event.stopPropagation();
        menuContent.style.display = menuContent.style.display === "block" ? "none" : "block";
    });

    menuContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest('.account_LoginRegister') && !event.target.closest('.modal')) {
            menuContent.style.display = "none";
        }
    });

    // Модальні вікна
    const container = document.querySelector('.container');

    document.querySelector('.account_LoginRegister').addEventListener('click', function (e) {
        e.preventDefault();
        console.log('Login/Register clicked');
        showChoiceModal();
    });

    function showChoiceModal() {
        console.log('Opening choice modal');
        const modal = document.getElementById('choiceModal');
        if (modal) {
            modal.style.display = 'flex';
            container.classList.add('blur');
        } else {
            console.error('Choice modal not found');
        }
        return false;
    }

    function showLoginModal() {
        console.log('Opening login modal');
        const choiceModal = document.getElementById('choiceModal');
        const loginModal = document.getElementById('loginModal');
        if (choiceModal && loginModal) {
            choiceModal.style.display = 'none';
            loginModal.style.display = 'flex';
            container.classList.add('blur');
        } else {
            console.error('Login modal or choice modal not found', { choiceModal, loginModal });
        }
    }

    function showRegisterModal() {
        console.log('Opening register modal');
        const choiceModal = document.getElementById('choiceModal');
        const registerModal = document.getElementById('registerModal');
        if (choiceModal && registerModal) {
            choiceModal.style.display = 'none';
            registerModal.style.display = 'flex';
            container.classList.add('blur');
        } else {
            console.error('Register modal or choice modal not found', { choiceModal, registerModal });
        }
    }

    function closeModal(modalId) {
        console.log(`Closing modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            const anyModalOpen = document.querySelector('.modal[style="display: flex;"]');
            if (!anyModalOpen) {
                container.classList.remove('blur');
            }
        } else {
            console.error(`Modal ${modalId} not found`);
        }
    }

    // Обробники для кнопок модальних вікон
    document.getElementById('loginButton')?.addEventListener('click', function () {
        console.log('Login button clicked');
        showLoginModal();
    });

    document.getElementById('registerButton')?.addEventListener('click', function () {
        console.log('Register button clicked');
        showRegisterModal();
    });

    // Обробники для хрестиків
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const modalId = this.getAttribute('data-modal-id');
            console.log('Close button clicked for modal:', modalId);
            closeModal(modalId);
        });
    });

    window.addEventListener('click', function (event) {
        console.log('Window click, target:', event.target);
        if (event.target.classList.contains('modal') && !event.target.closest('.account_LoginRegister')) {
            closeModal('choiceModal');
            closeModal('loginModal');
            closeModal('registerModal');
        }
    });
});