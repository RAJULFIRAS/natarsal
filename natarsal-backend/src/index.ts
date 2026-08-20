// D:/natarsal/natarsal-backend/src/index.ts
import app from "./app";
import { config } from "./config/env";

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log("=".repeat(50));
});
