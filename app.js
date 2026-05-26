/**
 * 3D Interactive Portfolio - Main Script
 * Manages Three.js background, custom cursor, scroll reveals, card tilts, and hero typing.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. HERO TYPING EFFECT
       ========================================== */
    const typingElement = document.getElementById('typing-text');
    const words = ["AI Automation Developer.", "Full Stack Developer.", "API Integration Expert.", "Creative Designer."];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIdx === currentWord.length) {
            typingSpeed = 1500; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }
    
    if (typingElement) {
        setTimeout(type, 1000);
    }

    /* ==========================================
       2. CUSTOM CURSOR
       ========================================== */
    const cursor = document.getElementById('custom-cursor');
    const cursorGlow = document.getElementById('custom-cursor-glow');
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Animate cursor positions with simple lerp (smooth follow)
    function animateCursor() {
        // Inner cursor
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        // Outer glow
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states for links and buttons
    const hoverables = document.querySelectorAll('a, button, .preset-btn, .upload-area, .chat-toggle-bubble, textarea, input');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorGlow.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorGlow.classList.remove('hover');
        });
    });

    /* ==========================================
       3. 3D TILT EFFECT ON CARDS
       ========================================== */
    const tiltCards = document.querySelectorAll('.tilt-card, .project-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside element
            const y = e.clientY - rect.top;  // y position inside element
            
            // Calculate offsets relative to card center (-1 to 1)
            const xc = ((x - rect.width / 2) / (rect.width / 2)) * 10; // Max tilt 10deg
            const yc = ((y - rect.height / 2) / (rect.height / 2)) * -10;
            
            card.style.transform = `rotateY(${xc}deg) rotateX(${yc}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0px)';
        });
    });

    /* ==========================================
       4. SCROLL REVEAL (INTERSECTION OBSERVER)
       ========================================== */
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    /* ==========================================
       5. NAVIGATION LINK SYNC
       ========================================== */
    const sections = document.querySelectorAll('.section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').slice(1) === current) {
                a.classList.add('active');
            }
        });
    });

    // Mobile Navigation Drawer Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(11, 15, 25, 0.95)';
            navLinks.style.padding = '2rem';
            navLinks.style.gap = '1.5rem';
        });
    }

    /* ==========================================
       6. THREE.JS 3D PARTICLE ENGINE
       ========================================== */
    const canvas = document.getElementById('three-canvas');
    if (!canvas) return;

    // Create Scene, Camera, Renderer
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Configuration
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    // Color definitions
    const colorCyan = new THREE.Color('#06b6d4');
    const colorPurple = new THREE.Color('#8b5cf6');
    const colorPink = new THREE.Color('#ec4899');

    for (let i = 0; i < count; i++) {
        // Random spherical coordinate distribution
        const radius = 10 + Math.random() * 45;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Interpolated color gradient matching layout variables
        const randVal = Math.random();
        let mixedColor;
        if (randVal < 0.33) {
            mixedColor = colorCyan.clone().lerp(colorPurple, Math.random());
        } else if (randVal < 0.66) {
            mixedColor = colorPurple.clone().lerp(colorPink, Math.random());
        } else {
            mixedColor = colorPink.clone().lerp(colorCyan, Math.random());
        }

        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Circle texture builder for smooth dots (WebGL defaults are square)
    function createCircleTexture() {
        const size = 16;
        const matCanvas = document.createElement('canvas');
        matCanvas.width = size;
        matCanvas.height = size;
        const ctx = matCanvas.getContext('2d');
        
        // Draw round gradient dot
        const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
        grad.addColorStop(0, 'rgba(255,255,255,1)');
        grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
        
        return new THREE.CanvasTexture(matCanvas);
    }

    const material = new THREE.PointsMaterial({
        size: 0.45,
        vertexColors: true,
        transparent: true,
        opacity: 0.65,
        map: createCircleTexture(),
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Ambient Lighting to add subtle reflection
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Track mouse coordinates for Three.js interactions
    let targetX = 0;
    let targetY = 0;
    
    window.addEventListener('mousemove', (event) => {
        targetX = (event.clientX - window.innerWidth / 2) * 0.04;
        targetY = (event.clientY - window.innerHeight / 2) * 0.04;
    });

    // Window Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    const clock = new THREE.Clock();

    function animate() {
        const elapsedTime = clock.getElapsedTime();

        // 1. Base auto-rotation
        particles.rotation.y = elapsedTime * 0.03;
        particles.rotation.x = elapsedTime * 0.015;

        // 2. Mouse response rotation (inertia lerping)
        particles.rotation.y += (targetX - particles.rotation.y) * 0.05;
        particles.rotation.x += (-targetY - particles.rotation.x) * 0.05;

        // 3. Scroll response (morph height and speed)
        const scrollVal = window.scrollY * 0.005;
        particles.position.y = -scrollVal;
        
        // Morph particles layout slightly based on scroll depth
        const posArr = geometry.attributes.position.array;
        for (let i = 0; i < count; i++) {
            const index = i * 3;
            // Add slight wave wobble to points
            posArr[index + 1] += Math.sin(elapsedTime + posArr[index]) * 0.003;
        }
        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    animate();
});
