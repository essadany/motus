# Use an official Node runtime as a parent image
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /src

# Bundle the app source inside the Docker image
COPY . .

# Install any dependencies
RUN npm install express express-session redis connect-redis axios cookie-parser jsonwebtoken dotenv cors


# Define the command to run the app
CMD ["node", "index.js"]

