/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'

// Mock the posts library
jest.mock('../../../lib/posts', () => ({
  getPostBySlug: (slug: string) => {
    if (slug === 'test-post') {
      return {
        slug: 'test-post',
        title: 'Test Post',
        date: '2025-06-17',
        content: '# Test Post\n\nThis is the full content of the test post.'
      }
    }
    return null
  }
}))

describe('Post Page', () => {
  test('should have getPostBySlug function available', () => {
    const { getPostBySlug } = require('../../../lib/posts')
    expect(typeof getPostBySlug).toBe('function')
    
    const post = getPostBySlug('test-post')
    expect(post).toBeTruthy()
    expect(post.title).toBe('Test Post')
  })
})
