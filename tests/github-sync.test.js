describe('GitHub Sync', () => {
  test('should fetch existing posts from GitHub repository', async () => {
    // Mock GitHub API response for listing files in posts directory
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([
          {
            name: '2025-06-01-my-first-post.md',
            path: 'posts/2025-06-01-my-first-post.md',
            sha: 'abc123',
            download_url: 'https://raw.githubusercontent.com/user/repo/main/posts/2025-06-01-my-first-post.md'
          },
          {
            name: '2025-06-15-another-post.md', 
            path: 'posts/2025-06-15-another-post.md',
            sha: 'def456',
            download_url: 'https://raw.githubusercontent.com/user/repo/main/posts/2025-06-15-another-post.md'
          }
        ])
      })
    );

    const GitHubPublisher = require('../src/github-publisher');
    const publisher = new GitHubPublisher('test-token', 'user/repo');
    
    const posts = await publisher.fetchExistingPosts();
    
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/user/repo/contents/posts',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'token test-token'
        })
      })
    );
    
    expect(posts).toHaveLength(2);
    expect(posts[0]).toEqual({
      filename: '2025-06-01-my-first-post.md',
      title: 'My First Post', // Parsed from filename
      path: 'posts/2025-06-01-my-first-post.md',
      sha: 'abc123',
      downloadUrl: 'https://raw.githubusercontent.com/user/repo/main/posts/2025-06-01-my-first-post.md'
    });
  });
});
