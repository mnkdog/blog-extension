/**
 * @jest-environment jsdom
 */

describe('Popup DOM Interactions', () => {
  beforeEach(() => {
    // Clear localStorage and DOM
    localStorage.clear();
    document.body.innerHTML = '';
  });

  test('should save content to localStorage when save button is clicked', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Load the HTML into DOM
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Load the browser storage script
    require('../src/browser-storage');
    
    // Load popup script
    require('../src/popup');
    
    // Trigger DOMContentLoaded
    document.dispatchEvent(new Event('DOMContentLoaded'));
    
    // Simulate user typing
    const textarea = document.getElementById('content');
    textarea.value = 'My awesome blog post content';
    
    // Click the save button
    const saveButton = document.getElementById('save');
    saveButton.click();
    
    // Check localStorage was used
    const keys = Object.keys(localStorage);
    const draftKeys = keys.filter(key => key.startsWith('draft_'));
    
    expect(draftKeys.length).toBe(1);
    
    const savedData = JSON.parse(localStorage.getItem(draftKeys[0]));
    expect(savedData.content).toBe('My awesome blog post content');
  });
});
