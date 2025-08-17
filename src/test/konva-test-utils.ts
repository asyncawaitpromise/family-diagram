import { fireEvent } from '@testing-library/react'

export interface Point {
  x: number
  y: number
}

export interface DragOptions {
  from: Point
  to: Point
  steps?: number
}

/**
 * Simulates a Konva drag operation by firing the appropriate events
 */
export const simulateKonvaDrag = (element: HTMLElement, options: DragOptions) => {
  const { from, to, steps = 5 } = options
  
  // Calculate step size for smooth drag
  const stepX = (to.x - from.x) / steps
  const stepY = (to.y - from.y) / steps

  // Start drag
  fireEvent.mouseDown(element, {
    clientX: from.x,
    clientY: from.y,
    buttons: 1,
  })

  // Intermediate drag moves
  for (let i = 1; i <= steps; i++) {
    const currentX = from.x + stepX * i
    const currentY = from.y + stepY * i
    
    fireEvent.mouseMove(element, {
      clientX: currentX,
      clientY: currentY,
      buttons: 1,
    })
  }

  // End drag
  fireEvent.mouseUp(element, {
    clientX: to.x,
    clientY: to.y,
  })
}

/**
 * Simulates a Konva shape drag by targeting the shape specifically
 */
export const simulateShapeDrag = (
  canvas: HTMLCanvasElement,
  shapeId: string,
  options: DragOptions
) => {
  const { from, to } = options

  // Simulate mouse down on shape
  fireEvent.mouseDown(canvas, {
    clientX: from.x,
    clientY: from.y,
    buttons: 1,
  })

  // Simulate drag move
  fireEvent.mouseMove(canvas, {
    clientX: to.x,
    clientY: to.y,
    buttons: 1,
  })

  // Simulate mouse up
  fireEvent.mouseUp(canvas, {
    clientX: to.x,
    clientY: to.y,
  })
}

/**
 * Simulates canvas panning
 */
export const simulateCanvasPan = (canvas: HTMLCanvasElement, options: DragOptions) => {
  simulateKonvaDrag(canvas, options)
}

/**
 * Gets the canvas element from a container
 */
export const getCanvas = (container: HTMLElement): HTMLCanvasElement => {
  const canvas = container.querySelector('canvas')
  if (!canvas) {
    throw new Error('Canvas not found in container')
  }
  return canvas
}

/**
 * Waits for Konva animations and re-renders to complete
 */
export const waitForKonva = () => new Promise(resolve => setTimeout(resolve, 100))

/**
 * Mock Konva event object
 */
export const createMockKonvaEvent = (
  type: string,
  target: any,
  position: Point,
  stage?: any
) => ({
  type,
  target: {
    ...target,
    getStage: () => stage || {
      getPointerPosition: () => position,
      x: () => 0,
      y: () => 0,
      scaleX: () => 1,
      scaleY: () => 1,
      position: () => ({ x: 0, y: 0 }),
      container: () => ({
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 800,
          height: 600,
        }),
      }),
    },
    position: () => position,
    x: () => position.x,
    y: () => position.y,
    constructor: { name: target.constructor?.name || 'MockShape' },
    id: () => target.id || 'mock-id',
  },
  evt: {
    clientX: position.x,
    clientY: position.y,
    preventDefault: vi.fn(),
  },
})

/**
 * Creates a mock store with testing utilities
 */
export const createMockStore = (initialState: any = {}) => {
  let state = { ...initialState }
  const listeners: Array<() => void> = []

  return {
    getState: () => state,
    setState: (newState: any) => {
      state = { ...state, ...newState }
      listeners.forEach(listener => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.push(listener)
      return () => {
        const index = listeners.indexOf(listener)
        if (index > -1) listeners.splice(index, 1)
      }
    },
    destroy: () => {
      listeners.length = 0
    },
  }
}