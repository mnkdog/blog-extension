// Browser-compatible GitHub API integration

class BrowserGitHubPublisher {
  constructor(token, repo) {
    this.token = token;
    this.repo = repo;
  }

  createMarkdown(postData) {
    const { title, content } = postData;
    
    return `# ${title}

${content}`;
  }

  generateFilename(title) {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    return `${date}-${slug}.md`;
  }

  async publishPost(postData) {
    const markdown = this.createMarkdown(postData);
    const filename = this.generateFilename(postData.title);
    const path = `posts/${filename}`;
    
    // GitHub API expects base64 encoded content
    const base64Content = btoa(markdown);
    
    const url = `https://api.github.com/repos/${this.repo}/contents/${path}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Add new post: ${postData.title}`,
        content: base64Content
      })
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
  }
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.BrowserGitHubPublisher = BrowserGitHubPublisher;
}
