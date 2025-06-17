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
        
        Object.entries(drafts).forEach(([draftId, draft]) => {
          const draftDiv = document.createElement('div');
          draftDiv.className = 'draft-item';
          draftDiv.style.cursor = 'pointer';
          draftDiv.style.display = 'flex';
          draftDiv.style.justifyContent = 'space-between';
          draftDiv.style.alignItems = 'center';
          
          const contentDiv = document.createElement('div');
          contentDiv.textContent = `${draft.content.substring(0, 50)}...`;
          contentDiv.style.flex = '1';
          
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = '×';
          deleteBtn.className = 'delete-btn';
          deleteBtn.style.marginLeft = '10px';
          deleteBtn.style.backgroundColor = '#ff4444';
          deleteBtn.style.color = 'white';
          deleteBtn.style.border = 'none';
          deleteBtn.style.borderRadius = '3px';
          deleteBtn.style.padding = '2px 6px';
          deleteBtn.style.cursor = 'pointer';
          
          // Add click handler to load draft (only on content area)
          contentDiv.addEventListener('click', () => {
            contentTextarea.value = draft.content;
            statusDiv.textContent = 'Draft loaded!';
            setTimeout(() => statusDiv.textContent = '', 2000);
          });
          
          // Add click handler to delete draft
          deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent loading the draft
            storage.delete(draftId);
            statusDiv.textContent = 'Draft deleted!';
            setTimeout(() => statusDiv.textContent = '', 2000);
            updateDraftsList(); // Refresh the list
          });
          
          draftDiv.appendChild(contentDiv);
          draftDiv.appendChild(deleteBtn);
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
