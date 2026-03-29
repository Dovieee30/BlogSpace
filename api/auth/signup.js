'use strict';

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

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ data: null, error: error.message, status: 400 });
    }

    return res.status(201).json({
      data: {
        user: { id: data.user.id, email: data.user.email, created_at: data.user.created_at },
        message: 'Signup successful. Check your email to confirm your account.',
      },
      error: null,
      status: 201,
    });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message, status: 500 });
  }
};
