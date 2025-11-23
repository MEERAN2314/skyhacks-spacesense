// Enhanced 3D Earth Visualization with Advanced Features

class Enhanced3DEarth {
    constructor(containerId) {
        this.containerId = containerId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.clouds = null;
        this.atmosphere = null;
        this.satellites = [];
        this.debris = [];
        this.orbitalPaths = [];
        this.animationId = null;
        this.isAnimating = true;
        this.rotationSpeed = 0.001;
        this.zoomLevel = 2.5;
        this.selectedObject = null;
        this.trails = [];
        this.labels = [];
        
        this.initialize();
    }
    
    initialize() {
        // Check if Three.js is available
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded, falling back to Plotly');
            return;
        }
        
        this.setupScene();
        this.createEarth();
        this.createAtmosphere();
        this.createStarfield();
        this.setupLighting();
        this.setupControls();
        this.animate();
        this.setupEventListeners();
    }
    
    setupScene() {
        const container = document.getElementById(this.containerId);
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        // Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.00000025);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
        this.camera.position.set(0, 0, this.zoomLevel);
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
    }
    
    createEarth() {
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Earth texture (using procedural generation)
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        // Create gradient for ocean
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#1a237e');
        gradient.addColorStop(0.5, '#0d47a1');
        gradient.addColorStop(1, '#01579b');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add continents (simplified)
        ctx.fillStyle = '#2e7d32';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 200 + 50;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            bumpScale: 0.05,
            specular: new THREE.Color(0x333333),
            shininess: 15
        });
        
        this.earth = new THREE.Mesh(geometry, material);
        this.earth.castShadow = true;
        this.earth.receiveShadow = true;
        this.scene.add(this.earth);
        
        // Add clouds layer
        this.createClouds();
    }
    
    createClouds() {
        const geometry = new THREE.SphereGeometry(1.01, 64, 64);
        
        // Create cloud texture
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add cloud patches
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 100 + 30;
            const opacity = Math.random() * 0.5 + 0.3;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            transparent: true,
            opacity: 0.4,
            depthWrite: false
        });
        
        this.clouds = new THREE.Mesh(geometry, material);
        this.scene.add(this.clouds);
    }
    
    createAtmosphere() {
        const geometry = new THREE.SphereGeometry(1.15, 64, 64);
        const material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        
        this.atmosphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.atmosphere);
    }
    
    createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];
        
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            vertices.push(x, y, z);
            
            const color = new THREE.Color();
            color.setHSL(Math.random() * 0.2 + 0.5, 0.5, Math.random() * 0.5 + 0.5);
            colors.push(color.r, color.g, color.b);
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });
        
        const stars = new THREE.Points(geometry, material);
        this.scene.add(stars);
    }
    
    setupLighting() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambient);
        
        // Sun light
        const sun = new THREE.DirectionalLight(0xffffff, 1);
        sun.position.set(5, 3, 5);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        this.scene.add(sun);
        
        // Hemisphere light
        const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
        this.scene.add(hemiLight);
    }
    
    setupControls() {
        // Mouse controls for rotation
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        this.renderer.domElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        this.renderer.domElement.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;
                
                this.earth.rotation.y += deltaX * 0.005;
                this.earth.rotation.x += deltaY * 0.005;
                
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        this.renderer.domElement.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        // Zoom with mouse wheel
        this.renderer.domElement.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY * 0.001;
            this.zoomLevel = Math.max(1.5, Math.min(10, this.zoomLevel + delta));
            this.camera.position.z = this.zoomLevel;
        });
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => {
            const container = document.getElementById(this.containerId);
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }
    
    addSatellite(data) {
        const geometry = new THREE.SphereGeometry(0.01, 16, 16);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00ff88,
            emissive: 0x00ff88,
            emissiveIntensity: 0.5
        });
        
        const satellite = new THREE.Mesh(geometry, material);
        
        // Convert lat/lon to 3D position
        const phi = (90 - data.latitude) * Math.PI / 180;
        const theta = (data.longitude + 180) * Math.PI / 180;
        const radius = 1 + (data.altitude / 6371) * 0.3;
        
        satellite.position.x = -radius * Math.sin(phi) * Math.cos(theta);
        satellite.position.y = radius * Math.cos(phi);
        satellite.position.z = radius * Math.sin(phi) * Math.sin(theta);
        
        satellite.userData = data;
        this.satellites.push(satellite);
        this.scene.add(satellite);
        
        // Add glow effect
        this.addGlow(satellite, 0x00ff88);
    }
    
    addDebris(data) {
        const geometry = new THREE.SphereGeometry(0.005, 8, 8);
        const color = data.risk_level === 'high' ? 0xff4444 : 
                     data.risk_level === 'medium' ? 0xff8800 : 0xffaa00;
        
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            emissive: color,
            emissiveIntensity: 0.3
        });
        
        const debris = new THREE.Mesh(geometry, material);
        
        // Convert lat/lon to 3D position
        const phi = (90 - data.latitude) * Math.PI / 180;
        const theta = (data.longitude + 180) * Math.PI / 180;
        const radius = 1 + (data.altitude / 6371) * 0.3;
        
        debris.position.x = -radius * Math.sin(phi) * Math.cos(theta);
        debris.position.y = radius * Math.cos(phi);
        debris.position.z = radius * Math.sin(phi) * Math.sin(theta);
        
        debris.userData = data;
        this.debris.push(debris);
        this.scene.add(debris);
    }
    
    addGlow(object, color) {
        const glowGeometry = new THREE.SphereGeometry(0.015, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        object.add(glow);
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Rotate Earth
        if (this.earth) {
            this.earth.rotation.y += this.rotationSpeed;
        }
        
        // Rotate clouds slightly faster
        if (this.clouds) {
            this.clouds.rotation.y += this.rotationSpeed * 1.1;
        }
        
        // Pulse satellites
        this.satellites.forEach((sat, i) => {
            const scale = 1 + Math.sin(Date.now() * 0.003 + i) * 0.2;
            sat.scale.set(scale, scale, scale);
        });
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    updateData(debrisData, satelliteData) {
        // Clear existing objects
        this.satellites.forEach(sat => this.scene.remove(sat));
        this.debris.forEach(deb => this.scene.remove(deb));
        this.satellites = [];
        this.debris = [];
        
        // Add new data
        debrisData.forEach(data => this.addDebris(data));
        satelliteData.forEach(data => this.addSatellite(data));
    }
    
    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        if (this.isAnimating) {
            this.animate();
        }
        return this.isAnimating;
    }
    
    zoomIn() {
        this.zoomLevel = Math.max(1.5, this.zoomLevel - 0.5);
        this.camera.position.z = this.zoomLevel;
    }
    
    zoomOut() {
        this.zoomLevel = Math.min(10, this.zoomLevel + 0.5);
        this.camera.position.z = this.zoomLevel;
    }
    
    resetView() {
        this.zoomLevel = 2.5;
        this.camera.position.set(0, 0, this.zoomLevel);
        this.earth.rotation.set(0, 0, 0);
    }
}

// Initialize enhanced 3D Earth if Three.js is available
if (typeof THREE !== 'undefined') {
    window.enhanced3DEarth = new Enhanced3DEarth('earthVisualization');
}
