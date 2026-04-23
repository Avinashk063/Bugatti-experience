// ──────────────────────────────────────────────
// Bugatti Divo — Scroll Animation Engine
// ──────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger);

const frameCount = 79;
let imagesLoaded = 0;

const currentFrame = index =>
    `/frames/Bugatti_Divo_performance_202604222325_${(index + 1).toString().padStart(3, '0')}.jpg`;

const images = [];
const canvas = document.getElementById('frameCanvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// ── MUST be declared before resizeCanvas is called ──
const bugatti = { frame: 0 };

// CSS pixel dimensions (separate from DPR-scaled canvas buffer)
let cssW = window.innerWidth;
let cssH = window.innerHeight;

// ── Canvas resize ────────────────────────────
function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    cssW = window.innerWidth;
    cssH = window.innerHeight;

    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render(); // safe — render() guards against missing image
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── Frame render ─────────────────────────────
function render() {
    const img = images[Math.round(bugatti.frame)];
    if (!img || !img.complete || !img.naturalWidth) return;

    ctx.clearRect(0, 0, cssW, cssH);

    // Cover-fit: fill viewport, centred
    const scale = Math.max(cssW / img.naturalWidth, cssH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const ox = (cssW - drawW) / 2;
    const oy = (cssH - drawH) / 2;

    ctx.drawImage(img, ox, oy, drawW, drawH);
}

// ── Loading screen elements ───────────────────
const loaderBar = document.getElementById('loaderBar');
const loaderPercent = document.getElementById('loaderPercent');
const loadingScreen = document.getElementById('loadingScreen');

// ── Image preload with progress ───────────────
function onImageLoad() {
    imagesLoaded++;
    const pct = Math.round((imagesLoaded / frameCount) * 100);
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPercent) loaderPercent.textContent = pct + '%';

    if (imagesLoaded === frameCount) {
        render(); // draw first frame
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.inOut',
            onComplete: () => {
                loadingScreen.style.display = 'none';
                initScrollAnimation();
            }
        });
    }
}

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = onImageLoad;
    img.onerror = onImageLoad; // don't stall loader on missing frames
    images.push(img);
}

// ── GSAP scroll animation ─────────────────────
function initScrollAnimation() {

    // Frame scrub over whole page
    gsap.to(bugatti, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5
        },
        onUpdate: render
    });

    // Hero overlay — fade in, then fade out on scroll
    gsap.fromTo('.hero-overlay',
        { opacity: 0, y: 40 },
        {
            opacity: 1, y: 0,
            duration: 1,
            ease: 'power2.out'
        }
    );

    gsap.to('.hero-overlay', {
        opacity: 0,
        y: -60,
        scrollTrigger: {
            trigger: '.hero',
            start: '40% top',
            end: '70% top',
            scrub: true
        }
    });

    // Nav
    gsap.fromTo('#siteNav',
        { opacity: 0, y: -20 },
        {
            opacity: 1, y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.specs-strip',
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        }
    );

    // Specs strip
    gsap.from('.spec-item', {
        opacity: 0, y: 50,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.specs-strip',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // Reveal left / right
    gsap.utils.toArray('.reveal-left').forEach(el => {
        gsap.from(el, {
            opacity: 0, x: -80,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' }
        });
    });

    gsap.utils.toArray('.reveal-right').forEach(el => {
        gsap.from(el, {
            opacity: 0, x: 80,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' }
        });
    });

    // Performance bars
    gsap.utils.toArray('.perf-bar-wrap').forEach((wrap, i) => {
        const fill = wrap.querySelector('.perf-bar-fill');
        const pct = wrap.dataset.pct + '%';
        fill.style.setProperty('--target-w', pct);
        gsap.fromTo(fill,
            { width: '0%' },
            {
                width: pct,
                duration: 1.2,
                delay: i * 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: wrap,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    // SVG ring
    const ring1 = document.getElementById('ring1');
    if (ring1) {
        const circumference = 2 * Math.PI * 88;
        ring1.style.strokeDasharray = circumference;
        ring1.style.strokeDashoffset = circumference;
        gsap.to(ring1, {
            strokeDashoffset: circumference * 0.08,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: ring1,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    }

    // Timeline
    gsap.from('.tl-item', {
        opacity: 0, x: 40,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });

    // CTA
    gsap.from('.cta-content > *', {
        opacity: 0, y: 40,
        stagger: 0.2,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 75%',
            toggleActions: 'play none none reverse'
        }
    });
}

// ── Nav scroll glass effect ───────────────────
window.addEventListener('scroll', () => {
    document.getElementById('siteNav')
        ?.classList.toggle('scrolled', window.scrollY > 80);
});