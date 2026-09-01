FROM node:20-alpine
# Prisma's query/schema engines need OpenSSL, which alpine images don't
# include by default. Without this, Prisma logs "failed to detect
# libssl/openssl" and the schema engine crashes on startup.
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 4000
CMD ["sh", "-c", "npx prisma db push --skip-generate && node prisma/seed.js && node src/server.js"]
