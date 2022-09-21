const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message("Password must be minimum 8 characters");
  }

  if (value.length > 255) {
    return helpers.message("Password must be maximum 255 characters");
  }

  if (
    !value.match(/(?=.*?[0-9])/) ||
    !value.match(/(?=.*?[A-Z])/) ||
    !value.match(/(?=.*?[a-z])/) ||
    !value.match(/(?=.*?[#?!@$%^&*-])/)
  ) {
    return helpers.message(
      "Password must contain at least 1 letter and 1 number and 1 special character"
    );
  }
  return value;
};

const positiveNumber = (value, helpers) => {
  if (value < 0) {
    return helpers.message("Must be a positive number!");
  }

  return value;
};

const integerNumber = (value, helpers) => {
  if (!!(value % 1)) {
    return helpers.message("Must be an integer number!");
  }

  return value;
};

module.exports = {
  objectId,
  password,
  positiveNumber,
  integerNumber,
};
