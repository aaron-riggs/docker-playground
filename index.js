const express = require('express');
const redis = require('redis');
const process = require('process');
// init express
const app = express();

// init redis client
const client = redis.createClient({
  host: 'redis-server',
  port: 6379
});
client.set('visits', 0);

// get number of visits, and increment it
app.get('/', (req, res) => {
  process.exit(0)
  client.get('visits', (err, visits) => {
    visits = parseInt(visits) + 1

    client.set('visits', visits);
    res.send(`visited ${visits} times`);
  });
});

app.listen(8081, () => {
  console.log('listening on port 8081')
});
