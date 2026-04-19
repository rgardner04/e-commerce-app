# Build client
FROM node:24 AS client
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# Build server
FROM node:24 AS server
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .
COPY --from=client /app/client/dist ./public

CMD ["node", "index.js"]
