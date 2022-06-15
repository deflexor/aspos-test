import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

const WEATHER_DATA = [
  { id: 'NY', location: 'New York', temp: 20 },
  { id: 'Tokyo', location: 'Tokyo', temp: 24 },
  { id: 'Msk', location: 'Moscow', temp: 15 },
  { id: 'Paris', location: 'Paris', temp: 19 },
  { id: 'SA', location: 'Saudi Arabia', temp: 36 },
  { id: 'Norway', location: 'Norway', temp: 14 }
]

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop'

function setupAPI (app) {
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.post('/api/signin', (req, res) => {
    const { userEmail, _userPassword } = req.body
    res.json({ email: userEmail })
  })

  app.post('/api/signup', (req, res) => {
    const { userEmail, _userPassword } = req.body
    res.json({ email: userEmail })
  })

  app.get('/api/weather', (req, res) => {
    const query = req.query

    if (query.location) {
      const loc = WEATHER_DATA.find(l => l.id === query.location)
      if (loc) {
        res.json(loc)
      } else {
        res.status(404).send('Location id not found')
      }
    } else if (query.userId) {
      res.json(WEATHER_DATA[0])
    } else {
      res.json(WEATHER_DATA)
    }
  })

  app.post('/api/weather', (req, res) => {
    res.json({ ok: true })
  })

  app.post('/api/feedback', (req, res) => {
    const userData = req.body

    console.log('/api/feedback', userData)

    res.json({ ok: true })
  })
}

export async function createServer (
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''

  const app = express()

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: 'ssr',
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100
        },
        hmr: {
          port: hmrPort
        }
      }
    })
    // use vite's connect instance as middleware
    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false
      })
    )
  }

  setupAPI(app)

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let template, render
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        // render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = indexProd
        // @ts-ignore
        // render = (await import('./dist/server/entry-server.tsx')).render
      }

      // const context = {}
      // const appHtml = render(url, context)

      /*if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url)
      }*/

      const appHtml = ''
      const html = template.replace('<!--app-html-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  )
}
