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

  parseTitleFromFilename(filename) {
    // Remove .md extension and date prefix
    const nameWithoutExt = filename.replace('.md', '');
    const withoutDate = nameWithoutExt.replace(/^\d{4}-\d{2}-\d{2}-/, '');
    
    // Convert kebab-case to Title Case
    return withoutDate
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  parseContentFromMarkdown(markdown) {
    // Remove the first line (title) and any leading newlines
    const lines = markdown.split('\n');
    const titleIndex = lines.findIndex(line => line.startsWith('# '));
    
    if (titleIndex >= 0) {
      const title = lines[titleIndex].replace('# ', '');
      const content = lines.slice(titleIndex + 1)
        .join('\n')
        .replace(/^\n+/, '') // Remove leading newlines
        .replace(/\n+$/, ''); // Remove trailing newlines
      
      return { title, content };
    }
    
    return { title: '', content: markdown };
  }

  async fetchExistingPosts() {
    const url = `https://api.github.com/repos/${this.repo}/contents/posts`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${this.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        // Posts directory doesn't exist yet
        return [];
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const files = await response.json();
    
    // Filter for markdown files and transform to our format
    return files
      .filter(file => file.name.endsWith('.md'))
      .map(file => ({
        filename: file.name,
        title: this.parseTitleFromFilename(file.name),
        path: file.path,
        sha: file.sha,
        downloadUrl: file.download_url
      }));
  }

  async fetchPostContent(downloadUrl) {
    const response = await fetch(downloadUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch post content: ${response.status}`);
    }
    
    const markdown = await response.text();
    return this.parseContentFromMarkdown(markdown);
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
