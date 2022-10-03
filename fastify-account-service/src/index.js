const fastify = require("fastify")();
const path = require("path");
const autoLoad = require("@fastify/autoload");

require("dotenv").config();

fastify.register(require("./databases/mongoose"));

fastify.register(require("@fastify/jwt"), {
  secret: process.env.JWT_SECRET,
});

fastify.register(autoLoad, {
  dir: path.join(__dirname, "plugins"),
});

fastify.register(autoLoad, {
  dir: path.join(__dirname, "routes"),
  options: Object.assign({ prefix: "/api" }),
});

fastify.listen({ port: process.env.PORT }, function (err, address) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }

  console.log(`Server is now listening on ${address}`);
});

module.exports = fastify;
