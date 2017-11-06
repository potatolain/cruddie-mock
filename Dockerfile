FROM node:6
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
CMD node ./bin/cruddie-mock ./examples/application
EXPOSE 3009
