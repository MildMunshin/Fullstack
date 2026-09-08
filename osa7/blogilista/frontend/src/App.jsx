import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import { useDispatch, useSelector } from 'react-redux'
import Notification from './components/Notification'
import { showNotification } from './reducers/notificationReducer'

import { initializeBlogs, createBlog, likeBlog, deleteBlog } from './reducers/blogReducer'

const App = () => {
  // const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [])

  const blogs = useSelector(state => state.blogs)
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const blogFormRef = useRef()

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = async (event) => {
    event.preventDefault()
    blogFormRef.current.toggleVisibility()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    }

    try {
      await dispatch(createBlog(blogObject))
      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      dispatch(showNotification(`New blog '${blogObject.title}' created`))
    } catch (error) {
      console.error('Error creating blog:', error)
      dispatch(showNotification('Error creating blog'))
    }
  }

  // const addBlog = async (event) => {
  //   blogFormRef.current.toggleVisibility()
  //   event.preventDefault()

  //   const blogObject = {
  //     title: newTitle,
  //     author: newAuthor,
  //     url: newUrl,
  //   }

  //   try {
  //     const returnedBlog = await dispatch(createBlog(blogObject))

  //     const completedBlog = {
  //       ...returnedBlog,
  //       user: {
  //         username: user.username,
  //         name: user.name,
  //         id: user.id
  //       }
  //     }

  //     setBlogs(blogs.concat(completedBlog))
  //     setNewTitle('')
  //     setNewAuthor('')
  //     setNewUrl('')
  //     dispatch(showNotification(`New blog '${completedBlog.title}' created`))
  //   } catch (exception) {
  //     setErrorMessage('Error creating blog')
  //     setTimeout(() => {
  //       setErrorMessage(null)
  //     }, 5000)
  //   }
  // }

  // useEffect(() => {
  //   blogService.getAll().then(blogs =>
  //     setBlogs( blogs )
  //   )
  // }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      console.log('token added:', user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      console.log(window.localStorage)

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  // const handleLike = async (id) => {
  //   const blog = blogs.find(b => b.id === id)
  //   const updatedBlog = {
  //     ...blog,
  //     likes: blog.likes + 1,
  //     user: blog.user.id
  //   }

  //   try {
  //     const returnedBlog = await blogService.update(id, updatedBlog)

  //     const completedBlog = {
  //       ...returnedBlog,
  //       user: blog.user
  //     }

  //     setBlogs(blogs.map(b => b.id === id ? completedBlog : b))
  //   } catch (error) {
  //     console.error('error updating like')
  //   }
  // }

  const handleLike = async (id) => {
    const blog = blogs.find(b => b.id === id)
    dispatch(likeBlog(blog))
    dispatch(showNotification(`You liked '${blog.title}'`, 5))
  }

  // const handleDelete = async (id) => {
  //   try {
  //     const blog = blogs.find(p => p.id === id)
  //     if (window.confirm(`Delete ${blog.title}`)) {
  //       await blogService
  //         .deleteBlog(id)
  //       setBlogs(blogs.filter(b => b.id !== id))
  //     }
  //   } catch (error) {
  //     console.log('error deleting blog')
  //   }
  // }

  const handleDelete = async (id) => {
    try {
      const blog = blogs.find(b => b.id === id)
      if (window.confirm(`Delete ${blog.title}`)) {
        dispatch(deleteBlog(blog))
        dispatch(showNotification(`Deleted '${blog.title}'`, 5))
      }
    } catch (error) {
      console.log('error deleting blog')
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="Login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const blogsList = () => (
    <div>
      <h2>Blogs</h2>
      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} user={user} handleLike={handleLike} handleDelete={handleDelete}/>
      )}
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel="New blog" ref={blogFormRef}>
      <BlogForm
        addBlog={addBlog}
        newTitle={newTitle}
        newAuthor={newAuthor}
        newUrl={newUrl}
        handleTitleChange={handleTitleChange}
        handleAuthorChange={handleAuthorChange}
        handleUrlChange={handleUrlChange}
      />
    </Togglable>
  )

  return (
    <div>
      <Notification/>
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name || user.username} logged in <button onClick={handleLogout}>logout</button></p>
          {blogForm()}
          {blogsList()}
        </div>
      )}
    </div>
  )
}

export default App