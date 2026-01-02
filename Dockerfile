# Development Dockerfile for Next.js with Bun
FROM oven/bun:1 AS development

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Expose the development port
EXPOSE 3000

# Start the development server
CMD ["bun", "run", "dev"]
