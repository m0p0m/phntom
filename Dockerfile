# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# ---

# Stage 2: Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy application code from the builder stage
COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD [ "npm", "start" ]
