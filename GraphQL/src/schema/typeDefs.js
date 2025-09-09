const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Response {
    status: String!
    code: String!
    message: String!
    data: JSON
  }

  scalar JSON

  type Query {
    users: Response
    user(id: ID!): Response
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): Response
    login(email: String!, password: String!): Response

    updateUser(id: ID!, name: String, email: String): Response
    deleteUser(id: ID!): Response
  }
`;

module.exports = typeDefs;
