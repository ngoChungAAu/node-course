const request = require("postman-request");

const url =
  "http://api.weatherstack.com/current?access_key=9fc1e88edd5b4932a8d816e84afaefc6&query=Ha Noi&units=m";

request(url, { json: true }, (err, res) => {
  console.log(res.body.current);
});
