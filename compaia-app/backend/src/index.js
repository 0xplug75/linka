const express = require('express');
const cors = require('cors');
require('dotenv').config();

const webhookRouter = require('./routes/webhook');
const seniorsRouter = require('./routes/seniors');
const alertsRouter = require('./routes/alerts');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/webhook', webhookRouter);
app.use('/api/seniors', seniorsRouter);
app.use('/api/alerts', alertsRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
