/**
 * @jest-environment jsdom
 */
import { render, waitFor } from '@testing-library/react'

// Mock the posts library
jest.mock('../../lib/posts', () => ({
  getPostBySlug: () => ({
    slug: 'test-post',
    title: 'Test Post',
    date: '2025-06-17',
    content: '# Test Post\n\nTest content.'
  }),
  markdownToHtml: (markdown: string) => '<h1>Test Post</h1><p>Test content.</p>'
}))

jest.mock('next/navigation', () => ({ notFound: jest.fn() }))

describe('Async Params Handling', () => {
  test('should handle async params correctly', async () => {
    const PostPage = require('../posts/[slug]/page').default
    
    // Test with params as a Promise (how Next.js will pass them)
    const paramsPromise = Promise.resolve({ slug: 'test-post' })
    
    const { container } = render(<PostPage params={paramsPromise} />)
    
    // Should eventually render the content
    await waitFor(() => {
      expect(container.innerHTML).toContain('Test Post')
    })
  })
})
