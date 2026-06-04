/**
 * 3D ROMANCE MASTER ENGINE
 * Includes: Three.js Constellation, Floating Hearts, 3D Petals, and Twinkle Sparks
 */

// 1. THREE.JS STARFIELD ENGINE
(function initThreeEngine() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particlesCount = 350;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i=0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 12;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        color: 0xff4d6d,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
    });

    const starMesh = new THREE.Points(geometry, material);
    scene.add(starMesh);

    camera.position.z = 3;

    function animate() {
        requestAnimationFrame(animate);
        starMesh.rotation.y += 0.0005;
        starMesh.rotation.x += 0.0002;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

// 2. ROMANCE ENGINE (HEARTS, PETALS, SPARKS)
(function initRomanceEngine() {
    const canvas = document.getElementById('romance-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class MultiParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 50;
            this.size = Math.random() * 15 + 8;
            this.speedY = Math.random() * 0.8 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.wobble = 0;
            this.wobbleIncr = Math.random() * 0.02;
            
            // Randomly choose type: 0=Heart, 1=Petal, 2=Spark
            const r = Math.random();
            if (r < 0.4) this.type = 'heart';
            else if (r < 0.8) this.type = 'petal';
            else this.type = 'spark';

            this.color = this.type === 'heart' ? '#ff0054' : (this.type === 'petal' ? '#ffccd5' : '#ffffff');
        }

        update() {
            this.y -= this.speedY;
            this.wobble += this.wobbleIncr;
            this.x += Math.sin(this.wobble) * 0.4;
            
            if (this.y < -50) this.reset();
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.type === 'heart') {
                this.drawHeart();
            } else if (this.type === 'petal') {
                this.drawPetal();
            } else {
                this.drawSpark();
            }

            ctx.restore();
        }

        drawHeart() {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            const topY = this.y - this.size / 2;
            ctx.moveTo(this.x, this.y);
            ctx.bezierCurveTo(this.x - this.size / 2, topY, this.x - this.size, this.y - this.size / 3, this.x - this.size, this.y);
            ctx.bezierCurveTo(this.x - this.size, this.y + this.size / 2, this.x - this.size / 3, this.y + this.size * 0.8, this.x, this.y + this.size);
            ctx.bezierCurveTo(this.x + this.size / 3, this.y + this.size * 0.8, this.x + this.size, this.y + this.size / 2, this.x + this.size, this.y);
            ctx.bezierCurveTo(this.x + this.size, this.y - this.size / 3, this.x + this.size / 2, topY, this.x, this.y - this.size / 2);
            ctx.fill();
        }

        drawPetal() {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.wobble * 5);
            let grad = ctx.createLinearGradient(-this.size/2, -this.size/2, this.size/2, this.size/2);
            grad.addColorStop(0, '#fff');
            grad.addColorStop(1, this.color);
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(0, 0, this.size, this.size/2, 0, 0, Math.PI*2);
            ctx.fill();
        }

        drawSpark() {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#fff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.random()*2, 0, Math.PI*2);
            ctx.fill();
        }
    }

    for(let i=0; i<60; i++) {
        particles.push(new MultiParticle());
    }

    function render() {
        ctx.clearRect(0,0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(render);
    }
    render();
})();
