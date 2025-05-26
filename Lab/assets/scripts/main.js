document.addEventListener('DOMContentLoaded', function () {
    // Підсвічування кнопок
    const navButtons = document.querySelectorAll('.pages a, .menu_content a:not(.account_LoginRegister)');

    const currentPage = window.location.pathname.includes('Shop.php') ? 'Shop' : 'Home';

    // Секції для прокручування на index.php
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

    if (currentPage === 'Shop') {
    setActiveButton('Shop');
    } else {
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

        window.addEventListener('scroll', checkVisibleSection);
        checkVisibleSection();
    }

    const handleNavClick = (sectionId, selector) => {
        return function (event) {
            event.preventDefault();
            setActiveButton(sectionId);
            if (currentPage === 'Home' && selector) {
                document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                if (['Home', 'AboutUs', 'Contact'].includes(sectionId)) {
                    window.location.href = `index.php${sectionId === 'AboutUs' ? '#about-us' : sectionId === 'Contact' ? '#footer' : ''}`;
                }
            }
        };
    };

    const handleShopClick = () => {
        return function (event) {
            event.preventDefault();
            setActiveButton('Shop');
            window.location.href = 'Shop.php';
        };
    };

    document.querySelector('.btn_text_Home')?.addEventListener('click', handleNavClick('Home', '.container'));
    document.querySelector('.btn_text_Home2')?.addEventListener('click', handleNavClick('Home', '.container'));
    document.querySelector('.btn_text_AboutUs')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    document.querySelector('.btn_text_AboutUs2')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    document.querySelector('.btn_text_Contact')?.addEventListener('click', handleNavClick('Contact', '.footer'));
    document.querySelector('.btn_text_Contact2')?.addEventListener('click', handleNavClick('Contact', '.footer'));
    document.querySelector('.btn_text_Shop')?.addEventListener('click', handleShopClick());
    document.querySelector('.btn_text_Shop2')?.addEventListener('click', handleShopClick());

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
        }
    }

    initializeSearch('main-search-input', 'main-search-form');
    initializeSearch('small-search-input', 'small-search-form');

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

    const container = document.querySelector('.container');

    // Показ модального вікна вибору (для .account_LoginRegister)
    document.querySelector('.account_LoginRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('profileModal');
        updateProfileContent();
    });

    // Показ модального вікна входу
    document.getElementById('loginButton')?.addEventListener('click', () => {
        showModal('loginModal', 'profileModal');
    });

    // Показ модального вікна реєстрації
    document.getElementById('registerButton')?.addEventListener('click', () => {
        showModal('registerModal', 'profileModal');
    });

    // Показ модального вікна профілю (для #openProfileModal)
    const profileButton = document.getElementById('openProfileModal');
    if (profileButton) {
        profileButton.addEventListener('click', (e) => {
            e.preventDefault();
            showModal('profileModal');
            updateProfileContent();
        });
    }

    // Додано для .account_MyAccount
    document.querySelector('.account_MyAccount')?.addEventListener('click', (e) => {
        e.preventDefault();
        showModal('profileModal');
        updateProfileContent();
    });

    // Закриття модальних вікон через хрестик
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-id');
            closeModal(modalId);
        });
    });

    // Закриття при кліку поза модальним вікном
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });

    // Універсальна функція для показу модального вікна
    function showModal(modalId, hideModalId = null) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            container.classList.add('blur');
            if (hideModalId) {
                const hideModal = document.getElementById(hideModalId);
                if (hideModal) hideModal.style.display = 'none';
            }
        }
    }

    // Універсальна функція для закриття модального вікна
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            const anyModalOpen = document.querySelector('.modal[style="display: flex;"]');
            if (!anyModalOpen) {
                container.classList.remove('blur');
            }
        }
    }

    // Функція для оновлення вмісту #profileContent
    function updateProfileContent() {
        const profileContent = document.getElementById('profileContent');
        if (profileContent) {
            if (window.loggedInUser) {
                profileContent.innerHTML = `
                    <h2>Welcome, ${window.loggedInUser.name || 'User'}!</h2>
                    <p>Email: ${window.loggedInUser.email}</p>
                `;
            } else {
                profileContent.innerHTML = `
                    <h2>Select an action</h2>
                    <button id="profileLoginButton">Sign in</button>
                    <button id="profileRegisterButton">Register</button>
                `;
                document.getElementById('profileLoginButton')?.addEventListener('click', () => {
                    showModal('loginModal', 'profileModal');
                });
                document.getElementById('profileRegisterButton')?.addEventListener('click', () => {
                    showModal('registerModal', 'profileModal');
                });
            }
        }
    }

    // Логіка кошика
    const cart = {
        items: JSON.parse(localStorage.getItem('cart')) || [],
        
        save() {
            try {
                localStorage.setItem('cart', JSON.stringify(this.items));
            } catch (e) {}
        },
        
        add(item) {
            if (!item?.name || isNaN(item?.price)) {
                return;
            }
            const existingItem = this.items.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                item.quantity = 1;
                this.items.push(item);
            }
            this.save();
            this.updateUI();
            const notification = document.createElement('div');
            notification.textContent = `${item.name} додано до кошика!`;
            notification.style.cssText = `
                position: fixed; top: 60px; right: 20px; background: #28a745;
                color: white; padding: 10px 20px; border-radius: 5px; z-index: 10002;
                font-size: 14px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        },
        
        remove(name) {
            const item = this.items.find(i => i.name === name);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    this.items = this.items.filter(i => i.name !== name);
                }
                this.save();
                this.updateUI();
            }
        },
        
        clear() {
            this.items = [];
            this.save();
            this.updateUI();
        },
        
        getTotal() {
            return this.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
        },
        
        getCount() {
            return this.items.reduce((count, item) => count + (item.quantity || 0), 0);
        },
        
        updateUI() {
            const cartItems = document.querySelector('.cart-items');
            const cartCount = document.querySelector('.cart-count');
            const cartTotal = document.querySelector('.cart-total');
            
            if (cartItems) {
                cartItems.innerHTML = this.items.length ? 
                    this.items.map(item => `
                        <div class="cart-item">
                            <span>${item.name} (${item.quantity} x ${item.price} грн)</span>
                            <button class="cart-remove" data-name="${item.name}">-</button>
                        </div>
                    `).join('') : 
                    '<p>Кошик порожній</p>';
            }
            
            if (cartCount) {
                cartCount.textContent = this.getCount();
            }
            
            if (cartTotal) {
                cartTotal.textContent = `Загалом: ${this.getTotal()} грн`;
            }
            
            document.querySelectorAll('.cart-remove').forEach(button => {
                button.removeEventListener('click', button._cartRemoveHandler);
                button._cartRemoveHandler = () => {
                    const name = button.dataset.name;
                    this.remove(name);
                };
                button.addEventListener('click', button._cartRemoveHandler);
            });
        }
    };

    // Обробка додавання до кошика
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add_to_cart')) {
            const tea = e.target.dataset.tea;
            const price = parseFloat(e.target.dataset.price);
            if (tea && !isNaN(price)) {
                cart.add({ name: tea, price });
            }
        }
    });

    // Обробка показу/приховування кошика
    const cartButton = document.querySelector('.btn_cart');
    const cartModal = document.querySelector('.cart-modal');
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartClose = document.querySelector('.cart-close');
    const cartClear = document.querySelector('.cart-clear');

    if (cartButton && cartModal && cartDropdown) {
        cartButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            cartModal.classList.toggle('open');
        });
    }

    if (cartClose && cartModal) {
        cartClose.addEventListener('click', (e) => {
            e.stopPropagation();
            cartModal.classList.remove('open');
        });
    }

    if (cartClear && cartModal) {
        cartClear.addEventListener('click', (e) => {
            e.stopPropagation();
            cart.clear();
            cartModal.classList.remove('open');
        });
    }

    // Закриття кошика при кліку поза ним
    document.addEventListener('click', (e) => {
        if (!cartModal || !cartButton) return;
        if (!cartModal.contains(e.target) && !cartButton.contains(e.target)) {
            cartModal.classList.remove('open');
            cartModal.style.display = 'none';
        }
    });

    // Ініціалізація UI кошика
    cart.updateUI();

    
});