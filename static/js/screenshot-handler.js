// Screenshot Handler for SpaceSense Pro
// Captures the dashboard or specific elements

class ScreenshotHandler {
    constructor() {
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        const screenshotBtn = document.getElementById('screenshotBtn');
        if (screenshotBtn) {
            screenshotBtn.addEventListener('click', () => this.takeScreenshot());
            console.log('✅ Screenshot handler initialized');
        }
    }
    
    async takeScreenshot() {
        console.log('📸 Taking screenshot...');
        
        try {
            // Show notification
            this.showNotification('Capturing screenshot...', 'info');
            
            // Use html2canvas library if available, otherwise use native method
            if (window.html2canvas) {
                await this.captureWithHtml2Canvas();
            } else {
                // Load html2canvas dynamically
                await this.loadHtml2Canvas();
                await this.captureWithHtml2Canvas();
            }
            
        } catch (error) {
            console.error('❌ Screenshot failed:', error);
            this.showNotification('Screenshot failed: ' + error.message, 'error');
        }
    }
    
    async loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (window.html2canvas) {
                resolve();
                return;
            }
            
            console.log('📚 Loading html2canvas library...');
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = () => {
                console.log('✅ html2canvas loaded');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('Failed to load html2canvas library'));
            };
            document.head.appendChild(script);
        });
    }
    
    async captureWithHtml2Canvas() {
        try {
            // Get the main dashboard container
            const element = document.querySelector('.dashboard-container') || document.body;
            
            console.log('📷 Capturing element:', element);
            
            // Configure html2canvas options
            const options = {
                backgroundColor: '#0a0a0f',
                scale: 2, // Higher quality
                logging: false,
                useCORS: true,
                allowTaint: true,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
                ignoreElements: (element) => {
                    // Ignore certain elements like the screenshot button itself
                    return element.classList.contains('quick-actions') ||
                           element.classList.contains('notification-container');
                }
            };
            
            // Capture the screenshot
            const canvas = await html2canvas(element, options);
            
            console.log('✅ Screenshot captured');
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                this.downloadScreenshot(blob);
            }, 'image/png');
            
        } catch (error) {
            console.error('❌ Capture failed:', error);
            throw error;
        }
    }
    
    downloadScreenshot(blob) {
        try {
            // Create download link
            const url = URL.createObjectURL(blob);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const filename = `spacesense-screenshot-${timestamp}.png`;
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('✅ Screenshot downloaded:', filename);
            this.showNotification('Screenshot saved!', 'success');
            
            // Play success sound if available
            if (window.soundEffects && window.soundEffects.playSuccess) {
                window.soundEffects.playSuccess();
            }
            
        } catch (error) {
            console.error('❌ Download failed:', error);
            throw error;
        }
    }
    
    showNotification(message, type = 'info') {
        // Use existing notification system if available
        if (window.wsClient && window.wsClient.showNotification) {
            window.wsClient.showNotification(message, type);
            return;
        }
        
        // Fallback notification
        const notification = document.createElement('div');
        notification.className = `screenshot-notification screenshot-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles if not already added
        if (!document.getElementById('screenshot-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'screenshot-notification-styles';
            style.textContent = `
                .screenshot-notification {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    z-index: 100001;
                    background: rgba(10, 10, 15, 0.95);
                    border: 2px solid;
                    border-radius: 10px;
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    animation: slideInRight 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    max-width: 400px;
                }
                .screenshot-notification-success { border-color: #4caf50; color: #4caf50; }
                .screenshot-notification-error { border-color: #f44336; color: #f44336; }
                .screenshot-notification-info { border-color: #00d4ff; color: #00d4ff; }
                .screenshot-notification i { font-size: 1.5rem; }
                .screenshot-notification span { color: white; font-size: 0.95rem; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize screenshot handler
console.log('🚀 Initializing Screenshot Handler...');
window.screenshotHandler = new ScreenshotHandler();
