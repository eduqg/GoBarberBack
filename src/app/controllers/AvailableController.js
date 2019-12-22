import AvailableService from '../services/AvailableService';

// Agenda do usuário
class AvailableController {
  async index(req, res) {
    // date pego no console com new Date().getTime()
    // Formato: 1571429292106
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // 2018-06-23 17:59:10
    const searchDate = Number(date);

    const available = await AvailableService.run({
      date: searchDate,
      provider_id: req.params.providerId,
    });

    return res.json(available);
  }
}

export default new AvailableController();
