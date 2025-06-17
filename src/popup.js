// Popup script for blog extension

// Only run in browser environment
if (typeof document !== 'undefined') {
  // Add event listener when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save');
    const contentTextarea = document.getElementById('content');
    
    if (saveButton && contentTextarea) {
      saveButton.addEventListener('click', () => {
        const content = contentTextarea.value;
        console.log('Saving:', content);
        // TODO: Save to storage when we implement browser-compatible storage
      });
    }
  });
}
