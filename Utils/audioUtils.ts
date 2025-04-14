import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export const extractAndSplitAudio = async (videoPath: string, chunkDir: string): Promise<void> => {
  if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);

  const audioPath = path.join(chunkDir, "audio.wav");

  await new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec("pcm_s16le")
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  await new Promise((resolve, reject) => {
    ffmpeg(audioPath)
      .output(path.join(chunkDir, "%03d.wav"))
      .audioCodec("pcm_s16le")
      .outputOptions(["-f segment", "-segment_time 25"])
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  fs.unlinkSync(audioPath);
};
