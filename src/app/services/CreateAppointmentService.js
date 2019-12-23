import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

import User from '../models/User';
import Appointment from '../models/Appointment';

import Notification from '../schemas/Notification';

import Cache from '../../lib/Cache';

class CreateAppointmentService {
  async run({ provider_id, user_id, date }) {
    /* Check if provider_id is a provider */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      // 401 = Não autorizado
      throw new Error('You can only create appointments with providers');
    }

    // Verifica datas passadas
    // ParseISO = transforma string do formato date
    // StartOfHour = ao invés de 19:27, 19:00
    const hourStart = startOfHour(parseISO(date));
    if (isBefore(hourStart, new Date())) {
      throw new Error('Past dates are not permited');
    }

    // Verificar se pretador de serviço já não tem algo agendado para aquela hora
    // Verifica se pretador está disponível
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      throw new Error('Appointment date is not avaible');
    }

    if (provider_id === user_id) {
      throw new Error('Appointment cannot be made to yourself');
    }

    const appointment = await Appointment.create({
      user_id,
      provider_id,
      date,
    });

    const user = await User.findByPk(user_id);
    const formattedDate = format(
      hourStart,
      "'dia' dd 'de' MMMM', às' H:mm'h'",
      { locale: pt }
    );

    // Notificar prestador de serviço
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    // Invalidade cache
    await Cache.invalidatePrefix(`user:${user.id}:appointments`);

    return appointment;
  }
}

export default new CreateAppointmentService();
