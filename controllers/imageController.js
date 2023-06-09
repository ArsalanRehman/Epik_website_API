const multer = require('multer');
const imageModel = require('../models/imageModel');
const fs = require('fs');

exports.storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

exports.fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.uploadImage = async (req, res) => {
  try {
    image = req.file;
    // const filename = `map.${image.mimetype.split('/')[1]}`;
    const filename = `${image.originalname}`;

    console.log(filename);

    const ImageURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/images/getImage/${filename}`;
    // console.log('Image URL',ImageURL);

    const newPicture = new imageModel({
      path: image.path,
      type: image.fieldname,
      Date: Date.now(),
      link: ImageURL,
    });
    await newPicture
      .save()
      .then((doc) => {
        console.log('Image information upload successfully');
      })
      .catch((err) => {
        console.log(err);
      });

    console.log(image);
    fs.renameSync(`./images/${image.filename}`, `./images/${filename}`);
    console.log('image name changed');
    res.status(200).json({
      status: 'success',
      message: 'Image has been uploaded inside server',
      path: image.path,
      link: ImageURL,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      err,
    });
  }
};
exports.getImage = (req, res) => {
  res.download('images/' + req.params.path);
};
