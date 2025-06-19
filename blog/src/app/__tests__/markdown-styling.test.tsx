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
    content: '# Main Heading\n\n## Sub Heading\n\nRegular paragraph text.'
  }),
  markdownToHtml: (markdown: string) => 
    '<h1>Main Heading</h1><h2>Sub Heading</h2><p>Regular paragraph text.</p>'
}))

jest.mock('next/navigation', () => ({ notFound: jest.fn() }))

describe('Markdown Styling', () => {
  test('should apply proper CSS classes for typography', () => {
    const PostPage = require('../posts/[slug]/page').default
    const { container } = render(<PostPage params={{ slug: 'test-post' }} />)
    
    // Should have prose classes for styling
    const proseDiv = container.querySelector('.prose')
    expect(proseDiv).toBeTruthy()
    
    // Should contain HTML elements that will be styled
    expect(container.innerHTML).toContain('<h1>')
    expect(container.innerHTML).toContain('<h2>')
    expect(container.innerHTML).toContain('<p>')
  })
})
