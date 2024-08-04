const mongoose = require('mongoose');
const { decrypt } = require('../encryptionUtils');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  awsAccessKeyId: String,
  awsSecretAccessKey: {
    iv: { type: String },
    encryptedData: { type: String },
  },
  isActive: { type: Boolean, default: false },
  frontendLoadBalancer: String,
  backendLoadBalancer: String,
  databaseEndpoint: String,
  signedUrlForPemFile: String,
}, { timestamps: true });

userSchema.methods.decryptSecretKey = function () {
  console.log("Decrypting");
  const { iv, encryptedData } = this.awsSecretAccessKey;
  return decrypt(encryptedData, iv);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
