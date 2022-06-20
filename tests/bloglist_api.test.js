const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  // let blogObject = new Blog(helper.initialBlogs[0])
  // await blogObject.save()
  // blogObject = new Blog(helper.initialBlogs[1])
  // await blogObject.save()
  const createUser = {
    "username": "guest12",
    "name": "mr white",
    "password":"216"
  }
  await api
        .post('/api/users')
        .send(createUser)
  
  // log in to get the token
  const login = {
    "username": "guest12",
    "password": "216"
  }
  const res = await api
    .post('/api/login')
    .send(login)
  
  helper.validToken = res.body.token

})

describe('when there are initial saved notes', () => {
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
  
})


describe('addition of a new blog post', () => {

  test('posting creates a new blog post', async () => {
    const newBlog = {
      title: 'panda',
      author: 'matt',
      url: 'http',
      likes: 15
    }
    token = "bearer ".concat(helper.validToken)

    await api
      .post('/api/blogs')
      .set('Authorization', token)
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

    token = "bearer ".concat(helper.validToken)

    await api
      .post('/api/blogs')
      .set('Authorization', token)
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
  test('posting blog with no title and url returns 400', async () => {
    const newBlog = {
      author: 'matt',
      likes: 16
    }
    token = "bearer ".concat(helper.validToken)
    await api
    .post('/api/blogs')
    .set('Authorization', token)
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  })

  test('posting blog with no token returns 401', async () => {
    const newBlog = {
      title: 'panda',
      author: 'matt',
      url: 'http',
      likes: 15
    }
    token = "bearer ".concat(helper.validToken)

    // no setting of Authorization header
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })
})

describe('deleting a blog post', () => {
  test('deleting a valid post', async () => {


    // adding a new post
    const newBlog = {
      title: 'panda',
      author: 'matt',
      url: 'http',
      likes: 15
    }
    token = "bearer ".concat(helper.validToken)

    const res = await api
      .post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    let blogId = res.body.id

    const blogsAtStart = await helper.blogsInDb()
    let blogToDelete = await Blog.findById(blogId)

    // const blogs = await helper.blogsInDb()

    // const blogToDelete = blogs[0]
    // console.log(blogToDelete)

    await api
    .delete(`/api/blogs/${blogId}`)
    .set('Authorization', token)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(r => r.title)
    expect(contents).not.toContain(blogToDelete.title)

  })
})

describe('updating a blog post', () => {
  test('updating a valid post\'s likes', async () => {
    const blogs = await helper.blogsInDb()

    const blogToUpdate = blogs[0]

    const newBlog = {
      likes: blogToUpdate.likes + 1
    }

    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(newBlog)
    .expect(200)

    const updatedBlogs = await helper.blogsInDb()
    expect(updatedBlogs[0].likes).toEqual(blogToUpdate.likes + 1)


  })
})


afterAll(() => {
  mongoose.connection.close()
})