// tests/popup.test.js
const fs = require('fs');
const path = require('path');

describe('Popup HTML', () => {
  test('should have a popup.html file with basic structure', () => {
    const popupPath = path.join(__dirname, '../src/popup.html');
    
    expect(fs.existsSync(popupPath)).toBe(true);
    
    const html = fs.readFileSync(popupPath, 'utf8');
    
    expect(html).toContain('<textarea');
    expect(html).toContain('id="content"');
    expect(html).toContain('<button');
  });
});