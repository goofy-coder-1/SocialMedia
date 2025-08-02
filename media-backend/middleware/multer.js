
const multer = require('multer');
const { storage } = require('../configure/cloudinary'); 

const upload = multer({ storage });

module.exports = upload;
