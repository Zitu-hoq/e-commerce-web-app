# Use official Node.js 22 image
FROM node:22.11.0-alpine

# Set working directory
WORKDIR /e-commerce-backend

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set default environment variable
ENV PORT=3000

# Expose the port
EXPOSE ${PORT}

# Start the server
CMD ["node", "server.js"]
