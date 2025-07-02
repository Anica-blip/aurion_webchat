# Aurion Webchat

A modern, customizable web chat interface that connects users to an AI assistant powered by OpenAI GPT-4o. Chat sessions and logs are stored in Supabase (`webchat` table) for analytics and follow-up.

---

## Features

- Responsive chat UI with mobile and desktop mockups
- Connects to OpenAI GPT-4o for intelligent conversation
- Logs chat sessions and messages to Supabase (`webchat` table)
- Easily embeddable in websites or Notion pages
- Designed for extensibility and privacy

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/aurion_webchat.git
cd aurion_webchat
```

### 2. Setup Environment Variables

- Create a `.env` file (if needed for your deployment) with the following:

```
OPENAI_API_KEY=your-openai-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-key
```

### 3. Deploy

- **Frontend:** Deploy the static files (`index.html`, `style.css`) using your preferred static site host (e.g., Render, Flashblitz, Vercel, Netlify).
- **Backend (if applicable):** Deploy your backend API project to Render or another platform and update the frontend API endpoint accordingly.

---

## Supabase Table Schema

The `webchat` table should include:

- `id` (uuid, primary key)
- `chat_session_id` (uuid, groups session messages)
- `user_bubble` (text, optional user display name)
- `question` (text, user’s message)
- `response` (text, AI’s reply)
- `created_at` (timestamp)
- `meta` (jsonb, optional)
- `is_user` (boolean, sender flag)
- `message_order` (integer)
- `feedback` (integer, user rating)

---

## Embedding in Notion

1. Deploy your webchat and obtain the public URL.
2. In Notion, use the `/embed` block and paste your webchat’s public URL.

---

## Contributing

Contributions and PRs are welcome!  
Please open an issue for questions or feature requests.

---

## License

MIT License

---

## Credits

- [OpenAI GPT-4o](https://platform.openai.com/)
- [Supabase](https://supabase.com/)
- [Render](https://render.com/)
- [Flashblitz](https://flashblitz.com/)
- [3C Thread To Success]

*Aurion 3C Mascot Webchat upholds a 3C practice: Clarity, Collaboration, and Credits.*
