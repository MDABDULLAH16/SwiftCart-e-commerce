document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar');
    const cartBtn = document.getElementById('cart-btn');
    const cartCount = document.getElementById('cart-count');

    // --- State ---
    let isMenuOpen = false;
    let itemCount = 0;

    // --- Mobile Menu Toggle ---
    mobileMenuBtn.addEventListener('click', () => {
        isMenuOpen = !isMenuOpen;

        if (isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            menuIcon.classList.remove('ph-list');
            menuIcon.classList.add('ph-x');
        } else {
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        }
    });

    // --- Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('shadow-md', 'bg-white/95');
            navbar.classList.remove('bg-white/80', 'shadow-sm');
        } else {
            navbar.classList.remove('shadow-md', 'bg-white/95');
            navbar.classList.add('bg-white/80', 'shadow-sm');
        }
    });

    // --- Cart Interaction (Demo) ---
    cartBtn.addEventListener('click', () => {
        itemCount++;
        cartCount.textContent = itemCount;

        // Simple animation trigger
        cartCount.classList.add('scale-125');
        setTimeout(() => {
            cartCount.classList.remove('scale-125');
        }, 200);

        // Optional: Alert for demo
        // alert(`Added item! Cart count: ${itemCount}`);
    });

    // --- Close Mobile Menu on Resize ---
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768 && isMenuOpen) {
            isMenuOpen = false;
            mobileMenu.classList.add('hidden');
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        }
    });

    // --- Fetch Trending Products ---
    async function fetchTrendingProducts() {
        const grid = document.getElementById('trending-products-grid');

        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();

            // Sort by rating count (popularity) and take top 3
            // Note: API rating structure is { rate: number, count: number }
            const topProducts = data
                .sort((a, b) => b.rating.count - a.rating.count) // Sort by popularity (count)
                .slice(0, 3);

            grid.innerHTML = topProducts.map(product => `
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                    <!-- Image -->
                    <div class="relative pt-[100%] overflow-hidden bg-white p-8">
                        <img src="${product.image}" alt="${product.title}" 
                            class="absolute top-0 left-0 w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110">
                        
                        <!-- Badges/Actions -->
                        <div class="absolute top-4 right-4 flex flex-col gap-2 opacity-0 transform translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                            <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-brand-600 hover:text-white transition-colors">
                                <i class="ph ph-heart text-xl"></i>
                            </button>
                            <button class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-700 shadow-md hover:bg-brand-600 hover:text-white transition-colors">
                                <i class="ph ph-eye text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6 flex flex-col flex-grow">
                        <div class="flex items-center gap-1 mb-2">
                            <i class="ph-fill ph-star text-yellow-400 text-sm"></i>
                            <span class="text-sm font-semibold text-gray-700">${product.rating.rate}</span>
                            <span class="text-xs text-gray-400">(${product.rating.count} reviews)</span>
                        </div>
                        
                        <h3 class="text-lg font-bold text-gray-900 mb-2 line-clamp-2" title="${product.title}">
                            ${product.title}
                        </h3>
                        
                        <div class="mt-auto flex items-center justify-between pt-4">
                            <span class="text-2xl font-bold text-brand-600">$${product.price}</span>
                            <button class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-900 border border-gray-200 hover:bg-brand-600 hover:text-white hover:border-brand-600 transition-all shadow-sm">
                                <i class="ph-bold ph-shopping-cart-simple text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

        } catch (error) {
            console.error('Error fetching products:', error);
            grid.innerHTML = `
                <div class="col-span-full text-center text-red-500 py-10">
                    <p>Failed to load trending products. Please try again later.</p>
                </div>
            `;
        }
    }

    // Initial Load
    fetchTrendingProducts();
});
