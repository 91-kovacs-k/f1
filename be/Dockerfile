FROM node:latest

LABEL author="Krisztián Kovács"

ENV NODE_ENV=development
ENV PORT=4000

COPY . /var/www
WORKDIR /var/www

RUN npm install

EXPOSE $PORT

ENTRYPOINT [ "npm", "run", "start-from-docker" ]