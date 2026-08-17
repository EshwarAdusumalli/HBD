/**
 * ROMANTIC & CINEMATIC BIRTHDAY WEBSITE INTERACTIVE LOGIC
 * Mode: Step-By-Step Interactive Screen Journey
 * Features:
 * - Full-Screen Slide / Screen Controller (goToScreen, nextScreen, prevScreen)
 * - Step Navigation Dots & Progress Indicator
 * - High-Performance 2D Canvas Confetti Engine with Physics
 * - Dynamic Starfield & Floating Hearts Generator
 * - 3D Interactive Cake with Individual & Batch Candle Blowout
 * - Web Audio API Synthesizer Fallback (Zero console errors on missing MP3)
 * - Custom Wish Celebration Modal (No browser alert)
 * - Interactive Memory Gallery Lightbox
 */

let currentScreen = 1;
const TOTAL_SCREENS = 7;

document.addEventListener('DOMContentLoaded', () => {
    initStars();
    initFloatingHearts();
    initCanvasConfetti();
    initAudioController();
    initGlobalListeners();
    updateProgressIndicator(1);
});

/* ==========================================================================
   1. SCREEN NAVIGATION CONTROLLER (STEP BY STEP)
   ========================================================================== */
window.goToScreen = function (screenNumber) {
    if (screenNumber < 1 || screenNumber > TOTAL_SCREENS) return;

    const previousScreen = currentScreen;
    currentScreen = screenNumber;

    // Deactivate all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Activate targeted screen
    const targetScreen = document.getElementById(`screen${screenNumber}`);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.scrollTop = 0; // Reset scroll position for targeted screen
    }

    // Update progress navigation
    updateProgressIndicator(screenNumber);

    // Screen-specific celebratory triggers
    if (screenNumber === 7) {
        setTimeout(() => {
            triggerCelebration();
        }, 350);
    } else if (screenNumber === 2 && previousScreen === 1) {
        fireConfetti(35);
    }
};

window.nextScreen = function () {
    if (currentScreen < TOTAL_SCREENS) {
        window.goToScreen(currentScreen + 1);
    }
};

window.prevScreen = function () {
    if (currentScreen > 1) {
        window.goToScreen(currentScreen - 1);
    }
};

function updateProgressIndicator(step) {
    const dots = document.querySelectorAll('.step-dot');
    dots.forEach((dot, index) => {
        if (index + 1 === step) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    const indicatorText = document.getElementById('stepIndicatorText');
    if (indicatorText) {
        indicatorText.innerText = `Step ${step} of ${TOTAL_SCREENS}`;
    }
}

/* ==========================================================================
   2. TWINKLING STARFIELD GENERATOR
   ========================================================================== */
function initStars() {
    const starsContainer = document.getElementById('starsContainer');
    if (!starsContainer) return;

    const starCount = window.innerWidth < 600 ? 60 : 120;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        const size = (Math.random() * 2.5 + 1).toFixed(1);
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
        star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
        star.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
        star.style.animationDuration = `${(Math.random() * 2.5 + 2).toFixed(2)}s`;

        fragment.appendChild(star);
    }

    starsContainer.appendChild(fragment);
}

/* ==========================================================================
   3. FLOATING HEARTS & PARTICLES GENERATOR
   ========================================================================== */
function initFloatingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');
    if (!heartsContainer) return;

    const heartEmojis = ['❤️', '💖', '💕', '💗', '💓', '✨', '🌸', '⭐', '🫶'];

    function createFloatingHeart() {
        if (document.hidden) return;

        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        const startX = (Math.random() * 96 + 2).toFixed(2);
        const fontSize = (Math.random() * 16 + 16).toFixed(0);
        const duration = (Math.random() * 4 + 6).toFixed(1);

        heart.style.left = `${startX}vw`;
        heart.style.fontSize = `${fontSize}px`;
        heart.style.animationDuration = `${duration}s`;

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, parseFloat(duration) * 1000);
    }

    setInterval(createFloatingHeart, 800);
}

