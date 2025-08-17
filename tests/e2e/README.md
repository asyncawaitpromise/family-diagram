# End-to-End Testing with Playwright

This directory contains comprehensive E2E tests for the Family Diagram application, specifically testing drag and drop functionality with real browser interactions.

## Why Playwright for UI Testing?

- ✅ **Real Browser Testing** - Tests actual canvas/Konva rendering
- ✅ **Actual Mouse Interactions** - Tests real drag and drop behavior
- ✅ **Visual Regression** - Captures screenshots to detect UI changes
- ✅ **Cross-Browser** - Tests in Chrome, Firefox, Safari, and mobile
- ✅ **No Mocking** - Tests the complete user experience

## Test Structure

### Core Test Files

- **`drag-and-drop.spec.ts`** - Main functionality tests
- **`visual-regression.spec.ts`** - Screenshot-based visual tests
- **`edge-cases.spec.ts`** - Error handling and boundary tests

## Running E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui

# Run in debug mode (step through tests)
npm run test:e2e:debug

# Run specific test file
npx playwright test drag-and-drop.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium

# Run both unit and E2E tests
npm run test:all
```

## Test Coverage

### 1. Core Drag and Drop Functionality
- ✅ Shape creation and selection
- ✅ Dragging selected shapes to new positions
- ✅ Canvas panning on empty space
- ✅ Selection border visibility
- ✅ Shape deselection on empty clicks
- ✅ Multiple shape handling

### 2. Advanced Interactions
- ✅ Zoom + drag combinations
- ✅ Rapid user interactions
- ✅ Pan and zoom workflows
- ✅ Debug logging toggle
- ✅ Shape deletion

### 3. Visual Regression Tests
- ✅ Empty canvas baseline
- ✅ Canvas with shapes
- ✅ Selected shape with border
- ✅ After dragging operations
- ✅ After panning operations
- ✅ Multiple shapes layouts
- ✅ Mobile layouts
- ✅ Dark mode (if applicable)

### 4. Edge Cases and Error Handling
- ✅ Clicking outside canvas bounds
- ✅ Rapid shape creation
- ✅ Extreme drag positions
- ✅ Window resize during interactions
- ✅ Keyboard navigation
- ✅ Touch gestures on mobile
- ✅ Long drag operations
- ✅ Overlapping shapes
- ✅ Performance with many shapes
- ✅ Browser navigation

## Key Test Patterns

### Basic Shape Interaction
```typescript
// Add a shape
await page.click('button:has-text("Circle")')
await page.waitForTimeout(500)

// Select and drag
const canvas = page.locator('canvas')
await canvas.click({ position: { x: 400, y: 300 } })
await canvas.dragTo(canvas, {
  sourcePosition: { x: 400, y: 300 },
  targetPosition: { x: 500, y: 200 }
})
```

### Canvas Panning
```typescript
// Pan by dragging empty space
await canvas.dragTo(canvas, {
  sourcePosition: { x: 100, y: 100 },
  targetPosition: { x: 200, y: 150 }
})
```

### Visual Testing
```typescript
// Take screenshot for comparison
await expect(page).toHaveScreenshot('test-state.png')
```

## What These Tests Protect Against

### Regression Prevention
- ✅ Shapes jumping to (0,0) during drag
- ✅ Selection border not following shapes
- ✅ Canvas panning interfering with shape drag
- ✅ UI breaking on different browsers/devices
- ✅ Visual regressions in the interface

### Real User Scenarios
- ✅ Complete workflows from start to finish
- ✅ Multi-step operations (add → select → drag → pan)
- ✅ Error recovery from invalid interactions
- ✅ Performance under load
- ✅ Mobile device interactions

## Test Configuration

### Browser Coverage
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome Mobile, Safari Mobile
- **Viewports**: Desktop (1280x720), Mobile (375x667)

### Test Settings
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

## Debugging Failed Tests

### View Test Results
```bash
# Open HTML report
npx playwright show-report
```

### Debug Specific Test
```bash
# Run single test in debug mode
npx playwright test --debug drag-and-drop.spec.ts
```

### Visual Debugging
- Failed tests automatically capture screenshots
- Video recordings show the complete interaction
- Trace viewer shows step-by-step execution

## CI/CD Integration

The tests are configured to run in CI environments:

```yaml
# GitHub Actions example
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Run E2E Tests
  run: npm run test:e2e

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: failure()
  with:
    name: playwright-report
    path: playwright-report/
```

## Visual Regression Testing

Screenshots are stored in `tests/e2e/visual-regression.spec.ts-snapshots/`:
- Baseline images are committed to git
- Test failures show visual diffs
- Update baselines with `--update-snapshots`

```bash
# Update visual baselines
npx playwright test --update-snapshots
```

## Performance Monitoring

E2E tests also monitor performance:
- Page load times
- Interaction responsiveness  
- Memory usage with many shapes
- Rendering performance

## Adding New E2E Tests

### For New Features
1. Add test to appropriate spec file
2. Follow existing patterns for setup
3. Include both happy path and edge cases
4. Add visual regression test if UI changes

### Test Structure Template
```typescript
test('should handle new feature', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('canvas')
  
  // Setup
  // Action
  // Assertion
  
  await expect(canvas).toBeVisible()
})
```

## Best Practices

1. **Wait for Elements** - Always wait for canvas to load
2. **Consistent Timing** - Use appropriate timeouts for animations
3. **Stable Selectors** - Use data-testid for reliable element selection
4. **Isolated Tests** - Each test should be independent
5. **Clean State** - Tests start with fresh application state

These E2E tests ensure your drag and drop functionality works perfectly for real users across all browsers and devices! 🚀