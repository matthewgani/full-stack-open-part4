const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let res = 0
  blogs.forEach(blog => {
    res = res + blog.likes
  });
  return res
}
const favoriteBlog = (blogs) => {
  let f = {}
  let curr = 0
  blogs.forEach(blog => {
    if (blog.likes > curr) {
      curr = blog.likes 
      f = blog
    }
  })
  let res = {
    title: f.title,
    author: f.author,
    likes: f.likes
  }
  // console.log(typeof(res))

  return res
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}