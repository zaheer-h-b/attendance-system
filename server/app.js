import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import debugRoutes from './routes/debugRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// ======================================================
// CORS CONFIGURATION
// ======================================================

const allowedOrigins = [
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {

    // Allow requests with no origin
    // (Postman, server-to-server requests, etc.)

    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS not allowed for origin: ${origin}`)
    );
  },

  credentials: true,

  methods: [
    'GET',
    'POST',
    'PUT',
    'DELETE',
    'PATCH',
    'OPTIONS'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization'
  ]
};


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

app.use(express.urlencoded({
  extended: true
}));


// ======================================================
// VIEW ENGINE
// ======================================================

app.set('view engine', 'ejs');

app.set(
  'views',
  path.join(__dirname, 'views')
);

app.use(
  express.static(
    path.join(__dirname, 'public')
  )
);


// ======================================================
// MONGODB CONNECTION
// ======================================================

async function connectDatabase() {

  if (mongoose.connection.readyState === 0) {

    try {

      await mongoose.connect(MONGO_URI);

      console.log('Database connected');

    } catch (err) {

      console.error(
        'Database connection error:',
        err
      );

      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    }
  }
}

connectDatabase();


// ======================================================
// MONGODB CONNECTION EVENTS
// ======================================================

const db = mongoose.connection;

db.on(
  'error',
  console.error.bind(
    console,
    'connection error'
  )
);

db.once('open', () => {

  console.log(
    'MongoDB connection established'
  );

});


// ======================================================
// API ROUTES
// ======================================================

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/attendance',
  attendanceRoutes
);

app.use(
  '/api/leaves',
  leaveRoutes
);

app.use(
  '/api/stats',
  statsRoutes
);

app.use(
  '/api/debug',
  debugRoutes
);


// ======================================================
// HEALTH CHECK
// ======================================================

app.get('/health', (req, res) => {

  res.status(200).json({
    message: 'Server is running',
    status: 'ok'
  });

});


// ======================================================
// ROOT ENDPOINT
// ======================================================

app.get('/', (req, res) => {

  res.render('index');

});


// ======================================================
// FAVICON
// ======================================================

app.get('/favicon.ico', (req, res) => {

  res.status(204).end();

});


// ======================================================
// ERROR HANDLING
// ======================================================

app.use(notFound);

app.use(errorHandler);


// ======================================================
// SERVER
// ======================================================

// IMPORTANT:
// Render needs the server to listen in production too.

app.listen(
  PORT,
  '0.0.0.0',
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);


// ======================================================
// EXPORT
// ======================================================

export default app;