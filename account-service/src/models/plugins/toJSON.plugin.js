/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

const toJSON = (schema) => {
  let transform;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  //Extend toJSON options
  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc, ret, options) {
      // remove private path
      for (const path in schema.paths) {
        if (schema.paths[path].options && schema.paths[path].options.private) {
          if (typeof ret[path] !== "undefined") {
            delete ret[path];
          }
        }
      }

      //Remove version
      if (typeof ret.__v !== "undefined") {
        delete ret.__v;
      }

      //Normalize ID
      if (ret._id && typeof ret._id === "object" && ret._id.toString) {
        if (typeof ret.id === "undefined") {
          ret.id = ret._id.toString();
        }
      }

      if (typeof ret._id !== "undefined") {
        delete ret._id;
      }

      //Call custom transform if present
      if (transform) {
        return transform(doc, ret, options);
      }

      return ret;
    },
  });
};

module.exports = toJSON;
