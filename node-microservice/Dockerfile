# Multi‑stage Dockerfile for the Node.js microservice
# ---------------------------------------------------
# Stage 1 – Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
# Stage 2 – Runtime
FROM node:20-alpine AS runtime
WORKDIR /app
# Copy only production dependencies & compiled code
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .
# Expose the microservice port (default 5000)
EXPOSE 5000
ENV NODE_ENV=production
# Use a non‑root user for security
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser
CMD ["node", "index.js"]
