'use strict';

const jwt = require('jsonwebtoken');
const { supabase } = require('../_lib/supabase');
const { handlePreflight } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ data: null, error: 'Method not allowed', status: 405 });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ data: null, error: 'email and password are required', status: 400 });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ data: null, error: error.message, status: 401 });
    }

    const token = jwt.sign(
      { id: data.user.id, email: data.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      data: { token, user: { id: data.user.id, email: data.user.email } },
      error: null,
      status: 200,
    });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message, status: 500 });
  }
};
