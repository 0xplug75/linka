const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { analyzeTranscript } = require('../services/triage');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/webhook/rounded
router.post('/rounded', async (req, res) => {
  try {
    const { call_id, transcript, senior_tel } = req.body;

    if (!transcript || !senior_tel) {
      return res.status(400).json({ error: 'transcript et senior_tel requis' });
    }

    // Trouver le senior par téléphone
    const senior = await prisma.senior.findFirst({ where: { tel: senior_tel } });
    if (!senior) return res.status(404).json({ error: 'Senior non trouvé' });

    const checkIn = await analyzeTranscript(senior.id, transcript);
    res.json({ success: true, checkIn });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
