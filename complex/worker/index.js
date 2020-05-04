const { redisHost, redisPort } = require('./keys');
const Redis = require('redis');

const redis = Redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000
});

const subRedis = redis.duplicate();

function fib(i) {
  if (i < 2) return 1;
  return fib(i - 1) + fib(i - 2);
}

subRedis.on('message', (channel, message) => {
  redis.hset(
    'values',
    message,
    fib(parseInt(message))
  );
});
subRedis.subscribe('insert');
