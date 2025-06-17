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
    const publishedPostsSection = document.getElementById('published-posts');
    const githubConfig = document.getElementById('github-config');
    const saveConfigButton = document.getElementById('save-config');
    const githubTokenInput = document.getElementById('github-token');
    const githubRepoInput = document.getElementById('github-repo');
    
    if (saveButton && publishButton && titleInput && contentTextarea && window.BrowserDraftStorage) {
      const storage = new window.BrowserDraftStorage();
      
      // Check if GitHub is already configured
      function isGitHubConfigured() {
        const config = localStorage.getItem('github-config');
        return config !== null;
      }
      
      // Get GitHub configuration
      function getGitHubConfig() {
        const config = localStorage.getItem('github-config');
        return config ? JSON.parse(config) : null;
      }
      
      // Function to load published posts
      async function loadPublishedPosts() {
        if (!isGitHubConfigured()) {
          publishedPostsSection.innerHTML = '<h4>Published Posts</h4><p>Configure GitHub to see published posts</p>';
          return;
        }
        
        try {
          const config = getGitHubConfig();
          const publisher = new window.BrowserGitHubPublisher(config.token, config.repo);
          const posts = await publisher.fetchExistingPosts();
          
          if (posts.length === 0) {
            publishedPostsSection.innerHTML = '<h4>Published Posts</h4><p>No published posts found</p>';
          } else {
            const postsContainer = document.createElement('div');
            posts.forEach(post => {
              const postDiv = document.createElement('div');
              postDiv.className = 'post-item';
              
              const titleSpan = document.createElement('span');
              titleSpan.textContent = post.title;
              titleSpan.style.flex = '1';
              
              const editBtn = document.createElement('button');
              editBtn.textContent = 'Edit';
              editBtn.className = 'edit-btn';
              
              // Add click handler to edit button
              editBtn.addEventListener('click', async () => {
                try {
                  statusDiv.textContent = 'Loading post content...';
                  
                  const postContent = await publisher.fetchPostContent(post.downloadUrl);
                  
                  titleInput.value = postContent.title;
                  contentTextarea.value = postContent.content;
                  
                  statusDiv.textContent = 'Post loaded for editing!';
                  setTimeout(() => statusDiv.textContent = '', 2000);
                  
                } catch (error) {
                  console.error('Error loading post content:', error);
                  statusDiv.textContent = `Error: ${error.message}`;
                  statusDiv.style.color = 'red';
                  setTimeout(() => {
                    statusDiv.textContent = '';
                    statusDiv.style.color = 'green';
                  }, 3000);
                }
              });
              
              postDiv.appendChild(titleSpan);
              postDiv.appendChild(editBtn);
              postsContainer.appendChild(postDiv);
            });
            
            publishedPostsSection.innerHTML = '<h4>Published Posts</h4>';
            publishedPostsSection.appendChild(postsContainer);
          }
        } catch (error) {
          console.error('Error loading published posts:', error);
          publishedPostsSection.innerHTML = '<h4>Published Posts</h4><p>Error loading posts</p>';
        }
      }
      
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
      
      // Load content on startup
      updateDraftsList();
      loadPublishedPosts();
      
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
      publishButton.addEventListener('click', async () => {
        if (!isGitHubConfigured()) {
          // Show configuration form
          githubConfig.style.display = 'block';
          statusDiv.textContent = 'Configure GitHub settings below';
        } else {
          const title = titleInput.value.trim();
          const content = contentTextarea.value.trim();
          
          if (!title || !content) {
            statusDiv.textContent = 'Please enter both title and content';
            statusDiv.style.color = 'red';
            setTimeout(() => {
              statusDiv.textContent = '';
              statusDiv.style.color = 'green';
            }, 2000);
            return;
          }
          
          try {
            statusDiv.textContent = 'Publishing to GitHub...';
            
            const config = getGitHubConfig();
            const publisher = new window.BrowserGitHubPublisher(config.token, config.repo);
            
            const postData = {
              title: title,
              content: content,
              created: new Date().toISOString()
            };
            
            await publisher.publishPost(postData);
            
            statusDiv.textContent = 'Successfully published to GitHub!';
            setTimeout(() => statusDiv.textContent = '', 3000);
            
            // Refresh published posts list
            loadPublishedPosts();
            
          } catch (error) {
            console.error('Publishing error:', error);
            statusDiv.textContent = `Error: ${error.message}`;
            statusDiv.style.color = 'red';
            setTimeout(() => {
              statusDiv.textContent = '';
              statusDiv.style.color = 'green';
            }, 3000);
          }
        }
      });
      
      // Save GitHub configuration
      saveConfigButton.addEventListener('click', () => {
        const token = githubTokenInput.value.trim();
        const repo = githubRepoInput.value.trim();
        
        if (token && repo) {
          const config = {
            token: token,
            repo: repo
          };
          localStorage.setItem('github-config', JSON.stringify(config));
          githubConfig.style.display = 'none';
          statusDiv.textContent = 'GitHub configuration saved!';
          setTimeout(() => statusDiv.textContent = '', 2000);
          
          // Load published posts now that GitHub is configured
          loadPublishedPosts();
        } else {
          statusDiv.textContent = 'Please fill in both token and repository';
          statusDiv.style.color = 'red';
          setTimeout(() => {
            statusDiv.textContent = '';
            statusDiv.style.color = 'green';
          }, 2000);
        }
      });
    }
  });
}
