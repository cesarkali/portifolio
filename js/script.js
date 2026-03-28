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

    // Lógica da Navbar no Scroll
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('nav-glass', 'py-4', 'shadow-2xl');
            nav.classList.remove('py-6');
        } else {
            nav.classList.remove('nav-glass', 'py-4', 'shadow-2xl');
            nav.classList.add('py-6');
        }
    });
});

