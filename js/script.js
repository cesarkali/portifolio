// Gallery logic (pure, no DOM)
// Inline gallery state to prevent ES module resolution issues on GitHub Pages
const kaliGallery = {
    images: [
      { src: 'assets/1web.png', label: 'Web — Dashboard', type: 'web' },
      { src: 'assets/2web.png', label: 'Web — Transações', type: 'web' },
      { src: 'assets/3web.png', label: 'Web — Relatórios', type: 'web' },
      { src: 'assets/1app.jpg', label: 'Android — Home', type: 'app' },
      { src: 'assets/2app.jpg', label: 'Android — Finn IA', type: 'app' },
      { src: 'assets/3app.jpg', label: 'Android — Contas', type: 'app' },
    ],
    currentIndex: 0,
};

function createGallery(startIdx = 0) {
    const images = kaliGallery.images;
    let currentIndex = startIdx;

    return {
      get images() { return images; },
      get currentIndex() { return currentIndex; },
      next() {
        currentIndex = (currentIndex + 1) % images.length;
        return currentIndex;
      },
      prev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        return currentIndex;
      },
      openLightbox(idx) {
        return images[idx].src;
      },
    };
}

// Bloqueio de scroll reutilizável (html + body + iOS) - Compatível com Lenis
let scrollLockCount = 0;
let savedScrollY = 0;

function lockScroll() {
    if (scrollLockCount === 0) {
        savedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
        
        // Stop Lenis if available
        if (window.lenis) {
            window.lenis.stop();
        }
        
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
    const scrollY = savedScrollY;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overscrollBehavior = '';
    document.body.style.overflow = '';
    document.body.style.overscrollBehavior = '';
    
    // Restart Lenis if available
    if (window.lenis) {
        window.lenis.start();
    }
    
    // Use requestAnimationFrame to avoid visual jump
    requestAnimationFrame(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
    });
}

// EFEITO DE TYPING (DIGITAÇÃO) NO HERO
const typingElement = document.getElementById('typing-text');
const texts = ['Product Manager', 'Product Owner', 'Estrategista de Produtos', 'Tech & IA'];
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
        } else {
            // Remove active class when element leaves viewport (infinite scroll effect)
            entry.target.classList.remove('active');
        }
    });
}, {
    threshold: 0.05,
    rootMargin: '0px 0px -10% 0px'
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

    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-fade');
    reveals.forEach(el => revealObserver.observe(el));

    // Parallax effect for sections (eatz.digital style)
    const parallaxSections = document.querySelectorAll('section');
    
    const handleParallax = () => {
        const scrolled = window.scrollY;
        
        parallaxSections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrolled;
            const sectionHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Only apply parallax when section is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                const progress = (scrolled - sectionTop + windowHeight) / (sectionHeight + windowHeight);
                const translateY = (progress - 0.5) * 30; // Subtle parallax
                
                // Apply subtle transform
                if (index % 2 === 0) {
                    section.style.transform = `translateY(${translateY}px)`;
                } else {
                    section.style.transform = `translateY(${-translateY}px)`;
                }
            }
        });
    };

    // Use Lenis scroll event for parallax
    if (window.lenis) {
        window.lenis.on('scroll', handleParallax);
    } else {
        window.addEventListener('scroll', handleParallax);
    }

    const nav = document.querySelector('nav');
    const progressBar = document.getElementById('progress-bar');

    // Use Lenis scroll event if available, otherwise fallback to window scroll
    const updateScrollEffects = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        if (progressBar) progressBar.style.width = scrolled + '%';

        if (window.scrollY > 20) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    };

    // Listen to Lenis scroll if available
    if (window.lenis) {
        window.lenis.on('scroll', updateScrollEffects);
    } else {
        window.addEventListener('scroll', updateScrollEffects);
    }

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
                const y = target.offsetTop - NAV_OFFSET;
                
                // Use Lenis scrollTo if available
                if (window.lenis) {
                    window.lenis.scrollTo(y, { duration: 1.5 });
                } else {
                    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
                }
                
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

    const updateActiveNav = () => {
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
    };

    // Listen to Lenis scroll if available
    if (window.lenis) {
        window.lenis.on('scroll', updateActiveNav);
    } else {
        window.addEventListener('scroll', updateActiveNav);
    }

    // Add smooth scroll to desktop nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const y = target.offsetTop - NAV_OFFSET;
            
            // Use Lenis scrollTo if available
            if (window.lenis) {
                window.lenis.scrollTo(y, { duration: 1.5 });
            } else {
                window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
            }
            
            history.replaceState(null, '', href);
        });
    });

    // Add smooth scroll to logo link (Júlio César)
    const logoLink = document.querySelector('nav a[href="#inicio"]');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#inicio');
            if (!target) return;

            // Scroll to top (hero section)
            if (window.lenis) {
                window.lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            history.replaceState(null, '', '#inicio');
        });
    }

    // Add smooth scroll to Hero CTA buttons
    const heroCtaButtons = document.querySelectorAll('.hero-cta-btn');
    heroCtaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (!target) return;

            const y = target.offsetTop - NAV_OFFSET;
            
            // Use Lenis scrollTo if available
            if (window.lenis) {
                window.lenis.scrollTo(y, { duration: 1.5, easing: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t });
            } else {
                window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
            }
            
            history.replaceState(null, '', href);
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
        const lightbox = document.getElementById('kali-lightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
            closeKaliLightbox();
            return;
        }
        if (locationModal && !locationModal.classList.contains('hidden')) {
            closeLocationModal();
            return;
        }
        if (mobileMenuLuxury && mobileMenuLuxury.classList.contains('active')) {
            closeLuxuryMenu();
        }
    });

    // ── Financial Kali Gallery ──────────────────────────────────────────────
    if (document.getElementById('kali-main-img')) {
        updateKaliGallery(0);

        // Auto-play: advance every 4s, pause on hover/touch
        _startKaliAutoPlay();

        const kaliCard = document.querySelector('.financial-kali-card');
        if (kaliCard) {
            kaliCard.addEventListener('mouseenter', _stopKaliAutoPlay);
            kaliCard.addEventListener('mouseleave', _startKaliAutoPlay);
            kaliCard.addEventListener('touchstart', _stopKaliAutoPlay, { passive: true });
        }
    }
});

