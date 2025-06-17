/**
 * @jest-environment jsdom
 */

describe('Edit Mode UI', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('should switch to edit mode when edit button is clicked', async () => {
    const fs = require('fs');
    const path = require('path');
    
    // Mock GitHub API responses
    global.fetch = jest.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([
          {
            name: '2025-06-17-test-post.md',
            path: 'posts/2025-06-17-test-post.md', 
            sha: 'abc123',
            download_url: 'https://example.com/content'
          }
        ])
      })
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve('# Test Post\n\nOriginal content')
      });
    
    localStorage.setItem('github-config', JSON.stringify({
      token: 'test-token',
      repo: 'user/repo'
    }));
    
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    require('../src/browser-storage');
    require('../src/browser-github-publisher');
    require('../src/popup');
    
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Click edit button
    const editButton = document.querySelector('.edit-btn');
    editButton.click();
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Should show we're in edit mode
    const publishButton = document.getElementById('publish');
    expect(publishButton.textContent).toContain('Update');
    
    // Should have loaded the content
    expect(document.getElementById('title').value).toBe('Test Post');
    expect(document.getElementById('content').value).toBe('Original content');
  });
});
