import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory storage for messages (simulating a database)
  let conversations: any[] = [
    {
      id: 'c1',
      recipientName: 'Sarah J.',
      recipientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      lastMessage: 'Does 2pm work for you?',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
      unreadCount: 1,
      relatedJobTitle: 'Fix Leaky Kitchen Sink',
      messages: [
        { id: 'm1', senderId: 'me', text: 'Hi Sarah, I saw your post about the sink. I can help with that!', timestamp: new Date(Date.now() - 1000 * 60 * 60) },
        { id: 'm2', senderId: 'Sarah J.', text: 'Oh that would be amazing! The apple pie is ready.', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
        { id: 'm3', senderId: 'Sarah J.', text: 'Does 2pm work for you?', timestamp: new Date(Date.now() - 1000 * 60 * 30) },
      ]
    },
    {
      id: 'c2',
      recipientName: 'Mike T.',
      recipientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      lastMessage: 'Thanks for the offer, but I found someone.',
      lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
      unreadCount: 0,
      relatedJobTitle: 'Paint Nursery Room',
      messages: [
        { id: 'm4', senderId: 'me', text: 'Hey Mike, do you still need help painting?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25) },
        { id: 'm5', senderId: 'Mike T.', text: 'Thanks for the offer, but I found someone.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
      ]
    }
  ];

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/conversations", (req, res) => {
    res.json(conversations);
  });

  app.post("/api/conversations", (req, res) => {
    const newConv = req.body;
    conversations = [newConv, ...conversations];
    res.status(201).json(newConv);
  });

  app.post("/api/messages/:convId", (req, res) => {
    const { convId } = req.params;
    const { message } = req.body;
    
    const convIndex = conversations.findIndex(c => c.id === convId);
    if (convIndex !== -1) {
      conversations[convIndex].messages.push(message);
      conversations[convIndex].lastMessage = message.text;
      conversations[convIndex].lastMessageTime = message.timestamp;
      res.status(200).json(conversations[convIndex]);
    } else {
      res.status(404).json({ error: "Conversation not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
