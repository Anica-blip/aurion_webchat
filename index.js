// index.js
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Init Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// POST /chat : expects { message, chat_session_id (optional), user_bubble (optional) }
app.post('/chat', async (req, res) => {
  try {
    const { message, chat_session_id, user_bubble } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Use provided session id or make new
    const sessionId = chat_session_id || uuidv4();

    // Call OpenAI Chat 4o - mini
    const openaiRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-4o", // or "gpt-4o-mini" if available
        messages: [
          { role: "system", content: "You are Speech-bubble, a helpful assistant." },
          { role: "user", content: message }
        ],
        max_tokens: 400
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const aiResponse = openaiRes.data.choices[0].message.content;

    // Determine next message_order
    const { data: msgs, error: fetchErr } = await supabase
      .from('webchat')
      .select('message_order')
      .eq('chat_session_id', sessionId)
      .order('message_order', { ascending: false })
      .limit(1);

    let message_order = 1;
    if (msgs && msgs.length > 0 && msgs[0].message_order) {
      message_order = msgs[0].message_order + 1;
    }

    // Store user message
    await supabase.from('webchat').insert([
      {
        chat_session_id: sessionId,
        user_bubble: user_bubble || "Anonymous",
        question: message,
        is_user: true,
        message_order: message_order,
        created_at: new Date().toISOString()
      }
    ]);

    // Store AI reply
    await supabase.from('webchat').insert([
      {
        chat_session_id: sessionId,
        user_bubble: "Speech-bubble",
        response: aiResponse,
        is_user: false,
        message_order: message_order + 1,
        created_at: new Date().toISOString()
      }
    ]);

    // Return reply + session id to client
    res.json({ reply: aiResponse, chat_session_id: sessionId });

  } catch (err) {
    console.error(err?.response?.data || err);
    res.status(500).json({ error: err?.response?.data || err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.send("Aurion Webchat API is running.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
