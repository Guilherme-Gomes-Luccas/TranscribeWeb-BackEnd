import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import mime from "mime-types";
import dotenv from "dotenv";

dotenv.config();

export const transcribeAudio = async (filePath: string): Promise<string> => {
  try {
    const file = fs.readFileSync(filePath);
    const mimeType = mime.lookup(filePath);

    if (!mimeType || !mimeType.startsWith("audio")) {
      throw new Error("Formato de áudio não suportado.");
    }

    const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-small", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
        "Content-Type": mimeType,
      },
      body: file,
    });

    const rawText = await response.text();

    // Tenta converter para JSON e tratar o erro se não for
    try {
      const result = JSON.parse(rawText) as { error?: string; text?: string };

      if (!response.ok || result.error) {
        console.error("Erro da API HuggingFace:", result.error || response.statusText);
        return "Transcrição falhou";
      }

      return result.text || "Transcrição falhou";
    } catch (jsonErr) {
      console.error("Resposta inválida (não é JSON):", rawText);
      return "Erro na transcrição (resposta inválida da API)";
    }
  } catch (err) {
    console.error("Erro na transcrição:", err);
    return "Erro na transcrição";
  } finally {
    // Remove o áudio temporário
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
