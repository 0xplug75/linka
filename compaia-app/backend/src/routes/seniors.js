const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/seniors - liste avec dernier check-in
router.get('/', async (req, res) => {
  const seniors = await prisma.senior.findMany({
    include: {
      checkIns: { orderBy: { date: 'desc' }, take: 1 },
      alerts: { where: { estResolu: false } },
    },
  });
  res.json(seniors);
});

// GET /api/seniors/:id - historique complet
router.get('/:id', async (req, res) => {
  const senior = await prisma.senior.findUnique({
    where: { id: req.params.id },
    include: { checkIns: { orderBy: { date: 'desc' } }, alerts: true },
  });
  if (!senior) return res.status(404).json({ error: 'Non trouvé' });
  res.json(senior);
});

module.exports = router;
