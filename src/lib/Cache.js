import redis from 'ioredis';

class Cache {
  constructor() {
    this.redis = new redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      // predefinição dos caches segue as estrutura cache:user
      // fica fácil para excluir caches por nome
      keyPrefix: 'cache:',
    });
  }

  set(key, value) {
    // EX = determina quando expirar
    return this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  // Para deletar alguma chave
  invalidate(key) {
    return this.redis.del(key);
  }

  // Invalida todas as chaves com um prefixo
  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`cache:${prefix}:*`);

    // Para deletar devem estar sem o prefix
    const keysWithoutPrefix = keys.map(key => key.replace('cache:', ''));

    return this.redis.del(keysWithoutPrefix);
  }
}

export default new Cache();
