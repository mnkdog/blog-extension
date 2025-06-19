/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'

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
  test('should have different font sizes for headings', () => {
    const PostPage = require('../posts/[slug]/page').default
    const { container } = render(<PostPage params={{ slug: 'test-post' }} />)
    
    const h1 = container.querySelector('h1')
    const h2 = container.querySelector('h2') 
    const p = container.querySelector('p')
    
    // This will fail because Tailwind typography isn't configured yet
    expect(h1).toHaveClass('prose')
    expect(h2).toHaveClass('prose')
    expect(p).toHaveClass('prose')
  })
})
