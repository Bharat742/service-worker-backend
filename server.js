// server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import webPushPkg from 'web-push';

const { setVapidDetails, sendNotification } = webPushPkg;

const app = express();
const PORT = 5000;

// 🔐 Your VAPID keys
const publicKey = 'BGuH-BZdpShuJMHisDaOvZCQgiKiON4PvjINGmKtxkB6xOPESoCHxd7MmcKiyVtYrfOGepMu3wnhN2CDTa26YwE';
const privateKey = 'UWRuioSXq3nVyRCq0sgYYB7_MtAbRUl1wBJ5QDSWVSA';

setVapidDetails(
  'mailto:bharatlal.kumar@technians.com',
  publicKey,
  privateKey
);

app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(bodyParser.json());

// Store subscriptions in-memory (for demo only)
let subscriptions = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({ message: 'Subscribed successfully' });
});

app.post('/sendNotification', (req, res) => {
  const notificationPayload = JSON.stringify({
    title: 'Push Notification',
    body: 'This is from your Node.js backend!',
    url: '/sendNotification'
  });

  const sendPromises = subscriptions
    .filter(sub => sub?.endpoint?.startsWith('https://'))
    .map(sub => sendNotification(sub, notificationPayload));

  Promise.all(sendPromises)
    .then(() => res.status(200).json({ message: 'Push sent' }))
    .catch(err => {
      console.error("Push error:", err);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
