// tests/popup-browser.test.js
describe('Popup Browser Compatibility', () => {
  test('should have browser-compatible popup script', () => {
    const fs = require('fs');
    const path = require('path');
    
    const popupJs = fs.readFileSync(path.join(__dirname, '../src/popup.js'), 'utf8');
    
    // Should not use Node.js require
    expect(popupJs).not.toContain('require(');
    
    // Should have basic functionality
    expect(popupJs).toContain('DOMContentLoaded');
    expect(popupJs).toContain('getElementById');
  });
});
