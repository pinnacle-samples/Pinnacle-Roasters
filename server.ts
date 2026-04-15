import 'dotenv/config';
import express from 'express';
import pinnacleCafeRouter from './router';
import { Server } from 'http';

const app = express();
const PORT = process.env.PORT || 3000;
const terminationGracePeriodMs = 30000;
let isShuttingDown = false;

app.use(express.json());
app.use('/webhook', pinnacleCafeRouter);

async function startServer(): Promise<Server> {
  try {
    return app.listen(PORT, () => {
      console.info(`[Pinnacle Roasters] Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('[Pinnacle Roasters] Failed to initialize:', err);
    process.exit(1);
  }
}

const server = await startServer();

async function gracefulShutdown(signal: string) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.info(`[Pinnacle Roasters] Received ${signal}. Beginning graceful shutdown.`);

  // Fallback timer in case existing connections hang.
  const forceExitTimer = setTimeout(() => {
    console.error(
      `[Pinnacle Roasters] Graceful shutdown timed out after ${terminationGracePeriodMs / 1000} seconds. Forcing exit.`,
    );
    process.exit(1);
  }, terminationGracePeriodMs).unref();

  server.close((error) => {
    clearTimeout(forceExitTimer);

    if (error) {
      console.error('[Pinnacle Roasters] Error while closing HTTP server:', error);
      process.exit(1);
    }

    console.info('[Pinnacle Roasters] HTTP server closed cleanly.');
    console.info('[Pinnacle Roasters] Exiting.');
    process.exit(0);
  });
}

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
