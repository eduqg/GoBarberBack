import * as Yup from 'yup';

import User from '../models/User';
import File from '../models/File';

class UserController {
  async store(req, res) {
    const userExists = await User.findOne({ where: { email: req.body.email } });

    // Caso seja usuário duplicado
    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    // when = quero que quando senha antiga foi digitada, senha também deve ser digitada
    // Se senha antiga for digitada ? Quero que campo de senha senha obrigatório, se não retorne o
    // o campo normalmente sem o required
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, fieldPassword) =>
          oldPassword ? fieldPassword.required() : fieldPassword
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails.' });
    }
    const { email, oldPassword } = req.body;
    const user = await User.findByPk(req.userId);

    // Se usuário quiser trocar email, primeiro checar se alguem já está usando-o
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      // Caso seja usuário duplicado
      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    // Só faço a verificação da senha se ele informou que quer trocar de senha (old password)
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({ error: 'Password does not match.' });
    }

    await user.update(req.body);

    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({
      id,
      name,
      email,
      avatar,
    });
  }
}

export default new UserController();
