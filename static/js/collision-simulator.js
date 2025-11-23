// Real-Time Collision Simulator

class CollisionSimulator {
    constructor() {
        this.simulations = [];
        this.activeSimulation = null;
        this.simulationSpeed = 1;
        this.timeStep = 60; // seconds
        
        this.initialize();
    }
    
    initialize() {
        this.createSimulatorPanel();
        this.setupControls();
    }
    
    createSimulatorPanel() {
        const container = document.querySelector('.advanced-section .main-grid');
        if (!container) return;
        
        const panel = document.createElement('div');
        panel.className = 'panel simulator-panel animate-fade-in gradient-border';
        panel.innerHTML = `
            <div class="panel-header">
                <h2><i class="fas fa-atom"></i> Collision Simulator</h2>
                <div class="panel-controls">
                    <button class="btn-control" id="runSimulation" title="Run Simulation">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn-control" id="pauseSimulation" title="Pause">
                        <i class="fas fa-pause"></i>
                    </button>
                    <button class="btn-control" id="resetSimulation" title="Reset">
                        <i class="fas fa-redo"></i>
                    </button>
                </div>
            </div>
            <div class="simulator-content">
                <div class="simulator-controls">
                    <div class="control-group">
                        <label>Simulation Speed</label>
                        <input type="range" id="simSpeed" min="1" max="10" value="1" step="1">
                        <span id="simSpeedValue">1x</span>
                    </div>
                    <div class="control-group">
                        <label>Time Step</label>
                        <select id="timeStep">
                            <option value="60">1 minute</option>
                            <option value="300">5 minutes</option>
                            <option value="600">10 minutes</option>
                            <option value="3600">1 hour</option>
                        </select>
                    </div>
                </div>
                <div class="simulator-visualization" id="simulatorViz">
                    <canvas id="simulatorCanvas"></canvas>
                </div>
                <div class="simulator-stats" id="simulatorStats">
                    <div class="stat-item">
                        <span class="stat-label">Time Elapsed:</span>
                        <span class="stat-value" id="simTime">0h 0m</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Collisions Detected:</span>
                        <span class="stat-value" id="simCollisions">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Close Approaches:</span>
                        <span class="stat-value" id="simApproaches">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Debris Generated:</span>
                        <span class="stat-value" id="simDebris">0</span>
                    </div>
                </div>
                <div class="simulator-log" id="simulatorLog">
                    <h4><i class="fas fa-list"></i> Event Log</h4>
                    <div class="log-entries" id="logEntries"></div>
                </div>
            </div>
        `;
        
        container.appendChild(panel);
        
        this.setupCanvas();
    }
    
    setupCanvas() {
        const canvas = document.getElementById('simulatorCanvas');
        if (!canvas) return;
        
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = 400;
        
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Initial draw
        this.drawSimulation();
    }
    
    setupControls() {
        // Run simulation
        document.getElementById('runSimulation')?.addEventListener('click', () => {
            this.startSimulation();
        });
        
        // Pause simulation
        document.getElementById('pauseSimulation')?.addEventListener('click', () => {
            this.pauseSimulation();
        });
        
        // Reset simulation
        document.getElementById('resetSimulation')?.addEventListener('click', () => {
            this.resetSimulation();
        });
        
        // Speed control
        document.getElementById('simSpeed')?.addEventListener('input', (e) => {
            this.simulationSpeed = parseInt(e.target.value);
            document.getElementById('simSpeedValue').textContent = `${this.simulationSpeed}x`;
        });
        
        // Time step control
        document.getElementById('timeStep')?.addEventListener('change', (e) => {
            this.timeStep = parseInt(e.target.value);
        });
    }
    
    startSimulation() {
        if (this.activeSimulation) return;
        
        this.activeSimulation = {
            startTime: Date.now(),
            elapsedTime: 0,
            objects: this.generateSimulationObjects(),
            collisions: 0,
            approaches: 0,
            debrisGenerated: 0,
            events: []
        };
        
        this.addLogEntry('Simulation started', 'info');
        this.runSimulationLoop();
    }
    
    generateSimulationObjects() {
        const objects = [];
        
        // Generate random objects
        for (let i = 0; i < 20; i++) {
            objects.push({
                id: i,
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 5 + 2,
                type: Math.random() > 0.7 ? 'debris' : 'satellite',
                active: true
            });
        }
        
        return objects;
    }
    
    runSimulationLoop() {
        if (!this.activeSimulation) return;
        
        // Update simulation
        this.updateSimulation();
        
        // Draw
        this.drawSimulation();
        
        // Update stats
        this.updateStats();
        
        // Continue loop
        setTimeout(() => {
            requestAnimationFrame(() => this.runSimulationLoop());
        }, 1000 / (30 * this.simulationSpeed));
    }
    
    updateSimulation() {
        const sim = this.activeSimulation;
        sim.elapsedTime += this.timeStep * this.simulationSpeed;
        
        // Update object positions
        sim.objects.forEach(obj => {
            if (!obj.active) return;
            
            obj.x += obj.vx;
            obj.y += obj.vy;
            
            // Bounce off walls
            if (obj.x < 0 || obj.x > this.canvas.width) obj.vx *= -1;
            if (obj.y < 0 || obj.y > this.canvas.height) obj.vy *= -1;
        });
        
        // Check for collisions
        this.checkCollisions();
        
        // Check for close approaches
        this.checkCloseApproaches();
    }
    
