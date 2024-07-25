#!/bin/bash

# Update the package list
sudo apt update -y

# Install Apache2
sudo apt install -y apache2

# Enable Apache2 to start on boot and start it now
sudo systemctl enable apache2
sudo systemctl start apache2

# Verify Apache status
sudo systemctl status apache2

# Create a simple index.html file
echo "Hello" | sudo tee /var/www/html/index.html
