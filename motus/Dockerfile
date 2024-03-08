# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /src

# Bundle the app source inside the Docker image
COPY . .

# Install any dependencies
RUN npm install express express-session axios redis  connect-redis


# Define the command to run the app
CMD ["node", "index.js"]

