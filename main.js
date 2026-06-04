/**
 * CHAPTER II - ULTRA LUXURY ROMANCE ENGINE SETUP
 */

// 1. THREE.JS CONSTELLATION ATMOSPHERE
(function initThreeEngine() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const starsCount = 180;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 16;
        positions[i + 1] = (Math.random() - 0.5) * 16;
        positions[i + 2] = (Math.random() - 0.5) * 16;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.045,
        color: 0xff758f, // Matching deep pink soft stellar environment
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
    });

    const starField = new THREE.Points(geometry, material);
    scene.add(starField);

    camera.position.z = 5;

    let currentScroll = 0;
    window.addEventListener('scroll', () => {
        currentScroll = window.scrollY / window.innerHeight;
    }, { passive: true });

    function animate() {
        requestAnimationFrame(animate);
        starField.rotation.y += 0.0003;
        starField.rotation.x += 0.0001;
        starField.position.y = currentScroll * 0.75;
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, { passive: true });

    animate();
})();


// 2. VECTOR ENGINE - DYNAMIC GLOWING FLOATING HEARTS & 3D SHADED PETALS
(function initRomanceEngine() {
    const canvas = document.getElementById('romance-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    
    // Premium Vibrant Romantic Color Matrix
    const heartColors = ['#ff0054', '#ff4d6d', '#ff758f', '#ff85a1']; // Hot pink energy shades
    const petalColors = ['#ffccd5', '#ffb3c1', '#ffa6c9', '#ffe5ec']; // Elegant soft blooming rose hues

    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    class PremiumParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 80;
            this.type = Math.random() > 0.5 ? 'heart' : 'flower';
            this.size = Math.random() * 14 + 10; // Luxury sizing threshold
            this.speedY = Math.random() * 0.9 + 0.45; // Smooth majestic upward float
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.55 + 0.3;
            this.wobble = Math.random() * Math.PI * 2;
            this.wobbleSpeed = Math.random() * 0.02 + 0.012;
            
            // Allocate color palettes based on particle properties
            this.color = this.type === 'heart' 
                ? heartColors[Math.floor(Math.random() * heartColors.length)]
                : petalColors[Math.floor(Math.random() * petalColors.length)];
        }

        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleSpeed;
            this.x += Math.sin(this.wobble) * 0.35 + this.speedX;

            // Graceful out-fade structure as elements flow up past the view boundary
            if (this.y < canvas.height * 0.2) {
                this.opacity -= 0.005;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            if (this.type === 'heart') {
                // Vector heart calculations
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 15;
                ctx.shadowColor = this.color; // Hot glowing drop shadow effect!
                ctx.beginPath();
                const topY = this.y - this.size / 2;
                ctx.moveTo(this.x, this.y);
                ctx.bezierCurveTo(this.x - this.size / 2, topY, this.x - this.size, this.y - this.size / 3, this.x - this.size, this.y);
                ctx.bezierCurveTo(this.x - this.size, this.y + this.size / 2, this.x - this.size / 3, this.y + this.size * 0.8, this.x, this.y + this.size);
                ctx.bezierCurveTo(this.x + this.size / 3, this.y + this.size * 0.8, this.x + this.size, this.y + this.size / 2, this.x + this.size, this.y);
                ctx.bezierCurveTo(this.x + this.size, this.y - this.size / 3, this.x + this.size / 2, topY, this.x, this.y - this.size / 2);
                ctx.fill();
            } else {
                // Render elegant 3D shaded falling/twirling flower petal structure
                ctx.translate(this.x, this.y);
                ctx.rotate(this.wobble);
                
                // Linear gradient layer mapping creates realistic 3D shadow curves across the petals
                let gradient = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
                gradient.addColorStop(0, '#ffffff'); // Glint reflection
                gradient.addColorStop(0.3, this.color);
                gradient.addColorStop(1, '#d96b82'); // Dark shaded base edge
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 0.6, this.size * 0.35, 0, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function handleParticles() {
        if (particles.length < 45 && Math.random() < 0.045) {
            particles.push(new PremiumParticle());
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
