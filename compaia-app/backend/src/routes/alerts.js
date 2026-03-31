const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/alerts - alertes non résolues
router.get('/', async (req, res) => {
  const alerts = await prisma.alert.findMany({
    where: { estResolu: false },
    include: { senior: true, checkIn: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(alerts);
});

// PATCH /api/alerts/:id/resolve - marquer comme traitée (idempotent)
router.patch('/:id/resolve', async (req, res) => {
  const alert = await prisma.alert.update({
    where: { id: req.params.id },
    data: { estResolu: true },
  });
  res.json(alert);
});

module.exports = router;
