const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const adminQuizRoutes = require('./routes/admin-quiz');
const competencyRoutes = require('./competencies/competencyRoutes');
const certificateRoutes = require('./competencies/certificateRoutes');
const { initializeDatabase } = require('./utils/db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/auth', authRoutes);
app.use('/quiz', quizRoutes);
app.use('/admin/quiz', adminQuizRoutes);
app.use('/competencies', competencyRoutes);
app.use('/certificates', certificateRoutes);

const PORT = process.env.PORT || 4000;

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();
    console.log('Database initialized.');
    app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

