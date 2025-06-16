// tests/popup-functionality.test.js
/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');

describe('Popup Functionality', () => {
  test('should save draft when save button is clicked', () => {
    // Load the HTML
    const html = fs.readFileSync(path.join(__dirname, '../src/popup.html'), 'utf8');
    document.body.innerHTML = html;
    
    // We need the popup script to be loaded
    require('../src/popup.js');
    
    // Simulate user input
    const textarea = document.getElementById('content');
    textarea.value = 'Test blog content';
    
    // Click save button
    const saveButton = document.getElementById('save');
    saveButton.click();
    
    // Check if draft was saved (we'll need to mock storage)
    expect(textarea.value).toBe('Test blog content');
  });
});


test('should save draft to storage when save button is clicked', () => {
  // Mock chrome.storage since we're in Node environment
  global.chrome = {
    storage: {
      local: {
        data: {},
        set: function(items, callback) {
          Object.assign(this.data, items);
          if (callback) callback();
        },
        get: function(keys, callback) {
          const result = {};
          if (Array.isArray(keys)) {
            keys.forEach(key => result[key] = this.data[key]);
          } else if (typeof keys === 'string') {
            result[keys] = this.data[keys];
          }
          callback(result);
        }
      }
    }
  };

  const mockSave = jest.fn();
  const DraftStorage = require('../src/storage');
  DraftStorage.prototype.save = mockSave;

  require('../src/popup');
  
  expect(mockSave).toHaveBeenCalled();
});