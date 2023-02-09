FROM node:18-alpine as build
WORKDIR /app
COPY package*.json /app/
RUN npm install --omit=dev
COPY . /app
ARG REACT_APP_SERVER_API
RUN REACT_APP_SERVER_API=${REACT_APP_SERVER_API} \
npm run build

FROM nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
