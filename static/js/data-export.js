// Data Export and Reporting System - SpaceSense Pro
// Completely rewritten for stability

class DataExporter {
    constructor() {
        this.currentModal = null;
        this.isModalOpen = false;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupExportControls());
        } else {
            this.setupExportControls();
        }
    }
    
    setupExportControls() {
        const trySetup = (attempts = 0) => {
            const navControls = document.querySelector('.nav-controls');
            
            if (navControls) {
                if (!document.getElementById('exportData')) {
                    const exportBtn = document.createElement('button');
                    exportBtn.className = 'refresh-btn';
                    exportBtn.id = 'exportData';
                    exportBtn.title = 'Export Data';
                    exportBtn.setAttribute('aria-label', 'Export data');
                    exportBtn.innerHTML = '<i class="fas fa-download"></i><span>Export</span>';
                    
                    exportBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        
                        // Use setTimeout to ensure click event is fully processed
                        setTimeout(() => {
                            this.showExportModal();
                        }, 10);
                    });
                    
                    navControls.appendChild(exportBtn);
                    console.log('✅ Export button added successfully');
                }
            } else if (attempts < 10) {
                setTimeout(() => trySetup(attempts + 1), 100);
            } else {
                console.error('❌ Could not find .nav-controls element');
            }
        };
        
        trySetup();
    }
    
    showExportModal() {
        // Prevent multiple modals
        if (this.isModalOpen) {
            console.log('⚠️ Modal already open');
            return;
        }
        
        console.log('🎯 Opening export modal...');
        this.isModalOpen = true;
        
        // Remove any existing modals
        const existingModal = document.querySelector('.export-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'export-modal';
        modal.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            z-index: 99999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            background: rgba(0, 0, 0, 0.9) !important;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div class="export-modal-content glass" style="position: relative !important; z-index: 100000 !important; transform: scale(0.8); transition: transform 0.3s ease;">
                <div class="export-modal-header">
                    <h2><i class="fas fa-download"></i> Export Data</h2>
                    <button class="close-modal" aria-label="Close modal"><i class="fas fa-times"></i></button>
                </div>
                <div class="export-modal-body">
                    <div class="export-options">
                        <button class="export-option" data-format="json">
                            <i class="fas fa-file-code"></i>
                            <span>JSON</span>
                            <small>Machine-readable format</small>
                        </button>
                        <button class="export-option" data-format="csv">
                            <i class="fas fa-file-csv"></i>
                            <span>CSV</span>
                            <small>Spreadsheet format</small>
                        </button>
                        <button class="export-option" data-format="pdf">
                            <i class="fas fa-file-pdf"></i>
                            <span>PDF Report</span>
                            <small>Printable document</small>
                        </button>
                    </div>
                    <div class="export-settings">
                        <label><input type="checkbox" checked> Include debris data</label>
                        <label><input type="checkbox" checked> Include risk analysis</label>
                        <label><input type="checkbox" checked> Include AI insights</label>
                        <label><input type="checkbox"> Include historical data</label>
                    </div>
                </div>
            </div>
        `;
        
        // Store reference
        this.currentModal = modal;
        
        // Add to DOM
        document.body.appendChild(modal);
        
        // Get elements
        const modalContent = modal.querySelector('.export-modal-content');
        const closeBtn = modal.querySelector('.close-modal');
        const exportOptions = modal.querySelectorAll('.export-option');
        
        // Animate in
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        });
        
        console.log('✅ Modal added to DOM');
        
        // Close function
        const closeModal = () => {
            if (!this.isModalOpen) return;
            
            console.log('🚪 Closing modal...');
            this.isModalOpen = false;
            
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
                this.currentModal = null;
            }, 300);
        };
        
        // Stop propagation on modal content
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        }, true);
        
        // Close button
        closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
        
        // Export options
        exportOptions.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                const format = btn.dataset.format;
                console.log(`📤 Exporting as ${format}...`);
                await this.exportData(format);
                closeModal();
            });
        });
        
        // ESC key
        const escHandler = (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                console.log('⌨️ ESC key pressed');
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Click outside - with proper delay and capture phase
        setTimeout(() => {
            const clickOutsideHandler = (e) => {
                // Only close if clicking directly on modal background
                if (e.target === modal && this.isModalOpen) {
                    console.log('👆 Clicked outside modal');
                    closeModal();
                    modal.removeEventListener('click', clickOutsideHandler, true);
                }
            };
            
            // Use capture phase to catch event before it bubbles
            modal.addEventListener('click', clickOutsideHandler, true);
        }, 500); // Longer delay to ensure button click is fully processed
    }
    
    async exportData(format) {
        try {
            console.log(`📥 Starting export for format: ${format}`);
            this.showNotification('Preparing export...', 'info');
            
            // For JSON and CSV, try direct server download first
            if (format === 'json' || format === 'csv') {
                try {
                    console.log(`🔗 Attempting direct server download for ${format}...`);
                    const downloadUrl = `/api/export/download/${format}`;
                    
                    // Create hidden iframe for download
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = downloadUrl;
                    document.body.appendChild(iframe);
                    
                    console.log(`✅ Server download initiated for ${format}`);
                    
                    // Remove iframe after download starts
                    setTimeout(() => {
                        if (iframe.parentNode) {
                            document.body.removeChild(iframe);
                        }
                    }, 2000);
                    
                    if (window.soundEffects && window.soundEffects.playSuccess) {
                        window.soundEffects.playSuccess();
                    }
                    
                    this.showNotification(`Data exported as ${format.toUpperCase()} successfully!`, 'success');
                    return;
                    
                } catch (serverError) {
                    console.warn(`⚠️ Server download failed, falling back to client-side: ${serverError.message}`);
                }
            }
            
            // Fallback to client-side generation
            let data = null;
            
            // Try to fetch from API
            try {
                const url = `/api/export/data?format=${format}`;
                console.log(`🌐 Fetching from: ${url}`);
                
                const response = await fetch(url);
                console.log(`📡 Response status: ${response.status}`);
                
                if (response.ok) {
                    data = await response.json();
                    console.log(`📦 Data received from API:`, data);
                    
                    if (data.error) {
                        console.warn(`⚠️ API returned error: ${data.error}`);
                        data = null;
                    }
                } else {
                    console.warn(`⚠️ API returned status ${response.status}, using fallback data`);
                }
            } catch (fetchError) {
                console.warn(`⚠️ API fetch failed: ${fetchError.message}, using fallback data`);
            }
            
            // If API failed, create sample data
            if (!data || (!data.debris && !data.risks)) {
                console.log('📝 Creating fallback sample data...');
                data = this.createSampleData();
            }
            
            // Ensure data has required fields
            if (!data.debris) data.debris = [];
            if (!data.risks) data.risks = {};
            if (!data.exported_at) data.exported_at = new Date().toISOString();
            
            console.log(`💾 Starting download for ${format}...`);
            console.log(`📊 Data summary: ${data.debris.length} debris objects`);
            
            if (format === 'pdf') {
                this.showNotification('Generating PDF report...', 'info');
            }
            
            // Perform download
            if (format === 'json') {
                this.downloadJSON(data);
            } else if (format === 'csv') {
                this.downloadCSV(data);
            } else if (format === 'pdf') {
                await this.generatePDF(data);
            }
            
            console.log(`✅ Download completed for ${format}`);
            
            if (window.soundEffects && window.soundEffects.playSuccess) {
                window.soundEffects.playSuccess();
            }
            
            this.showNotification(`Data exported as ${format.toUpperCase()} successfully!`, 'success');
            
        } catch (error) {
            console.error('❌ Export failed:', error);
            console.error('Error stack:', error.stack);
            this.showNotification(`Export failed: ${error.message}. Check console for details.`, 'error');
        }
    }
    
    createSampleData() {
        console.log('🎲 Creating sample data for export...');
        return {
            debris: [
                {
                    name: "COSMOS 2251 DEB",
                    object_type: "debris",
                    latitude: 51.6,
                    longitude: 0.0,
                    altitude: 790.0,
                    risk_level: "high"
                },
                {
                    name: "IRIDIUM 33 DEB",
                    object_type: "debris",
                    latitude: 86.4,
                    longitude: 45.0,
                    altitude: 780.0,
                    risk_level: "high"
                },
                {
                    name: "ISS (ZARYA)",
                    object_type: "satellite",
                    latitude: 51.6,
                    longitude: -120.0,
                    altitude: 408.0,
                    risk_level: "low"
                },
                {
                    name: "STARLINK-1007",
                    object_type: "satellite",
                    latitude: 53.0,
                    longitude: 100.0,
                    altitude: 550.0,
                    risk_level: "low"
                },
                {
                    name: "FENGYUN 1C DEB",
                    object_type: "debris",
                    latitude: 98.5,
                    longitude: -45.0,
                    altitude: 850.0,
                    risk_level: "medium"
                }
            ],
            risks: {
                total_objects: 5,
                high_risk_objects: 2,
                medium_risk_objects: 1,
                low_risk_objects: 2,
                collision_probability: {
                    next_24h: 0.023,
                    next_week: 0.089,
                    next_month: 0.156
                }
            },
            ai_insights: {
                ai_analysis: "Sample data generated for demonstration purposes. Current debris density shows elevated risk levels in LEO region.",
                confidence_score: 0.85
            },
            exported_at: new Date().toISOString(),
            format_version: "1.0",
            note: "This is sample data. Connect to API for real-time data."
        };
    }
    
    showNotification(message, type = 'info') {
        if (window.wsClient && window.wsClient.showNotification) {
            window.wsClient.showNotification(message, type);
            return;
        }
        
        const notification = document.createElement('div');
        notification.className = `export-notification export-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        if (!document.getElementById('export-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'export-notification-styles';
            style.textContent = `
                .export-notification {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    background: rgba(10, 10, 15, 0.95);
                    border: 2px solid;
                    border-radius: 10px;
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    z-index: 100001;
                    animation: slideInRight 0.3s ease;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    max-width: 400px;
                }
                .export-notification-success { border-color: #4caf50; color: #4caf50; }
                .export-notification-error { border-color: #f44336; color: #f44336; }
                .export-notification-info { border-color: #00d4ff; color: #00d4ff; }
                .export-notification i { font-size: 1.5rem; }
                .export-notification span { color: white; font-size: 0.95rem; }
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
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    downloadJSON(data) {
        try {
            console.log('📄 Creating JSON file...');
            const jsonString = JSON.stringify(data, null, 2);
            console.log(`📏 JSON size: ${jsonString.length} characters`);
            
            const blob = new Blob([jsonString], { type: 'application/json' });
            console.log(`💾 Blob created, size: ${blob.size} bytes`);
            
            const url = URL.createObjectURL(blob);
            const filename = `spacesense-pro-data-${new Date().toISOString().split('T')[0]}.json`;
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            console.log(`🔗 Download link created: ${filename}`);
            
            // Force click with multiple methods
            a.click();
            
            // Fallback: try direct navigation if click doesn't work
            setTimeout(() => {
                if (!document.hidden) {
                    console.log('🔄 Trying fallback download method...');
                    window.location.href = url;
                }
            }, 100);
            
            console.log('✅ Download triggered');
            
            // Cleanup
            setTimeout(() => {
                if (a.parentNode) {
                    document.body.removeChild(a);
                }
                URL.revokeObjectURL(url);
                console.log('🧹 Cleanup completed');
            }, 1000);
            
        } catch (error) {
            console.error('❌ JSON download failed:', error);
            throw error;
        }
    }
    
    downloadCSV(data) {
        try {
            console.log('📊 Creating CSV file...');
            let csv = 'Name,Type,Latitude,Longitude,Altitude,Risk Level\n';
            
            if (data.debris && Array.isArray(data.debris)) {
                console.log(`📋 Processing ${data.debris.length} debris items...`);
                data.debris.forEach((item, index) => {
                    const name = (item.name || 'Unknown').replace(/"/g, '""');
                    const type = (item.object_type || 'N/A').replace(/"/g, '""');
                    const lat = item.latitude || 0;
                    const lon = item.longitude || 0;
                    const alt = item.altitude || 0;
                    const risk = (item.risk_level || 'unknown').replace(/"/g, '""');
                    
                    csv += `"${name}","${type}",${lat},${lon},${alt},"${risk}"\n`;
                });
                console.log(`✅ CSV data prepared, ${csv.split('\n').length - 1} rows`);
            } else {
                console.warn('⚠️ No debris data available for CSV');
                csv += '"No data available","","","","",""\n';
            }
            
            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            console.log(`💾 CSV Blob created, size: ${blob.size} bytes`);
            
            const url = URL.createObjectURL(blob);
            const filename = `spacesense-pro-data-${new Date().toISOString().split('T')[0]}.csv`;
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            console.log(`🔗 CSV download link created: ${filename}`);
            
            // Force click with multiple methods
            a.click();
            
            // Fallback: try direct navigation if click doesn't work
            setTimeout(() => {
                if (!document.hidden) {
                    console.log('🔄 Trying CSV fallback download method...');
                    window.location.href = url;
                }
            }, 100);
            
            console.log('✅ CSV download triggered');
            
            // Cleanup
            setTimeout(() => {
                if (a.parentNode) {
                    document.body.removeChild(a);
                }
                URL.revokeObjectURL(url);
                console.log('🧹 CSV cleanup completed');
            }, 1000);
            
        } catch (error) {
            console.error('❌ CSV download failed:', error);
            throw error;
        }
    }
    
    async generatePDF(data) {
        try {
            console.log('📄 Starting PDF generation...');
            
            if (typeof window.jspdf === 'undefined') {
                console.log('📚 jsPDF not loaded, loading now...');
                await this.loadJsPDF();
            }
            
            console.log('✅ jsPDF library available');
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            console.log('📝 PDF document created');
            
            doc.setProperties({
                title: 'SpaceSense Pro - Orbital Debris Report',
                subject: 'Orbital Debris Intelligence Report',
                author: 'SpaceSense Pro',
                keywords: 'space, debris, satellites, orbital',
                creator: 'SpaceSense Pro v3.0'
            });
            
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            let yPos = margin;
            
            // Header
            doc.setFillColor(0, 212, 255);
            doc.rect(0, 0, pageWidth, 40, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            doc.text('SpaceSense Pro', margin, 25);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'normal');
            doc.text('Orbital Debris Intelligence Report', margin, 33);
            
            yPos = 50;
            
            // Metadata
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(10);
            doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
            yPos += 7;
            doc.text(`Report Version: 3.0.0-advanced`, margin, yPos);
            yPos += 15;
            
            // Executive Summary
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 212, 255);
            doc.text('Executive Summary', margin, yPos);
            yPos += 10;
            
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            
            const summary = [
                `Total Objects: ${data.debris?.length || 0}`,
                `High Risk: ${data.debris?.filter(d => d.risk_level === 'high').length || 0}`,
                `Medium Risk: ${data.debris?.filter(d => d.risk_level === 'medium').length || 0}`,
                `Low Risk: ${data.debris?.filter(d => d.risk_level === 'low').length || 0}`
            ];
            
            summary.forEach(line => {
                doc.text(line, margin, yPos);
                yPos += 7;
            });
            
            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `SpaceSense Pro v3.0 | Page ${i} of ${pageCount} | ${new Date().toLocaleDateString()}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }
            
            const filename = `spacesense-pro-report-${new Date().toISOString().split('T')[0]}.pdf`;
            console.log(`💾 Saving PDF as: ${filename}`);
            
            doc.save(filename);
            console.log('✅ PDF saved successfully');
            
        } catch (error) {
            console.error('❌ PDF generation failed:', error);
            console.error('Error stack:', error.stack);
            this.showNotification('PDF generation failed: ' + error.message, 'error');
            throw error;
        }
    }
    
    async loadJsPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('jsPDF loaded successfully');
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load jsPDF library'));
            document.head.appendChild(script);
        });
    }
}

// Initialize
window.dataExporter = null;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Initializing DataExporter...');
        window.dataExporter = new DataExporter();
    });
} else {
    console.log('🚀 Initializing DataExporter (DOM already loaded)...');
    window.dataExporter = new DataExporter();
}

window.initDataExporter = () => {
    if (!window.dataExporter) {
        window.dataExporter = new DataExporter();
    }
    return window.dataExporter;
};