/* ==========================================================================
   4. HIGH PERFORMANCE CANVAS CONFETTI ENGINE
   ========================================================================== */
let confettiParticles = [];
let isConfettiRunning = false;
let confettiCanvas, confettiCtx;

function initCanvasConfetti() {
    confettiCanvas = document.getElementById('confettiCanvas');
    if (!confettiCanvas) return;

    confettiCtx = confettiCanvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas, { passive: true });
}

function resizeCanvas() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}

const CONFETTI_COLORS = [
    '#ff4f9a', '#ff75ae', '#ffd45a', '#ff4757',
    '#8d55ff', '#ffffff', '#ffd5e6', '#2ed573', '#70a1ff'
];

function fireConfetti(amount = 100, originX = null, originY = null) {
    if (!confettiCanvas || !confettiCtx) return;

    const startX = originX !== null ? originX : confettiCanvas.width / 2;
    const startY = originY !== null ? originY : confettiCanvas.height * 0.55;

    for (let i = 0; i < amount; i++) {
        confettiParticles.push({
            x: startX,
            y: startY,
            radius: Math.random() * 5 + 4,
            velX: (Math.random() * 26 - 13),
            velY: (Math.random() * -22 - 6),
            gravity: 0.45,
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            tilt: Math.random() * 10 - 5,
            tiltAngle: Math.random() * Math.PI,
            tiltAngleInc: Math.random() * 0.08 + 0.04,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() * 8 - 4)
        });
    }

    if (!isConfettiRunning) {
        isConfettiRunning = true;
        requestAnimationFrame(renderConfetti);
    }
}

function renderConfetti() {
    if (!confettiCtx || !confettiCanvas) return;

    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let activeParticles = 0;

    for (let i = 0; i < confettiParticles.length; i++) {
        const p = confettiParticles[i];

        p.tiltAngle += p.tiltAngleInc;
        p.velY += p.gravity;
        p.x += p.velX + Math.sin(p.tiltAngle) * 1.5;
        p.y += p.velY;
        p.velX *= 0.98;
        p.rotation += p.rotSpeed;

        if (p.y <= confettiCanvas.height + 50 && p.x >= -50 && p.x <= confettiCanvas.width + 50) {
            activeParticles++;

            confettiCtx.save();
            confettiCtx.translate(p.x, p.y);
            confettiCtx.rotate((p.rotation * Math.PI) / 180);
            confettiCtx.fillStyle = p.color;
            confettiCtx.fillRect(-p.radius, -p.radius / 2, p.radius * 2, p.radius);
            confettiCtx.restore();
        }
    }

    if (activeParticles > 0) {
        requestAnimationFrame(renderConfetti);
    } else {
        confettiParticles = [];
        isConfettiRunning = false;
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
}

/* ==========================================================================
   5. WEB AUDIO API SYNTHESIZER (WHOOSH & FANFARE)
   ========================================================================== */
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            audioCtx = new AudioContextClass();
        }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

function playBlowSound() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const bufferSize = Math.floor(ctx.sampleRate * 0.25);
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.22);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.28, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
    } catch (e) { }
}

function playCelebrationFanfare() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        const notes = [523.25, 659.25, 783.99, 880.00, 1046.50, 1318.51];

        notes.forEach((freq, index) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.09);

            gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.09 + 0.65);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + index * 0.09);
            osc.stop(ctx.currentTime + index * 0.09 + 0.7);
        });
    } catch (e) { }
}

let synthIntervalId = null;
let isSynthPlaying = false;

