const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async() => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('blog post has an id created by Db', async () => {

  const blogs = await helper.blogsInDb()
  expect(blogs[0].id).toBeDefined()


})
test('posting creates a new blog post', async () => {
  const newBlog = {
    title: 'panda',
    author: 'matt',
    url: 'http',
    likes: 15
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogs = await helper.blogsInDb()

  const contents = blogs.map(n => n.title)
  expect(contents).toContain(
    'panda'
  )
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
})

test('posting a blog with no likes property defaults likes to 0', async () => {
  const newBlog = {
    title: 'panda',
    author: 'matt',
    url: 'http'
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const blogs = await helper.blogsInDb()

  const contents = blogs.map(n => n.title)
  expect(contents).toContain(
    'panda'
  )
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
})
test('posting blog with no title and url returns 400 ', async () => {
  const newBlog = {
    author: 'matt',
    likes: 16
  }

  await api
  .post('/api/blogs')
  .send(newBlog)
  .expect(400)
  .expect('Content-Type', /application\/json/)


})
afterAll(() => {
  mongoose.connection.close()
})