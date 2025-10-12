import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleGetVideos,
  handleGetVideo,
  handleCreateVideo,
  handleUpdateVideo,
  handleDeleteVideo,
  handleUploadVideo,
  upload,
} from "./routes/videos";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Video API routes
  app.get("/api/videos", handleGetVideos);
  app.get("/api/videos/:id", handleGetVideo);
  app.post("/api/videos", handleCreateVideo);
  app.post("/api/videos/upload", upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 }
  ]), handleUploadVideo);
  app.put("/api/videos/:id", handleUpdateVideo);
  app.delete("/api/videos/:id", handleDeleteVideo);

  return app;
}
