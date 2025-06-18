import { getAllPosts, getPostBySlug } from '../posts'

describe('Posts Library', () => {
  test('should export getAllPosts function', () => {
    expect(typeof getAllPosts).toBe('function')
  })

  test('should export getPostBySlug function', () => {
    expect(typeof getPostBySlug).toBe('function')
  })

  test('should return array from getAllPosts', () => {
    const posts = getAllPosts()
    expect(Array.isArray(posts)).toBe(true)
  })
})

  test('should read actual posts from posts directory', () => {
    const posts = getAllPosts()
    
    // Should find your published posts
    expect(posts.length).toBeGreaterThan(0)
    
    // Each post should have required properties
    posts.forEach(post => {
      expect(post).toHaveProperty('slug')
      expect(post).toHaveProperty('title')
      expect(post).toHaveProperty('content')
      expect(post).toHaveProperty('date')
      expect(post.title).not.toBe('Untitled')
    })
  })
