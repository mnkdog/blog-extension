import { render, screen } from '@testing-library/react'
import Home from '../page'

// Mock the posts library
jest.mock('../../lib/posts', () => ({
  getAllPosts: () => [
    {
      slug: '2025-06-17-test-post',
      title: 'Test Post',
      date: '2025-06-17',
      content: '# Test Post\n\nThis is test content.'
    },
    {
      slug: '2025-06-16-another-post', 
      title: 'Another Post',
      date: '2025-06-16',
      content: '# Another Post\n\nMore content here.'
    }
  ]
}))

describe('Home Page', () => {
  test('should display blog posts from posts library', () => {
    render(<Home />)
    
    expect(screen.getByText('My Blog')).toBeInTheDocument()
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Another Post')).toBeInTheDocument()
    expect(screen.getByText('2025-06-17')).toBeInTheDocument()
  })
})
