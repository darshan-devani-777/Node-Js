const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authMiddleware = require("../helpers/auth");

const { validateEmail, validatePassword, validateName } = require("../helpers/validation");

const resolvers = {
  Query: {
    users: (_, __, context) => {
      authMiddleware(context);
      return userController.getUsers();
    },
    usersConnection: (_, { first, after, last, before }, context) => {
      authMiddleware(context);
      return userController.getUsersPaginated({ first, after, last, before });
    },
    user: (_, { id }, context) => {
      authMiddleware(context);
      return userController.getUserById(id);
    },
  },
  
  Mutation: {
    register: (_, { name, email, password }) => {
      const validName = validateName(name);
      const validEmail = validateEmail(email);
      const validPassword = validatePassword(password);
      return authController.register(validName, validEmail, validPassword);
    },
    login: (_, { email, password }) => {
      const validEmail = validateEmail(email);
      return authController.login(validEmail, password);
    },

    updateUser: (_, { id, name, email }, context) => {
      authMiddleware(context);
      const update = {};
      if (typeof name !== "undefined") update.name = validateName(name);
      if (typeof email !== "undefined") update.email = validateEmail(email);
      return userController.updateUser(id, update);
    },
    deleteUser: (_, { id }, context) => {
      authMiddleware(context);
      return userController.deleteUser(id);
    },
  },
};

module.exports = resolvers;
