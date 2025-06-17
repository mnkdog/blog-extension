// Popup script for blog extension
const DraftStorage = require('./storage');

// Initialize storage
const storage = new DraftStorage();

// Add event listener when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save');
  const contentTextarea = document.getElementById('content');
  
  saveButton.addEventListener('click', () => {
    const content = contentTextarea.value;
    storage.save('current-draft', { content: content });
  });
});
