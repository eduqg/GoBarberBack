import mongoose from 'mongoose';

// Vamos usar mongo para notificações pois ele não precisa de relacionamentos
// Apenas id
const NotificationSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  user: {
    type: Number,
    required: true,
  },
  read: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true,
});

export default mongoose.model('Notification', NotificationSchema);
