const dotenv = require("dotenv");
dotenv.config();
const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.PUBLICKEY,
  privateKey: process.env.PRIVATEKEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

module.exports = imagekit;
