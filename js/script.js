// Bloqueio de scroll reutilizável (html + body + iOS)
let scrollLockCount = 0;
let savedScrollY = 0;

function lockScroll() {
    if (scrollLockCount === 0) {
        savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        document.documentElement.style.overflow = 'hidden';
        document.documentElement.style.overscrollBehavior = 'none';
        document.body.style.overflow = 'hidden';
        document.body.style.overscrollBehavior = 'none';
        document.body.style.position = 'fixed';
        document.body.style.top = '-' + savedScrollY + 'px';
        document.body.style.width = '100%';
    }
    scrollLockCount++;
}

function unlockScroll() {
    scrollLockCount = Math.max(0, scrollLockCount - 1);
    if (scrollLockCount !== 0) return;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overscrollBehavior = '';
    document.body.style.overflow = '';
    document.body.style.overscrollBehavior = '';
    window.scrollTo(0, savedScrollY);
}

// EFEITO DE TYPING (DIGITAÇÃO) NO HERO
const typingElement = document.getElementById('typing-text');
const texts = ['Product Owner', 'QA Engineer', 'Low-Code Expert', 'Tech Analyst'];
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
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

function openLocationModal() {
    const modal = document.getElementById('location-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
    lockScroll();
}

function closeLocationModal() {
    const modal = document.getElementById('location-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    modal.setAttribute('aria-hidden', 'true');
    unlockScroll();
}

document.addEventListener('DOMContentLoaded', () => {
    if (typingElement) type();

    const reveals = document.querySelectorAll('.reveal, .reveal-left');
    reveals.forEach(el => revealObserver.observe(el));

    const nav = document.querySelector('nav');
    const progressBar = document.getElementById('progress-bar');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        if (progressBar) progressBar.style.width = scrolled + '%';

        if (window.scrollY > 20) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    });

    const mobileBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const mobileMenuLuxury = document.getElementById('mobile-menu-luxury');
    const mobileLinksV7 = document.querySelectorAll('.mobile-link');
    const NAV_OFFSET = 96;

    const closeLuxuryMenu = () => {
        if (mobileMenuLuxury) {
            mobileMenuLuxury.classList.remove('active');
            mobileMenuLuxury.setAttribute('aria-hidden', 'true');
            unlockScroll();
        }
    };

    if (mobileBtn && mobileMenuLuxury) {
        mobileBtn.addEventListener('click', () => {
            mobileMenuLuxury.classList.add('active');
            mobileMenuLuxury.setAttribute('aria-hidden', 'false');
            lockScroll();
        });
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLuxuryMenu);

    mobileLinksV7.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            closeLuxuryMenu();

            requestAnimationFrame(() => {
                const y = window.scrollY + target.getBoundingClientRect().top - NAV_OFFSET;
                window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                history.replaceState(null, '', href);
            });
        });
    });

    document.querySelectorAll('.mobile-social-link').forEach(link => {
        link.addEventListener('click', closeLuxuryMenu);
    });

    if (mobileMenuLuxury) {
        mobileMenuLuxury.addEventListener('click', (e) => {
            if (e.target === mobileMenuLuxury) closeLuxuryMenu();
        });
    }

    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
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

    const locationModal = document.getElementById('location-modal');
    const locationModalBackdrop = document.getElementById('location-modal-backdrop');
    const locationModalClose = document.getElementById('location-modal-close');
    const locationTrigger = document.getElementById('location-trigger-btn');
    const locationLabel = document.getElementById('location-selected-label');
    const locationOptions = document.querySelectorAll('[data-location-option]');

    if (locationTrigger) {
        locationTrigger.addEventListener('click', () => openLocationModal());
    }

    if (locationModalClose) {
        locationModalClose.addEventListener('click', () => closeLocationModal());
    }

    if (locationModal) {
        locationModal.addEventListener('click', (e) => {
            if (e.target === locationModal || e.target === locationModalBackdrop) {
                closeLocationModal();
            }
        });
    }

    locationOptions.forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.getAttribute('data-location-label');
            if (label && locationLabel) locationLabel.textContent = label;
            closeLocationModal();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'Escape') return;
        if (locationModal && !locationModal.classList.contains('hidden')) {
            closeLocationModal();
            return;
        }
        if (mobileMenuLuxury && mobileMenuLuxury.classList.contains('active')) {
            closeLuxuryMenu();
        }
    });
});
