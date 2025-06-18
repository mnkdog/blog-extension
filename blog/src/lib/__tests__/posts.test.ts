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
