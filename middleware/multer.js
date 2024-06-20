import multer from "multer";

const storage = multer.memoryStorage();
export const singleupload = multer({storage}).single("file")