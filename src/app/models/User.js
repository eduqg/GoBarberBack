import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

// Esses campos não precisam ser um reflexo da base de dados
// São campos que usuário pode preencher (password)
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    // Antes de salvar esse trecho de código é executado
    this.addHook('beforeSave', async (user) => {
      // Se campo de password foi preenchido no create ou update
      if (user.password) {
        // Numero de 0 a 100 para força de criptografia
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
