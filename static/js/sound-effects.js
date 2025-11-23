// Sound Effects System for SpaceSense Lite Pro

class SoundEffects {
    constructor() {
        this.enabled = true;
        this.volume = 0.3;
        this.audioContext = null;
        
        this.initialize();
    }
    
    initialize() {
        // Create audio context
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
        
        this.setupControls();
    }
    
    setupControls() {
        // Add sound toggle button to navbar
        const navControls = document.querySelector('.nav-controls');
        if (navControls) {
            const soundBtn = document.createElement('button');
            soundBtn.className = 'auto-refresh-btn active';
            soundBtn.id = 'toggleSound';
            soundBtn.title = 'Toggle Sound Effects';
            soundBtn.innerHTML = '<i class="fas fa-volume-up"></i><span>Sound</span>';
            
            soundBtn.addEventListener('click', () => {
                this.enabled = !this.enabled;
                soundBtn.classList.toggle('active');
                soundBtn.querySelector('i').className = this.enabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
            });
            
            navControls.appendChild(soundBtn);
        }
    }
    
    playBeep(frequency = 440, duration = 100) {
        if (!this.enabled || !this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
    
    playSuccess() {
        if (!this.enabled) return;
        this.playBeep(523.25, 100); // C5
        setTimeout(() => this.playBeep(659.25, 100), 100); // E5
        setTimeout(() => this.playBeep(783.99, 150), 200); // G5
    }
    
    playAlert() {
        if (!this.enabled) return;
        this.playBeep(880, 150); // A5
        setTimeout(() => this.playBeep(880, 150), 200);
        setTimeout(() => this.playBeep(880, 150), 400);
    }
    
    playWarning() {
        if (!this.enabled) return;
        this.playBeep(440, 200); // A4
        setTimeout(() => this.playBeep(392, 200), 250); // G4
    }
    
    playClick() {
        if (!this.enabled) return;
        this.playBeep(800, 50);
    }
    
    playHover() {
        if (!this.enabled) return;
        this.playBeep(600, 30);
    }
    
    playRefresh() {
        if (!this.enabled) return;
        this.playBeep(523.25, 80);
        setTimeout(() => this.playBeep(659.25, 80), 80);
    }
    
    playZoom() {
        if (!this.enabled) return;
        this.playBeep(700, 60);
    }
}

// Initialize sound effects
window.soundEffects = null;

document.addEventListener('DOMContentLoaded', function() {
    window.soundEffects = new SoundEffects();
    
    // Add sound effects to buttons
    document.querySelectorAll('button, .btn-control').forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.soundEffects) {
                window.soundEffects.playClick();
            }
        });
        
        btn.addEventListener('mouseenter', () => {
            if (window.soundEffects) {
                window.soundEffects.playHover();
            }
        });
    });
    
    // Add sound to refresh button
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            if (window.soundEffects) {
                window.soundEffects.playRefresh();
            }
        });
    }
    
    // Add sound to zoom buttons
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            if (window.soundEffects) {
                window.soundEffects.playZoom();
            }
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            if (window.soundEffects) {
                window.soundEffects.playZoom();
            }
        });
    }
});
