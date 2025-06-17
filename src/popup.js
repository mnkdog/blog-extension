// Popup script for blog extension

// Only run in browser environment
if (typeof document !== 'undefined') {
  // Add event listener when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save');
    const contentTextarea = document.getElementById('content');
    const statusDiv = document.getElementById('status');
    const draftsList = document.getElementById('drafts-list');
    
    if (saveButton && contentTextarea && window.BrowserDraftStorage) {
      const storage = new window.BrowserDraftStorage();
      
      // Function to update drafts list
      function updateDraftsList() {
        const drafts = storage.list();
        const draftsContainer = draftsList.querySelector('div') || document.createElement('div');
        draftsContainer.innerHTML = '';
        
        Object.entries(drafts).forEach(([id, draft]) => {
          const draftDiv = document.createElement('div');
          draftDiv.className = 'draft-item';
          draftDiv.innerHTML = `<div>${draft.content.substring(0, 50)}...</div>`;
          draftsContainer.appendChild(draftDiv);
        });
        
        if (!draftsList.querySelector('div')) {
          draftsList.appendChild(draftsContainer);
        }
      }
      
      // Load drafts on startup
      updateDraftsList();
      
      saveButton.addEventListener('click', () => {
        const content = contentTextarea.value.trim();
        if (content) {
          const timestamp = Date.now();
          storage.save(`draft_${timestamp}`, { 
            content: content,
            created: new Date().toISOString()
          });
          statusDiv.textContent = 'Draft saved!';
          setTimeout(() => statusDiv.textContent = '', 2000);
          
          // Update the drafts list
          updateDraftsList();
        }
      });
    }
  });
}
