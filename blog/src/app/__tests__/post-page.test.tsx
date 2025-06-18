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
    content: '# Test Post\n\n## Subtitle\n\nThis is **bold** text.'
  }),
  markdownToHtml: (markdown: string) => 
    markdown.replace(/^# (.+)$/gm, '<h1>$1</h1>')
           .replace(/^## (.+)$/gm, '<h2>$1</h2>')
           .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}))

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn()
}))

describe('Post Page HTML Rendering', () => {
  test('should render markdown as HTML not raw text', () => {
    const PostPage = require('../posts/[slug]/page').default
    const { container } = render(<PostPage params={{ slug: 'test-post' }} />)
    
    // Should contain HTML elements, not raw markdown
    expect(container.innerHTML).toContain('<h1>')
    expect(container.innerHTML).toContain('<h2>')
    expect(container.innerHTML).toContain('<strong>')
    
    // Should NOT contain raw markdown
    expect(container.innerHTML).not.toContain('##')
    expect(container.innerHTML).not.toContain('**')
  })
})
