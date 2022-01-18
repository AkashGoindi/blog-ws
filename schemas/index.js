const { 
    GraphQLObjectType, 
    GraphQLSchema,
} = require('graphql');
const { 
    AddBlogMutation, 
    UpdateBlogMutation, 
    DeleteBlogMutation, 
    AddCommentMutation
} = require('./blog/mutation');
const {  
    LoginMutation, 
    AddUserMutation, 
    UpdateProfileMutation 
} = require('./user/mutation');
const {ProfileQuery, UserQuery} = require('./user/query');
const {BlogsQuery, BlogQuery, CommentsQuery} = require('./blog/query');

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: () => ({
        blog: BlogQuery,
        blogs: BlogsQuery,
        comments: CommentsQuery,
        profile: ProfileQuery,
        users: UserQuery,
    })
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: () => ({
        addBlog: AddBlogMutation,
        updateBlog: UpdateBlogMutation,
        deletePost: DeleteBlogMutation,
        addComment: AddCommentMutation,
        login: LoginMutation,
        addUser: AddUserMutation,
        updateProfile: UpdateProfileMutation,
    })
});

module.exports =  new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
