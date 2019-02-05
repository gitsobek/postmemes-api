const puppeteer = require('puppeteer')
const userFactory = require('./factories/user')
const sessionFactory = require('./factories/session')

let browser, page

beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox']
    })
    page = await browser.newPage()
    await page.goto('http://localhost:5000')
})

afterEach(async () => {
    await browser.close()
})

test('Test API status', async (done) => {
    const innerText = await page.evaluate(() => {
        return JSON.parse(document.querySelector("pre").innerHTML)
    })

    expect(innerText.message).toMatch("Hello, postmemes API user!")
    done()
})

test('Test OAuth Flow', async (done) => {
    await page.goto('http://localhost:5000/auth/google/start')

    const url = await page.url()

    expect(url).toMatch(/accounts\.google\.com/)
    done()
})

test('Login to the system and check if user is authorized for posts route', async (done) => {
    const user = await userFactory()
    const { session, sig } = sessionFactory(user)

    await page.setCookie({ name: 'session', value: session })
    await page.setCookie({ name: 'session.sig', value: sig })
    await page.goto('http://localhost:5000/api/posts')

    const innerText = await page.evaluate(() => {
        return JSON.parse(document.querySelector("pre").innerHTML)
    })

    expect(Array.isArray(innerText)).toBe(true)
    done()
})