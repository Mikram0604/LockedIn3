const express = require('express');
const cors = require('cors');
const { router } = require('./router');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize cron jobs
require('./agents/nudge');
require('./agents/silence');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For Twilio webhooks

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Disha API' });
});

// Twilio webhook endpoint
app.post('/webhook', router);

app.listen(PORT, () => {
  console.log(`Disha server is running on port ${PORT}`);
});
