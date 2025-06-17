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
}

module.exports = GitHubPublisher;
