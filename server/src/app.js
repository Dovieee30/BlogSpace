'use strict';

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────

// CORS — allow all origins in dev; restrict to your front-end origin in production
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    data: { message: 'Blog API is running 🚀', version: '1.0.0' },
    error: null,
    status: 200,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ data: null, error: 'Route not found', status: 404 });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({
    data: null,
    error: err.message || 'Internal Server Error',
    status: 500,
  });
});

module.exports = app;
