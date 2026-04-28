import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { signup, login } from './src/services/authService';
import { submitQuizResults, getUserProgress, getLeaderboard } from './src/services/quizService';
import { authenticate, AuthRequest } from './src/middleware/authMiddleware';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth Routes ---
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await signup(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await login(email, password);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- Quiz Routes ---
  app.post('/api/quiz/submit', authenticate, async (req: AuthRequest, res) => {
    try {
      const { levelId, answers } = req.body;
      const result = await submitQuizResults(req.user!.id, levelId, answers);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/user/progress', authenticate, async (req: AuthRequest, res) => {
    try {
      const result = await getUserProgress(req.user!.id);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get('/api/leaderboard', async (req, res) => {
    try {
      const result = await getLeaderboard();
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // --- Email Logic ---
  // Email Configuration from .env
  const mailConfig = {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  };

  const transporter = nodemailer.createTransport(mailConfig);

  // API Route: User Activity Notification
  app.post('/api/notify-admin', async (req, res) => {
    const { username, email, action, timestamp } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'mohamedbenothmane2006@gmail.com';

    console.log(`User activity: ${action} - ${username || email} at ${timestamp}`);

    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const actionLabel = action === 'login' ? 'User Login' : 'New User Registration';
        
        await transporter.sendMail({
          from: `"QuizMaster Pro System" <${process.env.EMAIL_USER}>`,
          to: adminEmail,
          subject: `${actionLabel} - QuizMaster Pro`,
          text: `Event: ${actionLabel}\nUsername: ${username || 'N/A'}\nEmail: ${email}\nDate: ${timestamp}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #111; background: #05070a; color: #fff; border-radius: 12px; border: 1px solid #1a1a1a;">
              <h2 style="color: #6366f1; margin-top: 0;">${actionLabel}</h2>
              <p style="margin: 8px 0;"><strong>Username:</strong> ${username || 'N/A'}</p>
              <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 8px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
              <hr style="border: 0; border-top: 1px solid #222; margin: 20px 0;" />
              <p style="font-size: 12px; color: #666;">This is an automated security notification from QuizMaster Pro Neural Archives.</p>
            </div>
          `,
        });
        res.json({ success: true, message: 'Admin notified via email' });
      } catch (error) {
        console.error('Email sending failed:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
      }
    } else {
      console.warn('Email config missing, skipping notification email.');
      res.json({ success: true, message: 'Admin notification logged (email skipped due to missing config)' });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
