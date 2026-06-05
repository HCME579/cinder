import { test, expect, _electron as electron } from '@playwright/test'
import { type ElectronApplication, type Page } from '@playwright/test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

let app: ElectronApplication
let page: Page

test.beforeAll(async () => {
  // Assumes `npm run build` has been run so dist-electron + dist exist.
  app = await electron.launch({
    args: [path.join(__dirname, '..', '..', 'dist-electron', 'main', 'index.js')]
  })
  page = await app.firstWindow()
  page.on('console', (msg) => {
    // eslint-disable-next-line no-console
    console.log(`[renderer:${msg.type()}]`, msg.text())
  })
  page.on('pageerror', (err) => {
    // eslint-disable-next-line no-console
    console.log('[renderer:error]', err.message)
  })
  await page.waitForLoadState('domcontentloaded')
})

test.afterAll(async () => {
  await app.close()
})

test('app boots to the sign-in screen', async () => {
  // Wait for the root div to be populated by React.
  await page.waitForSelector('#root > *', { state: 'attached', timeout: 20_000 })
  const html = await page.content()
  // eslint-disable-next-line no-console
  console.log('--- root html (first 800 chars) ---', html.slice(0, 800))
  // Look for the sign-in screen heading. It's robust against the styled gradient text.
  await expect(page.locator('text=Sign in').first()).toBeVisible({ timeout: 15_000 })
})
