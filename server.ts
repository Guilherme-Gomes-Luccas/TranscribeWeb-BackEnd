// server.ts

import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import fileRouter from "./routes/fileRoute";
import path from "path";
import fs from "fs";

dotenv.config();

const app = express();

const FRONT = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: FRONT,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Criação dos diretórios, se não existirem
const folders = ["uploads"];
folders.forEach((folder) => {
  const fullPath = path.resolve(process.cwd(), folder);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath);
  }
});

app.get("/", (_, res) => {
  res.send("API funcionando! 🌐");
});

app.use("/api", fileRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
