module.exports.logger = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      singleLine: true,
      translateTime: "SYS:dd-mm-yy HH:MM:ss",
      ignore: "pid,req.hostname,req.remoteAddress,req.remotePort,responseTime",
    },
  },
};
