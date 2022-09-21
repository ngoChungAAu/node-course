const allRoles = {
  admin: ["list-user", "update-role", "delete-user"],
  user: [],
};

module.exports = {
  roleTypes: Object.freeze(Object.keys(allRoles)),
  roleRights: new Map(Object.entries(allRoles)),
};
