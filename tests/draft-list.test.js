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
    
    // Should have a drafts list element
    const draftsList = document.getElementById('drafts-list');
    expect(draftsList).toBeTruthy();
    
    // Should contain the draft items
    expect(draftsList.innerHTML).toContain('First draft content');
    expect(draftsList.innerHTML).toContain('Second draft content');
  });
});
