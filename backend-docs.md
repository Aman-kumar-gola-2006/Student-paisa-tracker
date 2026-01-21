
# MERN Stack Pro - Production Integration Guide

This guide covers advanced integrations for Cloudinary, EmailJS, and Google OAuth.

## 1. Cloudinary Integration (Image Uploads)
In your `server/index.js`, install `cloudinary` and `multer-storage-cloudinary`.

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'payment_proofs',
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const upload = multer({ storage: storage });

// Route example
app.post('/api/borrow/add', authMiddleware, upload.single('proof'), async (req, res) => {
  const newBorrow = new Borrow({
    ...req.body,
    proofUrl: req.file ? req.file.path : null, // Cloudinary secure URL
  });
  await newBorrow.save();
  res.json(newBorrow);
});
```

## 2. EmailJS (Automated Reports)
On the frontend, use the EmailJS SDK to send aggregated data.

```javascript
import emailjs from 'emailjs-com';

const sendReport = (data) => {
  emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    {
      to_email: data.userEmail,
      month: data.month,
      income: data.income,
      expense: data.totalExpense,
      balance: data.remaining
    },
    'YOUR_PUBLIC_KEY'
  );
};
```

## 3. Google OAuth 2.0
Use `@react-oauth/google` for a seamless frontend flow.

```javascript
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const onSuccess = (response) => {
    // Send token to backend /api/auth/google
    console.log(response.credential);
  };
  return <GoogleLogin onSuccess={onSuccess} />;
};
```

## 4. .env Template
```text
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=supersecret
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=your_key
EMAILJS_PUBLIC_KEY=your_key
```
