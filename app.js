// App Setup
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const {spawn} = require('child_process');

// Setup Static Dir
app.use(express.static(__dirname + '/public'));

// Multer Storage Config
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, './public/uploads/');
  },
  filename: function(req, file, callback){
    callback(null, 'uploadedExcelFile.xlsx');
  }
});

const upload = multer({ storage: storage });

// ROUTES
// Get Upload Route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/upload.html');
});

// Post Results Route
app.post('/results', upload.single('file'), (req, res) => {
  !req.file?res.redirect("/"):runPython(req, res);
})

// SERVER CONFIG
// Start express server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// EXTERNAL SCRIPT
// Python run function
async function runPython(req, res) {
  let scriptData = {output: [], errors: []};
  const subprocess = await spawn('python3', [
    "-u",
    path.join(__dirname, '/public/lib/read_excel.py'),
    "HELLO WORLD!!"
  ]);
  subprocess.stderr.on('data', (error) => {
    scriptData.errors.push(error.toString());
  })
  subprocess.stdout.on('data', (data) => {
    scriptData.output.push(data.toString());
  })
  subprocess.on('close', () => {
    console.log("All done!");
    if(scriptData.errors.length > 0) {
      console.log('THERE WERE ERRORS!');
      console.log(scriptData.errors);
      res.sendFile(__dirname + '/views/error.html');
    } else {
      console.log("SUCCESS!");
      const freshData = scriptData.output.filter(item => item !== '' || item !== ' ' || item !== null || item !== '\n')
      console.log(freshData);
      res.sendFile(__dirname + '/views/results.html');
    }
  });
}
