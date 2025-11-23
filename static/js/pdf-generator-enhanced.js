// Enhanced PDF Generator for SpaceSense Pro
// Professional multi-page report with charts and tables

async function generateEnhancedPDF(data) {
    console.log('📄 Starting enhanced PDF generation...');
    
    try {
        if (!window.jspdf || !window.jspdf.jsPDF) {
            throw new Error('jsPDF library not available');
        }
        
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 15;
        let yPos = 20;
        
        // Calculate statistics
        const totalObjects = data.debris?.length || 0;
        const highRisk = data.debris?.filter(d => d.risk_level === 'high').length || 0;
        const mediumRisk = data.debris?.filter(d => d.risk_level === 'medium').length || 0;
        const lowRisk = data.debris?.filter(d => d.risk_level === 'low').length || 0;
        const satellites = data.debris?.filter(d => d.object_type === 'satellite').length || 0;
        const debris = data.debris?.filter(d => d.object_type === 'debris').length || 0;
        
        // ========== COVER PAGE ==========
        // Gradient header
        doc.setFillColor(0, 20, 40);
        doc.rect(0, 0, pageWidth, 80, 'F');
        
        doc.setFillColor(0, 100, 150);
        doc.rect(0, 80, pageWidth, 40, 'F');
        
        doc.setFillColor(0, 212, 255);
        doc.rect(0, 120, pageWidth, 20, 'F');
        
        // Title
        doc.setFontSize(36);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 212, 255);
        doc.text('SpaceSense Pro', pageWidth / 2, 45, { align: 'center' });
        
        doc.setFontSize(18);
        doc.setTextColor(255, 255, 255);
        doc.text('Orbital Debris Intelligence Report', pageWidth / 2, 65, { align: 'center' });
        
        // Date
        doc.setFontSize(12);
        doc.setTextColor(200, 200, 200);
        const dateStr = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
        doc.text(dateStr, pageWidth / 2, 95, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('CONFIDENTIAL - FOR AUTHORIZED PERSONNEL ONLY', pageWidth / 2, 133, { align: 'center' });
        
        // Report info box
        yPos = 160;
        doc.setFillColor(240, 248, 255);
        doc.setDrawColor(0, 212, 255);
        doc.setLineWidth(1);
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 50, 3, 3, 'FD');
        
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.text('Report Information', margin + 5, yPos + 10);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text(`Generated: ${new Date().toLocaleString()}`, margin + 5, yPos + 20);
        doc.text(`Report Version: 3.0.0-Advanced`, margin + 5, yPos + 28);
        doc.text(`Classification: CONFIDENTIAL`, margin + 5, yPos + 36);
        doc.text(`Data Source: Real-time Orbital Tracking System`, margin + 5, yPos + 44);
        
        // Quick stats boxes
        yPos = 230;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 100, 150);
        doc.text('Quick Statistics', pageWidth / 2, yPos, { align: 'center' });
        
        yPos += 15;
        const statBoxWidth = (pageWidth - 4 * margin) / 3;
        
        // Total objects
        doc.setFillColor(0, 212, 255);
        doc.roundedRect(margin, yPos, statBoxWidth, 25, 2, 2, 'F');
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(totalObjects.toString(), margin + statBoxWidth / 2, yPos + 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Objects', margin + statBoxWidth / 2, yPos + 20, { align: 'center' });
        
        // High risk
        doc.setFillColor(220, 53, 69);
        doc.roundedRect(margin + statBoxWidth + 5, yPos, statBoxWidth, 25, 2, 2, 'F');
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(highRisk.toString(), margin + statBoxWidth * 1.5 + 5, yPos + 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('High Risk', margin + statBoxWidth * 1.5 + 5, yPos + 20, { align: 'center' });
        
        // Collision probability
        const collisionProb = data.risks?.collision_probability?.next_24h || 0;
        doc.setFillColor(255, 193, 7);
        doc.roundedRect(margin + 2 * statBoxWidth + 10, yPos, statBoxWidth, 25, 2, 2, 'F');
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text((collisionProb * 100).toFixed(1) + '%', margin + statBoxWidth * 2.5 + 10, yPos + 12, { align: 'center' });
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('24h Collision Risk', margin + statBoxWidth * 2.5 + 10, yPos + 20, { align: 'center' });
        
        // ========== PAGE 2: EXECUTIVE SUMMARY ==========
        doc.addPage();
        yPos = 20;
        
        // Section header
        doc.setFillColor(0, 212, 255);
        doc.rect(0, yPos - 5, pageWidth, 12, 'F');
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('EXECUTIVE SUMMARY', margin, yPos + 5);
        
        yPos += 20;
        
        // Summary box
        doc.setFillColor(245, 250, 255);
        doc.setDrawColor(0, 212, 255);
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 60, 3, 3, 'FD');
        
        yPos += 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Orbital Environment Status', margin + 5, yPos);
        
        yPos += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Tracked Objects: ${totalObjects}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`Active Satellites: ${satellites}`, margin + 5, yPos);
        yPos += 6;
        doc.text(`Debris Objects: ${debris}`, margin + 5, yPos);
        yPos += 10;
        
        // Risk distribution bar
        const barHeight = 8;
        const barWidth = pageWidth - 2 * margin - 10;
        
        const highPercent = totalObjects > 0 ? (highRisk / totalObjects) : 0;
        const mediumPercent = totalObjects > 0 ? (mediumRisk / totalObjects) : 0;
        const lowPercent = totalObjects > 0 ? (lowRisk / totalObjects) : 0;
        
        let barX = margin + 5;
        
        if (highRisk > 0) {
            doc.setFillColor(220, 53, 69);
            doc.rect(barX, yPos, barWidth * highPercent, barHeight, 'F');
            barX += barWidth * highPercent;
        }
        
        if (mediumRisk > 0) {
            doc.setFillColor(255, 193, 7);
            doc.rect(barX, yPos, barWidth * mediumPercent, barHeight, 'F');
            barX += barWidth * mediumPercent;
        }
        
        if (lowRisk > 0) {
            doc.setFillColor(40, 167, 69);
            doc.rect(barX, yPos, barWidth * lowPercent, barHeight, 'F');
        }
        
        yPos += barHeight + 8;
        
        // Legend
        doc.setFontSize(9);
        doc.setFillColor(220, 53, 69);
        doc.circle(margin + 10, yPos - 1, 2, 'F');
        doc.setTextColor(220, 53, 69);
        doc.text(`High: ${highRisk} (${(highPercent * 100).toFixed(1)}%)`, margin + 15, yPos);
        
        doc.setFillColor(255, 193, 7);
        doc.circle(margin + 70, yPos - 1, 2, 'F');
        doc.setTextColor(255, 193, 7);
        doc.text(`Medium: ${mediumRisk} (${(mediumPercent * 100).toFixed(1)}%)`, margin + 75, yPos);
        
        doc.setFillColor(40, 167, 69);
        doc.circle(margin + 130, yPos - 1, 2, 'F');
        doc.setTextColor(40, 167, 69);
        doc.text(`Low: ${lowRisk} (${(lowPercent * 100).toFixed(1)}%)`, margin + 135, yPos);
        
        yPos += 20;
        
        // Risk Assessment Table
        doc.setFillColor(0, 212, 255);
        doc.rect(0, yPos - 5, pageWidth, 12, 'F');
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text('COLLISION RISK ASSESSMENT', margin, yPos + 5);
        
        yPos += 20;
        
        if (data.risks && data.risks.collision_probability) {
            const cp = data.risks.collision_probability;
            
            // Table header
            doc.setFillColor(230, 240, 250);
            doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text('Time Period', margin + 5, yPos + 7);
            doc.text('Probability', margin + 80, yPos + 7);
            doc.text('Risk Level', margin + 130, yPos + 7);
            
            yPos += 10;
            
            // Table rows
            const riskData = [
                { period: '24 Hours', prob: cp.next_24h, level: cp.next_24h > 0.05 ? 'HIGH' : cp.next_24h > 0.02 ? 'MEDIUM' : 'LOW' },
                { period: '7 Days', prob: cp.next_week, level: cp.next_week > 0.1 ? 'HIGH' : cp.next_week > 0.05 ? 'MEDIUM' : 'LOW' },
                { period: '30 Days', prob: cp.next_month, level: cp.next_month > 0.2 ? 'HIGH' : cp.next_month > 0.1 ? 'MEDIUM' : 'LOW' }
            ];
            
            doc.setFont('helvetica', 'normal');
            riskData.forEach((row, index) => {
                if (index % 2 === 0) {
                    doc.setFillColor(250, 250, 250);
                    doc.rect(margin, yPos, pageWidth - 2 * margin, 10, 'F');
                }
                
                doc.setTextColor(0, 0, 0);
                doc.text(row.period, margin + 5, yPos + 7);
                doc.text((row.prob * 100).toFixed(2) + '%', margin + 80, yPos + 7);
                
                const levelColor = row.level === 'HIGH' ? [220, 53, 69] : 
                                 row.level === 'MEDIUM' ? [255, 193, 7] : [40, 167, 69];
                doc.setTextColor(...levelColor);
                doc.setFont('helvetica', 'bold');
                doc.text(row.level, margin + 130, yPos + 7);
                doc.setFont('helvetica', 'normal');
                
                yPos += 10;
            });
        }
        
        yPos += 15;
        
        // High-Risk Objects
        if (totalObjects > 0) {
            doc.setFillColor(0, 212, 255);
            doc.rect(0, yPos - 5, pageWidth, 12, 'F');
            doc.setFontSize(16);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255, 255, 255);
            doc.text('HIGH-RISK OBJECTS DETAIL', margin, yPos + 5);
            
            yPos += 20;
            
            const highRiskObjects = data.debris?.filter(d => d.risk_level === 'high').slice(0, 10) || [];
            
            if (highRiskObjects.length > 0) {
                highRiskObjects.forEach((obj, index) => {
                    if (yPos > pageHeight - 40) {
                        doc.addPage();
                        yPos = 20;
                    }
                    
                    // Object box
                    doc.setFillColor(255, 245, 245);
                    doc.setDrawColor(220, 53, 69);
                    doc.setLineWidth(0.5);
                    doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 22, 2, 2, 'FD');
                    
                    // Number badge
                    doc.setFillColor(220, 53, 69);
                    doc.circle(margin + 8, yPos + 11, 5, 'F');
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(255, 255, 255);
                    doc.text((index + 1).toString(), margin + 8, yPos + 13, { align: 'center' });
                    
                    // Details
                    doc.setFontSize(11);
                    doc.setTextColor(0, 0, 0);
                    doc.text(obj.name || 'Unknown Object', margin + 18, yPos + 8);
                    
                    doc.setFontSize(8);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(100, 100, 100);
                    doc.text(`Type: ${obj.object_type || 'N/A'}`, margin + 18, yPos + 14);
                    doc.text(`Altitude: ${obj.altitude?.toFixed(0) || 0} km`, margin + 18, yPos + 19);
                    doc.text(`Coords: ${obj.latitude?.toFixed(2) || 0}°, ${obj.longitude?.toFixed(2) || 0}°`, margin + 80, yPos + 14);
                    doc.text(`Velocity: ${obj.velocity?.toFixed(2) || 7.5} km/s`, margin + 80, yPos + 19);
                    
                    yPos += 26;
                });
            } else {
                doc.setFontSize(10);
                doc.setTextColor(40, 167, 69);
                doc.text('✓ No high-risk objects detected.', margin + 5, yPos);
            }
        }
        
        // Footer on all pages
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            doc.setDrawColor(0, 212, 255);
            doc.setLineWidth(0.5);
            doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
            
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text('SpaceSense Pro™', margin, pageHeight - 10);
            doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
            doc.text('CONFIDENTIAL', pageWidth - margin, pageHeight - 10, { align: 'right' });
        }
        
        // Save
        const filename = `spacesense-report-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        console.log('✅ Enhanced PDF generated successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Enhanced PDF generation failed:', error);
        throw error;
    }
}

// Export for use
window.generateEnhancedPDF = generateEnhancedPDF;
