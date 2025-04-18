import express from 'express';
import multer from 'multer';
import { uploadAudio } from '../controllers/fileController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadAudio);

export default router;
