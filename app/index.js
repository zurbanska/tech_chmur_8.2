const express = require('express');
const Redis = require('ioredis');

const app = express();
const port = 3000;

app.use(express.json());

const client = new Redis({ host: 'redis', port: 6379 });

app.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    await client.rpush('messages', message);
    console.log(`Got a new message: ${message}`)
    res.send('Success!');
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.get('/', async (req, res) => {
  try {
    const messages = await client.lrange('messages', 0, -1);
    res.send(messages);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});