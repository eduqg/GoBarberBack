import { Router } from 'express';
import User from './app/models/User';

const routes = new Router();

routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Eduardo',
    email: 'edu@edu.com',
    password_hash: '1092312129',
  });
  return res.json(user);
});

export default routes;
