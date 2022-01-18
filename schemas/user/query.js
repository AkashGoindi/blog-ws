const { UserType } = require('../types');
const { GraphQLList } = require('graphql');
const UserModel = require('../../models/user.js');

const ProfileQuery = {
  type: UserType,
  resolve(parent, agrs, req) {
      if(req.isAuth) {
          return UserModel.findById(req.userId)
      }  else {
          throw new Error('User Unauthorised !');
      }
  }
}

const UserQuery = {
  type: new GraphQLList(UserType),
  resolve(parent, args) {
      return UserModel.find({});
  }
}

module.exports = {
  ProfileQuery,
  UserQuery
}