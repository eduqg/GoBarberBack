import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    // Verificar se usuário existe
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // 401 = Não autorizado
      return res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    // sign = mando payload, string aleatoria (gere uma no md5 online), configurações do token
    // Token pode expirar
    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, 'f6698fc96e0b3a19056a1de6eabeeb82',{
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController();
