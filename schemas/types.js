const BlogModel = require('../models/blog.js');
const UserModel = require('../models/user.js');

const jwt = require('jsonwebtoken');
const { 
    GraphQLObjectType, 
    GraphQLID, 
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');


const AuthType = new GraphQLObjectType({
  name: "Auth",
  fields: () => ({
      email: {type: GraphQLString},
      token: {type: GraphQLString},
      tokenEpiration: {type: GraphQLInt},
  })
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
      id: {type: GraphQLID},
      name: {type: GraphQLString},
      age: {type: GraphQLString},
      email: {type: GraphQLID},
      posts: {
          type: new GraphQLList(BlogType),
          resolve(parent, args) {
              return BlogModel.find({userId: parent.id});
          }
      }
  })
});

const BlogType = new GraphQLObjectType({
  name: "Blog",
  fields: () => ({
      id: {type: GraphQLID},
      title: {type: GraphQLString},
      breif: {type: GraphQLString},
      description: {type: GraphQLString},
      imageUrl: {type: GraphQLString},
      createdAt: {type: GraphQLString},
      publisher: {
          type: UserType,
          resolve(parent, args) {
              return UserModel.findById(parent.userId);
          }
      }
  })
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
      id: {type: GraphQLID},
      comment: {type: GraphQLString},
      userName: {type: GraphQLString},
      postId: {type: GraphQLID},
  })
});

const PostsType = new GraphQLObjectType({
  name: "AllPosts",
  fields: () => ({
      posts: {type: new GraphQLList(BlogType)},
      postedBy: {type: GraphQLString}
  })
});

module.exports = {
  AuthType,
  UserType,
  BlogType,
  CommentType,
  PostsType
}
