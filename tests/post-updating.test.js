describe('Post Updating', () => {
  test('should update existing post when editing', async () => {
    // Mock GitHub API calls
    global.fetch = jest.fn()
      // First call: update existing file
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          content: { sha: 'new-sha-456' }
        })
      });

    const GitHubPublisher = require('../src/github-publisher');
    const publisher = new GitHubPublisher('test-token', 'user/repo');
    
    const postData = {
      title: 'Updated Post Title',
      content: 'This is the updated content.',
      created: '2025-01-01T10:00:00Z'
    };
    
    const existingPost = {
      path: 'posts/2025-06-17-original-title.md',
      sha: 'original-sha-123'
    };
    
    await publisher.updatePost(postData, existingPost);
    
    // Should call GitHub API to update existing file
    expect(fetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/user/repo/contents/posts/2025-06-17-original-title.md',
      expect.objectContaining({
        method: 'PUT',
        body: expect.stringContaining('"sha":"original-sha-123"')
      })
    );
  });
});
