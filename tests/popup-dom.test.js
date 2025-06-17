/**
 * @jest-environment jsdom
 */

describe('Popup DOM Interactions', () => {
  test('should save content when save button is clicked', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Load the HTML into DOM
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Mock DraftStorage
    const mockSave = jest.fn();
    jest.doMock('../src/storage', () => {
      return class DraftStorage {
        save() { mockSave(...arguments); }
      };
    });
    
    // Load popup script that should attach event listeners
    require('../src/popup');
    
    // Simulate user typing
    const textarea = document.getElementById('content');
    textarea.value = 'My awesome blog post content';
    
    // Click the save button
    const saveButton = document.getElementById('save');
    saveButton.click();
    
    // Should have called save with the content
    expect(mockSave).toHaveBeenCalledWith(expect.any(String), {
      content: 'My awesome blog post content'
    });
  });
});
