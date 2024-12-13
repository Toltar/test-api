# Use a Node.js base image
FROM node:22.11.0-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build

# Expose the port your API listens on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
