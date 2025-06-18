import { getPostBySlug } from '../posts'

describe('Individual Posts', () => {
  test('should get individual post by slug', () => {
    // This will test against your actual posts
    const posts = require('../posts').getAllPosts()
    
    if (posts.length > 0) {
      const firstPost = posts[0]
      const individualPost = getPostBySlug(firstPost.slug)
      
      expect(individualPost).toBeTruthy()
      expect(individualPost?.slug).toBe(firstPost.slug)
      expect(individualPost?.title).toBe(firstPost.title)
    }
  })
  
  test('should return null for non-existent post', () => {
    const result = getPostBySlug('non-existent-post')
    expect(result).toBeNull()
  })
})
