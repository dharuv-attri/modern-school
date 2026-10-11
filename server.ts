import express from 'express';
import path from 'path';
import fs from 'fs';
import apiApp from './src/server/api.ts';

const app = express();
const PORT = process.env.PORT || 3000;

// Mount API routes
app.use(apiApp);

// In production, serve built frontend from dist
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Modern Public Sr. Sec. School server running on port ${PORT}`);
});

export default app;
