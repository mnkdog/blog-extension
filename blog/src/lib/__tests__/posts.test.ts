describe('Posts Library', () => {
  test('should export getAllPosts function', () => {
    // This will fail because posts.ts doesn't exist yet
    expect(() => require('../posts')).not.toThrow()
    
    const { getAllPosts } = require('../posts')
    expect(typeof getAllPosts).toBe('function')
  })
})
