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
  let userProfile: any = null;
  let conversations: any[] = []; // Started as empty, previously was mock, but we'll manage dynamically
  let jobs: any[] = [
    {
      id: '1',
      title: 'Fix Leaky Kitchen Sink',
      description: 'My kitchen sink drips constantly. I have the washer but need someone with a wrench and know-how to swap it out. I can bake you a pie in exchange!',
      category: 'Plumbing',
      budgetType: 'Barter/Trade',
      barterDescription: 'Homemade Apple Pie & Coffee',
      location: 'Downtown Community',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
      authorName: 'Sarah J.',
      status: 'active'
    },
    {
      id: '2',
      title: 'Paint Nursery Room',
      description: 'Need help painting a small 10x10 room. I have the paint and brushes, just need an extra hand to get it done faster.',
      category: 'Painting',
      budgetType: 'Fixed Price',
      budgetAmount: 50,
      location: 'Westside',
      postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      authorName: 'Mike T.',
      status: 'active'
    }
  ];

  let reviews: any[] = [
    {
      id: 'r1',
      jobId: '101',
      jobTitle: 'Fix Leaky Kitchen Sink',
      dealType: 'Barter/Trade',
      dealValue: 'Apple Pie',
      reviewerName: 'Sarah J.',
      reviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5,
      comment: "Alex was fantastic! He came over within an hour, fixed the leak, and was very polite. Highly recommended for any plumbing needs.",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      metrics: {
        punctuality: 5,
        professionalism: 5,
        broughtTools: true
      }
    }
  ];

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/jobs", (req, res) => {
    res.json(jobs);
  });

  app.post("/api/jobs", (req, res) => {
    const newJob = { ...req.body, id: `job_${Date.now()}`, postedAt: new Date(), status: 'active' };
    jobs.push(newJob);
    res.status(201).json(newJob);
  });

  app.patch("/api/jobs/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const jobIndex = jobs.findIndex(j => j.id === id);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = status;
      res.json(jobs[jobIndex]);
    } else {
      res.status(404).json({ error: "Job not found" });
    }
  });

  app.get("/api/reviews", (req, res) => {
    res.json(reviews);
  });

  app.post("/api/reviews", (req, res) => {
    const newReview = { ...req.body, id: `rev_${Date.now()}`, date: new Date() };
    reviews.push(newReview);
    
    // Also update the job status if not already completed
    const jobIndex = jobs.findIndex(j => j.id === newReview.jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].status = 'completed';
    }

    res.status(201).json(newReview);
  });

  app.get("/api/user", (req, res) => {
    res.json(userProfile);
  });

  app.post("/api/user", (req, res) => {
    userProfile = req.body;
    res.json(userProfile);
  });

  app.post("/api/user/signout", (req, res) => {
    userProfile = null;
    res.json({ status: "success" });
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
