const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DOCUMENTS_DIR = path.join(__dirname, 'documents');
const SAFE_FILE_PATTERN = /^[a-zA-Z0-9._-]+\.pdf$/;

app.disable('x-powered-by');

app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET'],
    optionsSuccessStatus: 204
  })
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 150,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use(express.static(PUBLIC_DIR, { index: 'index.html' }));

app.get('/documents/:filename', (req, res) => {
  const filename = path.basename(req.params.filename);

  if (!SAFE_FILE_PATTERN.test(filename)) {
    return res.status(400).send('Nom de fichier invalide.');
  }

  const requestedPath = path.resolve(path.join(DOCUMENTS_DIR, filename));
  const documentsRoot = path.resolve(DOCUMENTS_DIR) + path.sep;

  if (!requestedPath.startsWith(documentsRoot)) {
    return res.status(403).send('Accès refusé.');
  }

  fs.access(requestedPath, fs.constants.R_OK, (error) => {
    if (error) {
      return res.status(404).send('Document introuvable.');
    }

    return res.sendFile(requestedPath, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`
      }
    });
  });
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((_req, res) => {
  res.status(404).send('Page non trouvée.');
});

app.use((error, _req, res, _next) => {
  if (error.message === 'Origin not allowed by CORS') {
    return res.status(403).send('Requête CORS refusée.');
  }
  return res.status(500).send('Erreur serveur.');
});

app.listen(PORT, () => {
  console.log(`Serveur AMAP lancé sur http://localhost:${PORT}`);
});
