// Dashboard Manager
class DashboardManager {
    constructor() {
        this.isInitialized = false;
        this.aiInsightsCache = null;
        this.lastUpdateTime = null;
        this.autoRefreshEnabled = false;
        this.autoRefreshInterval = null;
        
        this.initialize();
    }
    
    async initialize() {
        console.log('🚀 Initializing SpaceSense Lite Dashboard...');
        
        try {
            // Show loading overlay
            this.showLoading(true);
            
            // Initialize components
            await this.loadInitialData();
            await this.loadAIInsights();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Hide loading overlay
            setTimeout(() => {
                this.showLoading(false);
                this.isInitialized = true;
                console.log('✅ Dashboard initialized successfully');
            }, 2000);
            
        } catch (error) {
            console.error('❌ Dashboard initialization failed:', error);
            this.showError('Failed to initialize dashboard');
        }
    }
    
    async loadInitialData() {
        try {
            // Load debris data
            const debrisResponse = await fetch('/api/debris/live');
            const debrisData = await debrisResponse.json();
            
            // Load risk analysis
            const riskResponse = await fetch('/api/risk/analysis');
            const riskData = await riskResponse.json();
            
            // Load satellites
            const satelliteResponse = await fetch('/api/satellites/tracked');
            const satelliteData = await satelliteResponse.json();
            
            // Update dashboard
            this.updateStats(riskData);
            this.updateConjunctions(riskData.critical_conjunctions);
            
            // Update Earth visualization
            if (window.earthViz) {
                console.log('Loading initial data for Earth viz:', {
                    debris: debrisData.debris?.length || 0,
                    satellites: satelliteData.satellites?.length || 0
                });
                window.earthViz.updateData(debrisData.debris || [], satelliteData.satellites || []);
            }
            
        } catch (error) {
            console.error('Error loading initial data:', error);
            throw error;
        }
    }
    
    async loadAIInsights() {
        try {
            const response = await fetch('/api/ai/insights');
            const insights = await response.json();
            
            this.aiInsightsCache = insights;
            this.updateAIInsights(insights);
            
        } catch (error) {
            console.error('Error loading AI insights:', error);
            // Use fallback insights
            this.updateAIInsights({
                ai_analysis: "AI analysis temporarily unavailable. Using cached risk assessment data.",
                risk_predictions: [],
                confidence_score: 0.75
            });
        }
    }
    
    updateLiveData(data) {
        if (!this.isInitialized) return;
        
        this.lastUpdateTime = new Date();
        
        // Update stats with smooth animations
        if (data.risks) {
            this.updateStats(data.risks);
        }
        
        // Update conjunctions
        if (data.risks && data.risks.critical_conjunctions) {
            this.updateConjunctions(data.risks.critical_conjunctions);
        }
        
        // Update timestamp indicator
        this.updateLastUpdateIndicator();
    }
    
    updateStats(risks) {
        // Animate stat updates
        this.animateStatCard('totalObjects', risks.total_objects);
        this.animateStatCard('highRiskObjects', risks.high_risk_objects);
        this.animateStatCard('mediumRiskObjects', risks.medium_risk_objects);
        this.animateStatCard('activeAlerts', risks.active_alerts);
        
        // Update risk zones
        if (risks.risk_zones) {
            this.updateRiskZone('safeZoneCount', risks.risk_zones.safe, 'safe');
            this.updateRiskZone('watchZoneCount', risks.risk_zones.watch, 'watch');
            this.updateRiskZone('alertZoneCount', risks.risk_zones.alert, 'alert');
        }
        
        // Update collision probability
        if (risks.collision_probability) {
            this.updateProbabilityDisplay(risks.collision_probability);
        }
    }
    
    animateStatCard(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const card = element.closest('.stat-card');
        if (card) {
            // Add update animation
            card.classList.add('animate-bounce-in');
            setTimeout(() => {
                card.classList.remove('animate-bounce-in');
            }, 600);
        }
        
        // Animate number change
        const currentValue = parseInt(element.textContent) || 0;
        this.countUpAnimation(element, currentValue, newValue, 800);
    }
    
