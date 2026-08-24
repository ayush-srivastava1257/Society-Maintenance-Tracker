import app from './app';
import { ensureDatabaseSeeded } from './utils/autoSeed';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`================================================`);
  console.log(`NestGrid API Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`================================================`);

  await ensureDatabaseSeeded();
});
