// tests/manifest.test.js
const fs = require('fs');
const path = require('path');

describe('Extension Manifest', () => {
  test('should have a valid manifest.json file', () => {
    const manifestPath = path.join(__dirname, '../src/manifest.json');
    
    expect(fs.existsSync(manifestPath)).toBe(true);
    
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    expect(manifest.manifest_version).toBe(3);
    expect(manifest.name).toBeDefined();
    expect(manifest.version).toBeDefined();
    expect(manifest.permissions).toContain('storage');
  });
});