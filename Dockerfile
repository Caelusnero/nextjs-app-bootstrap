# Use official Node.js LTS image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 5000

# Start the backend server
CMD ["node", "backend/server.js"]
