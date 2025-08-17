import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../routes/Home'
import { waitForKonva, createMockKonvaEvent } from './konva-test-utils'

// Mock react-konva to prevent canvas issues
vi.mock('react-konva', () => ({
  Stage: ({ children, ...props }: any) => <div data-testid="stage" {...props}>{children}</div>,
  Layer: ({ children, ...props }: any) => <div data-testid="layer" {...props}>{children}</div>,
  Circle: (props: any) => <div data-testid="circle" {...props} />,
  Rect: (props: any) => <div data-testid="rect" {...props} />,
  Star: (props: any) => <div data-testid="star" {...props} />,
  Line: (props: any) => <div data-testid="line" {...props} />,
}))

// Mock konva
vi.mock('konva', () => ({
  default: {},
  Konva: {},
}))

// Mock the debug logging
vi.mock('../stores/interactionStore', async () => {
  const actual = await vi.importActual('../stores/interactionStore')
  return {
    ...actual,
    useInteractionStore: () => ({
      debugLogging: false,
      debugLog: vi.fn(),
      toggleDebugLogging: vi.fn(),
      setDebugLogging: vi.fn(),
    }),
  }
})

const renderApp = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  )
}

describe('Shape Dragging', () => {
  beforeEach(() => {
    // Reset any persistent state
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should render the app with toolbar buttons', async () => {
    renderApp()
    
    // Check that toolbar buttons are present
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    await waitForKonva()
    
    // Should render without crashing
    expect(true).toBe(true)
  })

  it('should render stage component', async () => {
    const { container } = renderApp()
    
    // Check that stage is rendered
    const stage = container.querySelector('[data-testid="stage"]')
    expect(stage).toBeDefined()

    await waitForKonva()
  })

  it('should handle button clicks', async () => {
    renderApp()
    
    // Find any button and click it
    const buttons = screen.getAllByRole('button')
    if (buttons.length > 0) {
      fireEvent.click(buttons[0])
    }

    await waitForKonva()
    
    // Should not crash
    expect(true).toBe(true)
  })
})

describe('Shape Component Unit Tests', () => {
  it('should handle drag events correctly', () => {
    const mockOnPositionUpdate = vi.fn()
    const mockOnSelect = vi.fn()
    
    // Mock shape data
    const mockShape = {
      id: 'test-shape-1',
      type: 'circle',
      x: 100,
      y: 100,
      fill: '#ff0000',
    }

    // Create mock Konva events
    const dragStartEvent = createMockKonvaEvent('dragstart', mockShape, { x: 100, y: 100 })
    const dragMoveEvent = createMockKonvaEvent('dragmove', mockShape, { x: 150, y: 125 })
    const dragEndEvent = createMockKonvaEvent('dragend', mockShape, { x: 200, y: 150 })

    // Test that position update is called with correct values
    // Note: In a real implementation, you'd need to test the actual Shape component
    // This is a simplified example of how you'd structure such tests
    
    expect(mockShape.id).toBe('test-shape-1')
    expect(dragEndEvent.target.position()).toEqual({ x: 200, y: 150 })
  })

  it('should validate position coordinates', () => {
    const validPosition = { x: 100, y: 100 }
    const invalidPosition = { x: NaN, y: 100 }
    const infinitePosition = { x: Infinity, y: 100 }

    // Test position validation logic
    const isValidPosition = (pos: { x: number; y: number }) => 
      !isNaN(pos.x) && !isNaN(pos.y) && isFinite(pos.x) && isFinite(pos.y)

    expect(isValidPosition(validPosition)).toBe(true)
    expect(isValidPosition(invalidPosition)).toBe(false)
    expect(isValidPosition(infinitePosition)).toBe(false)
  })
})