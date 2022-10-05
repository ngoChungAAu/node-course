module.exports.userValidation = require("./user.validation");
module.exports.validatorCompiler = ({ schema, method, url, httpPart }) => {
  return (data) => schema.validate(data);
};
