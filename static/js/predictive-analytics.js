// Predictive Analytics Engine - Advanced ML-style predictions

class PredictiveAnalytics {
    constructor() {
        this.historicalData = [];
        this.predictions = [];
        this.trendAnalysis = {};
        this.anomalies = [];
        
        this.initialize();
    }
    
    initialize() {
        this.generateHistoricalData();
        this.setupPredictionEngine();
        this.startRealTimeAnalysis();
    }
    
    generateHistoricalData() {
        // Generate 30 days of historical collision probability data
        const now = new Date();
        for (let i = 30; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // Simulate realistic collision probability with trends
            const baseProb = 0.02;
            const trend = i * 0.0001;
            const noise = (Math.random() - 0.5) * 0.01;
            const seasonal = Math.sin(i * 0.2) * 0.005;
            
            this.historicalData.push({
                date: date.toISOString().split('T')[0],
                probability: Math.max(0, baseProb + trend + noise + seasonal),
                debrisCount: 150 + Math.floor(Math.random() * 20),
                conjunctions: Math.floor(Math.random() * 10) + 2
            });
        }
    }
    
    setupPredictionEngine() {
        // Create prediction panel
        this.createPredictionPanel();
        
        // Generate predictions
        this.generatePredictions();
        
        // Update every 30 seconds
        setInterval(() => {
            this.generatePredictions();
            this.updatePredictionDisplay();
        }, 30000);
    }
    
    createPredictionPanel() {
        const container = document.querySelector('.advanced-section .main-grid');
        if (!container) return;
        
        const panel = document.createElement('div');
        panel.className = 'panel prediction-panel animate-fade-in';
        panel.innerHTML = `
            <div class="panel-header">
                <h2><i class="fas fa-chart-line"></i> Predictive Analytics</h2>
                <div class="panel-controls">
                    <button class="btn-control" id="refreshPredictions" title="Refresh Predictions">
                        <i class="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>
            <div class="prediction-content">
                <div class="prediction-chart" id="predictionChart"></div>
                <div class="prediction-insights" id="predictionInsights"></div>
            </div>
        `;
        
        container.appendChild(panel);
        
        // Add event listener
        document.getElementById('refreshPredictions')?.addEventListener('click', () => {
            this.generatePredictions();
            this.updatePredictionDisplay();
        });
    }
    
    generatePredictions() {
        this.predictions = [];
        
        // Use simple linear regression for trend
        const trend = this.calculateTrend();
        
        // Generate 14-day forecast
        for (let i = 1; i <= 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            
            const lastProb = this.historicalData[this.historicalData.length - 1].probability;
            const predicted = lastProb + (trend * i) + (Math.random() - 0.5) * 0.005;
            
            this.predictions.push({
                date: date.toISOString().split('T')[0],
                probability: Math.max(0, Math.min(1, predicted)),
                confidence: 0.85 - (i * 0.02),
                trend: trend > 0 ? 'increasing' : 'decreasing'
            });
        }
        
        // Detect anomalies
        this.detectAnomalies();
    }
    
    calculateTrend() {
        const n = this.historicalData.length;
        let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
        
        this.historicalData.forEach((point, i) => {
            sumX += i;
            sumY += point.probability;
            sumXY += i * point.probability;
            sumX2 += i * i;
        });
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        return slope;
    }
    
    detectAnomalies() {
        this.anomalies = [];
        
        // Calculate mean and standard deviation
        const probs = this.historicalData.map(d => d.probability);
        const mean = probs.reduce((a, b) => a + b) / probs.length;
        const variance = probs.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / probs.length;
        const stdDev = Math.sqrt(variance);
        
        // Find anomalies (values > 2 standard deviations from mean)
        this.historicalData.forEach((point, i) => {
            if (Math.abs(point.probability - mean) > 2 * stdDev) {
                this.anomalies.push({
                    date: point.date,
                    value: point.probability,
                    severity: Math.abs(point.probability - mean) / stdDev
                });
            }
        });
    }
    
    updatePredictionDisplay() {
        this.renderPredictionChart();
        this.renderInsights();
    }
    
