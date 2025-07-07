// server.js
const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// 🔐 Your VAPID keys
const publicKey = 'BGuH-BZdpShuJMHisDaOvZCQgiKiON4PvjINGmKtxkB6xOPESoCHxd7MmcKiyVtYrfOGepMu3wnhN2CDTa26YwE';
const privateKey = 'UWRuioSXq3nVyRCq0sgYYB7_MtAbRUl1wBJ5QDSWVSA'; 

webPush.setVapidDetails(
  'mailto:bharatlal.kumar@technians.com',
  publicKey,
  privateKey
);

app.use(cors({
   origin: ['http://localhost:3000', 'https://pwa-react-single-page.netlify.app'], // OR your frontend domain in prod
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.options('*', cors());
app.use(bodyParser.json());

// 👇 Store subscriptions temporarily (in-memory for demo)
let subscriptions = [];

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription); // Store in DB in real apps
  res.status(201).json({ message: 'Subscribed successfully' });
});

app.post('/sendNotification', (req, res) => {
  const notificationPayload = JSON.stringify({
    title: 'Push Notification',
    body: 'This is from your Node.js backend!',
    url: '/sendNotification'
  });

  const sendPromises = subscriptions.map(sub =>
    webPush.sendNotification(sub, notificationPayload)
  );

  Promise.all(sendPromises)
    .then(() => res.status(200).json({ message: 'Push sent' }))
    .catch(err => {
      console.error("Push error:", err);
      res.sendStatus(500);
    });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
