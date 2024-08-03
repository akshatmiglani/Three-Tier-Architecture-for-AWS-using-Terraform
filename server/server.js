const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const User = require('./models/User');
const app = express();
const dotenv = require('dotenv');
const { Webhook } = require('svix');
const cors=require('cors');

dotenv.config(); 

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

console.log('CLERK_WEBHOOK_SECRET:', process.env.CLERK_WEBHOOK_SECRET);

async function verifySignature(req, res, next) {
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];
  const secret = process.env.CLERK_WEBHOOK_SECRET;

  if (!svix_id || !svix_timestamp || !svix_signature) {
      return res.status(400).send('Missing Svix headers');
  }

  const payload = JSON.stringify(req.body);
  const wh = new Webhook(secret);

  try {
      const evt = wh.verify(payload, {
          'svix-id': svix_id,
          'svix-timestamp': svix_timestamp,
          'svix-signature': svix_signature,
      });

      req.svixEvent = evt;
      next();
  } catch (err) {
      console.error('Error verifying webhook:', err);
      res.status(400).send('Error verifying webhook');
  }
}

app.post('/api/clerk-webhook',verifySignature, async (req, res) => {
  const { data } = req.body;

  if (req.body.type === 'user.created') {
    const { email_addresses } = data;
    const email = email_addresses[0].email_address;

    try {
      const user = new User({ email });
      await user.save();
      res.status(200).send('User email stored successfully');
    } catch (error) {
      res.status(500).send('Error storing user email');
    }
  } else {
    res.status(400).send('Invalid event type');
  }
});

app.get('/api/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');
    res.send({
      awsAccessKeyId: user.awsAccessKeyId,
      awsSecretAccessKey: user.awsSecretAccessKey,
      frontendLoadBalancer: user.frontendLoadBalancer,
      backendLoadBalancer: user.backendLoadBalancer,
      databaseEndpoint: user.databaseEndpoint,
      signedUrlForPemFile: user.signedUrlForPemFile
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.put('/api/:email', async (req, res) => {
  const { awsAccessKey, awsSecretKey } = req.body;
  try {
    console.log('Received request to update credentials for email:', req.params.email);
    console.log('AWS Access Key:', awsAccessKey);
    console.log('AWS Secret Key:', awsSecretKey);

    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }

    user.awsAccessKeyId = awsAccessKey;
    user.awsSecretAccessKey = awsSecretKey;
    await user.save();

    res.send('Credentials updated');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint to trigger Jenkins job
app.post('/api/initialize/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');

    // Trigger Jenkins job with user credentials
    await axios.post('http://jenkins-url/job/initialize-architecture/buildWithParameters', null, {
      params: {
        email: user.email,
        awsAccessKey: user.awsAccessKeyId,
        awsSecretKey: user.awsSecretAccessKey,
      },
      auth: {
        username: 'jenkins-username',
        password: 'jenkins-password',
      },
    });

    res.send('Jenkins job triggered');
  } catch (error) {
    console.error('Error triggering Jenkins job:', error);
    res.status(500).send('Server error');
  }
});

// Endpoint to fetch user configuration
app.get('/api/config/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');

    res.send({
      frontEndLoadBalancer: user.frontEndLoadBalancer,
      backEndLoadBalancer: user.backEndLoadBalancer,
      databaseEndpoint: user.databaseEndpoint,
      signedUrlForPemFile: user.signedUrlForPemFile,
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});
mongoose.connect('mongodb://localhost:27017/jenkins-db', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3000, () => console.log('Server running on port 3000'));
