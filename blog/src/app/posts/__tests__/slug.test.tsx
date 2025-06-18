/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import PostPage from '../[slug]/page'

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
  test('should display individual post content', () => {
    render(<PostPage params={{ slug: 'test-post' }} />)
    
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('2025-06-17')).toBeInTheDocument()
    expect(screen.getByText(/full content of the test post/)).toBeInTheDocument()
  })
})
