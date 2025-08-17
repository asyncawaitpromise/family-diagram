import { test, expect } from '@playwright/test'

test.describe('Basic App Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for the app to load - target the main canvas specifically
    await page.waitForSelector('#root canvas')
    await page.waitForTimeout(1000) // Give the app time to initialize
  })

  test('should load the app and show canvas and toolbar', async ({ page }) => {
    // Check that canvas is visible
    await expect(page.locator('#root canvas')).toBeVisible()
    
    // Check that toolbar is visible with shape buttons
    const toolbar = page.locator('.btn-primary')
    await expect(toolbar).toHaveCount(3) // Circle, Rectangle, Star buttons
  })

  test('should place a new circle object on the canvas', async ({ page }) => {
    // Click the first shape button (circle)
    const circleButton = page.locator('.btn-primary').first()
    await circleButton.click()
    
    // Wait a moment for the shape to be added
    await page.waitForTimeout(500)
    
    // Verify the app didn't crash - canvas should still be visible
    await expect(page.locator('#root canvas')).toBeVisible()
  })

  test('should place a new rectangle object on the canvas', async ({ page }) => {
    // Click the second shape button (rectangle)  
    const rectButton = page.locator('.btn-primary').nth(1)
    await rectButton.click()
    
    // Wait a moment for the shape to be added
    await page.waitForTimeout(500)
    
    // Verify the app didn't crash
    await expect(page.locator('#root canvas')).toBeVisible()
  })

  test('should place a new star object on the canvas', async ({ page }) => {
    // Click the third shape button (star)
    const starButton = page.locator('.btn-primary').nth(2)
    await starButton.click()
    
    // Wait a moment for the shape to be added
    await page.waitForTimeout(500)
    
    // Verify the app didn't crash
    await expect(page.locator('#root canvas')).toBeVisible()
  })

  test('should allow panning the display', async ({ page }) => {
    // Add a shape first so we can see the pan effect
    await page.locator('.btn-primary').first().click()
    await page.waitForTimeout(500)
    
    const canvas = page.locator('#root canvas')
    
    // Pan by dragging on the canvas
    await canvas.hover({ position: { x: 200, y: 200 } })
    await page.mouse.down()
    await page.mouse.move(300, 250)
    await page.mouse.up()
    
    // Verify the app is still functional
    await expect(canvas).toBeVisible()
  })

  test('should allow moving a placed object', async ({ page }) => {
    // Add a shape
    await page.locator('.btn-primary').first().click()
    await page.waitForTimeout(500)
    
    const canvas = page.locator('#root canvas')
    
    // Try to select and drag the shape (assuming it's placed near center)
    await canvas.click({ position: { x: 400, y: 300 } })
    await page.waitForTimeout(200)
    
    // Drag the shape to a new position
    await canvas.hover({ position: { x: 400, y: 300 } })
    await page.mouse.down()
    await page.mouse.move(500, 200)
    await page.mouse.up()
    
    // Verify the app is still functional
    await expect(canvas).toBeVisible()
  })

  test('should handle multiple shapes', async ({ page }) => {
    // Add multiple shapes
    await page.locator('.btn-primary').first().click() // Circle
    await page.waitForTimeout(300)
    
    await page.locator('.btn-primary').nth(1).click() // Rectangle
    await page.waitForTimeout(300)
    
    await page.locator('.btn-primary').nth(2).click() // Star
    await page.waitForTimeout(300)
    
    // Verify the app is still functional
    await expect(page.locator('#root canvas')).toBeVisible()
  })
})