function startSynthMelody() {
    if (isSynthPlaying) return;
    isSynthPlaying = true;

    const chords = [
        [523.25, 659.25, 783.99], // C
        [587.33, 698.46, 880.00], // Dm
        [659.25, 783.99, 987.77], // Em
        [698.46, 880.00, 1046.50] // F
    ];
    let chordIndex = 0;

    function playChord() {
        if (!isSynthPlaying) return;
        try {
            const ctx = getAudioContext();
            if (!ctx) return;

            const chord = chords[chordIndex % chords.length];
            chordIndex++;

            chord.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

                gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1.2);

                osc.connect(gain);
                gain.connect(ctx.destination);

                osc.start(ctx.currentTime + i * 0.15);
                osc.stop(ctx.currentTime + i * 0.15 + 1.3);
            });
        } catch (e) { }
    }

    playChord();
    synthIntervalId = setInterval(playChord, 2400);
}

function stopSynthMelody() {
    isSynthPlaying = false;
    if (synthIntervalId) {
        clearInterval(synthIntervalId);
        synthIntervalId = null;
    }
}

/* ==========================================================================
   6. 3D CAKE & CANDLE BLOW LOGIC
   ========================================================================== */
let extinguishedCandlesCount = 0;
const TOTAL_CANDLES = 3;

window.blowSingleCandle = function (candleElement) {
    const flame = candleElement.querySelector('.flame-assembly');
    if (!flame || flame.classList.contains('out')) return;

    flame.classList.add('out');
    extinguishedCandlesCount++;

    playBlowSound();

    const rect = candleElement.getBoundingClientRect();
    fireConfetti(25, rect.left + rect.width / 2, rect.top);

    if (extinguishedCandlesCount >= TOTAL_CANDLES) {
        onAllCandlesExtinguished();
    }
};

window.handleCandleKey = function (event, candleElement) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        window.blowSingleCandle(candleElement);
    }
};

window.blowAllCandles = function () {
    const candles = document.querySelectorAll('.cake-3d .candle');
    candles.forEach((candle, idx) => {
        const flame = candle.querySelector('.flame-assembly');
        if (flame && !flame.classList.contains('out')) {
            setTimeout(() => {
                flame.classList.add('out');
            }, idx * 120);
        }
    });

    extinguishedCandlesCount = TOTAL_CANDLES;
    playBlowSound();

    const cake = document.getElementById('cake3D');
    const rect = cake ? cake.getBoundingClientRect() : null;
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + 80 : window.innerHeight / 2;

    setTimeout(() => {
        onAllCandlesExtinguished(originX, originY);
    }, 400);
};

function onAllCandlesExtinguished(originX = null, originY = null) {
    playCelebrationFanfare();
    fireConfetti(140, originX, originY);

    const instruction = document.getElementById('cakeInstructionText');
    if (instruction) {
        instruction.innerHTML = "✨ <strong>Wish made! May every beautiful wish in your heart come true. ❤️</strong>";
    }

    const nextBtn = document.getElementById('btnNextAfterCake');
    if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
    }

    setTimeout(() => {
        showWishModal();
    }, 600);
}

/* ==========================================================================
   7. CUSTOM WISH MODAL CONTROLS
   ========================================================================== */
window.showWishModal = function () {
    const modal = document.getElementById('wishModal');
    if (!modal) return;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
};

