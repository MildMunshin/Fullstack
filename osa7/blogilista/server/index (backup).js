const express = require('express')
const mongoose = require('mongoose')


const app = express()

// ÄLÄ KOSKAAN TALLETA SALASANOJA GitHubiin!
const url = `mongodb+srv://MildMunshin:Y6JdIPhFhQZDBEgm@cluster0.5bryfn2.mongodb.net/Blogilista?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

// let blogs = [
//   {
//     id: "1",
//     content: "HTML is easy",
//     important: true
//   },
//   {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false
//   },
//   {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
//   }
// ]

app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs)
  })
})

// app.get('/api/blogs/:id', (request, response) => {
//   const id = request.params.id
//   const blog = blogs.find(blog => blog.id === id)

//   if (blog) {
//     response.json(blog)
//   } else {
//     response.status(404).end()
//   }
// })

// app.post('/api/blogs', (request, response) => {
//   const blog = new Blog({
//     title: body.title,
//     author: body.author,
//     url: body.url,
//     likes: body.likes,
//   })

//   blog.save().then((savedBlog) => {
//     response.status(savedBlog)
//   })
// })

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})