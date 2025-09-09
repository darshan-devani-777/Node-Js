require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./src/config/db");
const typeDefs = require("./src/schema/typeDefs");
const resolvers = require("./src/schema/resolvers");

const startServer = async () => {
  const app = express();

  connectDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req }),
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server Start At http://localhost:${PORT}${server.graphqlPath}`);
  });
};

startServer();
