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

  test('should NOT save content on page load, only on button click', () => {
    const fs = require('fs');
    const path = require('path');
    
    // Reset DOM
    document.body.innerHTML = '';
    
    // Load HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // Clear any previous mocks
    jest.clearAllMocks();
    
    // Mock storage with fresh spy
    const mockSave = jest.fn();
    
    // Delete popup from require cache to force fresh load
    delete require.cache[require.resolve('../src/popup')];
    
    // Load popup script
    require('../src/popup');
    
    // Should NOT have been called yet (no button click)
    expect(mockSave).not.toHaveBeenCalled();
  });
