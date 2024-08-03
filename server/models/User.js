const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  awsAccessKeyId: String,
  awsSecretAccessKey: String,
  isActive: { type: Boolean, default: false },
  frontendLoadBalancer: String,
  backendLoadBalancer: String,
  databaseEndpoint: String,
  signedUrlForPemFile: String,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (this.isModified('awsSecretAccessKey')) {
    const salt = await bcrypt.genSalt(10);
    this.awsSecretAccessKey = await bcrypt.hash(this.awsSecretAccessKey, salt);
  }
  next();
});

userSchema.methods.compareSecretKey = async function (key) {
  return await bcrypt.compare(key, this.awsSecretAccessKey);
};

module.exports = mongoose.model('User', userSchema);
