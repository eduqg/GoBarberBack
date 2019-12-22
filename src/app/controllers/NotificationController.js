import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    // Verifica se usuário logado é o pretador de serviços
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    // Somente provedores de serviços podem carregar notificações
    if (!checkIsProvider) {
      // 401 = Não autorizado
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    // Acha e atualiza notificação. Quero atualizar para lido
    // Colocar new: true para retornar nova atualização atualizada
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

export default new NotificationController();
