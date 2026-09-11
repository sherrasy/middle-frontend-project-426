FROM node:22-alpine AS frontend-build
WORKDIR /app/frontend
ARG SENTRY_DSN
ENV VITE_SENTRY_DSN=$SENTRY_DSN
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:22-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
RUN npm run build

FROM node:22-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app/backend

COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY --from=backend-build /app/backend/dist ./dist
COPY --from=backend-build /app/backend/drizzle ./dist/drizzle
COPY --from=backend-build /app/backend/package.json ./package.json
COPY --from=frontend-build /app/frontend/dist ./dist/public

EXPOSE 3000
CMD ["node", "dist/index.js"]