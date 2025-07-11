const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'demo_cloud_name', // Replace with your Cloudinary cloud name
  api_key: 'demo_api_key',       // Replace with your Cloudinary API key
  api_secret: 'demo_api_secret', // Replace with your Cloudinary API secret
  secure: true,
});

module.exports = cloudinary;
