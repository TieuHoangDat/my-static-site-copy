// webhook-server.js
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_TOKEN = 'your_secret_token'; // Thay bằng token bảo mật của bạn

app.use(bodyParser.json());

// Các cờ để quản lý trạng thái build
let isBuilding = false;
let buildQueued = false;

// Hàm để thực hiện build
const triggerBuild = () => {
  if (isBuilding) {
    // Nếu đang build, đặt cờ buildQueued để thực hiện build sau
    buildQueued = true;
    console.log('Build is already in progress. Build queued.');
    return;
  }

  isBuilding = true;
  console.log('Starting build process...');

  exec('npm run build', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing build: ${error}`);
      isBuilding = false;
      return;
    }
    console.log(`Build Output: ${stdout}`);
    if (stderr) {
      console.error(`Build Errors: ${stderr}`);
    }
    isBuilding = false;
    console.log('Build process completed.');

    // Nếu có buildQueued, thực hiện build lại
    if (buildQueued) {
      buildQueued = false;
      console.log('Queued build detected. Starting another build...');
      triggerBuild();
    }
  });
};

app.post('/webhook', (req, res) => {
  // Kiểm tra token bảo mật nếu cần
//   if (req.headers['x-strapi-webhook-token'] !== SECRET_TOKEN) {
//     return res.status(403).send('Forbidden');
//   }

  console.log('Webhook received.');

  // Kích hoạt build
  triggerBuild();

  res.status(200).send('Build triggered successfully.');
});

app.listen(PORT, () => {
  console.log(`Webhook server is running on port ${PORT}`);
});
