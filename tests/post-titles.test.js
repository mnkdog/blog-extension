/**
 * @jest-environment jsdom
 */

describe('Post Titles', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('should have a title input field in the popup', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Should have a title input
    const titleInput = document.getElementById('title');
    expect(titleInput).toBeTruthy();
    expect(titleInput.tagName).toBe('INPUT');
    expect(titleInput.placeholder).toContain('title');
  });

  test('should save both title and content when saving draft', () => {
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
    
    // Fill in title and content
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    
    titleInput.value = 'My Blog Post Title';
    contentTextarea.value = 'This is the content of my blog post.';
    
    // Click save
    const saveButton = document.getElementById('save');
    saveButton.click();
    
    // Check localStorage contains both title and content
    const keys = Object.keys(localStorage);
    const draftKey = keys.find(key => key.startsWith('draft_'));
    expect(draftKey).toBeTruthy();
    
    const savedDraft = JSON.parse(localStorage.getItem(draftKey));
    expect(savedDraft.title).toBe('My Blog Post Title');
    expect(savedDraft.content).toBe('This is the content of my blog post.');
  });
});
