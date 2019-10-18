// Configurações do JSON Web Token
export default {
  secret: process.env.APP_SECRET,
  expiresIn: '7d',
};
