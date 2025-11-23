// Simplified Data Export - GUARANTEED TO WORK
// This version bypasses all complexity and just downloads files

class SimpleDataExporter {
    constructor() {
        console.log('🚀 Simple Data Exporter initializing...');
        this.setupButton();
    }
    
    setupButton() {
        // Wait for nav-controls to exist
        const checkAndSetup = () => {
            const navControls = document.querySelector('.nav-controls');
            if (navControls && !document.getElementById('exportDataSimple')) {
                const btn = document.createElement('button');
                btn.id = 'exportDataSimple';
                btn.className = 'refresh-btn';
                btn.innerHTML = '<i class="fas fa-download"></i><span>Export</span>';
                btn.onclick = () => this.showModal();
                navControls.appendChild(btn);
                console.log('✅ Export button added');
            } else {
                setTimeout(checkAndSetup, 100);
            }
        };
        checkAndSetup();
    }
    
    showModal() {
        console.log('📂 Opening export modal...');
        
        // Remove old modal if exists
        const old = document.getElementById('simpleExportModal');
        if (old) old.remove();
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'simpleExportModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border: 3px solid #00d4ff;
                border-radius: 20px;
                padding: 2rem;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 0 50px rgba(0, 212, 255, 0.5);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
               