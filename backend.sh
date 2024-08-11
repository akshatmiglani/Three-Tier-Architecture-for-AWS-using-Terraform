#!/bin/bash

# Update the package list
sudo apt update -y

# Install curl if not already installed
sudo apt install -y curl

# Download and run the NodeSource installation script for Node.js LTS
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify the installation
node -v
npm -v

# Create a project directory
mkdir -p hello-api
cd hello-api

# Initialize a new Node.js project
npm init -y

# Install Express
npm install express
# Create a server.js file
cat <<EOL > server.js
const express = require('express');
const app = express();
const PORT = 80;

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

app.listen(PORT, () => {
    console.log(\`Server is running on port \${PORT}\`);
});
EOL

# Start the server directly
sudo node server.js
