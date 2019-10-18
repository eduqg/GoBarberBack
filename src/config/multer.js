import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      // Para gerar nome aleatório para o arquivo
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        // cb(recebe erro, funão)
        return cb(null, res.toString('hex') + file.originalname);
      });
    },
  }),
};
