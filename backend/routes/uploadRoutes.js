import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

// Optional: restrict file types
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowed.test(ext) && allowed.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingle = upload.single("image");

// POST /api/upload
router.post("/", (req, res) => {
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    res.status(200).json({
      message: "Image uploaded successfully",
      image: `/uploads/${req.file.filename}`, // used in frontend
    });
  });
});

export default router;