    countUpAnimation(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;
        
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + (difference * easeOutCubic));
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }
    
    updateRiskZone(elementId, count, riskLevel) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const zone = element.closest('.risk-zone');
        
        // Update count with animation
        this.countUpAnimation(element, parseInt(element.textContent) || 0, count, 600);
        
        // Add pulse animation based on risk level
        if (riskLevel === 'alert' && count > 0) {
            zone.classList.add('animate-heartbeat');
        } else {
            zone.classList.remove('animate-heartbeat');
        }
    }
    
    updateProbabilityDisplay(probabilities) {
        // 24 hour probability
        const prob24h = probabilities.next_24h * 100;
        this.updateProbabilityBar('prob24h', 'prob24hText', prob24h);
        
        // Weekly probability
        const probWeek = probabilities.next_week * 100;
        this.updateProbabilityBar('probWeek', 'probWeekText', probWeek);
    }
    
    updateProbabilityBar(barId, textId, percentage) {
        const bar = document.getElementById(barId);
        const text = document.getElementById(textId);
        
        if (bar && text) {
            // Animate bar width
            bar.style.transition = 'width 0.8s ease-out';
            bar.style.width = `${Math.min(percentage, 100)}%`;
            
            // Update text with animation
            text.textContent = `${percentage.toFixed(2)}%`;
            
            // Color coding
            if (percentage > 10) {
                bar.style.background = 'linear-gradient(90deg, var(--danger-color), #ff1744)';
            } else if (percentage > 5) {
                bar.style.background = 'linear-gradient(90deg, var(--warning-color), #ff6f00)';
            } else {
                bar.style.background = 'linear-gradient(90deg, var(--success-color), #2e7d32)';
            }
        }
    }
    
    updateConjunctions(conjunctions) {
        const container = document.getElementById('conjunctionsList');
        if (!container || !conjunctions) return;
        
        // Clear existing items with fade out
        const existingItems = container.querySelectorAll('.conjunction-item');
        existingItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate-fade-out');
            }, index * 50);
        });
        
        // Add new items after fade out
        setTimeout(() => {
            container.innerHTML = '';
            
            conjunctions.slice(0, 6).forEach((conjunction, index) => {
                const item = this.createConjunctionElement(conjunction);
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-slide-in-left');
                container.appendChild(item);
            });
        }, 300);
    }
    
    createConjunctionElement(conjunction) {
        const item = document.createElement('div');
        item.className = 'conjunction-item hover-lift';
        
        const riskClass = conjunction.risk_level;
        const timeUntil = this.formatTimeUntil(conjunction.time_of_closest_approach);
        const riskIcon = this.getRiskIcon(conjunction.risk_level);
        
        item.innerHTML = `
            <div class="conjunction-header">
                <span class="conjunction-id">
                    <i class="${riskIcon}"></i>
                    ${conjunction.id}
                </span>
                <span class="risk-badge ${riskClass}">${conjunction.risk_level.toUpperCase()}</span>
            </div>
            <div class="conjunction-details">
                <div><strong>Objects:</strong> ${conjunction.primary_object} ↔ ${conjunction.secondary_object}</div>
                <div><strong>Miss Distance:</strong> ${conjunction.miss_distance.toFixed(2)} km</div>
                <div><strong>Time to CA:</strong> ${timeUntil}</div>
                <div><strong>Collision Prob:</strong> ${(conjunction.collision_probability * 100).toFixed(4)}%</div>
                <div><strong>Rel. Velocity:</strong> ${conjunction.relative_velocity.toFixed(1)} km/s</div>
            </div>
        `;
        
        // Add click handler for details
        item.addEventListener('click', () => {
            this.showConjunctionDetails(conjunction);
        });
        
        return item;
    }
    
    getRiskIcon(riskLevel) {
        const icons = {
            'alert': 'fas fa-exclamation-triangle',
            'watch': 'fas fa-eye',
            'safe': 'fas fa-check-circle'
        };
        return icons[riskLevel] || 'fas fa-info-circle';
    }
    
    formatTimeUntil(isoString) {
        const targetTime = new Date(isoString);
        const now = new Date();
        const diffMs = targetTime - now;
        
        if (diffMs < 0) return 'Past event';
        
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }
    
    updateAIInsights(insights) {
        const analysisElement = document.getElementById('aiAnalysis');
        const predictionsElement = document.getElementById('aiPredictions');
        
        if (analysisElement) {
            analysisElement.innerHTML = `
                <div class="ai-text animate-fade-in">
                    <i class="fas fa-brain"></i>
                    ${insights.ai_analysis}
                </div>
                <div class="confidence-score">
                    Confidence: ${((insights.confidence_score || 0.75) * 100).toFixed(1)}%
                </div>
            `;
        }
        
        if (predictionsElement && insights.risk_predictions) {
            predictionsElement.innerHTML = '';
            
            insights.risk_predictions.forEach((prediction, index) => {
                const item = document.createElement('div');
                item.className = 'prediction-item animate-slide-in-right';
                item.style.animationDelay = `${index * 0.2}s`;
                
                item.innerHTML = `
                    <div class="prediction-header">
                        <span class="prediction-factor">${prediction.factor}</span>
                        <span class="impact-level impact-${prediction.impact_level}">${prediction.impact_level}</span>
                    </div>
                    <div class="prediction-details">
                        Probability: ${(prediction.probability * 100).toFixed(1)}% | 
                        Horizon: ${prediction.time_horizon}
                    </div>
                `;
                
                predictionsElement.appendChild(item);
            });
        }
    }
    
    showConjunctionDetails(conjunction) {
        // Create modal or detailed view
        console.log('Showing details for conjunction:', conjunction);
        // Implementation for detailed conjunction view
    }
    
    updateLastUpdateIndicator() {
        if (!this.lastUpdateTime) return;
        
        // Add a subtle indicator that data was updated
        const indicator = document.createElement('div');
        indicator.className = 'update-indicator animate-fade-in';
        indicator.innerHTML = `<i class="fas fa-sync-alt"></i> Updated ${this.lastUpdateTime.toLocaleTimeString()}`;
        
        // Remove existing indicator
        const existing = document.querySelector('.update-indicator');
        if (existing) {
            existing.remove();
        }
        
        // Add to navbar
        const navbar = document.querySelector('.nav-container');
        if (navbar) {
            navbar.appendChild(indicator);
            
            // Auto remove after 3 seconds
            setTimeout(() => {
                indicator.classList.add('animate-fade-out');
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                    }
                }, 300);
            }, 3000);
        }
    }
    
    setupEventListeners() {
        // Manual refresh button
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                await this.manualRefresh();
            });
        }
        
        // Auto-refresh toggle
        const autoRefreshBtn = document.getElementById('toggleAutoRefresh');
        if (autoRefreshBtn) {
            autoRefreshBtn.addEventListener('click', () => {
                this.toggleAutoRefresh();
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'r':
                        e.preventDefault();
                        this.loadInitialData();
                        break;
                    case 'f':
                        e.preventDefault();
                        // Toggle fullscreen for earth viz
                        break;
                    case '=':
                    case '+':
                        e.preventDefault();
                        if (window.earthViz) {
                            window.earthViz.zoomIn();
                        }
                        break;
                    case '-':
                        e.preventDefault();
                        if (window.earthViz) {
                            window.earthViz.zoomOut();
                        }
                        break;
                }
            }
            
            // Zoom shortcuts without Ctrl
            switch (e.key) {
                case '+':
                case '=':
                    if (e.target.tagName !== 'INPUT' && window.earthViz) {
                        e.preventDefault();
                        window.earthViz.zoomIn();
                    }
                    break;
                case '-':
                    if (e.target.tagName !== 'INPUT' && window.earthViz) {
                        e.preventDefault();
                        window.earthViz.zoomOut();
                    }
                    break;
            }
        });
        
        // Window resize handler
        window.addEventListener('resize', () => {
            // Trigger resize for Plotly
            if (window.earthViz) {
                setTimeout(() => {
                    Plotly.Plots.resize('earthVisualization');
                }, 100);
            }
        });
        
        // Mouse wheel zoom for Earth visualization
        const earthContainer = document.getElementById('earthVisualization');
        if (earthContainer) {
            earthContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (window.earthViz) {
                    if (e.deltaY < 0) {
                        window.earthViz.zoomIn();
                    } else {
                        window.earthViz.zoomOut();
                    }
                }
            }, { passive: false });
        }
    }
    
    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = show ? 'flex' : 'none';
        }
    }
    
    async manualRefresh() {
        const refreshBtn = document.getElementById('refreshData');
        
        try {
            // Show loading state
            if (refreshBtn) {
                refreshBtn.classList.add('loading');
                refreshBtn.disabled = true;
            }
            
            // Fetch fresh data
            const response = await fetch('/api/data/live-update');
            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }
            
            // Update dashboard with fresh data
            this.updateStats(data.risks);
            this.updateConjunctions(data.risks.critical_conjunctions);
            
            // Update Earth visualization
            if (window.earthViz) {
                window.earthViz.updateData(data.debris, []);
            }
            
            // Show success notification
            if (window.wsClient) {
                window.wsClient.showNotification('Data refreshed successfully!', 'success');
            }
            
            // Update last refresh time
            this.lastUpdateTime = new Date();
            this.updateLastUpdateIndicator();
            
        } catch (error) {
            console.error('Manual refresh failed:', error);
            if (window.wsClient) {
                window.wsClient.showNotification('Failed to refresh data', 'error');
            }
        } finally {
            // Remove loading state
            if (refreshBtn) {
                refreshBtn.classList.remove('loading');
                refreshBtn.disabled = false;
            }
        }
    }
    
    toggleAutoRefresh() {
        const autoRefreshBtn = document.getElementById('toggleAutoRefresh');
        
        if (this.autoRefreshEnabled) {
            // Disable auto-refresh
            this.autoRefreshEnabled = false;
            if (this.autoRefreshInterval) {
                clearInterval(this.autoRefreshInterval);
                this.autoRefreshInterval = null;
            }
            
            if (autoRefreshBtn) {
                autoRefreshBtn.classList.remove('active');
                autoRefreshBtn.querySelector('i').className = 'fas fa-play';
                autoRefreshBtn.title = 'Enable Auto-Refresh (60s)';
            }
            
            if (window.wsClient) {
                window.wsClient.showNotification('Auto-refresh disabled', 'info');
            }
        } else {
            // Enable auto-refresh
            this.autoRefreshEnabled = true;
            this.autoRefreshInterval = setInterval(() => {
                this.manualRefresh();
            }, 60000); // Refresh every 60 seconds
            
            if (autoRefreshBtn) {
                autoRefreshBtn.classList.add('active');
                autoRefreshBtn.querySelector('i').className = 'fas fa-pause';
                autoRefreshBtn.title = 'Disable Auto-Refresh';
            }
            
            if (window.wsClient) {
                window.wsClient.showNotification('Auto-refresh enabled (60s)', 'success');
            }
        }
    }
    
    showError(message) {
        console.error(message);
        // Show error notification
        if (window.wsClient) {
            window.wsClient.showNotification(message, 'error');
        }
    }
}

