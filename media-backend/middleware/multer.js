// middleware/multer.js
const multer = require('multer');
const { storage } = require('../configure/cloudinary'); // ✅ correct import path

const upload = multer({ storage });

module.exports = upload;
