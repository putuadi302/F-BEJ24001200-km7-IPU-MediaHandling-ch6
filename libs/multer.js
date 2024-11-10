const multer = require("multer");

const upload = multer({
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowType = ["image/jpg", "image/png", "image/jpeg"];

    if (allowType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error("harus png, png dan jpeg");
      cb(err, false);
    }
  },
  onError: (err, next) => {
    next(err);
  },
});

module.exports = upload;
