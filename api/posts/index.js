'use strict';

const { supabase } = require('../_lib/supabase');
const { verifyAuth } = require('../_lib/authMiddleware');
const { handlePreflight } = require('../_lib/cors');

module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  // ── GET /api/posts — public ──────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.status(200).json({ data, error: null, status: 200 });
    } catch (err) {
      return res.status(500).json({ data: null, error: err.message, status: 500 });
    }
  }

  // ── POST /api/posts — protected ──────────────────────────────────────────────
  if (req.method === 'POST') {
    const auth = verifyAuth(req);
    if (auth.error) {
      return res.status(auth.status).json({ data: null, error: auth.error, status: auth.status });
    }

    try {
      const { title, body, author } = req.body;

      if (!title || !body) {
        return res.status(400).json({ data: null, error: 'title and body are required', status: 400 });
      }

      const { data, error } = await supabase
        .from('posts')
        .insert([{ title, body, author: author || auth.user.email }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ data, error: null, status: 201 });
    } catch (err) {
      return res.status(500).json({ data: null, error: err.message, status: 500 });
    }
  }

  return res.status(405).json({ data: null, error: 'Method not allowed', status: 405 });
};
