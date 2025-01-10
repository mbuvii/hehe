# Use the official Node.js image as a base
FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 8000

# Command to run your app
CMD ["node", "index.js"]