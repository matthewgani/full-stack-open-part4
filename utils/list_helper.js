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

module.exports = {
  dummy,
  totalLikes
}