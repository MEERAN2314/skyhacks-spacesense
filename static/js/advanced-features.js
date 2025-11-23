// Advanced Features for SpaceSense Pro

class AdvancedFeatures {
    constructor() {
        this.heatmapData = [];
        this.timelineEvents = [];
        this.satelliteTracking = [];
        this.performanceMetrics = {
            fps: 60,
            latency: 0,
            objectsTracked: 0,
            updateRate: 0
        };
        
        this.initialize();
    }
    
    initialize() {
        this.createShootingStars();
        this.initializeHeatmap();
        this.initializeTimeline();
        this.initializeSatelliteTracker();
        this.startPerformanceMonitoring();
        this.setupAdvancedControls();
    }
    
    // Shooting Stars Effect
    createShootingStars() {
        const container = document.querySelector('.space-background');
        if (!container) return;
        
        const shootingStarsContainer = document.createElement('div');
        shootingStarsContainer.className = 'shooting-stars';
        container.appendChild(shootingStarsContainer);
        
        setInterval(() => {
            const star = document.createElement('div');
            star.className = 'shooting-star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 50}%`;
            star.style.animationDelay = `${Math.random() * 2}s`;
            star.style.animationDuration = `${2 + Math.random() * 2}s`;
            
            shootingStarsContainer.appendChild(star);
            
            setTimeout(() => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            }, 4000);
        }, 3000);
    }
    
    // Orbital Debris Heatmap
    initializeHeatmap() {
        const heatmapContainer = document.getElementById('debrisHeatmap');
        if (!heatmapContainer) return;
        
        // Generate heatmap data
        const altitudes = [];
        const densities = [];
        const colors = [];
        
        for (let i = 200; i <= 2000; i += 50) {
            altitudes.push(i);
            const density = this.calculateDebrisDensity(i);
            densities.push(density);
            colors.push(this.getHeatmapColor(density));
        }
        
        const data = [{
            x: altitudes,
            y: densities,
            type: 'bar',
            marker: {
                color: colors,
                line: {
                    color: 'rgba(0, 212, 255, 0.5)',
                    width: 1
                }
            },
            hovertemplate: 'Altitude: %{x} km<br>Density: %{y:.4f} obj/km³<extra></extra>'
        }];
        
        const layout = {
            title: {
                text: 'Debris Density by Altitude',
                font: { color: '#00d4ff', size: 14 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
                title: 'Altitude (km)',
                color: '#b0b0b0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis: {
                title: 'Density (objects/km³)',
                color: '#b0b0b0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            margin: { l: 50, r: 20, t: 40, b: 40 }
        };
        
        Plotly.newPlot(heatmapContainer, data, layout, {
            displayModeBar: false,
            responsive: true
        });
    }
    
    calculateDebrisDensity(altitude) {
        // Simulate debris density with realistic distribution
        // Peak density around 800-1000 km (LEO congestion)
        const peak = 900;
        const spread = 300;
        const baseDensity = 0.001;
        const peakDensity = 0.05;
        
        const distance = Math.abs(altitude - peak);
        const density = baseDensity + (peakDensity - baseDensity) * Math.exp(-(distance * distance) / (2 * spread * spread));
        
        return density + Math.random() * 0.005;
    }
    
    getHeatmapColor(density) {
        if (density > 0.03) return '#f44336';
        if (density > 0.02) return '#ff9800';
        if (density > 0.01) return '#ffeb3b';
        return '#4caf50';
    }
    
    // Event Timeline
    initializeTimeline() {
        this.timelineEvents = [
            {
                time: new Date(Date.now() - 3600000).toISOString(),
                title: 'High-Risk Conjunction Detected',
                description: 'SAT-4521 and DEB-8932 close approach',
                type: 'alert'
            },
            {
                time: new Date(Date.now() - 7200000).toISOString(),
                title: 'Orbital Maneuver Completed',
                description: 'ISS debris avoidance maneuver successful',
                type: 'success'
            },
            {
                time: new Date(Date.now() - 10800000).toISOString(),
                title: 'New Debris Detected',
                description: '15 new fragments tracked in LEO',
                type: 'warning'
            },
            {
                time: new Date(Date.now() - 14400000).toISOString(),
                title: 'Satellite Launch',
                description: 'Starlink batch deployed successfully',
                type: 'info'
            }
        ];
        
        this.renderTimeline();
    }
    
    renderTimeline() {
        const container = document.getElementById('eventTimeline');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.timelineEvents.forEach((event, index) => {
            const item = document.createElement('div');
            item.className = 'timeline-item animate-slide-in-left';
            item.style.animationDelay = `${index * 0.1}s`;
            
            const typeColors = {
                alert: '#f44336',
                warning: '#ff9800',
                success: '#4caf50',
                info: '#00d4ff'
            };
            
            item.innerHTML = `
                <div class="timeline-dot" style="background: ${typeColors[event.type]}; box-shadow: 0 0 10px ${typeColors[event.type]}"></div>
                <div class="timeline-content">
                    <div class="timeline-time">${this.formatTimeAgo(event.time)}</div>
                    <div class="timeline-title">${event.title}</div>
                    <div class="timeline-description">${event.description}</div>
                </div>
            `;
            
            container.appendChild(item);
        });
    }
    
    formatTimeAgo(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        
        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${Math.floor(diffHours / 24)} days ago`;
    }
    
    // Satellite Tracker
    initializeSatelliteTracker() {
        this.satelliteTracking = [
            { name: 'ISS (ZARYA)', type: 'crewed_station', altitude: 408, velocity: 7.66, status: 'active' },
            { name: 'HUBBLE SPACE TELESCOPE', type: 'science', altitude: 547, velocity: 7.59, status: 'active' },
            { name: 'STARLINK-1007', type: 'communication', altitude: 550, velocity: 7.58, status: 'active' },
            { name: 'GPS BIIA-21', type: 'navigation', altitude: 20200, velocity: 3.87, status: 'active' },
            { name: 'GOES-16', type: 'weather', altitude: 35786, velocity: 3.07, status: 'active' }
        ];
        
        this.renderSatelliteTracker();
    }
    
    renderSatelliteTracker() {
        const container = document.getElementById('satelliteList');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.satelliteTracking.forEach((satellite, index) => {
            const item = document.createElement('div');
            item.className = 'satellite-item animate-fade-in';
            item.style.animationDelay = `${index * 0.1}s`;
            
            const icons = {
                crewed_station: 'fa-space-station',
                science: 'fa-telescope',
                communication: 'fa-satellite-dish',
                navigation: 'fa-location-dot',
                weather: 'fa-cloud-sun'
            };
            
            item.innerHTML = `
                <div class="satellite-icon">
                    <i class="fas ${icons[satellite.type] || 'fa-satellite'}"></i>
                </div>
                <div class="satellite-info">
                    <div class="satellite-name">${satellite.name}</div>
                    <div class="satellite-details">
                        Alt: ${satellite.altitude.toFixed(0)} km | 
                        Vel: ${satellite.velocity.toFixed(2)} km/s
                    </div>
                </div>
                <div class="satellite-status"></div>
            `;
            
            item.addEventListener('click', () => {
                this.focusOnSatellite(satellite);
            });
            
            container.appendChild(item);
        });
    }
    
    focusOnSatellite(satellite) {
        console.log('Focusing on satellite:', satellite.name);
        // Trigger Earth visualization to focus on this satellite
        if (window.earthViz) {
            // Add focus functionality to earth viz
            this.showNotification(`Tracking ${satellite.name}`, 'info');
        }
    }
    
    // Performance Monitoring
    startPerformanceMonitoring() {
        let lastTime = performance.now();
        let frames = 0;
        
        const updateMetrics = () => {
            frames++;
            const currentTime = performance.now();
            const elapsed = currentTime - lastTime;
            
            if (elapsed >= 1000) {
                this.performanceMetrics.fps = Math.round((frames * 1000) / elapsed);
                this.performanceMetrics.latency = Math.round(elapsed / frames);
                frames = 0;
                lastTime = currentTime;
                
                this.updatePerformanceDisplay();
            }
            
            requestAnimationFrame(updateMetrics);
        };
        
        updateMetrics();
    }
    
    updatePerformanceDisplay() {
        const container = document.getElementById('performanceMetrics');
        if (!container) return;
        
        container.innerHTML = `
            <div class="metric-item">
                <div class="metric-value">${this.performanceMetrics.fps}</div>
                <div class="metric-label">FPS</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${this.performanceMetrics.latency}ms</div>
                <div class="metric-label">Latency</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${this.performanceMetrics.objectsTracked}</div>
                <div class="metric-label">Objects</div>
            </div>
            <div class="metric-item">
                <div class="metric-value">${this.performanceMetrics.updateRate}/s</div>
                <div class="metric-label">Updates</div>
            </div>
        `;
    }
    
    // Advanced Controls
    setupAdvancedControls() {
        // Search functionality
        const searchInput = document.getElementById('satelliteSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterSatellites(e.target.value);
            });
        }
        
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.applyFilter(btn.dataset.filter);
            });
        });
    }
    
    filterSatellites(query) {
        const items = document.querySelectorAll('.satellite-item');
        const lowerQuery = query.toLowerCase();
        
        items.forEach(item => {
            const name = item.querySelector('.satellite-name').textContent.toLowerCase();
            if (name.includes(lowerQuery)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    applyFilter(filter) {
        console.log('Applying filter:', filter);
        // Implement filter logic based on satellite type, risk level, etc.
    }
    
    showNotification(message, type = 'info') {
        if (window.wsClient) {
            window.wsClient.showNotification(message, type);
        }
    }
    
    // Add new timeline event
    addTimelineEvent(event) {
        this.timelineEvents.unshift(event);
        if (this.timelineEvents.length > 10) {
            this.timelineEvents.pop();
        }
        this.renderTimeline();
    }
    
    // Update performance metrics
    updateMetrics(metrics) {
        Object.assign(this.performanceMetrics, metrics);
        this.updatePerformanceDisplay();
    }
}

// Initialize advanced features
window.advancedFeatures = null;

document.addEventListener('DOMContentLoaded', function() {
    // Wait for other components to load
    setTimeout(() => {
        window.advancedFeatures = new AdvancedFeatures();
    }, 1000);
});
