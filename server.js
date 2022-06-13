import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop'

function setupAPI(app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.post('/api/signin', (req, res) => {
    const { userEmail, _userPassword } = req.body;
    res.json({ email: userEmail })
  });
  
  app.post('/api/signup', (req, res) => {
    const { userEmail, _userPassword } = req.body;
    res.json({ email: userEmail })
  });


    /*   POST api/signup – добавляет нового пользователя в систему.
    Параметры:
    email – почтовый адрес, который должен быть уникален для каждого пользователя
    password - пароль

    POST api/signin – логинит существующего пользователя.
    Параметры:
    email – уникальный почтовый адрес пользователя
    password - пароль


    */

    /*
     Виджет показывает температуру в выбранном месте (Например, “NY 20°C”). 
     Место, для которого отображается температура, можно выбрать из списка доступных. 
     Если пользователь не вошел в систему, то показывается погода в месте по умолчанию.
     Если пользователь вошел в систему, то показывается погода в месте,
    которое он сохранил в системе для себя (или погода в месте по умолчанию, если пользователь не сохранял погоду).

     */
    // GET api/weather – возвращает список мест и их идентификаторов, по которым есть данные по погоде.
    // GET api/weather?location={locationId} – возвращает текущую температуру и место по идентификатору места locationId.
    // GET api/weather?user={userId} – возвращает текущую температуру и место по идентификатору пользователя.
    // POST api/weather –для заданного пользователя сохраняет место, в котором ему показывается погода.

    app.get('/api/weather', (req, res) => {
          const query = req.query;

          console.log(query);
     
          // res.json(book);
          res.status(404).send('Book not found');
    });
    app.post('/api/weather', (req, res) => {
      const userData = req.body;

      console.log('/api/weather', userData);

      res.status(404).send('Book not found');
    });
  

    /*     Виджет Обратная связь
    Этот виджет нужно добавить после текста статьи.
    Виджет позволяет отправить обратную связь о странице: 
    оценка (хорошо или плохо),
    текст (не более 200 символов),
    email пользователя (если пользователь вошел в систему, то email добавляется автоматически, а для анонимного пользователя это поле необязательное, его можно заполнить).
    API
    POST api/feedback–отправляет обратную связь о странице.
    Параметры:
    text – текст обратной связи
    grade – оценка страницы (возможные значения “good” и “bad”)
    page – адрес страницы, которой дается обратная связь.
    email – необязательный параметр. */
    app.post('/api/feedback', (req, res) => {
      const userData = req.body;

      console.log('/api/feedback', userData);

      res.status(404).send('Book not found');
    });

}

export async function createServer(
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
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = indexProd
        // @ts-ignore
        render = (await import('./dist/server/entry-server.js')).render
      }

      const context = {}
      const appHtml = render(url, context)

      if (context.url) {
        // Somewhere a `<Redirect>` was rendered
        return res.redirect(301, context.url)
      }

      const html = template.replace(`<!--app-html-->`, appHtml)

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
