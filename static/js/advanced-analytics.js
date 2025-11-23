// Advanced Analytics Dashboard
class AdvancedAnalytics {
    constructor() {
        this.mlPredictions = null;
        this.notifications = [];
        this.trajectoryData = null;
        this.updateInterval = null;
        
        this.initialize();
    }
    
    async initialize() {
        console.log('📊 Initializing Advanced Analytics...');
        
        await this.loadAllAnalytics();
        this.setupAutoRefresh();
        this.setupEventListeners();
        
        console.log('✅ Advanced Analytics initialized');
    }
    
    async loadAllAnalytics() {
        try {
            // Load comprehensive analytics
            const response = await fetch('/api/analytics/comprehensive');
            const data = await response.json();
            
            this.updateAnalyticsDashboard(data);
            
            // Load ML model stats
            await this.loadMLStats();
            
            // Load notifications
            await this.loadNotifications();
            
            // Load trajectory statistics
            await this.loadTrajectoryStats();
            
        } catch (error) {
            console.error('Error loading analytics:', error);
        }
    }
    
    async loadMLStats() {
        try {
            const response = await fetch('/api/ml/model-stats');
            const stats = await response.json();
            
            this.mlPredictions = stats;
            this.displayMLStats(stats);
            
        } catch (error) {
            console.error('Error loading ML stats:', error);
        }
    }
    
