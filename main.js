let scene, camera, renderer, crystalStars, coreNebula;
const totalStars = 1500;
const nebulaPoints = 1200;

function engineInit() {
    const canvas = document.getElementById('webgl-canvas');
    
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030205, 0.01);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 40;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LAYER 1: Deep Space Star Field Backdrop
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(totalStars * 3);
    const starColors = new Float32Array(totalStars * 3);

    const deepPurple = new THREE.Color('#7c3aed');
    const luxuryGold = new THREE.Color('#eab308');

    for (let i = 0; i < totalStars * 3; i += 3) {
        starPositions[i] = (Math.random() - 0.5) * 160;
        starPositions[i + 1] = (Math.random() - 0.5) * 160;
        starPositions[i + 2] = (Math.random() - 0.5) * 160;

        const paintBlend = deepPurple.clone().lerp(luxuryGold, Math.random() * 0.4);
        starColors[i] = paintBlend.r;
        starColors[i + 1] = paintBlend.g;
        starColors[i + 2] = paintBlend.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
        size: 0.22,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    crystalStars = new THREE.Points(starGeo, starMat);
    scene.add(crystalStars);

    // LAYER 2: Live Fluid Interactive 3D Cosmic Nebula Cloud Core
    const nebulaGeo = new THREE.BufferGeometry();
    const nebPositions = new Float32Array(nebulaPoints * 3);

    for(let i=0; i < nebulaPoints * 3; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = Math.cbrt(Math.random()) * 18;

        nebPositions[i] = r * Math.sin(phi) * Math.cos(theta);
        nebPositions[i+1] = r * Math.sin(phi) * Math.sin(theta);
        nebPositions[i+2] = r * Math.cos(phi);
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebPositions, 3));

    const nebulaMat = new THREE.PointsMaterial({
        size: 0.45,
        color: new THREE.Color('#d4af37'), // Clean Luxury Gold Points
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    coreNebula = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(coreNebula);

    window.addEventListener('resize', responsiveResize);
    window.addEventListener('mousemove', handleInteractionCoords);
    
    graphicsLoop();
}

let scrollGoal = 0;
let scrollCurrent = 0;
let pointerX = 0, pointerY = 0;

function handleInteractionCoords(event) {
    pointerX = (event.clientX / window.innerWidth) - 0.5;
    pointerY = (event.clientY / window.innerHeight) - 0.5;
}

function responsiveResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function graphicsLoop() {
    requestAnimationFrame(graphicsLoop);

    scrollGoal = window.scrollY;
    scrollCurrent += (scrollGoal - scrollCurrent) * 0.04;

    const timeFactor = Date.now() * 0.0003;
    
    crystalStars.rotation.y = timeFactor * 0.2;
    crystalStars.rotation.x = scrollCurrent * 0.0002;

    coreNebula.rotation.y = -timeFactor * 0.5;
    coreNebula.rotation.z = scrollCurrent * 0.0005;
    
    // Cosmic cloud dynamically expands and shifts shape on user mouse scrolling
    const expansionIntensity = 1 + (Math.abs(scrollGoal - scrollCurrent) * 0.015);
    coreNebula.scale.set(expansionIntensity, expansionIntensity, expansionIntensity);

    // Parallax interactive tracking vectors
    camera.position.x += (pointerX * 6 - camera.position.x) * 0.04;
    camera.position.y += (-pointerY * 6 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

engineInit();
