const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb){
    // Create a unique filename: fieldname-timestamp.extension
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Limit file size to 10MB
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('file'); // 'file' is the field name in the form-data

// Check File Type
function checkFileType(file, cb){
  // Allow all file types for now, but this is where you could restrict it
  // Example: /jpeg|jpg|png|gif/
  const filetypes = /.*/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: File type not supported!');
  }
}

module.exports = upload;
