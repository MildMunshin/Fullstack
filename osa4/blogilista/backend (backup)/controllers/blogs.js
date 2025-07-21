const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

// blogsRouter.get('/', (request, response) => {
//   Blog.find({}).then(blogs => {
//     response.json(blogs)
//   })
// })

blogsRouter.get('/', async (request, response) => { 
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

// app.get('/api/blogs', (request, response) => {
//   Blog.find({}).then(blogs => {
//     response.json(blogs)
//   })
// })

// blogsRouter.get('/api/blogs', (request, response) => {
//   Blog.find({}).then(blogs => {
//     response.json(blogs)
//   })
// })

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })
  try {
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

// blogsRouter.post('/', (request, response, next) => {
//   const body = request.body

//   const blog = new Blog({
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes
//   })

//   blog.save()
//     .then(savedBlog => {
//       response.json(savedBlog)
//     })
//     .catch(error => next(error))
// })

module.exports = blogsRouter