window.closeWishModal = function () {
    const modal = document.getElementById('wishModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    fireConfetti(60);
    // Smoothly proceed to Screen 3 (Letter)
    window.goToScreen(3);
};

/* ==========================================================================
   8. MEMORY GALLERY DATA & FULL-SCREEN LIGHTBOX ENGINE
   ========================================================================== */
const MEMORIES = [
    {
        id: 1,
        type: 'video',
        src: 'Motivator.mp4',
        poster: 'photo1.jpeg',
        badge: 'Memory 01 • Video 🎬',
        title: 'A Beautiful Memory ❤️',
        desc: 'One of those moments I will always keep close to my heart.'
    },
    {
        id: 2,
        type: 'image',
        src: 'photo10.jpeg',
        badge: 'Memory 02 • Photo 📸',
        title: 'Just Us ✨',
        desc: 'One picture, a thousand memories.'
    },
    {
        id: 3,
        type: 'image',
        src: 'photo5.jpeg',
        badge: 'Memory 03 • Photo 📸',
        title: 'That Smile 🥹',
        desc: 'One of my favourite things.'
    },
    {
        id: 4,
        type: 'image',
        src: 'photo11.jpeg',
        badge: 'Memory 04 • Photo 📸',
        title: 'Forever favourite 💗💎🤌🏻',
        desc: 'The moments that make no sense but mean everything.'
    },
    {
        id: 5,
        type: 'image',
        src: 'photo3.jpeg',
        badge: 'Memory 05 • Photo 🌸',
        title: 'Beautiful Memories 🌸',
        desc: 'Some moments deserve to be remembered forever.'
    },
    {
        id: 6,
        type: 'image',
        src: 'photo6.jpeg',
        badge: 'Memory 06 • Photo 💫',
        title: 'Just you 💫',
        desc: "I'm glad this moment happened."
    },
    {
        id: 7,
        type: 'image',
        src: 'photo7.jpeg',
        badge: 'Memory 07 • Photo 📖',
        title: 'The innocent face 🫣',
        desc: 'Another page of our beautiful story.'
    },
    {
        id: 8,
        type: 'image',
        src: 'photo8.jpeg',
        badge: 'Memory 08 • Photo ❤️',
        title: 'Unforgettable ❤️',
        desc: 'This one will always have a special place.'
    },
    {
        id: 9,
        type: 'image',
        src: 'photo9.jpeg',
        badge: 'Memory 09 • Photo 🌙',
        title: 'Teenager 👶🏻🐣',
        desc: 'Memories I never want to lose.'
    },
    {
        id: 10,
        type: 'image',
        src: 'photo2.jpeg',
        badge: 'Memory 10 • Photo 🫶',
        title: 'The way i look at you... 🫶',
        desc: "Because our story isn't finished yet."
    }
];

let currentLightboxIndex = 0;
let wasBgMusicPlayingBeforeVideo = false;

window.openMemoryLightbox = function (index) {
    if (index < 0 || index >= MEMORIES.length) index = 0;
    currentLightboxIndex = index;
    renderCurrentLightboxMemory();

    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
    }
};

window.openLightbox = function (imageOrVideoSrc, titleText, descText) {
    // Find matching memory index if possible
    const matchIndex = MEMORIES.findIndex(m => m.src === imageOrVideoSrc);
    if (matchIndex !== -1) {
        window.openMemoryLightbox(matchIndex);
        return;
    }

    const isVideo = imageOrVideoSrc.endsWith('.mp4') || imageOrVideoSrc.endsWith('.webm') || imageOrVideoSrc.endsWith('.mov');
    const modal = document.getElementById('lightboxModal');
    const img = document.getElementById('lightboxImg');
    const video = document.getElementById('lightboxVideo');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');
    const counter = document.getElementById('lightboxCounter');

    if (!modal) return;

    if (counter) counter.innerText = 'Special Memory';
    if (title) title.innerText = titleText || '';
    if (desc) desc.innerText = descText || '';

    if (isVideo) {
        if (img) img.style.display = 'none';
        if (video) {
            video.style.display = 'block';
            video.src = imageOrVideoSrc;
            video.style.background = '#000000';
            video.load();
            pauseBackgroundMusicForVideo();
            video.play().catch(() => { });
        }
    } else {
        if (video) {
            video.pause();
            video.src = '';
            video.style.display = 'none';
            resumeBackgroundMusicAfterVideo();
        }
        if (img) {
            img.style.display = 'block';
            img.src = imageOrVideoSrc;
            img.alt = titleText || 'Memory Preview';
        }
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
};

function renderCurrentLightboxMemory() {
    const item = MEMORIES[currentLightboxIndex];
    if (!item) return;

    const img = document.getElementById('lightboxImg');
    const video = document.getElementById('lightboxVideo');
    const title = document.getElementById('lightboxTitle');
    const desc = document.getElementById('lightboxDesc');
    const counter = document.getElementById('lightboxCounter');

    if (counter) counter.innerText = item.badge || `Memory ${currentLightboxIndex + 1} of ${MEMORIES.length}`;
    if (title) title.innerText = item.title || '';
    if (desc) desc.innerText = item.desc || '';

    if (item.type === 'video' || (item.src && item.src.endsWith('.mp4'))) {
        if (img) img.style.display = 'none';
        if (video) {
            video.style.display = 'block';
            if (video.src !== item.src && !video.src.endsWith(item.src)) {
                video.src = item.src;
                if (item.poster) {
                    video.poster = item.poster;
                    video.style.background = `url(${item.poster}) center/contain no-repeat #000000`;
                } else {
                    video.poster = '';
                    video.style.background = '#000000';
                }
                video.load();
            }
            pauseBackgroundMusicForVideo();
            video.play().catch(() => { });
        }
    } else {
        if (video) {
            video.pause();
            video.src = '';
            video.style.display = 'none';
            resumeBackgroundMusicAfterVideo();
        }
        if (img) {
            img.style.display = 'block';
            img.src = item.src;
            img.alt = item.title || 'Memory Preview';
        }
    }
}

window.nextMemory = function (event) {
    if (event) event.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex + 1) % MEMORIES.length;
    renderCurrentLightboxMemory();
};

