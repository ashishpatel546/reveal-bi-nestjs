FROM node:16-alpine3.15
WORKDIR /usr/src/app
COPY package.json ./
# RUN npm config set strict-ssl false
RUN npm install
# RUN npm install pm2 -g
COPY . .
RUN npm run build
# EXPOSE PORT, SHOULD BE SAME AS SERVICE PORT
EXPOSE 8080
CMD [ "node","--max-old-space-size=8192", "./dist/main.js" ]
# CMD [ "pm2-runtime", "./ecosystem.config.js" ]