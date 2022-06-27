const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')


// moved token checking to middleware


blogsRouter.get('/', async (request, response) => {
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
  const blogs = await Blog.find({}).populate('user', {username:1, name: 1})
  // the json below will change the user object according to userSchema too
  // we populate with the parameter user because Blog has a user param
  response.json(blogs)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

  // const decodedToken = jwt.verify(request.token, process.env.SECRET)

  //handled in middleware
  // if (!decodedToken.id) {
  //   return response.status(401).json({error: 'token missing or invalid'})
  // }

  const userid = request.user.id

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    // if no blog exist, we still return 204
    return response.status(204).end()
  }
  if (!(blog.user.toString() === userid)) {
    return response.status(401).json({error: 'unauthorized to delete this blog post'})
  }


  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})



// they didnt ask for this yet
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body 

  const blog = {
    likes: body.likes
  }
  // blog object here only needs to contain updated likes
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, 
    {new: true, runValidators: true, context:'query'})
  response.json(updatedBlog)
})



blogsRouter.post('/', userExtractor, async (request, response) => {
  if (request.body.likes === undefined) {
    request.body.likes = 0
  }
  if (request.body.title === undefined && request.body.url === undefined) {
    return response.status(400).json('No title and url')
  }
  const body = request.body

  // request Headers needs Key Authorization 
  // with value 'bearer <token>'
  // const token = getTokenFrom(request)

  // if (!request.token) {
  //   return response.status(401).json({error: 'No token in header'})
  // }

  // handled if no token or if invalid token in middleware errorhandler
  // const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // contains username, id and iat. username and id were created in userForToken
  // in login.js

  //The object decoded from the token contains the username and id fields,
  // which tells the server who made the request.
  

  // if (!decodedToken.id) {
  //   return response.status(401).json({error: 'token missing or invalid'})
  // }

  const user = request.user

  // const blog = new Blog(request.body)
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })
  //gives the user._id (id object) to be saved to the DB.
  // in the db, the blog will have the user id object, referencing the user in the user collection


  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()




  response.status(201).json(savedBlog)
  // we only use the blogSchema change when returning json
  // meaning we only return .id (string) instead of __id and __v which savedBlog has
  
})

module.exports = blogsRouter