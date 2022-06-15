const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  if (request.body.likes === undefined) {
    request.body.likes = 0
  }
  if (request.body.title === undefined && request.body.url === undefined) {
    return response.status(400).json('No title and url')
  }
  const blog = new Blog(request.body)
  // blog
  //   .save()
  //   .then(result => {
  //     response.status(201).json(result)
  //   })
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

module.exports = blogsRouter