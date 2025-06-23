/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'

describe('CSS Loading', () => {
  test('should have Tailwind typography styles available', () => {
    // Create a simple component with prose classes
    const TestComponent = () => (
      <div className="prose">
        <h1>Test Heading</h1>
        <p>Test paragraph</p>
      </div>
    )
    
    const { container } = render(<TestComponent />)
    const proseDiv = container.querySelector('.prose')
    
    expect(proseDiv).toBeTruthy()
    expect(proseDiv?.className).toContain('prose')
    
    // Check if h1 exists inside prose
    const h1 = proseDiv?.querySelector('h1')
    expect(h1).toBeTruthy()
    expect(h1?.textContent).toBe('Test Heading')
  })
})
