/**
 * @jest-environment jsdom
 */

describe('GitHub Publish UI', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  test('should have a publish button in the popup', () => {
    const fs = require('fs');
    const path = require('path');
    
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    const publishButton = document.getElementById('publish');
    expect(publishButton).toBeTruthy();
    expect(publishButton.textContent).toContain('Publish');
  });

  test('should show configuration form when publish is clicked without setup', () => {
    const fs = require('fs');
    const path = require('path');
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    require('../src/browser-storage');
    window.BrowserGitHubPublisher = class MockBrowserGitHubPublisher {
      constructor() {}
      fetchExistingPosts() { return Promise.resolve([]); }
    };
    require('../src/popup');
    
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    const publishButton = document.getElementById('publish');
    publishButton.click();
    
    const configForm = document.getElementById('github-config');
    expect(configForm).toBeTruthy();
    expect(configForm.style.display).not.toBe('none');
    
    expect(document.getElementById('github-token')).toBeTruthy();
    expect(document.getElementById('github-repo')).toBeTruthy();
    
    consoleSpy.mockRestore();
  });

  test('should save GitHub configuration when save config is clicked', () => {
    const fs = require('fs');
    const path = require('path');
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    require('../src/browser-storage');
    window.BrowserGitHubPublisher = class MockBrowserGitHubPublisher {
      constructor() {}
      fetchExistingPosts() { return Promise.resolve([]); }
    };
    require('../src/popup');
    
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    const publishButton = document.getElementById('publish');
    publishButton.click();
    
    const tokenInput = document.getElementById('github-token');
    const repoInput = document.getElementById('github-repo');
    const saveConfigButton = document.getElementById('save-config');
    
    tokenInput.value = 'test-token-123';
    repoInput.value = 'username/my-blog';
    
    saveConfigButton.click();
    
    const savedConfig = localStorage.getItem('github-config');
    expect(savedConfig).toBeTruthy();
    
    const config = JSON.parse(savedConfig);
    expect(config.token).toBe('test-token-123');
    expect(config.repo).toBe('username/my-blog');
    
    consoleSpy.mockRestore();
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
    
    localStorage.setItem('github-config', JSON.stringify({
      token: 'test-token',
      repo: 'user/test-repo'
    }));
    
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    require('../src/browser-storage');
    // Use a mock that actually calls fetch
    window.BrowserGitHubPublisher = class MockBrowserGitHubPublisher {
      constructor() {}
      fetchExistingPosts() { return Promise.resolve([]); }
      async publishPost(postData) {
        // Actually call fetch like the real implementation
        const response = await fetch('https://api.github.com/repos/user/test-repo/contents/posts/test.md', {
          method: 'PUT',
          headers: {
            'Authorization': 'token test-token',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: `Add new post: ${postData.title}`,
            content: 'base64content'
          })
        });
        return response.json();
      }
    };
    require('../src/popup');
    
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    titleInput.value = 'Test Blog Post';
    contentTextarea.value = 'This is my test content.';
    
    const publishButton = document.getElementById('publish');
    publishButton.click();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Should have called GitHub API
    expect(fetch).toHaveBeenCalled();
  });
});
