// GitHub API integration for publishing blog posts

class GitHubPublisher {
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

  prepareCreateRequest(postData) {
    const markdown = this.createMarkdown(postData);
    const filename = this.generateFilename(postData.title);
    const path = `posts/${filename}`;
    
    // GitHub API expects base64 encoded content
    const base64Content = btoa(markdown);
    
    return {
      message: `Add new post: ${postData.title}`,
      content: base64Content,
      path: path
    };
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
}

module.exports = GitHubPublisher;
