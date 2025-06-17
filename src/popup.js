// Popup script for blog extension

// Only run in browser environment
if (typeof document !== 'undefined') {
  // Add event listener when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save');
    const publishButton = document.getElementById('publish');
    const titleInput = document.getElementById('title');
    const contentTextarea = document.getElementById('content');
    const statusDiv = document.getElementById('status');
    const draftsList = document.getElementById('drafts-list');
    const githubConfig = document.getElementById('github-config');
    
    if (saveButton && publishButton && titleInput && contentTextarea && window.BrowserDraftStorage) {
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
          const displayTitle = draft.title || 'Untitled';
          const displayContent = draft.content.substring(0, 30);
          contentDiv.textContent = `${displayTitle} - ${displayContent}...`;
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
            titleInput.value = draft.title || '';
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
      
      // Save draft functionality
      saveButton.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = contentTextarea.value.trim();
        if (content) {
          const timestamp = Date.now();
          storage.save(`draft_${timestamp}`, { 
            title: title,
            content: content,
            created: new Date().toISOString()
          });
          statusDiv.textContent = 'Draft saved!';
          setTimeout(() => statusDiv.textContent = '', 2000);
          
          // Update the drafts list
          updateDraftsList();
        }
      });
      
      // Publish to GitHub functionality
      publishButton.addEventListener('click', () => {
        // For now, just show the configuration form
        githubConfig.style.display = 'block';
        statusDiv.textContent = 'Configure GitHub settings below';
      });
    }
  });
}
