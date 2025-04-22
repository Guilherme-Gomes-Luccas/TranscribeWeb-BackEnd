import express from 'express';
import multer from 'multer';
import { uploadAudio } from '../controllers/fileController';

const router = express.Router();

// Armazena os arquivos temporariamente em /tmp/uploads (Render permite escrita nessa pasta)
const upload = multer({
    dest: '/tmp/uploads',
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.post('/upload', upload.single('file'), uploadAudio);

export default router;
