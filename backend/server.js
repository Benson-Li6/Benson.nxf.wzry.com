const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const RESERVE_FILE = path.join(DATA_DIR, 'reservations.json');
const USER_FILE = path.join(DATA_DIR, 'users.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(RESERVE_FILE)) fs.writeFileSync(RESERVE_FILE, '[]');
if (!fs.existsSync(USER_FILE)) fs.writeFileSync(USER_FILE, '[]');

function readData(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return [];
  }
}

function writeData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

app.get('/api/reservations', (req, res) => {
  res.json(readData(RESERVE_FILE));
});

app.post('/api/reservations', (req, res) => {
  const list = readData(RESERVE_FILE);
  list.push(req.body);
  writeData(RESERVE_FILE, list);
  res.json({ success: true });
});

app.delete('/api/reservations', (req, res) => {
  const { name, date, start } = req.body;
  let list = readData(RESERVE_FILE);
  list = list.filter(r =>
    !(r.name === name && r.date === date && r.start === start)
  );
  writeData(RESERVE_FILE, list);
  res.json({ success: true });
});

app.get('/api/users', (req, res) => {
  res.json(readData(USER_FILE));
});

app.post('/api/users', (req, res) => {
  const users = readData(USER_FILE);
  const i = users.findIndex(u => u.name === req.body.name);
  if (i >= 0) users[i] = req.body;
  else users.push(req.body);
  writeData(USER_FILE, users);
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('服务已启动');
});
