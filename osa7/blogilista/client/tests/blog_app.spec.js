// blog_app.spec.js
import { test, expect } from '@playwright/test'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'samppa',
        name: 'samppa Multanen',
        password: 'securepassword'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'Login'
    }).click()

    await expect(page.getByText('Username')).toBeVisible()
    await expect(page.getByText('Password')).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login'
      }).click()
      await page.getByRole('textbox').first().fill('samppa')
      await page.getByRole('textbox').last().fill('securepassword')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('samppa Multanen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login'
      }).click()
      await page.getByRole('textbox').first().fill('vaara_kayttaja')
      await page.getByRole('textbox').last().fill('badpassword')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('Username')).toBeVisible()
      await expect(page.getByText('Password')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page, request }) => {
      await request.post('http://localhost:3003/api/testing/reset')
      await request.post('http://localhost:3003/api/users', {
        data: {
          username: 'samppa',
          name: 'samppa Multanen',
          password: 'securepassword'
        }
      })
    })

    test('a new blog can be created', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login'
      }).click()
      await page.getByRole('textbox').first().fill('samppa')
      await page.getByRole('textbox').last().fill('securepassword')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('samppa Multanen logged in')).toBeVisible()

      await page.getByRole('button', { name: 'New blog' }).click()

      const inputs = page.locator('input')
      await inputs.nth(0).fill('Sampan blogi')  // Title
      await inputs.nth(1).fill('Samppa Suhonen') // Author
      await inputs.nth(2).fill('www.testisivu.fi') // Url

      await page.getByRole('button', { name: 'Add' }).click()

      await expect(page.getByText('Sampan blogi Samppa Suhonen')).toBeVisible()
    })

    test('the user can like a blog', async ({ page }) => {
      await page.goto('http://localhost:5173')
      await page.getByRole('button', { name: 'Login'
      }).click()
      await page.getByRole('textbox').first().fill('samppa')
      await page.getByRole('textbox').last().fill('securepassword')
      await page.getByRole('button', { name: 'Login' }).click()

      await page.getByRole('button', { name: 'New blog' }).click()

      const inputs = page.locator('input')
      await inputs.nth(0).fill('Sampan blogi')  // Title
      await inputs.nth(1).fill('Samppa Suhonen') // Author
      await inputs.nth(2).fill('www.testisivu.fi') // Url

      await page.getByRole('button', { name: 'Add' }).click()

      await page.getByRole('button', { name: 'View' }).last().click()
      await page.getByRole('button', { name: 'Like' }).click()
      await expect(page.getByText('Likes 1')).toBeVisible()
    })
  })
})
