import 'dotenv/config';

// A fila será rodada em paralelo a nossa aplicação
// Ela não influenciará no processamento da aplicação
import Queue from './lib/Queue';

Queue.processQueue();