    renderPredictionChart() {
        const container = document.getElementById('predictionChart');
        if (!container) return;
        
        // Combine historical and predicted data
        const historicalTrace = {
            x: this.historicalData.map(d => d.date),
            y: this.historicalData.map(d => d.probability * 100),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Historical',
            line: { color: '#00d4ff', width: 2 },
            marker: { size: 4 }
        };
        
        const predictedTrace = {
            x: this.predictions.map(d => d.date),
            y: this.predictions.map(d => d.probability * 100),
            type: 'scatter',
            mode: 'lines+markers',
            name: 'Predicted',
            line: { color: '#ff6b35', width: 2, dash: 'dash' },
            marker: { size: 4 }
        };
        
        // Confidence interval
        const upperBound = {
            x: this.predictions.map(d => d.date),
            y: this.predictions.map(d => (d.probability + 0.01) * 100),
            type: 'scatter',
            mode: 'lines',
            name: 'Upper Bound',
            line: { color: 'rgba(255, 107, 53, 0.2)', width: 0 },
            fill: 'tonexty',
            fillcolor: 'rgba(255, 107, 53, 0.2)',
            showlegend: false
        };
        
        const lowerBound = {
            x: this.predictions.map(d => d.date),
            y: this.predictions.map(d => Math.max(0, (d.probability - 0.01) * 100)),
            type: 'scatter',
            mode: 'lines',
            name: 'Lower Bound',
            line: { color: 'rgba(255, 107, 53, 0.2)', width: 0 },
            showlegend: false
        };
        
        const layout = {
            title: {
                text: 'Collision Probability Forecast',
                font: { color: '#00d4ff', size: 14 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
                title: 'Date',
                color: '#b0b0b0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis: {
                title: 'Collision Probability (%)',
                color: '#b0b0b0',
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            margin: { l: 50, r: 20, t: 40, b: 40 },
            legend: {
                font: { color: '#b0b0b0' }
            }
        };
        
        Plotly.newPlot(container, [lowerBound, upperBound, historicalTrace, predictedTrace], layout, {
            displayModeBar: false,
            responsive: true
        });
    }
    
    renderInsights() {
        const container = document.getElementById('predictionInsights');
        if (!container) return;
        
        const trend = this.predictions[0].trend;
        const avgConfidence = (this.predictions.reduce((a, b) => a + b.confidence, 0) / this.predictions.length * 100).toFixed(1);
        const maxProb = Math.max(...this.predictions.map(p => p.probability)) * 100;
        
        container.innerHTML = `
            <div class="insight-grid">
                <div class="insight-card">
                    <div class="insight-icon ${trend === 'increasing' ? 'danger' : 'success'}">
                        <i class="fas fa-arrow-${trend === 'increasing' ? 'up' : 'down'}"></i>
                    </div>
                    <div class="insight-content">
                        <div class="insight-label">Trend</div>
                        <div class="insight-value">${trend}</div>
                    </div>
                </div>
                
                <div class="insight-card">
                    <div class="insight-icon info">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="insight-content">
                        <div class="insight-label">Peak Risk</div>
                        <div class="insight-value">${maxProb.toFixed(2)}%</div>
                    </div>
                </div>
                
                <div class="insight-card">
                    <div class="insight-icon success">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="insight-content">
                        <div class="insight-label">Confidence</div>
                        <div class="insight-value">${avgConfidence}%</div>
                    </div>
                </div>
                
                <div class="insight-card">
                    <div class="insight-icon warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="insight-content">
                        <div class="insight-label">Anomalies</div>
                        <div class="insight-value">${this.anomalies.length}</div>
                    </div>
                </div>
            </div>
            
            <div class="insight-recommendations">
                <h4><i class="fas fa-lightbulb"></i> Recommendations</h4>
                <ul>
                    ${this.generateRecommendations().map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    generateRecommendations() {
        const recommendations = [];
        const trend = this.predictions[0].trend;
        const maxProb = Math.max(...this.predictions.map(p => p.probability));
        
        if (trend === 'increasing') {
            recommendations.push('⚠️ Collision risk is trending upward - increase monitoring frequency');
            recommendations.push('🛰️ Consider preemptive maneuver planning for critical assets');
        } else {
            recommendations.push('✅ Risk trend is favorable - maintain current monitoring protocols');
        }
        
        if (maxProb > 0.05) {
            recommendations.push('🚨 High-risk period detected in forecast - prepare contingency plans');
        }
        
        if (this.anomalies.length > 0) {
            recommendations.push(`📊 ${this.anomalies.length} anomalies detected - investigate unusual patterns`);
        }
        
        recommendations.push('🔄 Update orbital data regularly for accurate predictions');
        
        return recommendations;
    }
    
    startRealTimeAnalysis() {
        // Simulate real-time data updates
        setInterval(() => {
            // Add new data point
            const lastPoint = this.historicalData[this.historicalData.length - 1];
            const newDate = new Date(lastPoint.date);
            newDate.setDate(newDate.getDate() + 1);
            
            const newProb = lastPoint.probability + (Math.random() - 0.5) * 0.01;
            
            this.historicalData.push({
                date: newDate.toISOString().split('T')[0],
                probability: Math.max(0, newProb),
                debrisCount: lastPoint.debrisCount + Math.floor((Math.random() - 0.5) * 5),
                conjunctions: Math.floor(Math.random() * 10) + 2
            });
            
            // Keep only last 30 days
            if (this.historicalData.length > 30) {
                this.historicalData.shift();
            }
            
            // Regenerate predictions
            this.generatePredictions();
        }, 60000); // Every minute
    }
}

// Initialize predictive analytics
window.predictiveAnalytics = null;

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.predictiveAnalytics = new PredictiveAnalytics();
    }, 2000);
});
