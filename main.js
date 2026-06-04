/**
 * CHAPTER II - THE ANNIVERSARY INTERACTIVE EXHIBIT ENGINE
 */

// 1. THREE.JS LUXURY BACKGROUND SETUP
(function initThreeEngine() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create a pristine deep atmospheric constellation starfield background
    const starsCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const velocities = [];

    for (let i = 0; i < starsCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 15;
        positions[i + 1] = (Math.random() - 0.5) * 15;
        positions[i + 2] = (Math.random() - 0.5) * 15;
        velocities.push((Math.random() - 0.5) * 0.002);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft incandescent magical particle materials
    const material = new THREE.PointsMaterial({
        size: 0.04,
        color: 0xd4af37, // Soft Luxury Gold Light Accent
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    camera.position.z = 5;

    // Fluid scroll mapping parameters
    let currentScroll = 0;
    window.addEventListener('scroll', () => {
        currentScroll = window.scrollY / window.innerHeight;
    });

    function animate() {
        requestAnimationFrame(animate);

        // Slow, elegant continuous rotation
        starField.rotation.y += 0.0005;
        starField.rotation.x += 0.0002;

        // Sync with user's native mouse scrolling patterns
        starField.position.y = currentScroll * 0.8;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
})();


// 2. CANVAS FLOATING ROMANCE ENGINE (HEARTS & FLOWER PETALS)
(function initRomanceEngine() {
    const canvas = document.getElementById('romance-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const colors = ['#ff4d6d', '#ff758f', '#ffccd5', '#fff0f3']; // Romantic soft pinks & cream rose hues

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class RomanceParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 60;
            this.type = Math.random() > 0.45 ? 'heart' : 'petal'; // Random distribution mixture
            this.size = Math.random() * 12 + 8;
            this.speedY = Math.random() * 0.8 + 0.4; // Controlled float upward velocity
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.45 + 0.25;
            this.wobble = Math.random() * Math.PI;
            this.wobbleSpeed = Math.random() * 0.02 + 0.01;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.25 + this.speedX;

            // Softly fade out as particles arrive closer to top text border elements
            if (this.y < canvas.height * 0.25) {
                this.opacity -= 0.004;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.beginPath();

            if (this.type === 'heart') {
                // Vector heart curve calculations
                const topY = this.y - this.size / 2;
                ctx.moveTo(this.x, this.y);
                ctx.bezierCurveTo(this.x - this.size / 2, topY, this.x - this.size, this.y - this.size / 3, this.x - this.size, this.y);
                ctx.bezierCurveTo(this.x - this.size, this.y + this.size / 2, this.x - this.size / 3, this.y + this.size * 0.8, this.x, this.y + this.size);
                ctx.bezierCurveTo(this.x + this.size / 3, this.y + this.size * 0.8, this.x + this.size, this.y + this.size / 2, this.x + this.size, this.y);
                ctx.bezierCurveTo(this.x + this.size, this.y - this.size / 3, this.x + this.size / 2, topY, this.x, this.y - this.size / 2);
                ctx.fill();
            } else {
                // Drifting structural flower petal representation
                ctx.translate(this.x, this.y);
                ctx.rotate(this.wobble);
                ctx.ellipse(0, 0, this.size / 2, this.size / 3, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function handleParticles() {
        // Safe element count threshold limit for high-performing processing
        if (particles.length < 40 && Math.random() < 0.04) {
            particles.push(new RomanceParticle());
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].y + particles[i].size < 0 || particles[i].opacity <= 0) {
                particles.splice(i, 1);
            }
        }
    }

    function renderLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        handleParticles();
        requestAnimationFrame(renderLoop);
    }
    renderLoop();
})();
