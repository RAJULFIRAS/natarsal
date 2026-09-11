import app from "./app";
import { config } from "./config/env";

const PORT = process.env.PORT || 3001;

export default app;

if (process.env.VERCEL !== "1") {
  const server = app.listen(PORT, () => {
    console.log("=".repeat(50));
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log("=".repeat(50));
  });

  const gracefulShutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
}
