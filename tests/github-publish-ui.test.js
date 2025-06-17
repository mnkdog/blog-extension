/**
 * @jest-environment jsdom
 */

describe('GitHub Publish UI', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('should have a publish button in the popup', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Should have a publish button
    const publishButton = document.getElementById('publish');
    expect(publishButton).toBeTruthy();
    expect(publishButton.textContent).toContain('Publish');
  });

  test('should show configuration form when publish is clicked without setup', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Load scripts
    require('../src/browser-storage');
    require('../src/popup');
    
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Click publish button
    const publishButton = document.getElementById('publish');
    publishButton.click();
    
    // Should show configuration form
    const configForm = document.getElementById('github-config');
    expect(configForm).toBeTruthy();
    expect(configForm.style.display).not.toBe('none');
    
    // Should have inputs for token and repo
    expect(document.getElementById('github-token')).toBeTruthy();
    expect(document.getElementById('github-repo')).toBeTruthy();
  });
});

  test('should save GitHub configuration when save config is clicked', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Load scripts
    require('../src/browser-storage');
    require('../src/popup');
    
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Show config form
    const publishButton = document.getElementById('publish');
    publishButton.click();
    
    // Fill in configuration
    const tokenInput = document.getElementById('github-token');
    const repoInput = document.getElementById('github-repo');
    const saveConfigButton = document.getElementById('save-config');
    
    tokenInput.value = 'test-token-123';
    repoInput.value = 'username/my-blog';
    
    // Click save config
    saveConfigButton.click();
    
    // Should save to localStorage
    const savedConfig = localStorage.getItem('github-config');
    expect(savedConfig).toBeTruthy();
    
    const config = JSON.parse(savedConfig);
    expect(config.token).toBe('test-token-123');
    expect(config.repo).toBe('username/my-blog');
  });
