FROM node:20

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx

COPY --from=0 /app/dist /usr/share/nginx/html