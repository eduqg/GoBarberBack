import express from 'express';
import path from 'path';
import Youch from 'youch';
import * as Sentry from '@sentry/node';
import 'express-async-errors';

import routes from './routes';
import sentryConfig from './config/sentry';

import './database';

class App {
  constructor() {
    this.server = express();

    Sentry.init(sentryConfig);
    // Devem ser instanciados para poderem ser usados

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    // Para servir arquivos estáticos, que podem ser acessados diretamente pelo navegador
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  routes() {
    this.server.use(routes);
    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      const errors = await new Youch(err, req).toJSON();
      // 500 = Internal server error
      return res.status(500).json(errors);
    });
  }
}

export default new App().server;
