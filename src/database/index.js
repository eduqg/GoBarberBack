import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, File];

class Database {
  constructor() {
    this.init();
  }

  // Conecta com base de dados carrega models
  init() {
    // Conecta com a base de dados
    this.connection = new Sequelize(databaseConfig);

    // Para cada model, chamar metodo init, passando a conexão
    // Se existir método de associação, chamar
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
