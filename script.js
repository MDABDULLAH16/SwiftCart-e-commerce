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
});
