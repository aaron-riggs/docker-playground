const {
  redisHost,
  redisPort,
  pgUser,
  pgHost,
  pgDb,
  pgPassword,
  pgPort,
} = require("./keys");

// Express setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// pg client
const { Pool } = require("pg");

pg = new Pool({
  user: pgUser,
  host: pgHost,
  database: pgDb,
  password: pgPassword,
  port: pgPort,
});

pg.on("error", () => console.log("pg lost connection"));

// one-time table setup
pg.query("CREATE TABLE IF NOT EXISTS values (number INT)").catch(err =>
  console.log(err)
);

// redis client
const Redis = require("redis");

redis = Redis.createClient({
  host: redisHost,
  port: redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redis.duplicate();

// route handlers

// test
app.get("/", (req, res) => {
  res.send("yo");
});

// get values from PG
app.get("/values/all", async (req, res) => {
  const values = await pg.query("SELECT * FROM values");
  res.send(values.rows);
});

// get values from redis
app.get("values/current", async (req, res) => {
  redis.hgetall("values", (err, values) => {
    if (err) res.send("REDIS ERROR");
    res.send(values);
  });
});

// submit new index to worker
app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > 40) return res.status(422).send("Fuck you");

  redis.hset("values", index, "New index to calculate!");

  redisPublisher.publish("insert", index);
  pg.query("INSERT INTO values (number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("listening on port 5000");
});
