import { Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

const UPLOAD_DIR = "/tmp/uploads";

// Garante que a pasta exista (boa prática mesmo com multer criando automaticamente)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const uploadAudio = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo enviado" });
      return;
    }

    const filePath = path.resolve(req.file.path); // <-- Arquivo recém-uploadado
    console.log("→ Iniciando upload para FastAPI. Arquivo em:", filePath);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath), req.file.originalname);
    console.log("→ FormData headers:", formData.getHeaders());

    interface TranscribeResponse {
      resumo: string;
      transcricao: string;
    }

    const response = await axios.post<TranscribeResponse>(
      "https://GuilhermeGomes-TranscribeWebAPI.hf.space/transcribe/",
      formData,
      { headers: formData.getHeaders(), maxContentLength: Infinity } as any
    );

    console.log("← Resposta da FastAPI:", response.status, response.data);

    // Agora sim: remove o arquivo atual depois de usá-lo
    fs.unlinkSync(filePath);

    res.json({ summary: response.data.resumo, transcript: response.data.transcricao });

  } catch (error: any) {
    console.error("❌ Erro no uploadAudio:", error.stack || error);
    res.status(500).json({ error: "Erro ao processar o áudio" });
  }
};