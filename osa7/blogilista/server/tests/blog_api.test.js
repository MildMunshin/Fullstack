const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

// beforeEach(async () => {
//   await Blog.deleteMany({})

//   const blogObjects = helper.initialBlogs
//     .map(blog => new Blog(blog))
//   const promiseArray = blogObjects.map(blog => blog.save())
//   await Promise.all(promiseArray)
// })

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  await User.deleteMany({})
  await User.insertMany(helper.initialUsers)
})

test('a user with invalid username cannot be added ', async () => {
  const newUser = {
    "username": "Ke",
    "name": "Keke Multanen",
    "password": "badpassword"
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})

test('a user with invalid password cannot be added ', async () => {
  const newUser = {
    "username": "Keke",
    "name": "Keke Multanen",
    "password": "j2"
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})

test('a user with a duplicate username cannot be added', async () => {
  const newUser = {
    username: helper.initialUsers[0].username,
    name: 'Test Duplicate',
    password: 'validpassword'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
})


test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(e => e.title)
  assert.strictEqual(titles.includes('React patterns'), true)
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  assert(titles.includes('Canonical string reduction'))
})

test('blog without title is not added', async () => {
  const newBlog = {
    _id: "5a422b891b54a676234d17fa",

    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToView = blogsAtStart[0]


  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultBlog.body, blogToView)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]


  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const titles = blogsAtEnd.map(n => n.title)
  assert(!titles.includes(blogToDelete.title))

  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('all blogs have an id field', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body
  blogs.forEach(blog => {
    assert.ok(blog.id, 'Blog should have an id field')
    assert.strictEqual(blog._id, undefined, 'Blog should not have an _id field')
  })
})

test('should return 400 Bad Request if title is missing', async () => {
  const blogWithoutTitle = {
    author: 'Test Author',
    url: 'http://testurl.com'
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutTitle)
    .expect(400)
})

test('should return 400 Bad Request if url is missing', async () => {
  const blogWithoutUrl = {
    title: 'Test Title',
    author: 'Test Author'
  }

  await api
    .post('/api/blogs')
    .send(blogWithoutUrl)
    .expect(400)
})

test('should set likes to 0 if likes field is missing', async () => {
  const newBlog = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html'
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('a blog can be updated (likes)', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})