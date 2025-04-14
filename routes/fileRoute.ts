import express from "express";
import multer from "multer";
import path from "path";

import { extractAndSplitAudio } from "../Utils/audioUtils";
import { transcribeChunks } from "../services/transcribeChunksService";
import { summarizeText } from "../services/summarizeService";
import { clearFolder } from "../Utils/fileUtils";

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), async (req, res): Promise<void> => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "Arquivo não enviado." });
    return;
  }

  const videoPath = path.resolve(file.path);
  const chunkDir = path.resolve("chunks");

  try {
    await extractAndSplitAudio(videoPath, chunkDir);
    const transcript = await transcribeChunks(chunkDir);
    const summary = await summarizeText(transcript);

    res.json({ transcript, summary });
  } catch (err) {
    console.error("Erro durante o processo:", err);
    res.status(500).json({ error: "Erro ao processar o vídeo." });
  } finally {
    clearFolder("uploads");
    clearFolder("chunks");
  }
});

export default router;
