#!/bin/bash

# Update the package list
sudo apt update -y

# Install curl if not already installed
sudo apt install -y curl

# Install Apache2
sudo apt install -y apache2

# Enable Apache2 to start on boot and start it now
sudo systemctl enable apache2
sudo systemctl start apache2

# Download and run the NodeSource installation script for Node.js LTS
curl -sL https://deb.nodesource.com/setup_lts.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify the installation of Node.js and npm
node -v
npm -v

# Install create-react-app globally
sudo npm install -g create-react-app

# Create a new React application
npx create-react-app my-react-app

# Build the React application
cd my-react-app
npm run build

# Copy the build files to Apache's root directory
sudo cp -r build/* /var/www/html/

# Adjust permissions
sudo chown -R www-data:www-data /var/www/html

# Restart Apache to serve the new content
sudo systemctl restart apache2

# Verify Apache status
sudo systemctl status apache2
