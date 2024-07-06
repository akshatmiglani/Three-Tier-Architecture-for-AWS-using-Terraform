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
