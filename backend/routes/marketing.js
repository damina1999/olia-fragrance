const express = require('express');
const router = express.Router();

// Simple endpoint to receive abandoned cart snapshots for emails/automation
router.post('/abandoned', async (req, res) => {
  try {
    const { email, cart, userId } = req.body;
    // In production: enqueue job to send emails, persist snapshot to DB
    console.log('Abandoned cart received for', email || userId, 'items:', cart?.length || 0);
    return res.json({ message: 'Received' });
  } catch (err) {
    console.error('Abandoned cart error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
