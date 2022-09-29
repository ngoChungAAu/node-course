const httpStatus = require("http-status");
const User = require("../models/user.model");

const register = async (userBody) => {
  const isTaken = await User.isEmailTaken(userBody.email);

  if (isTaken) {
    throw new Error({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Email already taken",
    });
  }

  const user = await User.findOne({ email: userBody.email, isActive: false });

  if (user) {
    user.name = userBody.name;
    user.password = userBody.password;

    await user.save();

    return user;
  } else {
    await User.create(userBody);
  }
};
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new Error({
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Incorrect email or password",
    });
  }
  return user;
};

const updateProfile = async (user, body) => {
  const fields = Object.keys(body);

  fields.forEach((e) => (user[e] = body[e]));

  await user.save();

  return user;
};

const changePassword = async (user, body) => {
  if (!(await user.isPasswordMatch(body.currentPassword))) {
    throw new Error({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Incorrect current password",
    });
  }

  user.password = body.newPassword;

  await user.save();
};

const logoutMe = async (token) => {
  await token.remove();
};

const logoutAll = async (id) => {
  await Token.deleteMany({ user: id });
};

const getList = async (filter, options) => {
  const { page: qPage, limit: qLimit, ...qSort } = options;

  const sort = {
    createdAt: 1,
  };

  if (qSort.createdAt) {
    sort.createdAt = qSort.createdAt === "asc" ? 1 : -1;
  }

  const limit = qLimit && parseInt(qLimit) > 0 ? parseInt(qLimit) : 3;

  const page = qPage && parseInt(qPage) > 0 ? parseInt(qPage) : 1;

  const skip = (page - 1) * limit;

  const totalDocs = await User.countDocuments(filter);
  const users = await User.find(filter).skip(skip).limit(limit).sort(sort);

  if (totalDocs === 0) {
    throw new Error({
      statusCode: httpStatus.NO_CONTENT,
      message: "No content",
    });
  }

  return {
    data: users,
    totalItem: totalDocs,
    totalPage: Math.ceil(totalDocs / limit),
    currentPage: page,
  };
};

const getDetail = async (id) => {
  const user = await User.findById({ _id: id });

  if (!user) {
    throw new Error({
      statusCode: httpStatus.NOT_FOUND,
      message: "User not found",
    });
  }

  return user;
};

const updateRole = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    throw new Error({
      statusCode: httpStatus.BAD_REQUEST,
      message: "User not found",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
  } else {
    user.role = "admin";
  }

  await user.save();
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    throw new Error({
      statusCode: httpStatus.BAD_REQUEST,
      message: "User not found",
    });
  }
};

const activeAccount = async (token) => {
  const tokenDoc = await Token.findOne({
    activeToken: token,
  });

  if (!tokenDoc) {
    return next(
      new Error({
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Token not found. Please register!",
      })
    );
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, res) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        await tokenDoc.remove();
      }

      return next(
        new Error({
          statusCode: httpStatus.UNAUTHORIZED,
          message: "Token is expired!. Please register again!",
        })
      );
    }
  });

  const { user } = await tokenDoc.populate("user");

  user.isActive = true;

  await user.save();

  await tokenDoc.remove();
};

module.exports = {
  register,
  login,
  updateProfile,
  changePassword,
  logoutMe,
  logoutAll,
  getList,
  getDetail,
  updateRole,
  deleteUser,
  activeAccount,
};