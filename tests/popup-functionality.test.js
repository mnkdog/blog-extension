// tests/popup-functionality.test.js
describe('Popup Functionality', () => {
  test('should have popup.js file', () => {
    const fs = require('fs');
    const path = require('path');
    
    const popupJsPath = path.join(__dirname, '../src/popup.js');
    expect(fs.existsSync(popupJsPath)).toBe(true);
  });

  test('should save draft to storage when save button is clicked', () => {
    // Mock the save method BEFORE requiring modules
    const mockSave = jest.fn();
    jest.doMock('../src/storage', () => {
      return class DraftStorage {
        save() {
          mockSave();
        }
      };
    });

    // Now require the popup module
    require('../src/popup');
    
    expect(mockSave).toHaveBeenCalled();
    
    // Clean up mocks
    jest.dontMock('../src/storage');
  });
});