// ── Financial Kali Gallery — global state & functions ──────────────────────
const _kaliGallery = createGallery(0);

// Auto-play state (hoisted so lightbox functions can access it)
let _kaliAutoPlayTimer = null;

function _startKaliAutoPlay() {
    _stopKaliAutoPlay();
    _kaliAutoPlayTimer = setInterval(() => {
        const lightbox = document.getElementById('kali-lightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) return;
        updateKaliGallery(_kaliGallery.next());
    }, 4000);
}

function _stopKaliAutoPlay() {
    if (_kaliAutoPlayTimer) { clearInterval(_kaliAutoPlayTimer); _kaliAutoPlayTimer = null; }
}

function updateKaliGallery(idx) {
    const mainImg = document.getElementById('kali-main-img');
    if (mainImg) {
        mainImg.src = _kaliGallery.images[idx].src;
        mainImg.alt = _kaliGallery.images[idx].label;
    }
    document.querySelectorAll('.kali-thumb').forEach((thumb, i) => {
        if (i === idx) {
            thumb.classList.add('active');
            thumb.style.opacity = '1';
            thumb.style.borderColor = 'rgba(255,255,255,0.5)';
        } else {
            thumb.classList.remove('active');
            thumb.style.opacity = '0.35';
            thumb.style.borderColor = 'transparent';
        }
    });
}

function kaliGalleryNav(dir) {
    const idx = dir === 'next' ? _kaliGallery.next() : _kaliGallery.prev();
    updateKaliGallery(idx);
}

function kaliGallerySet(idx) {
    // Sync internal index
    while (_kaliGallery.currentIndex !== idx) {
        if (idx > _kaliGallery.currentIndex) _kaliGallery.next();
        else _kaliGallery.prev();
    }
    updateKaliGallery(idx);
}

// ── Financial Kali Lightbox ─────────────────────────────────────────────────
function _updateLightboxCounter(idx) {
    const counter = document.getElementById('lightbox-counter');
    if (counter) counter.textContent = (idx + 1) + ' / ' + _kaliGallery.images.length;
}

function openKaliLightbox(event, idx) {
    if (event) event.stopPropagation();
    const lightbox = document.getElementById('kali-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (!lightbox || !lightboxImg) return;
    const i = (idx !== undefined) ? idx : _kaliGallery.currentIndex;
    lightboxImg.src = _kaliGallery.images[i].src;
    lightboxImg.alt = _kaliGallery.images[i].label;
    _updateLightboxCounter(i);
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    lightbox.setAttribute('aria-hidden', 'false');
    lockScroll();
    // Stop auto-play while lightbox is open
    if (typeof _stopKaliAutoPlay === 'function') _stopKaliAutoPlay();
}

function closeKaliLightbox() {
    const lightbox = document.getElementById('kali-lightbox');
    if (!lightbox) return;
    lightbox.classList.add('hidden');
    lightbox.classList.remove('flex');
    lightbox.setAttribute('aria-hidden', 'true');
    unlockScroll();
    // Restart auto-play after closing lightbox
    if (typeof _startKaliAutoPlay === 'function') _startKaliAutoPlay();
}

function kaliLightboxNav(dir) {
    const idx = dir === 'next' ? _kaliGallery.next() : _kaliGallery.prev();
    updateKaliGallery(idx);
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
        lightboxImg.src = _kaliGallery.images[idx].src;
        lightboxImg.alt = _kaliGallery.images[idx].label;
    }
    _updateLightboxCounter(idx);
}

// Touch/swipe support for lightbox
(function() {
    let touchStartX = 0;
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    document.addEventListener('touchend', (e) => {
        const lightbox = document.getElementById('kali-lightbox');
        if (!lightbox || lightbox.classList.contains('hidden')) return;
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            kaliLightboxNav(diff > 0 ? 'next' : 'prev');
        }
    }, { passive: true });
})();

// Expose to window for inline onclick handlers
window.kaliGalleryNav = kaliGalleryNav;
window.kaliGallerySet = kaliGallerySet;
window.openKaliLightbox = openKaliLightbox;
window.closeKaliLightbox = closeKaliLightbox;
window.kaliLightboxNav = kaliLightboxNav;
