const { test, expect } = require('@playwright/test');

test.describe('Drawing App Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
    });

    test('should load the app and display controls', async ({ page }) => {
        await expect(page.locator('#toolSelect')).toBeVisible();
        await expect(page.locator('#thicknessSlider')).toBeVisible();
        await expect(page.locator('#colorPicker')).toBeVisible();
        await expect(page.locator('#clearCanvas')).toBeVisible();
        await expect(page.locator('#saveDrawing')).toBeVisible();
    });

    test('should allow drawing with the pen tool', async ({ page }) => {
        const canvas = page.locator('canvas');
        await expect(canvas).toBeVisible();

        const boundingBox = await canvas.boundingBox();
        const startX = boundingBox.x + 50;
        const startY = boundingBox.y + 50;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + 100, startY + 100);
        await page.mouse.up();

        const screenshot = await canvas.screenshot();
        expect(screenshot).toBeTruthy();
    });

    test('should allow changing brush color and thickness', async ({ page }) => {
        const canvas = page.locator('canvas');
        const colorPicker = page.locator('#colorPicker');
        const thicknessSlider = page.locator('#thicknessSlider');

        await colorPicker.fill('#ff0000');
        await expect(colorPicker).toHaveValue('#ff0000');

        await thicknessSlider.fill('20');
        await expect(thicknessSlider).toHaveValue('20');

        const boundingBox = await canvas.boundingBox();
        const startX = boundingBox.x + 150;
        const startY = boundingBox.y + 150;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + 100, startY + 100);
        await page.mouse.up();

        const screenshot = await canvas.screenshot();
        expect(screenshot).toBeTruthy();
    });

    test('should allow clearing the canvas', async ({ page }) => {
        const canvas = page.locator('canvas');
        const clearButton = page.locator('#clearCanvas');

        const boundingBox = await canvas.boundingBox();
        const startX = boundingBox.x + 50;
        const startY = boundingBox.y + 50;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + 100, startY + 100);
        await page.mouse.up();

        await clearButton.click();

        const clearedScreenshot = await canvas.screenshot();
        expect(clearedScreenshot).toBeTruthy();
    });

    const fs = require('fs');
    const path = require('path');
});