    async loadNotifications() {
        try {
            const response = await fetch('/api/notifications/active');
            const data = await response.json();
            
            this.notifications = data.alerts || [];
            this.displayNotifications(this.notifications);
            
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }
    
    async loadTrajectoryStats() {
        try {
            const response = await fetch('/api/trajectory/statistics');
            const stats = await response.json();
            
            this.trajectoryData = stats;
            this.displayTrajectoryStats(stats);
            
        } catch (error) {
            console.error('Error loading trajectory stats:', error);
        }
    }
    
    updateAnalyticsDashboard(data) {
        // Update system health indicators
        if (data.system_health) {
            this.updateSystemHealth(data.system_health);
        }
        
        // Update debris tracking summary
        if (data.debris_tracking) {
            this.updateDebrisTracking(data.debris_tracking);
        }
        
        // Update risk analysis
        if (data.risk_analysis) {
            this.updateRiskAnalysis(data.risk_analysis);
        }
    }
    
    updateSystemHealth(health) {
        const healthContainer = document.getElementById('systemHealth');
        if (!healthContainer) return;
        
        const statusColor = health.status === 'operational' ? '#4caf50' : '#ff9800';
        
        healthContainer.innerHTML = `
            <div class="health-indicator" style="border-left: 4px solid ${statusColor}">
                <div class="health-item">
                    <i class="fas fa-heartbeat"></i>
                    <span>Status: ${health.status.toUpperCase()}</span>
                </div>
                <div class="health-item">
                    <i class="fas fa-clock"></i>
                    <span>Uptime: ${health.uptime_hours.toFixed(1)}h</span>
                </div>
                <div class="health-item">
                    <i class="fas fa-tachometer-alt"></i>
                    <span>Response: ${health.api_response_time_ms.toFixed(1)}ms</span>
                </div>
                <div class="health-item">
                    <i class="fas fa-sync"></i>
                    <span>Data Age: ${health.data_freshness_minutes.toFixed(1)}min</span>
                </div>
            </div>
        `;
    }
    
    updateDebrisTracking(tracking) {
        const container = document.getElementById('debrisTrackingSummary');
        if (!container) return;
        
        container.innerHTML = `
            <div class="tracking-summary">
                <div class="tracking-stat">
                    <h4>${tracking.total_objects}</h4>
                    <p>Total Objects</p>
                </div>
                <div class="tracking-stat high-risk">
                    <h4>${tracking.high_risk}</h4>
                    <p>High Risk</p>
                </div>
                <div class="tracking-stat medium-risk">
                    <h4>${tracking.medium_risk}</h4>
                    <p>Medium Risk</p>
                </div>
                <div class="tracking-stat low-risk">
                    <h4>${tracking.low_risk}</h4>
                    <p>Low Risk</p>
                </div>
            </div>
        `;
    }
    
    updateRiskAnalysis(risk) {
        // Update collision probability chart
        this.createCollisionProbabilityChart(risk.collision_probability);
    }
    
    displayMLStats(stats) {
        const container = document.getElementById('mlStatsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="ml-stats-grid">
                <div class="ml-stat-card">
                    <div class="ml-stat-icon">
                        <i class="fas fa-brain"></i>
                    </div>
                    <div class="ml-stat-content">
                        <h4>${(stats.accuracy * 100).toFixed(1)}%</h4>
                        <p>Model Accuracy</p>
                    </div>
                </div>
                <div class="ml-stat-card">
                    <div class="ml-stat-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="ml-stat-content">
                        <h4>${stats.training_samples}</h4>
                        <p>Training Samples</p>
                    </div>
                </div>
                <div class="ml-stat-card">
                    <div class="ml-stat-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="ml-stat-content">
                        <h4>${(stats.precision * 100).toFixed(1)}%</h4>
                        <p>Precision</p>
                    </div>
                </div>
                <div class="ml-stat-card">
                    <div class="ml-stat-icon">
                        <i class="fas fa-bullseye"></i>
                    </div>
                    <div class="ml-stat-content">
                        <h4>${(stats.f1_score * 100).toFixed(1)}%</h4>
                        <p>F1 Score</p>
                    </div>
                </div>
            </div>
            <div class="ml-features">
                <h5>Features Used:</h5>
                <div class="feature-tags">
                    ${stats.features_used.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
            </div>
        `;
    }
    
    displayNotifications(notifications) {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        if (notifications.length === 0) {
            container.innerHTML = '<p class="no-notifications">No active notifications</p>';
            return;
        }
        
        const notificationHTML = notifications.map(notif => {
            const priorityClass = `priority-${notif.priority}`;
            const icon = this.getNotificationIcon(notif.type);
            
            return `
                <div class="notification-card ${priorityClass}" data-id="${notif.id}">
                    <div class="notification-header">
                        <i class="${icon}"></i>
                        <span class="notification-title">${notif.title}</span>
                        <span class="notification-priority">${notif.priority}</span>
                    </div>
                    <div class="notification-body">
                        <p>${notif.message}</p>
                        <span class="notification-time">${this.formatTime(notif.created_at)}</span>
                    </div>
                    <div class="notification-actions">
                        <button class="btn-acknowledge" onclick="advancedAnalytics.acknowledgeNotification('${notif.id}')">
                            <i class="fas fa-check"></i> Acknowledge
                        </button>
                        <button class="btn-dismiss" onclick="advancedAnalytics.dismissNotification('${notif.id}')">
                            <i class="fas fa-times"></i> Dismiss
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = notificationHTML;
    }
    
    displayTrajectoryStats(stats) {
        const container = document.getElementById('trajectoryStatsContainer');
        if (!container) return;
        
        container.innerHTML = `
            <div class="trajectory-stats-grid">
                <div class="trajectory-stat">
                    <i class="fas fa-rocket"></i>
                    <h4>${stats.total_maneuvers || 0}</h4>
                    <p>Total Maneuvers</p>
                </div>
                <div class="trajectory-stat">
                    <i class="fas fa-tachometer-alt"></i>
                    <h4>${stats.average_delta_v || 0} m/s</h4>
                    <p>Avg Delta-V</p>
                </div>
                <div class="trajectory-stat">
                    <i class="fas fa-gas-pump"></i>
                    <h4>${stats.total_fuel_used_kg || 0} kg</h4>
                    <p>Total Fuel Used</p>
                </div>
                <div class="trajectory-stat">
                    <i class="fas fa-percentage"></i>
                    <h4>${(stats.average_confidence * 100 || 0).toFixed(1)}%</h4>
                    <p>Avg Confidence</p>
                </div>
            </div>
        `;
    }
    
    async acknowledgeNotification(alertId) {
        try {
            const response = await fetch(`/api/notifications/acknowledge/${alertId}`, {
                method: 'POST'
            });
            const result = await response.json();
            
            if (result.success) {
                this.showToast('Notification acknowledged', 'success');
                await this.loadNotifications();
            }
        } catch (error) {
            console.error('Error acknowledging notification:', error);
            this.showToast('Failed to acknowledge notification', 'error');
        }
    }
    
    async dismissNotification(alertId) {
        try {
            const response = await fetch(`/api/notifications/dismiss/${alertId}`, {
                method: 'POST'
            });
            const result = await response.json();
            
            if (result.success) {
                this.showToast('Notification dismissed', 'success');
                await this.loadNotifications();
            }
        } catch (error) {
            console.error('Error dismissing notification:', error);
            this.showToast('Failed to dismiss notification', 'error');
        }
    }
    
    async predictCollision(missDistance, relativeVelocity, altitude, objectSize) {
        try {
            const response = await fetch(
                `/api/ml/predict-collision?miss_distance=${missDistance}&relative_velocity=${relativeVelocity}&altitude=${altitude}&object_size=${objectSize}`
            );
            const prediction = await response.json();
            
            this.displayCollisionPrediction(prediction);
            return prediction;
            
        } catch (error) {
            console.error('Error predicting collision:', error);
            return null;
        }
    }
    
    displayCollisionPrediction(prediction) {
        const container = document.getElementById('collisionPredictionResult');
        if (!container) return;
        
        const riskColor = this.getRiskColor(prediction.risk_level);
        
        container.innerHTML = `
            <div class="prediction-result" style="border-left: 4px solid ${riskColor}">
                <h4>Collision Prediction</h4>
                <div class="prediction-details">
                    <div class="prediction-item">
                        <span>Probability:</span>
                        <strong>${(prediction.probability * 100).toFixed(4)}%</strong>
                    </div>
                    <div class="prediction-item">
                        <span>Confidence:</span>
                        <strong>${(prediction.confidence * 100).toFixed(2)}%</strong>
                    </div>
                    <div class="prediction-item">
                        <span>Risk Level:</span>
                        <strong style="color: ${riskColor}">${prediction.risk_level.toUpperCase()}</strong>
                    </div>
                </div>
                <div class="contributing-factors">
                    <h5>Contributing Factors:</h5>
                    <ul>
                        ${prediction.contributing_factors.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    createCollisionProbabilityChart(probabilities) {
        const container = document.getElementById('collisionProbabilityChart');
        if (!container) return;
        
        const data = [{
            x: ['Next 24h', 'Next Week', 'Next Month'],
            y: [
                probabilities.next_24h * 100,
                probabilities.next_week * 100,
                probabilities.next_month * 100
            ],
            type: 'bar',
            marker: {
                color: ['#ff6b35', '#ff9800', '#ffc107']
            }
        }];
        
        const layout = {
            title: 'Collision Probability Forecast',
            yaxis: { title: 'Probability (%)' },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            font: { color: '#ffffff' }
        };
        
        Plotly.newPlot(container, data, layout, { responsive: true });
    }
    
    getNotificationIcon(type) {
        const icons = {
            'critical_conjunction': 'fas fa-exclamation-triangle',
            'high_collision_probability': 'fas fa-radiation',
            'high_risk_debris': 'fas fa-meteor',
            'satellite_maneuver': 'fas fa-rocket',
            'new_debris_detected': 'fas fa-satellite-dish'
        };
        return icons[type] || 'fas fa-bell';
    }
    
    getRiskColor(riskLevel) {
        const colors = {
            'critical': '#d32f2f',
            'high': '#ff6b35',
            'medium': '#ff9800',
            'low': '#4caf50'
        };
        return colors[riskLevel] || '#757575';
    }
    
    formatTime(isoString) {
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    }
    
    showToast(message, type = 'info') {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    setupAutoRefresh() {
        // Refresh analytics every 30 seconds
        this.updateInterval = setInterval(() => {
            this.loadAllAnalytics();
        }, 30000);
    }
    
    setupEventListeners() {
        // Add event listeners for interactive elements
        document.addEventListener('DOMContentLoaded', () => {
            const predictBtn = document.getElementById('runMLPrediction');
            if (predictBtn) {
                predictBtn.addEventListener('click', () => this.runMLPredictionDemo());
            }
        });
    }
    
    async runMLPredictionDemo() {
        // Demo prediction with sample values
        await this.predictCollision(8.5, 12.3, 550, 0.8);
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Initialize on page load
let advancedAnalytics;
document.addEventListener('DOMContentLoaded', () => {
    advancedAnalytics = new AdvancedAnalytics();
});
