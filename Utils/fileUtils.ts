import fs from "fs";
import path from "path";

export const clearFolder = (folderPath: string): void => {
  const dirPath = path.resolve(folderPath);
  if (!fs.existsSync(dirPath)) return;

  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.lstatSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    }
  });
};
