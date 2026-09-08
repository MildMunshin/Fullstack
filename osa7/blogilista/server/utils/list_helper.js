const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let currentBlog = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > currentBlog.likes) {
      currentBlog = blogs[i]
    }
  }
  return currentBlog
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  let maxAuthor = null
  let maxCount = 0

  for (const [author, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxAuthor = author
      maxCount = count
    }
  }

  return {
    author: maxAuthor,
    blogs: maxCount
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}

  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes
  })

  let maxAuthor = null
  let maxLikes = 0

  for (const [author, likes] of Object.entries(counts)) {
    if (likes > maxLikes) {
      maxAuthor = author
      maxLikes = likes
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}