window.prevMemory = function (event) {
    if (event) event.stopPropagation();
    currentLightboxIndex = (currentLightboxIndex - 1 + MEMORIES.length) % MEMORIES.length;
    renderCurrentLightboxMemory();
};

window.toggleLightboxFullscreen = function (event) {
    if (event) event.stopPropagation();

    const modal = document.getElementById('lightboxModal');
    const icon = document.getElementById('fullscreenIcon');

    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (modal.requestFullscreen) {
            modal.requestFullscreen().catch(() => { });
        } else if (modal.webkitRequestFullscreen) {
            modal.webkitRequestFullscreen();
        }
        if (icon) icon.innerText = '⤓';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => { });
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        if (icon) icon.innerText = '⛶';
    }
};

document.addEventListener('fullscreenchange', () => {
    const icon = document.getElementById('fullscreenIcon');
    if (icon) {
        icon.innerText = document.fullscreenElement ? '⤓' : '⛶';
    }
});

document.addEventListener('webkitfullscreenchange', () => {
    const icon = document.getElementById('fullscreenIcon');
    if (icon) {
        icon.innerText = document.webkitFullscreenElement ? '⤓' : '⛶';
    }
});

function pauseBackgroundMusicForVideo() {
    const bgMusic = document.getElementById('bgMusic');
    if (isAudioPlaying && bgMusic && !bgMusic.paused) {
        wasBgMusicPlayingBeforeVideo = true;
        bgMusic.pause();
    }
    if (isSynthPlaying) {
        wasBgMusicPlayingBeforeVideo = true;
        stopSynthMelody();
    }
}

function resumeBackgroundMusicAfterVideo() {
    if (wasBgMusicPlayingBeforeVideo) {
        wasBgMusicPlayingBeforeVideo = false;
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic && isAudioPlaying) {
            bgMusic.play().catch(() => {
                startSynthMelody();
            });
        } else if (isAudioPlaying) {
            startSynthMelody();
        }
    }
}

window.closeLightbox = function (event) {
    const modal = document.getElementById('lightboxModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    const video = document.getElementById('lightboxVideo');
    if (video) {
        video.pause();
        video.src = '';
    }

    resumeBackgroundMusicAfterVideo();

    if (document.fullscreenElement || document.webkitFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => { });
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }

    setTimeout(() => {
        const img = document.getElementById('lightboxImg');
        if (img && !modal.classList.contains('active')) img.src = '';
    }, 350);
};

/* ==========================================================================
   9. AUDIO CONTROLLER & BACKGROUND MUSIC
   ========================================================================== */
let isAudioPlaying = false;

function initAudioController() {
    const bgMusic = document.getElementById('bgMusic');
    const musicToggleBtn = document.getElementById('musicToggleBtn');

    if (!musicToggleBtn || !bgMusic) return;

    musicToggleBtn.addEventListener('click', toggleMusic);
}

