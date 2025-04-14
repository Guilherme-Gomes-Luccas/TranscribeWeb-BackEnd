import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export const summarizeText = async (text: string): Promise<string> => {
  try {
    if (!text || text.trim().length === 0) {
      return "Texto vazio, não é possível resumir.";
    }

    // Divida o texto em partes menores com base no comprimento
    const chunks = splitText(text);

    const summaries = [];

    for (const chunk of chunks) {
      const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: chunk }),
      });

      const raw = await response.text();

      try {
        const result = JSON.parse(raw);
        if (Array.isArray(result) && result[0]?.summary_text) {
          summaries.push(result[0].summary_text);
        } else {
          console.warn("Resposta inesperada da API:", result);
        }
      } catch (err) {
        console.error("Erro ao fazer parse da resposta da API:", raw);
      }
    }

    // Junta os resumos das partes e retorna
    return summaries.length > 0 ? summaries.join(" ") : "Resumo não disponível.";
  } catch (err) {
    console.error("Erro ao resumir:", err);
    return "Erro ao resumir o texto.";
  }
};

// Dividir grande texto em pequenas partes
function splitText(text: string): string[] {
  const words = text.split(/\s+/);
  const maxWordsPerChunk = 250;

  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if (currentChunk.split(/\s+/).length >= maxWordsPerChunk) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk += " " + word;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
