# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /server

# Install nodemon for live reloading in development
RUN npm install -g nodemon

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port
EXPOSE 3000

# Start your application with nodemon
CMD ["npm", "run", "dev"]