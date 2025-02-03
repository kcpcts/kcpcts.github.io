class ScrollingSphere {
    constructor() {
        this.container = document.getElementById('sphere-container');
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        
        // Create renderer with transparency
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        
        // Add rotation state tracking
        this.rotationState = {
            x: 0,
            y: 0,
            targetX: 0,
            targetY: 0,
            lastScrollPercent: 0
        };
        
        this.setupRenderer();
        this.createSphere();
        this.setupCamera();
        this.addEventListeners();
        this.animate();
    }

    setupRenderer() {
        this.renderer.setSize(40, 40);  // Match container size
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
    }

    createSphere() {
        // Create single wireframe sphere
        const geometry = new THREE.IcosahedronGeometry(2, 0);  // Low poly for clean lines
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,  // Pure white
            wireframe: true,
            transparent: true,
            opacity: 0.9,
            wireframeLinewidth: 2
        });
        
        this.sphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.sphere);
    }

    setupCamera() {
        this.camera.position.z = 6;
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('scroll', () => this.onScroll());
    }

    onWindowResize() {
        this.renderer.setSize(40, 40);  // Match container size
    }

    onScroll() {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Update target rotation based on scroll, maintaining continuous rotation
        this.rotationState.targetY = scrollPercent * Math.PI * 2;
        this.rotationState.targetX = scrollPercent * Math.PI;
        
        // Store last scroll position for smooth transitions
        this.rotationState.lastScrollPercent = scrollPercent;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Increase base rotation speed (from 0.002 to 0.01)
        this.rotationState.targetY += 0.01;
        
        // Smooth interpolation between current and target rotations
        this.rotationState.x += (this.rotationState.targetX - this.rotationState.x) * 0.1;
        this.rotationState.y += (this.rotationState.targetY - this.rotationState.y) * 0.1;
        
        // Apply rotations
        this.sphere.rotation.x = this.rotationState.x;
        this.sphere.rotation.y = this.rotationState.y;
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ScrollingSphere();
}); 