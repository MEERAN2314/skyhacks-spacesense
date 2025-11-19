// WebSocket Client for Real-time Updates
class WebSocketClient {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.isConnected = false;
        
        this.connect();
    }
    
    connect() {
        try {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/ws`;
            
            this.ws = new WebSocket(wsUrl);
            
            this.ws.onopen = () => {
                console.log('✅ WebSocket connected');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.updateConnectionStatus(true);
                this.showNotification('Connected to SpaceSense Lite', 'success');
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.handleMessage(data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('❌ WebSocket disconnected');
                this.isConnected = false;
                this.updateConnectionStatus(false);
                this.attemptReconnect();
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.showNotification('Connection error', 'error');
            };
            
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.attemptReconnect();
        }
    }
    
    handleMessage(data) {
        switch (data.type) {
            case 'initial_data':
                this.handleLiveUpdate(data);
                break;
            case 'live_update':
                this.handleLiveUpdate(data);
                break;
            case 'status_update':
                this.handleStatusUpdate(data);
                break;
            case 'alert':
                this.handleAlert(data);
                break;
            case 'system_status':
                this.handleSystemStatus(data);
                break;
            default:
                console.log('Unknown message type:', data.type);
        }
    }
    
    handleLiveUpdate(data) {
        // Update dashboard with live data
        if (window.dashboardManager) {
            window.dashboardManager.updateLiveData(data);
        }
        
        // Update Earth visualization
        if (window.earthViz) {
            window.earthViz.updateData(data.debris, data.satellites);
        }
        
        // Update stats
        this.updateStats(data.risks);
        
        // Update conjunctions
        this.updateConjunctions(data.risks.critical_conjunctions);
        
        // Add subtle animation to indicate live update
        this.animateUpdate();
    }
    
    handleAlert(data) {
        this.showNotification(data.message, data.level || 'warning');
        
        // Add visual alert indicators
        if (data.level === 'critical') {
            this.triggerCriticalAlert();
        }
    }
    
    handleSystemStatus(data) {
        console.log('System status update:', data);
    }
    
    handleStatusUpdate(data) {
        // Just update the timestamp, don't refresh all data
        const statusElement = document.getElementById('connectionStatus');
        if (statusElement) {
            const text = statusElement.querySelector('span');
            if (text) {
                text.textContent = 'Connected';
            }
        }
        
        // Update last seen time quietly
        this.lastUpdateTime = new Date(data.timestamp);
    }
    
    updateStats(risks) {
        if (!risks) return;
        
        // Update stat cards with animation
        this.animateStatUpdate('totalObjects', risks.total_objects);
        this.animateStatUpdate('highRiskObjects', risks.high_risk_objects);
        this.animateStatUpdate('mediumRiskObjects', risks.medium_risk_objects);
        this.animateStatUpdate('activeAlerts', risks.active_alerts);
        
        // Update risk zones
        if (risks.risk_zones) {
            this.animateStatUpdate('safeZoneCount', risks.risk_zones.safe);
            this.animateStatUpdate('watchZoneCount', risks.risk_zones.watch);
            this.animateStatUpdate('alertZoneCount', risks.risk_zones.alert);
        }
        
        // Update collision probability bars
        if (risks.collision_probability) {
            this.updateProbabilityBar('prob24h', 'prob24hText', risks.collision_probability.next_24h);
            this.updateProbabilityBar('probWeek', 'probWeekText', risks.collision_probability.next_week);
        }
    }
    
    animateStatUpdate(elementId, newValue) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const currentValue = parseInt(element.textContent) || 0;
        const targetValue = newValue || 0;
        
        // Animate number counting
        this.animateNumber(element, currentValue, targetValue, 1000);
        
        // Add glow effect
        element.parentElement.classList.add('animate-glow');
        setTimeout(() => {
            element.parentElement.classList.remove('animate-glow');
        }, 2000);
    }
    
    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        const difference = end - start;
        
        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(start + (difference * easeOutQuart));
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };
        
        requestAnimationFrame(step);
    }
    
    updateProbabilityBar(barId, textId, probability) {
        const bar = document.getElementById(barId);
        const text = document.getElementById(textId);
        
        if (bar && text) {
            const percentage = (probability * 100).toFixed(2);
            bar.style.width = `${Math.min(percentage, 100)}%`;
            text.textContent = `${percentage}%`;
            
            // Color coding based on risk level
            if (probability > 0.1) {
                bar.style.background = 'var(--danger-color)';
            } else if (probability > 0.05) {
                bar.style.background = 'var(--warning-color)';
            } else {
                bar.style.background = 'var(--success-color)';
            }
        }
    }
    
    updateConjunctions(conjunctions) {
        const container = document.getElementById('conjunctionsList');
        if (!container || !conjunctions) return;
        
        container.innerHTML = '';
        
        conjunctions.slice(0, 5).forEach((conjunction, index) => {
            const item = this.createConjunctionItem(conjunction);
            item.style.animationDelay = `${index * 0.1}s`;
            item.classList.add('animate-slide-in-left');
            container.appendChild(item);
        });
    }
    
    createConjunctionItem(conjunction) {
        const item = document.createElement('div');
        item.className = 'conjunction-item';
        
        const riskClass = conjunction.risk_level;
        const timeUntil = this.formatTimeUntil(conjunction.time_of_closest_approach);
        
        item.innerHTML = `
            <div class="conjunction-header">
                <span class="conjunction-id">${conjunction.id}</span>
                <span class="risk-badge ${riskClass}">${conjunction.risk_level.toUpperCase()}</span>
            </div>
            <div class="conjunction-details">
                <div>Objects: ${conjunction.primary_object} ↔ ${conjunction.secondary_object}</div>
                <div>Miss Distance: ${conjunction.miss_distance.toFixed(2)} km</div>
                <div>Time: ${timeUntil}</div>
                <div>Probability: ${(conjunction.collision_probability * 100).toFixed(4)}%</div>
            </div>
        `;
        
        return item;
    }
    
    formatTimeUntil(isoString) {
        const targetTime = new Date(isoString);
        const now = new Date();
        const diffMs = targetTime - now;
        
        if (diffMs < 0) return 'Past';
        
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }
        
        return `${hours}h ${minutes}m`;
    }
    
    animateUpdate() {
        // Add subtle pulse to indicate live update
        document.body.classList.add('live-update-pulse');
        setTimeout(() => {
            document.body.classList.remove('live-update-pulse');
        }, 500);
    }
    
    triggerCriticalAlert() {
        // Flash red border
        document.body.style.boxShadow = 'inset 0 0 20px rgba(244, 67, 54, 0.8)';
        setTimeout(() => {
            document.body.style.boxShadow = '';
        }, 2000);
        
        // Shake animation
        document.querySelector('.dashboard-container').classList.add('animate-shake');
        setTimeout(() => {
            document.querySelector('.dashboard-container').classList.remove('animate-shake');
        }, 500);
    }
    
    updateConnectionStatus(connected) {
        const statusElement = document.getElementById('connectionStatus');
        if (!statusElement) return;
        
        const icon = statusElement.querySelector('i');
        const text = statusElement.querySelector('span');
        
        if (connected) {
            statusElement.style.background = 'rgba(76, 175, 80, 0.2)';
            statusElement.style.borderColor = 'var(--success-color)';
            icon.style.color = 'var(--success-color)';
            text.textContent = 'Connected';
        } else {
            statusElement.style.background = 'rgba(244, 67, 54, 0.2)';
            statusElement.style.borderColor = 'var(--danger-color)';
            icon.style.color = 'var(--danger-color)';
            text.textContent = 'Disconnected';
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-slide-in-right`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        notification.innerHTML = `
            <i class="${icons[type] || icons.info}"></i>
            <span>${message}</span>
            <button class="notification-close">×</button>
        `;
        
        // Add to page
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('animate-slide-out-right');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.add('animate-slide-out-right');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
    }
    
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('Max reconnection attempts reached');
            this.showNotification('Connection lost. Please refresh the page.', 'error');
            return;
        }
        
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
        
        setTimeout(() => {
            this.connect();
        }, delay);
    }
    
    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Initialize WebSocket client
let wsClient;
document.addEventListener('DOMContentLoaded', function() {
    wsClient = new WebSocketClient();
});