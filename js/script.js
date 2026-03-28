// EFEITO DE TYPING (DIGITAÇÃO) NO HERO
const typingElement = document.getElementById('typing-text');
const texts = ["Product Owner", "QA Engineer", "Low-Code Expert", "Tech Analyst"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const current = texts[textIndex];
    
    if (isDeleting) {
        typingElement.textContent = current.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingElement.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pausa no final do texto
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// INTERSECTION OBSERVER PARA ANIMAÇÕES DE REVEAL
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            // Opcional: parar de observar após animar
            // revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.addEventListener('DOMContentLoaded', () => {
    // Iniciar efeito de digitação
    if (typingElement) type();

    // Observar elementos de reveal
    const reveals = document.querySelectorAll('.reveal, .reveal-left');
    reveals.forEach(el => revealObserver.observe(el));

    // Lógica da Navbar & Progress Bar no Scroll
    const nav = document.querySelector('nav');
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', () => {
        // Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Nav Glass State
        if (window.scrollY > 20) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    // Novo Menu Mobile Luxury
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenuLuxury = document.getElementById('mobile-menu-luxury');
    const mobileLinksV7 = document.querySelectorAll('.mobile-link');

    if (mobileBtn && mobileMenuLuxury) {
        mobileBtn.addEventListener('click', () => {
            mobileMenuLuxury.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeLuxuryMenu = () => {
        if (mobileMenuLuxury) {
            mobileMenuLuxury.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLuxuryMenu);
    mobileLinksV7.forEach(link => link.addEventListener('click', closeLuxuryMenu));

    // Destacar link ativo no scroll (ScrollSpy)
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-tech-cyan', 'font-bold');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('text-tech-cyan', 'font-bold');
            }
        });
    });
});

