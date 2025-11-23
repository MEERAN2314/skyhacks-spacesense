// Data Export and Reporting System - SpaceSense Pro

class DataExporter {
    constructor() {
        this.setupExportControls();
    }
    
    setupExportControls() {
        // Add export button to navbar
        const navControls = document.querySelector('.nav-controls');
        if (navControls) {
            const exportBtn = document.createElement('button');
            exportBtn.className = 'refresh-btn';
            exportBtn.id = 'exportData';
            exportBtn.title = 'Export Data';
            exportBtn.innerHTML = '<i class="fas fa-download"></i><span>Export</span>';
            
            exportBtn.addEventListener('click', () => {
                this.showExportModal();
            });
            
            navControls.appendChild(exportBtn);
        }
    }
    
    showExportModal() {
        const modal = document.createElement('div');
        modal.className = 'export-modal';
        modal.innerHTML = `
            <div class="export-modal-content glass animate-zoom-in">
                <div class="export-modal-header">
                    <h2><i class="fas fa-download"></i> Export Data</h2>
                    <button class="close-modal"><i class="fas fa-times"></i></button>
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
                        <label>
                            <input type="checkbox" checked> Include debris data
                        </label>
                        <label>
                            <input type="checkbox" checked> Include risk analysis
                        </label>
                        <label>
                            <input type="checkbox" checked> Include AI insights
                        </label>
                        <label>
                            <input type="checkbox"> Include historical data
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.classList.add('animate-fade-out');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        });
        
        // Export options
        modal.querySelectorAll('.export-option').forEach(btn => {
            btn.addEventListener('click', async () => {
                const format = btn.dataset.format;
                await this.exportData(format);
                
                // Close modal
                modal.querySelector('.close-modal').click();
            });
        });
        
        // Click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.querySelector('.close-modal').click();
            }
        });
    }
    
    async exportData(format) {
        try {
            const response = await fetch(`/api/export/data?format=${format}`);
            const data = await response.json();
            
            if (format === 'json') {
                this.downloadJSON(data);
            } else if (format === 'csv') {
                this.downloadCSV(data);
            } else if (format === 'pdf') {
                this.generatePDF(data);
            }
            
            if (window.soundEffects) {
                window.soundEffects.playSuccess();
            }
            
            if (window.wsClient) {
                window.wsClient.showNotification(`Data exported as ${format.toUpperCase()}`, 'success');
            }
        } catch (error) {
            console.error('Export failed:', error);
            if (window.wsClient) {
                window.wsClient.showNotification('Export failed', 'error');
            }
        }
    }
    
    downloadJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spacesense-pro-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    downloadCSV(data) {
        // Convert debris data to CSV
        let csv = 'Name,Type,Latitude,Longitude,Altitude,Risk Level\n';
        
        if (data.debris) {
            data.debris.forEach(item => {
                csv += `"${item.name}","${item.object_type}",${item.latitude},${item.longitude},${item.altitude},"${item.risk_level}"\n`;
            });
        }
        
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `spacesense-pro-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    generatePDF(data) {
        // In a real implementation, use a PDF library like jsPDF
        if (window.wsClient) {
            window.wsClient.showNotification('PDF generation coming soon!', 'info');
        }
    }
}

// Initialize data exporter
window.dataExporter = null;

document.addEventListener('DOMContentLoaded', function() {
    window.dataExporter = new DataExporter();
});
