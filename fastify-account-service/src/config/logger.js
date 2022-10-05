module.exports.logger = {
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "mm/dd/yyyy HH:MM:ss",
      ignore: "pid,hostname,reqId,responseTime,req,res",
      messageFormat: "{msg} [{req.method} {req.url} {res.statusCode}]",
    },
  },
};
