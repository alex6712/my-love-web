# Stage 1 (сборка приложения)
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts --no-progress --quiet

COPY . .

RUN npm run build

# Stage 2 (копирование файлов, запуск)
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
