document.addEventListener('DOMContentLoaded', () => {
    // --- Global Elements ---
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');


    document.getElementById('logo').addEventListener('click', () => {
        window.location.href = 'index.html';
    })


    // --- State ---
    let cart = []; // array of {id,title,price,image,qty}
    let itemCount = 0;

    const CART_KEY = 'swiftcart_cart_v1';

    // --- Cart Elements ---
    const cartModal = document.getElementById('cart-modal');
    const cartBackdrop = document.getElementById('cart-backdrop');
    const cartPanel = document.getElementById('cart-panel');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const clearCartBtn = document.getElementById('clear-cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    // --- Global: Mobile Menu Toggle ---
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.replace('ph-list', 'ph-x');
            } else {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.replace('ph-x', 'ph-list');
            }
        });
    }

    // --- Global: Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('shadow-md', 'bg-white/95');
                navbar.classList.remove('bg-white/80', 'shadow-sm');
            } else {
                navbar.classList.remove('shadow-md', 'bg-white/95');
                navbar.classList.add('bg-white/80', 'shadow-sm');
            }
        });
    }

    // --- Helper: Update Cart UI ---
    function updateCartUI() {
        // update count badge
        itemCount = cart.reduce((s, it) => s + it.qty, 0);
        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.classList.add('scale-125');
            setTimeout(() => cartCount.classList.remove('scale-125'), 200);
        }
        renderCartItems();
    }

    // --- Cart Persistence ---
    function loadCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            cart = raw ? JSON.parse(raw) : [];
        } catch (err) {
            cart = [];
        }
        updateCartUI();
    }

    function saveCart() {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch (err) {
            console.error('Failed to save cart', err);
        }
    }

    async function fetchProductById(id) {
        if (!id) return null;
        const cached = window.currentProducts ? window.currentProducts.find(p => p.id === id) : null;
        if (cached) return cached;
        try {
            const res = await fetch(`https://fakestoreapi.com/products/${id}`);
            return await res.json();
        } catch (err) {
            console.error('Failed to fetch product', err);
            return null;
        }
    }

    // --- Helper: Add to Cart (with productId) ---
    window.addToCart = async (e, productId) => {
        if (e && e.stopPropagation) e.stopPropagation();

        // simple animation if button element provided
        if (e && e.currentTarget) {
            const btn = e.currentTarget;
            btn.classList.add('scale-110');
            setTimeout(() => btn.classList.remove('scale-110'), 200);
        }

        if (!productId) {
            // fallback: just increment count
            cart.push({ id: `misc-${Date.now()}`, title: 'Item', price: 0, image: '', qty: 1 });
            saveCart();
            updateCartUI();
            return;
        }

        const product = await fetchProductById(productId);
        if (!product) return;

        const existing = cart.find(i => i.id === product.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ id: product.id, title: product.title, price: Number(product.price), image: product.image, qty: 1 });
        }
        saveCart();
        updateCartUI();
    };

    // --- Cart Rendering & Removal ---
    function renderCartItems() {
        if (!cartItemsContainer) return;
        if (!cart || cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center text-gray-500">Your cart is empty.</p>';
            if (cartTotalEl) cartTotalEl.textContent = '$0.00';
            return;
        }

        const itemsHtml = cart.map(item => `
            <div class="flex items-center gap-3">
                <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-contain rounded-md border">
                <div class="flex-1">
                    <div class="flex items-center justify-between">
                        <h4 class="text-sm font-semibold">${item.title}</h4>
                        <button onclick="window.removeFromCart(${item.id})" class="text-sm text-red-500">Remove</button>
                    </div>
                    <div class="flex items-center justify-between mt-1 text-sm text-gray-600">
                        <span>Qty: ${item.qty}</span>
                        <span>$${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        cartItemsContainer.innerHTML = itemsHtml;

        const total = cart.reduce((s, it) => s + it.price * it.qty, 0);
        if (cartTotalEl) cartTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    window.removeFromCart = (id) => {
        const idx = cart.findIndex(i => i.id === id);
        if (idx === -1) return;
        cart.splice(idx, 1);
        saveCart();
        updateCartUI();
    };

    // --- Global: Cart Button Click (open cart modal) ---
    function openCart() {
        if (!cartModal) return;
        cartModal.classList.remove('hidden');
        setTimeout(() => {
            if (cartBackdrop) cartBackdrop.classList.remove('opacity-0');
            if (cartPanel) cartPanel.classList.remove('translate-x-full');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        if (!cartModal) return;
        if (cartBackdrop) cartBackdrop.classList.add('opacity-0');
        if (cartPanel) cartPanel.classList.add('translate-x-full');
        setTimeout(() => {
            cartModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', () => openCart());
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);
    if (clearCartBtn) clearCartBtn.addEventListener('click', () => { cart = []; saveCart(); updateCartUI(); });
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => { alert('Checkout flow not implemented.'); });


    // --- Helper: Render Products Grid ---
    function renderProductCards(products, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = products
          .map(
            (product) => `
            <div class="bg-white rounded-2xl border border-gray-100 p-4 transition-all hover:shadow-lg flex flex-col h-full group relative">
                <div class="relative pt-[100%] overflow-hidden bg-white mb-4 cursor-pointer" onclick="window.openModal(${product.id})">
                    <img  src="${product.image}" alt="${product.title}" 
                        class="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105">
                </div>
                
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full uppercase tracking-wider line-clamp-1 max-w-[70%]">
                        ${product.category}
                    </span>
                    <div class="flex items-center gap-1">
                        <i class="ph-fill ph-star text-yellow-400 text-xs"></i>
                        <span class="text-xs font-bold text-gray-700">${product.rating.rate}</span>
                    </div>
                </div>

                <h3 class="font-bold text-gray-900 mb-1 leading-snug line-clamp-2 hover:text-brand-600 cursor-pointer transition-colors" onclick="window.location.href='product.html?id=${product.id}'" title="${product.title}">
                    ${product.title}
                </h3>
                
                <div class="mt-auto flex items-center justify-between pt-4">
                    <span class="text-xl font-bold text-gray-900">$${product.price}</span>
                    <div class="flex gap-2">
                         <button onclick="window.openModal(${product.id})" class="p-2 text-gray-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors" title="Quick View">
                            <i class="ph-bold ph-eye text-lg"></i>
                        </button>
                        <button onclick="addToCart(event, ${product.id})" class="p-2 bg-gray-900 text-white rounded-lg hover:bg-brand-600 transition-colors shadow-md">
                            <i class="ph-bold ph-plus text-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        `,
          )
          .join("");
    }

    // --- PAGE: HOME (No Filters - Show 8 Products) ---
    const productsGrid = document.getElementById('products-grid');
    const categoryFilters = document.getElementById('category-filters');

    // If on home page (no category filters)
    if (productsGrid && !categoryFilters) {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                const first8 = data.slice(0, 8);
                renderProductCards(first8, 'products-grid');
                window.currentProducts = data; // Store all for modal lookup
            })
            .catch(err => {
                console.error(err);
                productsGrid.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load products.</p>';
            });
    }

    // --- PAGE: PRODUCTS (With Filters - Show All) ---
    if (categoryFilters && productsGrid) {
        let activeCategory = 'all';

        // Fetch Categories
        fetch('https://fakestoreapi.com/products/categories')
            .then(res => res.json())
            .then(categories => {
                const allCats = ['all', ...categories];
                categoryFilters.innerHTML = allCats.map(cat => `
                    <button class="category-btn px-6 py-2 rounded-full font-medium transition-all capitalize ${cat === activeCategory ? 'bg-brand-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}"
                    data-category="${cat}">
                        ${cat}
                    </button>
                `).join('');

                // Add Listeners
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        activeCategory = btn.dataset.category;
                        // Update UI
                        document.querySelectorAll('.category-btn').forEach(b => {
                            b.className = b.dataset.category === activeCategory
                                ? 'category-btn px-6 py-2 rounded-full font-medium transition-all capitalize bg-brand-600 text-white shadow-md'
                                : 'category-btn px-6 py-2 rounded-full font-medium transition-all capitalize bg-white text-gray-600 border border-gray-200 hover:bg-gray-50';
                        });
                        fetchProducts(activeCategory);
                    });
                });
            });

        // Fetch Products
        function fetchProducts(category) {
            productsGrid.innerHTML = '<div class="col-span-full py-20 flex justify-center"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div></div>';

            const url = category === 'all'
                ? 'https://fakestoreapi.com/products'
                : `https://fakestoreapi.com/products/category/${category}`;

            fetch(url)
                .then(res => res.json())
                .then(data => {
                    renderProductCards(data, 'products-grid');
                    window.currentProducts = data; // Store all for modal lookup
                })
                .catch(err => {
                    console.error(err);
                    productsGrid.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load products.</p>';
                });
        }

        // Init
        fetchProducts('all');
    }

    // --- PAGE: HOME ONLY (Trending) ---
    const trendingGrid = document.getElementById('trending-products-grid');
    if (trendingGrid) {
        fetch('https://fakestoreapi.com/products')
            .then(res => res.json())
            .then(data => {
                // Sort by rating rate (stars) in descending order and take top 3
                const top3 = data.sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 3);
                trendingGrid.innerHTML = top3
                  .map(
                    (product) => `
                     <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer" onclick="window.openModal(${product.id})">
                        <div class="relative pt-[100%] overflow-hidden bg-white p-8">
                            <img src="${product.image}" class="absolute top-0 left-0 w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110">
                             <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-brand-600 hover:text-white transition-colors">
                                    <i class="ph ph-heart text-xl"></i>
                                </button>
                            </div>
                        </div>
                        <div class="p-6 flex flex-col flex-grow">
                            <div class="flex items-center gap-1 mb-2">
                                <i class="ph-fill ph-star text-yellow-400 text-sm"></i>
                                <span class="text-sm font-semibold text-gray-700">${product.rating.rate}</span>
                                <span class="text-xs text-gray-400">(${product.rating.count})</span>
                            </div>
                            <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2">${product.title}</h3>
                             <div class="mt-auto flex items-center justify-between pt-4">
                                <span class="text-2xl font-bold text-brand-600">$${product.price}</span>
                                <button onclick="addToCart(event, ${product.id})" class="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-900 border border-gray-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm">
                                    <i class="ph-bold ph-shopping-cart-simple text-lg"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `,
                  )
                  .join("");
            });
    }

    // --- PAGE: PRODUCT DETAILS ---
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (productId) {
            fetch(`https://fakestoreapi.com/products/${productId}`)
                .then(res => res.json())
                .then(product => {
                    document.getElementById('loading-spinner').classList.add('hidden');

                    document.getElementById('p-image').src = product.image;
                    document.getElementById('p-category').textContent = product.category;
                    document.getElementById('p-title').textContent = product.title;
                    document.getElementById('p-rating').textContent = product.rating.rate;
                    document.getElementById('p-reviews').textContent = `${product.rating.count} reviews`;
                    document.getElementById('p-description').textContent = product.description;
                    document.getElementById('p-price').textContent = `$${product.price}`;

                    document.getElementById('add-to-cart-btn').onclick = (e) => addToCart(e, product.id);
                })
                .catch(err => {
                    console.error(err);
                    document.getElementById('loading-spinner').classList.add('hidden');
                    document.getElementById('error-message').classList.remove('hidden');
                });
        } else {
            document.getElementById('loading-spinner').classList.add('hidden');
            document.getElementById('error-message').classList.remove('hidden');
        }
    }

    // --- Shared: Modal Logic (Quick View) ---
    // Only init if modal elements exist in current page
    const modal = document.getElementById('product-modal');
    if (modal) {
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalPanel = document.getElementById('modal-panel');
        const closeModalBtn = document.getElementById('close-modal');

        window.openModal = (id) => {
            // Use cached data on home/products page if available, else fetch logic could be added
            // For now, relies on 'window.currentProducts' from the grid fetch
            const product = window.currentProducts ? window.currentProducts.find(p => p.id === id) : null;
            if (!product) return;

            document.getElementById('modal-image').src = product.image;
            document.getElementById('modal-category').textContent = product.category;
            document.getElementById('modal-title').textContent = product.title;
            document.getElementById('modal-rating').textContent = product.rating.rate;
            document.getElementById('modal-reviews').textContent = `(${product.rating.count} reviews)`;
            document.getElementById('modal-description').textContent = product.description;
            document.getElementById('modal-price').textContent = `$${product.price}`;

            document.getElementById('modal-add-to-cart').onclick = () => {
                addToCart(null, product.id);
                closeModal();
            };

            modal.classList.remove('hidden');
            setTimeout(() => {
                modalBackdrop.classList.remove('opacity-0');
                modalPanel.classList.remove('opacity-0', 'scale-95');
            }, 10);
            document.body.style.overflow = 'hidden';
        };

        function closeModal() {
            modalBackdrop.classList.add('opacity-0');
            modalPanel.classList.add('opacity-0', 'scale-95');
            setTimeout(() => {
                modal.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        }

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    }

    // --- Newsletter Form ---
    // --- Init: load persisted cart ---
    loadCart();

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            alert(`Thanks for subscribing with ${input.value}!`);
            newsletterForm.reset();
        });
    }
});
