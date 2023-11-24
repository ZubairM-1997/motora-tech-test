const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const { Canvas, Image, ImageData } = require('canvas');
const faceapi = require('face-api.js');
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const app = express();

const secretKey = 'ce129411902b556798acfb18e1e951d844dc902e';
const adminUser = { username: 'admin', password: 'adminpassword' };

// In-memory store
const users = [];
const requests = [];
const modelsPath = path.join(__dirname, 'models');

// Middleware to check JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
  });
};

// Middleware to check admin user
const isAdmin = (req, res, next) => {
  if (req.user && req.user.username === adminUser.username) {
    next();
  } else {
    res.sendStatus(403);
  }
};

app.use('/models', express.static(modelsPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());


// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Load face-api.js models
async function loadFaceApiModels() {
	const MODEL_URL = './models/weights'

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
  await faceapi.nets.ageGenderNet.loadFromDisk(MODEL_URL)
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL)
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL)
}


loadFaceApiModels().then(() => {
  console.log('Face-api.js models loaded');
});

// Face detection function
// Face detection function
async function detectFaces(buffer) {
  console.log(buffer)
  try {
    // Convert buffer to base64
    const base64Image = Buffer.from(buffer).toString('base64');


    // Create a new Image object
    const image = new Image();
    image.src = `data:image/png;base64,${base64Image}`;

    const canvas = faceapi.createCanvasFromMedia(image);
    const displaySize = { width: image.width, height: image.height };

    // Set the size of the canvas
    faceapi.matchDimensions(canvas, displaySize);

    // Display the image on the canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, image.width, image.height);

    // Perform face detection
    const detections = await faceapi.detectAllFaces(canvas).withFaceLandmarks().withFaceDescriptors();

    // Log the number of detected faces
    console.log('Number of detected faces:', detections.length);

    // Return the number of detected faces
    return detections.length;
  } catch (error) {
    console.error('Face Detection error:', error);
    throw error;
  }
}




// Login route for regular user
app.post('/user-login', (req, res) => {
  const { username } = req.body;
  console.log(username);

  // Check for duplicate usernames
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const token = jwt.sign({ username }, secretKey, { expiresIn: '30m' });
  users.push({ username, token });
  res.json({ token });
});

// Create a request route
app.post('/create-request', authenticateJWT, upload.single('image'), async (req, res) => {
  const { name } = req.body;
  const { buffer } = req.file;

  // Simulate processing time
  setTimeout(async () => {
    try {
      const detectedFaces = await detectFaces(buffer);

      const request = {
        username: req.user.username,
        name,
        status: 'ready',
        faces: detectedFaces,
      };

      requests.push(request);
      res.json(request);
    } catch (error) {
      console.error('Face Detection error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }, 5000);
});

// Get requests route
app.get('/requests', authenticateJWT, (req, res) => {
  const userRequests = requests.filter(request => request.username === req.user.username);
  res.json(userRequests);
});

// Admin summary route
app.get('/admin-summary', authenticateJWT, isAdmin, (req, res) => {
  const summary = users.map(user => {
    const userRequests = requests.filter(request => request.username === user.username);
    const totalImages = userRequests.length;
    const totalFaces = userRequests.reduce((sum, request) => sum + request.faces, 0);

    return { username: user.username, totalImages, totalFaces };
  });

  res.json(summary);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

