const multer = require("multer");
const path = require("path");
const fs = require("fs");


// Filter image type
function fileFilter(req, file, cb) {
  const allowed = ["image/png", "image/jpg", "image/jpeg"];

  if (!allowed.includes(file.mimetype)) {
    return cb("Type Error. Allowed types: png, jpg, jpeg", false);

  } else {
    return cb(undefined, true);
  }
}


// Set multer Storage Settings
const storage = multer.diskStorage({

  // File Destination
  destination(req, file, cb) {
    const uploadPath = path.join("uploads");

    if (!fs.existsSync(uploadPath)) {
      // if uploda directory not exists, will be create
      fs.mkdirSync(path.join(uploadPath), { recursive: true });
    }
    cb(undefined, uploadPath);
  },

  // File Name
  filename(req, file, cb) {
    // Current Time in milliseconds + file extension
    const fileName = `${new Date().getTime()}_${file.originalname.split('.')[0]}.${file.mimetype.split("/")[1]}`;
    return cb(undefined, fileName);
  }
});

// File size Limit
const limits = {
  fileSize: 11000000 // 11MB
};



const upload = multer({
  limits,
  storage,
  fileFilter
}).fields([{ name: "image", maxCount: 1 }]);



/**
 * @description Add Game File Handler
 */
export default (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {

      if (err === "Type Error. Alowed types: png, jpg, jpeg")
        return res.status(400).send({ msg: err, success: false });

      if (err.message)
        return res.status(400).send({ msg: err.message, success: false });


      return res.status(500).send({ msg: "server error.", success: false });
    }
    next();
  });
};
