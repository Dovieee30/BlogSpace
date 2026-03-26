'use strict';

const express = require('express');
const { supabase } = require('../supabaseClient');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ─── GET /api/posts ───────────────────────────────────────────────────────────
// Public — fetch all posts, newest first
router.get('/', async (req, res) => {
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
});

// ─── GET /api/posts/:id ───────────────────────────────────────────────────────
// Public — fetch a single post
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      // PGRST116 = no rows found
      if (error.code === 'PGRST116') {
        return res.status(404).json({ data: null, error: 'Post not found', status: 404 });
      }
      throw error;
    }

    return res.status(200).json({ data, error: null, status: 200 });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message, status: 500 });
  }
});

// ─── POST /api/posts ──────────────────────────────────────────────────────────
// Protected — create a new post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, body, author } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        data: null,
        error: 'title and body are required',
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ title, body, author: author || req.user.email }])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ data, error: null, status: 201 });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message, status: 500 });
  }
});

// ─── PUT /api/posts/:id ───────────────────────────────────────────────────────
// Protected — update a post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, author } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (body !== undefined) updates.body = body;
    if (author !== undefined) updates.author = author;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        data: null,
        error: 'At least one field (title, body, author) must be provided to update',
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
});

// ─── DELETE /api/posts/:id ────────────────────────────────────────────────────
// Protected — delete a post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

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
});

module.exports = router;
