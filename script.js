document.addEventListener('DOMContentLoaded', function() {
    // Initialize Vanta.js topology background
    VANTA.TOPOLOGY({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0x89964e,
        backgroundColor: 0x222222
    });

    // Three.js 3D Text Setup
    const container = document.getElementById('three-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-5, -5, -5);
    scene.add(backLight);

    // Load font and create 3D text
    const fontLoader = new THREE.FontLoader();
    const isMobile = window.innerWidth < 768;
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(font) {
        const textGeometry = new THREE.TextGeometry('DeyVision', {
            font: font,
            size: isMobile ? 0.4 : 0.7,
            height: isMobile ? 0.2 : 0.4,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 5
        });

        textGeometry.center();

        const textMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.3,
            roughness: 0.4
        });

        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);
        window.textMesh = textMesh;
    });

    // Create small wireframe CCCs floating along the whole page
    const miniCCCs = [];
    fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', function(font) {
        // Fixed positions for 6 CCCs spread across the page scroll
        const positions = [
            { x: 3, y: 1, z: -1 },
            { x: -3, y: -6, z: -2 },
            { x: 3.5, y: -14, z: -1.5 },
            { x: -3.5, y: -22, z: -1 },
            { x: 3, y: -30, z: -2 },
            { x: -3, y: -38, z: -1.5 }
        ];

        for (let i = 0; i < 6; i++) {
            const miniGeometry = new THREE.TextGeometry('DEY', {
                font: font,
                size: 0.25,
                height: 0.06,
                curveSegments: 8,
                bevelEnabled: false
            });
            miniGeometry.center();

            const edges = new THREE.EdgesGeometry(miniGeometry, 15);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.4
            });
            const miniMesh = new THREE.LineSegments(edges, lineMaterial);
            miniMesh.position.set(positions[i].x, positions[i].y, positions[i].z);
            miniMesh.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            miniMesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.005,
                    y: (Math.random() - 0.5) * 0.005,
                    z: (Math.random() - 0.5) * 0.005
                },
                floatSpeed: Math.random() * 0.3 + 0.3,
                floatOffset: Math.random() * Math.PI * 2,
                baseY: miniMesh.position.y
            };
            scene.add(miniMesh);
            miniCCCs.push(miniMesh);
        }
        window.miniCCCs = miniCCCs;
    });

    camera.position.z = 5;

    // Drag to rotate
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotationY = 0;
    let rotationX = 0;

    container.addEventListener('mousedown', function(e) {
        isDragging = true;
        previousMousePosition = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
        container.style.cursor = 'grab';
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging || !window.textMesh) return;

        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        rotationY += deltaX * 0.01;
        rotationX += deltaY * 0.01;
        rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, rotationX));

        window.textMesh.rotation.y = rotationY;
        window.textMesh.rotation.x = rotationX;

        previousMousePosition = { x: e.clientX, y: e.clientY };
    });


    container.style.cursor = 'grab';

    // Handle resize
    window.addEventListener('resize', function() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        // Animate floating wireframe CCCs
        if (window.miniCCCs) {
            window.miniCCCs.forEach((mini) => {
                mini.rotation.x += mini.userData.rotationSpeed.x;
                mini.rotation.y += mini.userData.rotationSpeed.y;
                mini.rotation.z += mini.userData.rotationSpeed.z;
                mini.position.y += Math.sin(time * mini.userData.floatSpeed + mini.userData.floatOffset) * 0.002;
            });
        }

        renderer.render(scene, camera);
    }
    animate();

    // Scroll-triggered fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const videoSections = document.querySelectorAll('.video-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
    videoSections.forEach(el => observer.observe(el));

    // Parallax effect on scroll - move camera to follow scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const scrollHint = document.querySelector('.scroll-hint');

        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 500);
        }

        if (scrollHint) {
            scrollHint.style.opacity = 1 - (scrolled / 300);
        }

        // Move camera down as user scrolls to keep CCCs visible
        camera.position.y = -scrolled * 0.005;
    });

});
