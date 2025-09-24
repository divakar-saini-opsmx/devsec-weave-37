# Stage 1: Build the React app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app source code
COPY . .

#ARG VITE_APP_API_URL
#ENV VITE_APP_API_URL=$VITE_APP_API_URL

# Build the app for production
RUN npm run build

# Stage 2: Serve the app using a lightweight web server
FROM nginx:alpine

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
