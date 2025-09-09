const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authMiddleware = require("../helpers/auth");

const resolvers = {
  Query: {
    users: (_, __, context) => {
      authMiddleware(context);
      return userController.getUsers();
    },
    user: (_, { id }, context) => {
      authMiddleware(context);
      return userController.getUserById(id);
    },
  },
  Mutation: {
    register: (_, { name, email, password }) =>
      authController.register(name, email, password),
    login: (_, { email, password }) =>
      authController.login(email, password),

    updateUser: (_, { id, name, email }, context) => {
      authMiddleware(context);
      return userController.updateUser(id, { name, email });
    },
    deleteUser: (_, { id }, context) => {
      authMiddleware(context);
      return userController.deleteUser(id);
    },
  },
};

module.exports = resolvers;
