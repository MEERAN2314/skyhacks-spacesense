# Quick PDF Test

## Test in Browser Console

Open your browser console (F12) and run these commands one by one:

### Test 1: Check if jsPDF is loaded
```javascript
console.log('jsPDF available:', !!window.jspdf);
console.log('jsPDF.jsPDF available:', !!(window.jspdf && window.jspdf.jsPDF));
```

**Expected:** Both should show `true`

### Test 2: Create a simple PDF
```javascript
const { jsPDF } = window.jspdf;
const doc = new jsPDF();
doc.text('Hello SpaceSense!', 10, 10);
doc.save('test.pdf');
```

**Expected:** A file named `test.pdf` should download

### Test 3: Test the exporter directly
```javascript
window.simpleExporter.generatePDF({
    debris: [
        {name: 'TEST-1', object_type: 'debris', altitude: 500, risk_level: 'high'},
        {name: 'TEST-2', object_type: 'satellite', altitude: 400, risk_level: 'low'}
    ],
    risks: {
        collision_probability: {
            next_24h: 0.02,
            next_week: 0.05,
            next_month: 0.1
        }
    }
});
```

**Expected:** A PDF report should download

## If Tests Fail

### Test 1 Fails (jsPDF not loaded)
**Solution:** Reload the page and wait 2 seconds, then try again

### Test 2 Fails (Can't create PDF)
**Solution:** Run this to reload jsPDF:
```javascript
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
script.onload = () => console.log('jsPDF reloaded!');
document.head.appendChild(script);
```

Wait 2 seconds, then try Test 2 again.

### Test 3 Fails (Exporter error)
**Check console for specific error message**

Common errors:
- `Cannot read property 'length' of undefined` → Data issue, but PDF should still generate with fallback
- `doc.save is not a function` → jsPDF not properly loaded
- `Network error` → Check internet connection for CDN

## Manual PDF Download

If all else fails, you can manually trigger PDF generation:

```javascript
// Fetch data
fetch('/api/export/data?format=pdf')
    .then(r => r.json())
    .then(data => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Simple content
        doc.setFontSize(20);
        doc.text('SpaceSense Pro Report', 20, 20);
        
        doc.setFontSize(12);
        doc.text('Generated: ' + new Date().toLocaleString(), 20, 35);
        
        doc.setFontSize(10);
        doc.text('Total Objects: ' + (data.debris?.length || 0), 20, 50);
        
        // Save
        doc.save('spacesense-report.pdf');
        console.log('PDF saved!');
    });
```

## Browser Compatibility Check

```javascript
// Check browser
console.log('Browser:', navigator.userAgent);

// Check download capability
console.log('Can download:', 'download' in document.createElement('a'));

// Check Blob support
console.log('Blob support:', typeof Blob !== 'undefined');
```

All should be supported in modern browsers.