    checkCollisions() {
        const sim = this.activeSimulation;
        const objects = sim.objects.filter(o => o.active);
        
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const obj1 = objects[i];
                const obj2 = objects[j];
                
                const dx = obj1.x - obj2.x;
                const dy = obj1.y - obj2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < obj1.radius + obj2.radius) {
                    // Collision detected!
                    sim.collisions++;
                    
                    // Generate debris
                    const debrisCount = Math.floor(Math.random() * 5) + 3;
                    sim.debrisGenerated += debrisCount;
                    
                    for (let k = 0; k < debrisCount; k++) {
                        sim.objects.push({
                            id: sim.objects.length,
                            x: (obj1.x + obj2.x) / 2,
                            y: (obj1.y + obj2.y) / 2,
                            vx: (Math.random() - 0.5) * 4,
                            vy: (Math.random() - 0.5) * 4,
                            radius: Math.random() * 2 + 1,
                            type: 'debris',
                            active: true
                        });
                    }
                    
                    // Deactivate collided objects
                    obj1.active = false;
                    obj2.active = false;
                    
                    this.addLogEntry(
                        `Collision: ${obj1.type} #${obj1.id} ↔ ${obj2.type} #${obj2.id} (${debrisCount} fragments)`,
                        'danger'
                    );
                    
                    // Play sound
                    if (window.soundEffects) {
                        window.soundEffects.playAlert();
                    }
                }
            }
        }
    }
    
    checkCloseApproaches() {
        const sim = this.activeSimulation;
        const objects = sim.objects.filter(o => o.active);
        const threshold = 20; // pixels
        
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                const obj1 = objects[i];
                const obj2 = objects[j];
                
                const dx = obj1.x - obj2.x;
                const dy = obj1.y - obj2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < threshold && distance > obj1.radius + obj2.radius) {
                    sim.approaches++;
                    
                    this.addLogEntry(
                        `Close approach: ${obj1.type} #${obj1.id} ↔ ${obj2.type} #${obj2.id} (${distance.toFixed(1)}px)`,
                        'warning'
                    );
                }
            }
        }
    }
    
    drawSimulation() {
        if (!this.ctx) return;
        
        // Clear canvas
        this.ctx.fillStyle = 'rgba(10, 10, 15, 0.95)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        if (!this.activeSimulation) {
            // Draw placeholder
            this.ctx.fillStyle = '#b0b0b0';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Click Run to start simulation', this.canvas.width / 2, this.canvas.height / 2);
            return;
        }
        
        // Draw objects
        this.activeSimulation.objects.forEach(obj => {
            if (!obj.active) return;
            
            // Draw object
            this.ctx.beginPath();
            this.ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
            
            if (obj.type === 'satellite') {
                this.ctx.fillStyle = '#00ff88';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ff88';
            } else {
                this.ctx.fillStyle = '#ff4444';
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = '#ff4444';
            }
            
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Draw velocity vector
            this.ctx.beginPath();
            this.ctx.moveTo(obj.x, obj.y);
            this.ctx.lineTo(obj.x + obj.vx * 10, obj.y + obj.vy * 10);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        });
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    updateStats() {
        if (!this.activeSimulation) return;
        
        const hours = Math.floor(this.activeSimulation.elapsedTime / 3600);
        const minutes = Math.floor((this.activeSimulation.elapsedTime % 3600) / 60);
        
        document.getElementById('simTime').textContent = `${hours}h ${minutes}m`;
        document.getElementById('simCollisions').textContent = this.activeSimulation.collisions;
        document.getElementById('simApproaches').textContent = this.activeSimulation.approaches;
        document.getElementById('simDebris').textContent = this.activeSimulation.debrisGenerated;
    }
    
    addLogEntry(message, type = 'info') {
        const container = document.getElementById('logEntries');
        if (!container) return;
        
        const entry = document.createElement('div');
        entry.className = `log-entry log-${type} smooth-fade-in-up`;
        
        const time = new Date().toLocaleTimeString();
        const icons = {
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle',
            danger: 'fa-times-circle',
            success: 'fa-check-circle'
        };
        
        entry.innerHTML = `
            <span class="log-time">${time}</span>
            <i class="fas ${icons[type]}"></i>
            <span class="log-message">${message}</span>
        `;
        
        container.insertBefore(entry, container.firstChild);
        
        // Keep only last 10 entries
        while (container.children.length > 10) {
            container.removeChild(container.lastChild);
        }
    }
    
    pauseSimulation() {
        this.activeSimulation = null;
        this.addLogEntry('Simulation paused', 'warning');
    }
    
    resetSimulation() {
        this.activeSimulation = null;
        this.drawSimulation();
        document.getElementById('logEntries').innerHTML = '';
        this.updateStats();
        this.addLogEntry('Simulation reset', 'info');
    }
}

// Initialize collision simulator
window.collisionSimulator = null;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.collisionSimulator = new CollisionSimulator();
    }, 2500);
});
