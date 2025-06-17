describe('GitHub API Integration', () => {
  test('should have a GitHubPublisher class', () => {
    const GitHubPublisher = require('../src/github-publisher');
    
    expect(GitHubPublisher).toBeDefined();
    expect(typeof GitHubPublisher).toBe('function');
  });

  test('should create markdown content from post data', () => {
    const GitHubPublisher = require('../src/github-publisher');
    const publisher = new GitHubPublisher('test-token', 'user/repo');
    
    const postData = {
      title: 'My First Post',
      content: 'This is the content of my blog post.\n\nWith multiple paragraphs.',
      created: '2025-01-01T10:00:00Z'
    };
    
    const markdown = publisher.createMarkdown(postData);
    
    expect(markdown).toContain('# My First Post');
    expect(markdown).toContain('This is the content of my blog post.');
    expect(markdown).toContain('With multiple paragraphs.');
  });

  test('should generate appropriate filename from title', () => {
    const GitHubPublisher = require('../src/github-publisher');
    const publisher = new GitHubPublisher('test-token', 'user/repo');
    
    const filename = publisher.generateFilename('My First Post!');
    
    expect(filename).toMatch(/^\d{4}-\d{2}-\d{2}-my-first-post\.md$/);
  });
});

  test('should prepare API request data for creating a file', () => {
    const GitHubPublisher = require('../src/github-publisher');
    const publisher = new GitHubPublisher('test-token', 'username/blog-repo');
    
    const postData = {
      title: 'Test Post',
      content: 'This is test content.',
      created: '2025-01-01T10:00:00Z'
    };
    
    const requestData = publisher.prepareCreateRequest(postData);
    
    expect(requestData.message).toBe('Add new post: Test Post');
    expect(requestData.content).toBeDefined(); // Base64 encoded content
    expect(requestData.path).toMatch(/^posts\/\d{4}-\d{2}-\d{2}-test-post\.md$/);
    
    // Decode the base64 content to verify
    const decodedContent = atob(requestData.content);
    expect(decodedContent).toContain('# Test Post');
    expect(decodedContent).toContain('This is test content.');
  });