function toggleMusic() {
    const bgMusic = document.getElementById('bgMusic');
    const musicIcon = document.getElementById('musicIcon');
    const tooltip = document.querySelector('.music-tooltip');

    if (!bgMusic) return;

    if (!isAudioPlaying) {
        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                isAudioPlaying = true;
                if (musicIcon) musicIcon.innerText = '🔊';
                if (tooltip) tooltip.innerText = 'Pause Music';
            }).catch(() => {
                startSynthMelody();
                isAudioPlaying = true;
                if (musicIcon) musicIcon.innerText = '🔊';
                if (tooltip) tooltip.innerText = 'Pause Music';
            });
        }
    } else {
        bgMusic.pause();
        stopSynthMelody();
        isAudioPlaying = false;
        wasBgMusicPlayingBeforeVideo = false;
        if (musicIcon) musicIcon.innerText = '🎵';
        if (tooltip) tooltip.innerText = 'Play Music';
    }
}

/* ==========================================================================
   10. CELEBRATION TRIGGER (FINALE BUTTON)
   ========================================================================== */
window.triggerCelebration = function () {
    playCelebrationFanfare();
    fireConfetti(120, window.innerWidth * 0.3, window.innerHeight * 0.5);
    setTimeout(() => {
        fireConfetti(120, window.innerWidth * 0.7, window.innerHeight * 0.5);
    }, 250);
};

/* ==========================================================================
   11. GLOBAL INTERACTION & KEYBOARD / SWIPE LISTENERS
   ========================================================================== */
function initGlobalListeners() {
    document.addEventListener('click', function onFirstClick(e) {
        getAudioContext();
        fireConfetti(35, e.clientX, e.clientY);
        document.removeEventListener('click', onFirstClick);
    }, { once: true });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        const lightboxModal = document.getElementById('lightboxModal');
        const isLightboxActive = lightboxModal && lightboxModal.classList.contains('active');

        const wishModal = document.getElementById('wishModal');
        const isWishModalActive = wishModal && wishModal.classList.contains('active');

        if (e.key === 'Escape') {
            if (isWishModalActive) {
                closeWishModal();
            }
            if (isLightboxActive) {
                closeLightbox();
            }
            return;
        }

        if (isLightboxActive) {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                window.nextMemory();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                window.prevMemory();
            } else if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                window.toggleLightboxFullscreen();
            } else if (e.key === ' ' || e.key === 'Spacebar') {
                const video = document.getElementById('lightboxVideo');
                if (video && video.style.display !== 'none') {
                    e.preventDefault();
                    if (video.paused) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                }
            }
        } else {
            if (e.key === 'ArrowRight') {
                window.nextScreen();
            } else if (e.key === 'ArrowLeft') {
                window.prevScreen();
            }
        }
    });

    // Touch Swipe Gestures for Lightbox
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox) {
        let touchStartX = 0;
        let touchStartY = 0;

        lightbox.addEventListener('touchstart', (e) => {
            if (e.touches && e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (e.changedTouches && e.changedTouches.length === 1) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const diffX = touchEndX - touchStartX;
                const diffY = touchEndY - touchStartY;

                // Detect horizontal swipe with minimal vertical movement
                if (Math.abs(diffX) > 45 && Math.abs(diffY) < 70) {
                    if (diffX < 0) {
                        window.nextMemory();
                    } else {
                        window.prevMemory();
                    }
                }
            }
        }, { passive: true });
    }

    // Video Card Hover Preview Effect
    const videoCard = document.querySelector('.photo-card.video-card');
    if (videoCard) {
        const previewVideo = videoCard.querySelector('.photo-video');
        if (previewVideo) {
            videoCard.addEventListener('mouseenter', () => {
                previewVideo.play().catch(() => { });
            });
            videoCard.addEventListener('mouseleave', () => {
                previewVideo.pause();
            });
        }
    }
}
