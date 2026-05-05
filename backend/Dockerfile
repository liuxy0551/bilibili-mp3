FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY dist/ ./dist/

RUN mkdir -p /app/downloads

ENV NODE_ENV=production
ENV PORT=3000
ENV DOWNLOAD_DIR=/app/downloads

EXPOSE 3000

CMD ["node", "dist/index.js"]
