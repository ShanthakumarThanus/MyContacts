const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const Contact = require('../models/Contact');

// GET /contacts (scope user)
router.get("/", requireAuth, async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user.id });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;