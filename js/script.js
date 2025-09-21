document.addEventListener('DOMContentLoaded', function() {
    
    // --- VERIFICAÇÃO DE CONEXÃO LENTA / PREFERÊNCIA DE MOVIMENTO REDUZIDO ---
    try {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches || (navigator.connection && (navigator.connection.saveData || (navigator.connection.effectiveType && navigator.connection.effectiveType.includes('2g'))))) {
            document.documentElement.classList.add('reduced-motion');
        }
    } catch (e) {
        console.error("Could not check connection status:", e);
    }

    // Inicializa AOS (Animate on Scroll)
    AOS.init({
        duration: 800,
        once: false, 
        offset: 50,
    });

    // --- INICIALIZAÇÃO DO SWIPER (APENAS NA PÁGINA INICIAL) ---
    const testimonialSwiper = document.querySelector('.testimonial-swiper');
    if (testimonialSwiper) {
        new Swiper(testimonialSwiper, {
            loop: true,
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: { 
                delay: 5000, 
                disableOnInteraction: false 
            },
            navigation: { 
                nextEl: '.swiper-button-next', 
                prevEl: '.swiper-button-prev' 
            },
            pagination: { 
                el: '.swiper-pagination', 
                clickable: true 
            },
        });
    }

    // --- LÓGICA DE NAVEGAÇÃO ATIVA ---
    const navLinks = document.querySelectorAll('.nav-menu a.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- LÓGICA DO TEXTO ROTATIVO ---
    const rotatingTextContainer = document.getElementById('rotating-text-container');
    if (rotatingTextContainer) {
        const rotatingItems = [...rotatingTextContainer.querySelectorAll('.rotating-text-item')];
        if (rotatingItems.length > 1) { // Só executa se houver mais de um item
            let rotIdx = 0;
            let rotTimer;

            function nextRot() {
                rotatingItems.forEach(item => item.classList.remove('active'));
                rotatingItems[rotIdx].classList.add('active');
                rotIdx = (rotIdx + 1) % rotatingItems.length;
                rotTimer = setTimeout(nextRot, 4000);
            }
            
            if (!document.documentElement.classList.contains('reduced-motion')) {
                nextRot(); // Inicia o loop
            } else {
                rotatingItems[0].classList.add('active'); // Mostra apenas o primeiro
            }
        }
    }

    // --- MENU MOBILE ---
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const body = document.body;

    function closeMobileMenu() {
        navMenu.classList.remove('mobile-active');
        navToggle.classList.remove('active');
        body.classList.remove('mobile-menu-open');
    }

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            navToggle.classList.toggle('active');
            body.classList.toggle('mobile-menu-open');
        });
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // --- BOTÃO VOLTAR AO TOPO ---
    const backToTopButton = document.getElementById('back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) backToTopButton.classList.add('visible');
            else backToTopButton.classList.remove('visible');
        });
    }
    
     // --- DARK MODE ---
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    function setDarkMode(isDark) {
        if (isDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }

    darkModeToggle.addEventListener('click', () => {
        setDarkMode(!body.classList.contains('dark-mode'));
    });

    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        setDarkMode(currentTheme === 'dark');
    } else {
        setDarkMode(prefersDarkScheme.matches);
    }

    // --- LAZY LOADING DO MAPA (APENAS NA PÁGINA DE CONTATO) ---
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            if (this.dataset.src) {
                const iframe = document.createElement('iframe');
                iframe.src = this.dataset.src;
                iframe.width = "100%";
                iframe.height = "450";
                iframe.style.border = 0;
                iframe.loading = "lazy";
                iframe.referrerPolicy = "no-referrer-when-downgrade";
                iframe.title = "Localização da Beatriz Facas no Google Maps";
                this.replaceWith(iframe);
            }
        }, { once: true });
    }

    // --- LÓGICA DO BANNER DE COOKIES ---
    const cookieBanner = document.getElementById('cookie-banner');
    const cookieAcceptBtn = document.getElementById('cookie-accept-btn');

    if (cookieBanner && cookieAcceptBtn) {
        if (!localStorage.getItem('cookie_consent')) {
            setTimeout(() => {
                cookieBanner.classList.add('visible');
            }, 1000); 
        }

        cookieAcceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookie_consent', 'true');
            cookieBanner.classList.remove('visible');
        });
    }
});