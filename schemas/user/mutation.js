const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthType, 
  UserType
} = require('../types');
const { 
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql');
const UserModel = require('../../models/user.js');

const LoginMutation = {
  type: AuthType,
  args: {
      email: {type: GraphQLString},
      password: {type: GraphQLString}
  },
  async resolve(parent, args) {
      const user = await UserModel.findOne({email: args.email});
      if(!user) {
          throw new Error("User doesn't exists !");
      }
      const isGenuine = await bcrypt.compare(args.password, user.password);
      if(!isGenuine) {
          throw new Error("Incorrect Password !");
      }
      const token = jwt.sign({
          userId: user.id,
          userName: user.name,
          email: user.email
      }, 'secretKey', {expiresIn: '24h'});
      return {
          token: token,
          email: user.email,
          tokenEpiration: 24
      }
  }
}

const AddUserMutation = {
  type: AuthType,
  args: {
      name: {type: new GraphQLNonNull(GraphQLString)},
      age: {type: new GraphQLNonNull(GraphQLInt)},
      email: {type: new GraphQLNonNull(GraphQLString)},
      password: {type: new GraphQLNonNull(GraphQLString)},
  },
  async resolve(parent, args) {
      let userExists = await UserModel.findOne({email: args.email});
      if(!userExists) {
          let hashedPassword = await bcrypt.hash(args.password, 12);
          let user = new UserModel({
              name: args.name,
              age: args.age,
              email: args.email,
              password: hashedPassword
          });
          return user.save().then(result => {
              const token = jwt.sign({
                  userId: result._doc._id,
                  userName: result._doc.name,
                  email: result._doc.email
              }, 'secretKey', {expiresIn: '24h'});
              return {
                  email: result._doc.email,
                  token: token,
                  tokenEpiration: 24
              }
          }).catch(err => {
              throw new Error("Unable to add the user at the moment!")
          });
      } else {
          throw new Error("User Already Exist !");
      }
  }
}

const UpdateProfileMutation = {
  type: UserType,
  args: {
      name: {type: new GraphQLNonNull(GraphQLString)},
      age: {type: new GraphQLNonNull(GraphQLInt)}
  },
  async resolve(parent, args, req) {
      if(req.isAuth) {
          const userId = req.userId;
          return UserModel.findByIdAndUpdate(
              {_id: userId}, 
              {
                  name: args.name, 
                  age: args.age
              }, 
              {new: true}
          ).then(result => {
              return {...result._doc, id: result._doc._id};
          }).catch(err => {
              throw new Error('Unable to update the user at the moment !');
          })
      } else {
          throw new Error('User Unauthorised !');
      }
  }
}


module.exports = {
  LoginMutation,
  AddUserMutation,
  UpdateProfileMutation
}