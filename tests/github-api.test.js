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
