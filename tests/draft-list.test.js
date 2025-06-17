/**
 * @jest-environment jsdom
 */

describe('Draft List', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('should display saved drafts in a list', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Pre-populate some drafts
    localStorage.setItem('draft_post1', JSON.stringify({
      content: 'First draft content',
      created: '2025-01-01T10:00:00Z'
    }));
    localStorage.setItem('draft_post2', JSON.stringify({
      content: 'Second draft content', 
      created: '2025-01-02T10:00:00Z'
    }));
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Load the browser storage script
    require('../src/browser-storage');
    
    // Load popup script
    require('../src/popup');
    
    // Trigger DOMContentLoaded to run the popup script
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Now check for the drafts list
    const draftsList = document.getElementById('drafts-list');
    expect(draftsList).toBeTruthy();
    
    // Should contain the draft items
    expect(draftsList.innerHTML).toContain('First draft content');
    expect(draftsList.innerHTML).toContain('Second draft content');
  });
});

  test('should load draft into editor when clicked', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Pre-populate a draft
    localStorage.setItem('draft_post1', JSON.stringify({
      content: 'Click me to load this content',
      created: '2025-01-01T10:00:00Z'
    }));
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Load scripts
    require('../src/browser-storage');
    require('../src/popup');
    
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Find and click the draft item
    const draftItem = document.querySelector('.draft-item');
    expect(draftItem).toBeTruthy();
    
    draftItem.click();
    
    // Check that content was loaded into textarea
    const textarea = document.getElementById('content');
    expect(textarea.value).toBe('Click me to load this content');
  });
