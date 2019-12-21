import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
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

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation Fails.', messages: err.inner });
  }
};
