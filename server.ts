import express from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import fileRouter from "./routes/fileRoute";

dotenv.config();

const app = express();

const FRONT = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: `${FRONT}`,
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());
app.use("/api", fileRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
