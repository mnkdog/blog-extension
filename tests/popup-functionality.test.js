// tests/popup-functionality.test.js
describe('Popup Functionality', () => {
  test('should have popup.js file', () => {
    const fs = require('fs');
    const path = require('path');
    
    const popupJsPath = path.join(__dirname, '../src/popup.js');
    expect(fs.existsSync(popupJsPath)).toBe(true);
  });

  test('should initialize without errors', () => {
    // Simple test that popup.js can be required without throwing
    expect(() => {
      require('../src/popup');
    }).not.toThrow();
  });
});
