const {
  BlogType,
  CommentType
} = require('../types');
const { 
  GraphQLID, 
  GraphQLString,
  GraphQLNonNull,
} = require('graphql');
const BlogModel = require('../../models/blog.js');
const CommentModel = require('../../models/comment.js');

const AddBlogMutation = {
  type: BlogType,
  args: {
      title:  {type: new GraphQLNonNull(GraphQLString)},
      breif: {type: new GraphQLNonNull(GraphQLString)},
      description: {type: new GraphQLNonNull(GraphQLString)},
      imageUrl: {type: GraphQLString},
  },
  resolve(parent, args, req) {
      if(req.isAuth){
          let blog = new BlogModel({
              title: args.title,
              breif: args.breif,
              description: args.description,
              imageUrl: args.imageUrl || "",
              userId: req.userId
          });
          return blog.save().then(result => {
              return {...result._doc, id: result._doc._id}
          }).catch(err => {
              throw new Error('Unable to add the post at the moment !');
          });
      } else {
          throw new Error('User Unauthorised !');
      }
  }  
}

const UpdateBlogMutation = {
  type: BlogType,
  args: {
      id: {type: new GraphQLNonNull(GraphQLString)},
      title: {type: new GraphQLNonNull(GraphQLString)},
      description: {type: new GraphQLNonNull(GraphQLString)}
  },
  async resolve(parent, args, req) {
      if(req.isAuth) {
          const postId = args.id;
          return BlogModel.findByIdAndUpdate(
              {_id: postId}, 
              {
                  title: args.title, 
                  description: args.description
              }, 
              {new: true}
          ).then(result => {
              return {...result._doc, id: result._doc._id};
          }).catch(err => {
              throw new Error('Unable to update the post at the moment !');
          })
      } else {
          throw new Error('User Unauthorised !');
      }
  }
}

const DeleteBlogMutation ={
  type: BlogType,
  args: {
      id: {type: new GraphQLNonNull(GraphQLID)},
  },
  async resolve(parent, args, req) {
      if(req.isAuth) {
          const postId = args.id;
          return BlogModel.deleteOne({_id: postId}).then(result=>{
              return {id: postId}
          }).catch(err => {
              throw err
              // throw new Error('Unable to delete the post at the moment !');
          })
      } else {
          throw new Error('User Unauthorised !');
      }
  }
}

const AddCommentMutation = {
    type: CommentType,
    args: {
        postId: {type: GraphQLID},
        comment: {type: GraphQLString}
    },
    resolve(parent, args, req) {
        if(req.isAuth) {
            let comment = new CommentModel({
                comment: args.comment,
                postId: args.postId,
                userName: req.userName
            });
            return comment.save().then(result => {
                return {...result._doc, id: result._doc._id}
            }).catch(err => {
                throw new Error('Unable to add the comment at the moment !');
            });
        } 
        else {
            throw new Error('User Unauthorised !');
        }
    }
  }

module.exports = {
  AddBlogMutation,
  UpdateBlogMutation,
  DeleteBlogMutation,
  AddCommentMutation
}