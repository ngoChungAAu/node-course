require("./database/mongoose");
const app = require("./app");
const config = require("./config/config");

app.listen(config.port, () => {
  console.log("Server is running on port %s", config.port);
});
