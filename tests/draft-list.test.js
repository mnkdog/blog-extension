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

  test('should load draft into editor when content is clicked', () => {
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
    
    // Find the content div inside the draft item and click it
    const draftItem = document.querySelector('.draft-item');
    const contentDiv = draftItem.querySelector('div'); // First div is the content
    expect(contentDiv).toBeTruthy();
    
    contentDiv.click();
    
    // Check that content was loaded into textarea
    const textarea = document.getElementById('content');
    expect(textarea.value).toBe('Click me to load this content');
  });

  test('should delete draft when delete button is clicked', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Pre-populate drafts
    localStorage.setItem('draft_post1', JSON.stringify({
      content: 'First draft to delete',
      created: '2025-01-01T10:00:00Z'
    }));
    localStorage.setItem('draft_post2', JSON.stringify({
      content: 'Second draft to keep',
      created: '2025-01-02T10:00:00Z'
    }));
    
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Load scripts
    require('../src/browser-storage');
    require('../src/popup');
    
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Should have 2 drafts initially
    const draftItems = document.querySelectorAll('.draft-item');
    expect(draftItems.length).toBe(2);
    
    // Find and click the delete button on the first draft
    const deleteButton = document.querySelector('.delete-btn');
    expect(deleteButton).toBeTruthy();
    
    deleteButton.click();
    
    // Should now have only 1 draft
    const remainingDrafts = document.querySelectorAll('.draft-item');
    expect(remainingDrafts.length).toBe(1);
    
    // Should contain the second draft content
    expect(document.body.innerHTML).toContain('Second draft to keep');
    expect(document.body.innerHTML).not.toContain('First draft to delete');
  });
});
