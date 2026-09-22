const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Public: get active events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(events);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
