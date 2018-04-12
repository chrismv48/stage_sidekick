const express = require('express');
const proxy = require('express-http-proxy');

const app = express();

const port = process.env.PORT || 3000;
const path = require('path')
const webpack = require('webpack')

const proxyHost = '127.0.0.1';
const proxyPort = '3005';

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));

app.use('/api', proxy(`${proxyHost}:${proxyPort}`));
app.use(express.static('public'))

const isProd = process.env.NODE_ENV === 'production'

let config

if (isProd) {
  config = require('./webpack.prod.js')
} else {
  config = require('./webpack.dev.js')
}

const publicPath = config.output.publicPath || '/';
const outputPath = config.output.path || path.resolve(process.cwd(), 'dist');

if (!isProd) {
  console.log('Development env detected: Initializing hot reloading')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler, {
    log: console.log,
    path: '/__webpack_hmr'
  }))

  app.use(webpackDevMiddleware(compiler, {
    entry: config.entry,
    publicPath: config.output.publicPath,
    stats: {
      colors: true
    }
  }))

  app.use('*', function (req, res, next) {
    const filename = path.join(compiler.outputPath, 'index.html')
    compiler.outputFileSystem.readFile(filename, (err, result) => {
      if (err) {
        return next(err)
      }
      res.set('content-type', 'text/html')
      res.send(result)
      res.end()
    })
  })

} else {
  app.use(publicPath, express.static(outputPath));
  app.get('*.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
  });
  app.get('*', (req, res) => res.sendFile(path.resolve(outputPath, 'index.html')));
}

app.listen(port, (err) => {
  if (err) {
    console.log(err.message)
  } else {
    console.log(`Server Started at port ${port}`);
  }
});

