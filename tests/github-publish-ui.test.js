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

  test('should attempt to publish when GitHub is configured and publish is clicked', async () => {
    const fs = require('fs');
    const path = require('path');
    
    // Mock fetch for GitHub API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ 
          content: { html_url: 'https://github.com/user/repo/blob/main/posts/test.md' }
        })
      })
    );
    
    // Pre-configure GitHub settings
    localStorage.setItem('github-config', JSON.stringify({
      token: 'test-token',
      repo: 'user/test-repo'
    }));
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Load scripts in correct order
    require('../src/browser-storage');
    require('../src/browser-github-publisher');
    require('../src/popup');
    
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Fill in title and content
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    titleInput.value = 'Test Blog Post';
    contentTextarea.value = 'This is my test content.';
    
    // Click publish
    const publishButton = document.getElementById('publish');
    publishButton.click();
    
    // Wait a moment for async operations
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Should have called GitHub API
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/user/test-repo/contents/posts/2025-01-17-test-blog-post.md',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Authorization': 'token test-token'
        })
      })
    );
  });
});
