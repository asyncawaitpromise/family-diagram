import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'

// Simple test to verify setup works
describe('Basic Test Setup', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should render a simple component', () => {
    const SimpleComponent = () => <div>Hello Test</div>
    const { getByText } = render(<SimpleComponent />)
    expect(getByText('Hello Test')).toBeDefined()
  })

  it('should have vi (vitest) available', () => {
    const mockFn = vi.fn()
    mockFn('test')
    expect(mockFn).toHaveBeenCalledWith('test')
  })

  it('should have canvas mocks available', () => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    expect(context).toBeDefined()
  })
})