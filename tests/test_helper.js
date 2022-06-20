const Blog = require('../models/blog')
const User = require('../models/user')
const initialBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  },
  {
    title: 'Go To Statement Considered Harmful 2',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 15,
  },
]

const initialUsers = [
  {
    username: 'm586',
    name: 'matt',
    password: '112222'
  },
  {
    username: '5586',
    name: 'tam',
    password: '1123329'
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', author: 'matt', url:'http', likes:16 })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const validToken = null

module.exports = {
  initialBlogs, initialUsers, nonExistingId, blogsInDb, usersInDb, validToken
}