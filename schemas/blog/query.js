const {
  BlogType,
  PostsType,
  CommentType
} = require('../types');

const {
  GraphQLID,
  GraphQLString,
  GraphQLList
} = require('graphql');

const BlogModel = require('../../models/blog.js');
const UserModel = require('../../models/user.js');
const CommentModel = require('../../models/comment.js');

const BlogQuery = {
  type: BlogType,
  args: { id: { type: GraphQLID } },
  resolve(parent, args) {
    return BlogModel.findById(args.id);
  }
}

const BlogsQuery = {
  type: PostsType,
  args: { userId: { type: GraphQLString } },
  async resolve(parent, args, req) {
    if (args.userId) {
      let posts = BlogModel.find({ userId: args.userId }).sort({ createdAt: -1 });
      let user = await UserModel.findById(args.userId);
      return {
        posts,
        postedBy: user.name
      }
    } else {
      return {
        posts: BlogModel.find({}).sort({ createdAt: -1 }),
        postedBy: 'Comunity'
      }
    }
  }
}

const CommentsQuery = {
  type: new GraphQLList(CommentType),
  args: { postId: { type: GraphQLID } },
  resolve(parent, args, req) {
    if (req.isAuth) {
      return CommentModel.find({ postId: args.postId }).sort({ createdAt: -1 }).limit(10);
    } else {
      throw new Error('User Unauthorised !');
    }
  }
}

module.exports = {
  BlogsQuery,
  BlogQuery,
  CommentsQuery
}