const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/files', function(req, res) {
  const folder = req.query.folder;
  if (!folder) {
    return res.status(500).json({
      error: "Folder name is required as query parameter"
    });
  }

  const directoryPath = path.join(__dirname, folder);
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).json({
        error: "Unable to read the directory"
      });
    }
    return res.json({ files });
  });
});

app.get("/file", function(req, res) {
  const folder = req.query.folder;
  const filename = req.query.filename;

  if (!filename || !folder) {
    return res.status(500).json({
      error: "File name or folder name is required as query parameter"
    });
  }

  const filePath = path.join(__dirname, folder, filename);
  fs.readFile(filePath, "utf8", function(err, data) {
    if (err) {
      return res.status(500).json({
        error: "Error in reading the file or file is not found"
      });
    }
    res.json({ data });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