// Initialize dashboard manager
window.dashboardManager = null;

document.addEventListener('DOMContentLoaded', function() {
    window.dashboardManager = new DashboardManager();
    
    // Add some CSS for additional animations
    const style = document.createElement('style');
    style.textContent = `
        .live-update-pulse {
            animation: pulse 0.5s ease-in-out;
        }
        
        .animate-fade-out {
            animation: fadeOut 0.3s ease-out forwards;
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.95); }
        }
        
        .update-indicator {
            position: absolute;
            right: 200px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 212, 255, 0.2);
            border: 1px solid var(--primary-color);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.8rem;
            color: var(--primary-color);
        }
        
        .notification-container {
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .notification {
            background: var(--panel-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            min-width: 300px;
            backdrop-filter: blur(10px);
        }
        
        .notification-success { border-color: var(--success-color); }
        .notification-error { border-color: var(--danger-color); }
        .notification-warning { border-color: var(--warning-color); }
        .notification-info { border-color: var(--primary-color); }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            font-size: 1.2rem;
            margin-left: auto;
        }
        
        .animate-slide-out-right {
            animation: slideOutRight 0.3s ease-in forwards;
        }
        
        @keyframes slideOutRight {
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .confidence-score {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
            text-align: right;
        }
        
        .prediction-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.25rem;
        }
        
        .prediction-factor {
            font-weight: bold;
            font-size: 0.9rem;
        }
        
        .impact-level {
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: bold;
        }
        
        .impact-high { background: var(--danger-color); }
        .impact-medium { background: var(--warning-color); }
        .impact-low { background: var(--success-color); }
        
        .prediction-details {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }
    `;
    document.head.appendChild(style);
});