const { createWorker, PSM } = require('tesseract.js');
const http = require("http");
const path = require("path");
const fs = require("fs");

const express = require("express");

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});


app.get("/", express.static(path.join(__dirname, "./public")));

const worker = createWorker({
  langPath: '..',
  gzip: false,
  logger: m => console.log(m)
});

const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "/uploads/"
  
});


app.post(
  "/upload",
  upload.single("file"),
  (req, res) => {
    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, "./uploads/");

    if (path.extname(req.file.originalname).toLowerCase() === ".png") {
      fs.rename(tempPath, targetPath, err => {
        if (err) return handleError(err, res);

        res
          .status(200)
          .contentType("text/plain")
          .end("File uploaded!");
      });
    } else {
      fs.unlink(tempPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .png files are allowed!");
      });
    }
  }
);

(async () => {
  await worker.load();
  await worker.loadLanguage('thnd');
  await worker.initialize('thnd');
  const { data: { text } } = await worker.recognize('../01.jpg');
  console.log(text);
  await worker.terminate();
})();
