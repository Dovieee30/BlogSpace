'use strict';

const express = require('express');
const jwt = require('jsonwebtoken');
const { supabase } = require('../supabaseClient');

const router = express.Router();

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        error: 'email and password are required',
        status: 400,
      });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ data: null, error: error.message, status: 400 });
    }

    return res.status(201).json({
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at,
        },
        message: 'Signup successful. Check your email to confirm your account.',
      },
      error: null,
      status: 201,
    });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message, status: 500 });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        data: null,
        error: 'email and password are required',
        status: 400,
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ data: null, error: error.message, status: 401 });
    }

    // Sign a custom JWT so the front-end (or any client) can authenticate
    // with this API server — separate from the Supabase session token.
    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      data: {
        token,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      },
      error: null,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message, status: 500 });
  }
});

module.exports = router;
