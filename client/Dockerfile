FROM node:22.11.0-alpine
WORKDIR /app-client

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Set port and expose it
ENV PORT=5000
EXPOSE ${PORT}

# Start Next.js server
CMD ["npm", "start"]
