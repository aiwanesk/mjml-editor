import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { errorHandler } from "./interfaces/http/middleware/errorHandler.js";
import { templateRoutes } from "./interfaces/http/routes/templateRoutes.js";
import { uploadRoutes } from "./interfaces/http/routes/uploadRoutes.js";
import { exportRoutes } from "./interfaces/http/routes/exportRoutes.js";
import { widgetRoutes } from "./interfaces/http/routes/widgetRoutes.js";
import { compileRoutes } from "./interfaces/http/routes/compileRoutes.js";
import { registerTemplateSavedHandler } from "./infrastructure/event-handlers/OnTemplateSaved.js";
import fs from "fs";

// Register domain event handlers
registerTemplateSavedHandler();

// Ensure directories exist
[config.uploadDir, config.thumbnailDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const app = express();

app.use(cors({ origin: config.clientUrl }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static(config.uploadDir));
app.use("/thumbnails", express.static(config.thumbnailDir));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Routes
app.use("/api/templates", templateRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/compile", compileRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/widgets", widgetRoutes);

// Error handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
