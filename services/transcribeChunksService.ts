import fs from "fs";
import path from "path";
import { transcribeAudio } from "./transcribeSerivce"; // ajuste o caminho se necessário

export const transcribeChunks = async (chunkDir: string): Promise<string> => {
  try {
    const files = fs.readdirSync(chunkDir)
      .filter(file => file.endsWith(".mp3") || file.endsWith(".wav"))
      .sort();

    if (files.length === 0) {
      throw new Error("Nenhum chunk de áudio encontrado.");
    }

    const transcripts: string[] = [];

    for (const file of files) {
      const filePath = path.join(chunkDir, file);
      console.log(`Transcrevendo: ${file}`);
      const result = await transcribeAudio(filePath);
      transcripts.push(result);
    }

    return transcripts.join(" ");
  } catch (err) {
    console.error("Erro ao transcrever os chunks:", err);
    return "Erro ao transcrever os chunks";
  }
};
