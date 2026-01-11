FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace config
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy server package
COPY packages/server ./packages/server

# Install dependencies
RUN pnpm install --filter @flymail/server

# Generate Prisma client
WORKDIR /app/packages/server
RUN pnpm exec prisma generate

# Create data and uploads directories
RUN mkdir -p data uploads

# Expose ports
EXPOSE 3001 25

# Start server
CMD ["pnpm", "dev"]
