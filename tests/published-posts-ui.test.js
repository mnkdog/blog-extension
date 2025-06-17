/**
 * @jest-environment jsdom
 */

describe('Published Posts UI', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('should display published posts section in popup', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Should have a published posts section
    const publishedSection = document.getElementById('published-posts');
    expect(publishedSection).toBeTruthy();
    
    // Should have a heading
    expect(publishedSection.innerHTML).toContain('Published Posts');
  });

  test('should fetch and display published posts on startup', async () => {
    const fs = require('fs');
    const path = require('path');
    
    // Mock GitHub API for fetching posts
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            name: '2025-06-17-my-test-post.md',
            path: 'posts/2025-06-17-my-test-post.md',
            sha: 'abc123',
            download_url: 'https://raw.githubusercontent.com/user/repo/main/posts/2025-06-17-my-test-post.md'
          }
        ])
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
    
    // Load scripts
    require('../src/browser-storage');
    require('../src/browser-github-publisher');
    require('../src/popup');
    
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Wait for async loading
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Should display the published post
    const publishedSection = document.getElementById('published-posts');
    expect(publishedSection.innerHTML).toContain('My Test Post');
  });
});
