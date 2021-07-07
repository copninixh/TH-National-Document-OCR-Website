const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');
const PORT = process.env.PORT || 8080

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('รองรับสกุลไฟล์ jpeg|jpg|png|gif เท่านั้นน้า!');
  }
}


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));

//get sec
app.get('/', (req, res) => res.render('index'));
app.get('/slide', (req, res) => res.render('slide'));
app.get('/project', (req, res) => res.render('project'));

//post sec
app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('index', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('index', {
          msg: 'โปรดอัพโหลดไฟล์รูปภาพ',

        });
     
      } else {
        res.render('index', {
          msg: 'อัพโหลดรูปภาพแล้ว',
      
          file: `uploads/${req.file.filename}`
      });
      }
    }
  });
});

app.listen(PORT, ()=>{
  console.log(`${PORT}`)
})

