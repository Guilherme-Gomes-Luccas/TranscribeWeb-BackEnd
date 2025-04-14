import { Request, Response } from "express";
import { transcribeAudio } from "../services/transcribeSerivce";
import { summarizeText } from "../services/summarizeService";

export const handleUploadAndProcess = async (req: Request, res: Response): Promise<void> => {
  try {
    const filePath = req.file?.path;
    if (!filePath) {
      res.status(400).json({ error: "Arquivo não encontrado" });
      return;
    }

    const transcript = await transcribeAudio(filePath);
    const summary = await summarizeText(transcript);

    res.json({ transcript, summary });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro no processamento" });
  }
};
