const app = require("./app");
require("./database/mongoose");
const config = require("./config/config");

app.listen(config.port, () => {
  console.log("Server is running on port %s", config.port);
});
