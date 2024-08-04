const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const app = express();
const dotenv = require('dotenv');
const { Webhook } = require('svix');
const cors=require('cors');
const axios=require('axios')
const { encrypt } = require('./encryptionUtils');

dotenv.config(); 

const username = process.env.JENKINS_USERNAME; 
const apiToken = process.env.JENKINS_TOKEN; 


app.use(bodyParser.json());
app.use(cors());

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
    const encryptedSecret = encrypt(awsSecretKey);
    user.awsSecretAccessKey = {
      iv: encryptedSecret.iv,
      encryptedData: encryptedSecret.encryptedData
    };

    console.log(user.awsSecretAccessKey);
    await user.save();

    res.send('Credentials updated');
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).send('Server error');
  }
});
app.post('/api/initialize/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');

    const crumbResponse = await axios.get('http://localhost:8080/crumbIssuer/api/json', {
      auth: {
        username: username,
        password: apiToken
      }
    });
    const crumb = crumbResponse.data.crumb;

    const decryptedSecretKey = user.decryptSecretKey();
    
    await axios.post(`http://localhost:8080/job/Automation%20of%203%20Tier%20Architecture/buildWithParameters?token=${process.env.APITOKEN}&action=apply&AWS_ACCESS_KEY_ID=${user.awsAccessKeyId}&AWS_SECRET_ACCESS_KEY=${decryptedSecretKey}&EMAIL=${user.email}`, {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Jenkins-Crumb': crumb
      },
      auth: {
        username: username,
        password: apiToken
      }
    });
    

    res.send('Jenkins job triggered');
  } catch (error) {
    console.error('Error triggering Jenkins job:', error);
    res.status(500).send('Server error');
  }
});

app.post('/api/destroy/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');

    const crumbResponse = await axios.get('http://localhost:8080/crumbIssuer/api/json', {
      auth: {
        username: username,
        password: apiToken
      }
    });
    const crumb = crumbResponse.data.crumb;

    const decryptedSecretKey = user.decryptSecretKey();
    
    await axios.post(`http://localhost:8080//job/Automation%20of%203%20Tier%20Architecture/buildWithParameters?token=${process.env.APITOKEN}&action=destroy&AWS_ACCESS_KEY_ID=${user.awsAccessKeyId}&AWS_SECRET_ACCESS_KEY=${decryptedSecretKey}&EMAIL=${user.email}`,{}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Jenkins-Crumb': crumb
      },
      auth: {
        username: username,
        password: apiToken
      }
    });

    await User.updateOne(
      { email: req.params.email },
      {
        $unset: {
          frontEndLoadBalancer: "",
          backEndLoadBalancer: "",
          databaseEndpoint: "",
          signedUrlForPemFile: "",
          isActive: false
        }
      }
    );

    res.send('Jenkins job triggered');
  } catch (error) {
    console.error('Error triggering Jenkins job:', error);
    res.status(500).send('Server error');
  }
});

app.get('/api/checkActiveConfig/:email', async (req, res) => {
 


  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).send('User not found');

    const activeConfig = user.isActive

    res.json({ isActive: !!activeConfig });
  } catch (error) {
    console.error('Error checking active configuration:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

mongoose.connect('mongodb://localhost:27017/jenkins-db', { useNewUrlParser: true, useUnifiedTopology: true });

app.listen(3000, () => console.log('Server running on port 3000'));
