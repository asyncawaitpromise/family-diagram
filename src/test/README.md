# Testing Guide

This directory contains comprehensive tests for the drag and drop functionality in the Family Diagram application.

## Test Structure

### Core Test Files

- **`setup.ts`** - Vitest configuration and mocks for Canvas/Konva
- **`konva-test-utils.ts`** - Utilities for testing Konva interactions
- **`shape-dragging.test.tsx`** - Tests for shape selection and dragging
- **`canvas-panning.test.tsx`** - Tests for canvas panning functionality  
- **`selection-border.test.tsx`** - Tests for selection border following
- **`integration.test.tsx`** - End-to-end workflow tests

## Running Tests

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run specific test file
npm run test shape-dragging

# Run tests in watch mode
npm run test --watch
```

## Test Categories

### 1. Shape Dragging Tests
- ✅ Shape selection and deselection
- ✅ Drag functionality for selected shapes
- ✅ Position validation (prevents NaN/Infinity)
- ✅ Prevention of dragging unselected shapes

### 2. Canvas Panning Tests  
- ✅ Panning on empty canvas space
- ✅ Prevention of panning when clicking shapes
- ✅ Shape deselection on empty space clicks
- ✅ Multiple pan operations
- ✅ Pan + zoom combinations

### 3. Selection Border Tests
- ✅ Border visibility with shape selection
- ✅ Real-time position updates during drag
- ✅ Border position calculations for different shape types
- ✅ Rapid update handling

### 4. Integration Tests
- ✅ Complete workflows (add → select → drag → pan)
- ✅ Cross-feature interactions
- ✅ State consistency across operations
- ✅ Rapid user interaction handling
- ✅ Error boundary testing

## Key Test Utilities

### `simulateKonvaDrag(element, options)`
Simulates a complete drag operation with mousedown → mousemove → mouseup events.

### `simulateShapeDrag(canvas, shapeId, options)`
Specifically tests shape dragging with proper event targeting.

### `simulateCanvasPan(canvas, options)`
Tests canvas panning on empty space.

### `createMockKonvaEvent(type, target, position)`
Creates mock Konva event objects for unit testing.

## Mocking Strategy

### Canvas/Konva Mocks
- HTMLCanvasElement.getContext() returns mock context
- getBoundingClientRect() provides consistent dimensions
- Konva events are simulated with proper structure

### Store Mocks
- Zustand stores are mocked for isolated testing
- Debug logging is disabled in tests
- State changes are tracked and validated

## What These Tests Protect Against

### Regression Prevention
- ✅ Shapes jumping to (0,0) during drag
- ✅ Selection border not following shapes
- ✅ Canvas panning interfering with shape dragging
- ✅ Invalid coordinates causing crashes
- ✅ State inconsistencies between operations

### Edge Cases
- ✅ Rapid user interactions
- ✅ Invalid coordinate handling
- ✅ Component unmounting during operations
- ✅ Multiple simultaneous operations

## Adding New Tests

When adding new drag/drop features:

1. **Unit Tests** - Test the component/hook logic in isolation
2. **Integration Tests** - Test how the feature works with existing functionality  
3. **Edge Cases** - Test error conditions and boundary cases
4. **Regression Tests** - Add specific tests for any bugs you fix

### Example Test Structure
```typescript
describe('New Feature', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('should handle normal operation', async () => {
    const { container } = renderApp()
    // ... test implementation
    await waitForKonva()
    expect(/* assertions */)
  })

  it('should handle edge cases', async () => {
    // ... edge case tests
  })
})
```

## Debugging Test Failures

### Common Issues
1. **Canvas not found** - Check that components render properly
2. **Timing issues** - Use `waitForKonva()` after interactions
3. **Event not firing** - Verify event coordinates are within canvas bounds
4. **State not updating** - Check that mocks are properly configured

### Debug Tools
```typescript
// Enable debug logging in tests
vi.mock('../stores/interactionStore', () => ({
  useInteractionStore: () => ({
    debugLogging: true, // Enable for debugging
    debugLog: console.log, // Use real console.log
    // ...
  })
}))
```

## CI/CD Integration

Tests are designed to run in headless environments:
- No real canvas rendering required
- Consistent timing with `waitForKonva()`
- Proper cleanup between tests
- Deterministic results

Add to your CI pipeline:
```yaml
- name: Run Tests
  run: npm run test:run
```