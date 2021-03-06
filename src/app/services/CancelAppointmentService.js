import { isBefore, subHours } from 'date-fns';

import User from '../models/User';
import Appointment from '../models/Appointment';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

import Cache from '../../lib/Cache';

class CancelAppointmentService {
  async run({ provider_id, user_id }) {
    const appointment = await Appointment.findByPk(provider_id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== user_id) {
      throw new Error("You don't have permission to cancel this appointment.");
    }

    // Remove duas horas do horário do agendamento
    const limitDate = subHours(appointment.date, 2);
    // Agendamento: 13:00
    // Horario limite para cancelar: 11:00
    // Agora: 11:25h
    if (isBefore(limitDate, new Date())) {
      throw new Error('You only can cancel appointments 2 hours in advance.');
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    });

    // Invalidade cache
    await Cache.invalidatePrefix(`user:${user_id}:appointments`);

    return appointment;
  }
}

export default new CancelAppointmentService();
