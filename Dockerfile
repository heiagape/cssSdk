# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Create and change to the app directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Use a lighter weight base image for the final build
FROM node:18-alpine

# Create and change to the app directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Set the environment variable to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]