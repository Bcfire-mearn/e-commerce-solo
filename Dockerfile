# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the application will run on
EXPOSE 3000

# Define the command to run the application
CMD ["node", "index.js"]
