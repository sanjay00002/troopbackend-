import multer, { memoryStorage } from 'multer';
const storage = memoryStorage();
const upload = multer({ storage: storage });


const uploadFrontImage = (req, res, next) => {
  upload.single('front_image')(req, res, function (err) {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'File upload failed' });
    }
    next();
  });
};

export default uploadFrontImage;
