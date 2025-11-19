// Earth Visualization with Plotly.js
class EarthVisualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.isAnimating = true;
        this.debrisData = [];
        this.satelliteData = [];
        this.animationFrame = null;
        this.rotationAngle = 0;
        
        this.initializeVisualization();
    }
    
    initializeVisualization() {
        // Create 3D Earth visualization
        const earthData = this.createEarthSphere();
        const layout = this.createLayout();
        
        Plotly.newPlot(this.containerId, earthData, layout, {
            displayModeBar: false,
            responsive: true
        });
        
        this.startAnimation();
    }
    
    createEarthSphere() {
        // Create Earth sphere
        const phi = [];
        const theta = [];
        const x = [];
        const y = [];
        const z = [];
        
        for (let i = 0; i <= 50; i++) {
            for (let j = 0; j <= 50; j++) {
                const phiVal = (i / 50) * Math.PI;
                const thetaVal = (j / 50) * 2 * Math.PI;
                
                phi.push(phiVal);
                theta.push(thetaVal);
                
                x.push(Math.sin(phiVal) * Math.cos(thetaVal));
                y.push(Math.sin(phiVal) * Math.sin(thetaVal));
                z.push(Math.cos(phiVal));
            }
        }
        
        return [{
            type: 'scatter3d',
            mode: 'markers',
            x: x,
            y: y,
            z: z,
            marker: {
                size: 2,
                color: '#1e3a8a',
                opacity: 0.6
            },
            name: 'Earth',
            hoverinfo: 'skip'
        }];
    }
    
    createLayout() {
        return {
            scene: {
                xaxis: { visible: false, range: [-2, 2] },
                yaxis: { visible: false, range: [-2, 2] },
                zaxis: { visible: false, range: [-2, 2] },
                camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 },
                    center: { x: 0, y: 0, z: 0 }
                },
                bgcolor: 'rgba(0,0,0,0)',
                aspectmode: 'cube'
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { l: 0, r: 0, t: 0, b: 0 },
            showlegend: false
        };
    }
    
    updateData(debrisData, satelliteData) {
        this.debrisData = debrisData || [];
        this.satelliteData = satelliteData || [];
        this.renderObjects();
    }
    
    renderObjects() {
        const traces = [this.createEarthSphere()[0]];
        
        // Add debris objects
        if (this.debrisData.length > 0) {
            const debrisTrace = this.createDebrisTrace();
            traces.push(debrisTrace);
        }
        
        // Add satellites
        if (this.satelliteData.length > 0) {
            const satelliteTrace = this.createSatelliteTrace();
            traces.push(satelliteTrace);
        }
        
        // Add orbital paths
        const orbitalPaths = this.createOrbitalPaths();
        traces.push(...orbitalPaths);
        
        Plotly.react(this.containerId, traces, this.createLayout());
    }
    
    createDebrisTrace() {
        const x = [];
        const y = [];
        const z = [];
        const colors = [];
        const sizes = [];
        const texts = [];
        
        this.debrisData.forEach(debris => {
            const coords = this.latLonToCartesian(
                debris.latitude, 
                debris.longitude, 
                1 + (debris.altitude / 6371) // Earth radius normalization
            );
            
            x.push(coords.x);
            y.push(coords.y);
            z.push(coords.z);
            
            // Color based on risk level
            const riskColors = {
                'high': '#ff4444',
                'medium': '#ff8800',
                'low': '#ffaa00'
            };
            colors.push(riskColors[debris.risk_level] || '#ffaa00');
            
            sizes.push(Math.max(3, debris.size_estimate * 20));
            texts.push(`${debris.name}<br>Risk: ${debris.risk_level}<br>Alt: ${debris.altitude.toFixed(1)} km`);
        });
        
        return {
            type: 'scatter3d',
            mode: 'markers',
            x: x,
            y: y,
            z: z,
            marker: {
                size: sizes,
                color: colors,
                opacity: 0.8,
                symbol: 'diamond'
            },
            text: texts,
            hovertemplate: '%{text}<extra></extra>',
            name: 'Debris'
        };
    }
    
    createSatelliteTrace() {
        const x = [];
        const y = [];
        const z = [];
        const texts = [];
        
        this.satelliteData.forEach(satellite => {
            const coords = this.latLonToCartesian(
                satellite.latitude,
                satellite.longitude,
                1 + (satellite.altitude / 6371)
            );
            
            x.push(coords.x);
            y.push(coords.y);
            z.push(coords.z);
            
            texts.push(`${satellite.name}<br>Type: ${satellite.mission_type}<br>Alt: ${satellite.altitude.toFixed(1)} km`);
        });
        
        return {
            type: 'scatter3d',
            mode: 'markers',
            x: x,
            y: y,
            z: z,
            marker: {
                size: 8,
                color: '#00ff88',
                opacity: 0.9,
                symbol: 'square'
            },
            text: texts,
            hovertemplate: '%{text}<extra></extra>',
            name: 'Satellites'
        };
    }
    
    createOrbitalPaths() {
        const paths = [];
        
        // Create sample orbital paths
        for (let i = 0; i < 3; i++) {
            const path = this.generateOrbitalPath(1.2 + i * 0.1, i * 60);
            paths.push({
                type: 'scatter3d',
                mode: 'lines',
                x: path.x,
                y: path.y,
                z: path.z,
                line: {
                    color: `rgba(0, 212, 255, ${0.3 - i * 0.1})`,
                    width: 2
                },
                hoverinfo: 'skip',
                name: `Orbit ${i + 1}`
            });
        }
        
        return paths;
    }
    
    generateOrbitalPath(radius, inclination) {
        const points = 100;
        const x = [];
        const y = [];
        const z = [];
        
        const incRad = (inclination * Math.PI) / 180;
        
        for (let i = 0; i <= points; i++) {
            const theta = (i / points) * 2 * Math.PI;
            
            const xLocal = radius * Math.cos(theta);
            const yLocal = radius * Math.sin(theta) * Math.cos(incRad);
            const zLocal = radius * Math.sin(theta) * Math.sin(incRad);
            
            x.push(xLocal);
            y.push(yLocal);
            z.push(zLocal);
        }
        
        return { x, y, z };
    }
    
    latLonToCartesian(lat, lon, radius) {
        const latRad = (lat * Math.PI) / 180;
        const lonRad = (lon * Math.PI) / 180;
        
        return {
            x: radius * Math.cos(latRad) * Math.cos(lonRad),
            y: radius * Math.cos(latRad) * Math.sin(lonRad),
            z: radius * Math.sin(latRad)
        };
    }
    
    startAnimation() {
        if (!this.isAnimating) return;
        
        this.rotationAngle += 0.5;
        
        // Update camera rotation
        const camera = {
            eye: {
                x: 2 * Math.cos(this.rotationAngle * Math.PI / 180),
                y: 2 * Math.sin(this.rotationAngle * Math.PI / 180),
                z: 1.5
            },
            center: { x: 0, y: 0, z: 0 }
        };
        
        Plotly.relayout(this.containerId, { 'scene.camera': camera });
        
        this.animationFrame = requestAnimationFrame(() => this.startAnimation());
    }
    
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    toggleAnimation() {
        if (this.isAnimating) {
            this.stopAnimation();
        } else {
            this.isAnimating = true;
            this.startAnimation();
        }
        return this.isAnimating;
    }
    
    resetView() {
        this.rotationAngle = 0;
        const camera = {
            eye: { x: 1.5, y: 1.5, z: 1.5 },
            center: { x: 0, y: 0, z: 0 }
        };
        Plotly.relayout(this.containerId, { 'scene.camera': camera });
    }
}

// Initialize when DOM is loaded
let earthViz;
document.addEventListener('DOMContentLoaded', function() {
    earthViz = new EarthVisualization('earthVisualization');
    
    // Control buttons
    document.getElementById('toggleAnimation')?.addEventListener('click', function() {
        const isAnimating = earthViz.toggleAnimation();
        const icon = this.querySelector('i');
        icon.className = isAnimating ? 'fas fa-pause' : 'fas fa-play';
    });
    
    document.getElementById('resetView')?.addEventListener('click', function() {
        earthViz.resetView();
    });
});