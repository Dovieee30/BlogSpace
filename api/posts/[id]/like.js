'use strict';

const { supabase } = require('../../_lib/supabase');
const { handlePreflight } = require('../../_lib/cors');

module.exports = async function handler(req, res) {
  if (handlePreflight(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ data: null, error: 'Method not allowed', status: 405 });
  }

  try {
    const { id } = req.query;
    const { action } = req.body; // 'like' or 'unlike'

    // Fetch current likes count
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ data: null, error: 'Post not found', status: 404 });
      }
      throw fetchError;
    }

    const currentLikes = post.likes || 0;
    const newLikes = action === 'unlike'
      ? Math.max(0, currentLikes - 1)
      : currentLikes + 1;

    const { data, error: updateError } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', id)
      .select('likes')
      .single();

    if (updateError) throw updateError;

    return res.status(200).json({ data: { likes: data.likes }, error: null, status: 200 });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message, status: 500 });
  }
};
