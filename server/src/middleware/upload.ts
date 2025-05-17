import multer from "multer";

const storage = multer.memoryStorage(); 

function fileFilter (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
)  {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, 
  },
  fileFilter: fileFilter,
});

export default upload;
