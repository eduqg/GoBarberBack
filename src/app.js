import express from 'express';
import path from 'path';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.server = express();
    // Devem ser instanciados para poderem ser usados
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    // Para servir arquivos estáticos, que podem ser acessados diretamente pelo navegador
    this.server.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')));
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
