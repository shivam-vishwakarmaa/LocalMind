FROM node:20-alpine

WORKDIR /app

# Install dependencies based on the package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Copy core files
COPY . .

# Build standard architecture Next application
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
