import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp"); //used to save inthis folder
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)----//name used to generate
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
