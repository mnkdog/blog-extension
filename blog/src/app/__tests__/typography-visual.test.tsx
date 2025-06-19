/**
 * @jest-environment jsdom
 */
import { render, cleanup } from '@testing-library/react'

// Mock the posts library  
jest.mock('../../lib/posts', () => ({
  getPostBySlug: () => ({
    slug: 'test-post', 
    title: 'Test Post',
    date: '2025-06-17',
    content: '# Large Heading\n\n## Medium Heading\n\nNormal text.'
  }),
  markdownToHtml: (markdown: string) => 
    '<h1>Large Heading</h1><h2>Medium Heading</h2><p>Normal text.</p>'
}))

jest.mock('next/navigation', () => ({ notFound: jest.fn() }))

describe('Typography Visual Styling', () => {
  afterEach(() => {
    cleanup()
  })

  test('should have prose container for markdown content', () => {
    const PostPage = require('../posts/[slug]/page').default
    const { container } = render(<PostPage params={{ slug: 'test-post' }} />)
    
    const proseContainer = container.querySelector('.prose')
    expect(proseContainer).toBeTruthy()
    
    expect(proseContainer?.innerHTML).toContain('<h1>Large Heading</h1>')
    expect(proseContainer?.innerHTML).toContain('<h2>Medium Heading</h2>')
    expect(proseContainer?.innerHTML).toContain('<p>Normal text.</p>')
  })
})
