# Dockerfile for the Next.js frontend (production)
# ------------------------------------------------
# Stage 1 – Builder (install deps and build)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build   # creates .next production build

# Stage 2 – Runtime (serve with next start)
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
# Copy only what we need from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
# Install only production deps
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
# Use non‑root user for security
# RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# USER appuser
CMD ["npm", "run", "start"]
