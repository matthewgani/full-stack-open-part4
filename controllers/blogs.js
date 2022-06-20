const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.delete('/:id', async (request, response) => {
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

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, 
    {new: true, runValidators: true, context:'query'})
  response.json(updatedBlog)
})



blogsRouter.post('/', async (request, response) => {
  if (request.body.likes === undefined) {
    request.body.likes = 0
  }
  if (request.body.title === undefined && request.body.url === undefined) {
    return response.status(400).json('No title and url')
  }
  // const user = await User.findById(body.userId)

  const blog = new Blog(request.body)
  
  // const blog = new Blog({
  //   title: body.title,
  //   author: body.author,
  //   url: body.url,
  //   likes: body.likes,
  //   user: user._id
  // })
  //gives the user._id (id object) to be saved to the DB.
  // in the db, the blog will have the user id object, referencing the user in the user collection


  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })
  const savedBlog = await blog.save()

  // user.blogs = user.blogs.concat(savedBlog._id)
  // await user.save()




  response.status(201).json(savedBlog)
  // we only use the blogSchema change when returning json
  // meaning we only return .id (string) instead of __id and __v which savedBlog has
  
})

module.exports = blogsRouter