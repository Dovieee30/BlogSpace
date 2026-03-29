'use strict';

const { supabase } = require('../../_lib/supabase');
const { verifyAuth } = require('../../_lib/authMiddleware');
const { handlePreflight } = require('../../_lib/cors');

module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  const { id } = req.query;

  // ── GET /api/posts/:id — public ──────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ data: null, error: 'Post not found', status: 404 });
        }
        throw error;
      }

      return res.status(200).json({ data, error: null, status: 200 });
    } catch (err) {
      return res.status(500).json({ data: null, error: err.message, status: 500 });
    }
  }

  // ── PUT /api/posts/:id — protected ───────────────────────────────────────────
  if (req.method === 'PUT') {
    const auth = verifyAuth(req);
    if (auth.error) {
      return res.status(auth.status).json({ data: null, error: auth.error, status: auth.status });
    }

    try {
      const { title, body, author } = req.body;
      const updates = {};
      if (title !== undefined) updates.title = title;
      if (body !== undefined) updates.body = body;
      if (author !== undefined) updates.author = author;

      if (Object.keys(updates).length === 0) {
        return res.status(400).json({
          data: null,
          error: 'At least one field (title, body, author) must be provided',
          status: 400,
        });
      }

      const { data, error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ data: null, error: 'Post not found', status: 404 });
        }
        throw error;
      }

      return res.status(200).json({ data, error: null, status: 200 });
    } catch (err) {
      return res.status(500).json({ data: null, error: err.message, status: 500 });
    }
  }

  // ── DELETE /api/posts/:id — protected ───────────────────────────────────────
  if (req.method === 'DELETE') {
    const auth = verifyAuth(req);
    if (auth.error) {
      return res.status(auth.status).json({ data: null, error: auth.error, status: auth.status });
    }

    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;

      return res.status(200).json({
        data: { message: `Post ${id} deleted successfully` },
        error: null,
        status: 200,
      });
    } catch (err) {
      return res.status(500).json({ data: null, error: err.message, status: 500 });
    }
  }

  return res.status(405).json({ data: null, error: 'Method not allowed', status: 405 });
};
