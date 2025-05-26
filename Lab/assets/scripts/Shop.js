document.addEventListener('DOMContentLoaded', () => {

    // Підсвічування кнопок
    const navButtons = document.querySelectorAll('.pages a, .menu_content a:not(.account_LoginRegister)');

    function removeActiveClass() {
        navButtons.forEach(button => button.classList.remove('active'));
    }

    function setActiveButton(sectionId) {
        removeActiveClass();
        const buttons = document.querySelectorAll(`.btn_text_${sectionId}, .btn_text_${sectionId}2`);
        buttons.forEach(button => button.classList.add('active'));
    }

    setActiveButton('Shop');

    const handleNavClick = (sectionId, url, selector) => {
        return function (event) {
            event.preventDefault();
            setActiveButton(sectionId);
            if (sectionId === 'Contact') {
                const footer = document.querySelector(selector);
                if (footer) {
                    footer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.location.href = url;
                }
            } else {
                window.location.href = url;
            }
        };
    };

    document.querySelector('.btn_text_Home')?.addEventListener('click', handleNavClick('Home', 'index.php', '.container'));
    document.querySelector('.btn_text_Home2')?.addEventListener('click', handleNavClick('Home', 'index.php', '.container'));
    document.querySelector('.btn_text_AboutUs')?.addEventListener('click', handleNavClick('AboutUs', 'index.php#about-us', '#about-us'));
    document.querySelector('.btn_text_AboutUs2')?.addEventListener('click', handleNavClick('AboutUs', 'index.php#about-us', '#about-us'));
    document.querySelector('.btn_text_Contact')?.addEventListener('click', handleNavClick('Contact', 'index.php#footer', '#footer'));
    document.querySelector('.btn_text_Contact2')?.addEventListener('click', handleNavClick('Contact', 'index.php#footer', '#footer'));
    document.querySelector('.btn_text_Shop')?.addEventListener('click', handleNavClick('Shop', 'Shop.php', null));
    document.querySelector('.btn_text_Shop2')?.addEventListener('click', handleNavClick('Shop', 'Shop.php', null));

    document.querySelector('.account_LoginRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = 'index.php';
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

    // Ініціалізація обробників .add_to_cart
    function initCartHandlers() {
        const addToCartButtons = document.querySelectorAll('.add_to_cart');
    }

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
    initCartHandlers();

    // Повторна перевірка через 1с для динамічних елементів
    setTimeout(() => {
        initCartHandlers();
    }, 1000);
});