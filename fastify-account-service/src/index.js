const fastify = require("fastify")();
const path = require("path");
const autoLoad = require("@fastify/autoload");

require("dotenv").config();

fastify.register(require("./databases/mongoose"));

fastify.register(require("./routes/user.route"), { prefix: "/user" });

fastify.listen({ port: process.env.PORT }, function (err, address) {
  if (err) {
    console.log(err.message);
    process.exit(1);
  }

  console.log(`Server is now listening on ${address}`);
});
