import { getPostBySlug } from '../posts'

describe('Markdown Rendering', () => {
  test('should process markdown content into HTML', () => {
    // Mock a post with markdown
    const mockMarkdown = '# Test Title\n\n## Subtitle\n\nThis is **bold** text.'
    
    // We need a function to convert markdown to HTML
    const { markdownToHtml } = require('../posts')
    
    expect(typeof markdownToHtml).toBe('function')
    
    const html = markdownToHtml(mockMarkdown)
    expect(html).toContain('<h1>')
    expect(html).toContain('<h2>')
    expect(html).toContain('<strong>')
  })
})
