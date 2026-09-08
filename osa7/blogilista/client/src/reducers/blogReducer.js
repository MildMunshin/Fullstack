import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    likeOf(state, action) {
      const id = action.payload.id
      return state.map(blog =>
        blog.id !== id ? blog: action.payload
      )
    },
    removeBlog(state, action) {
      const id = action.payload.id
      return state.filter(blog => blog.id !== id)
    }
  }
})

export const { setBlogs, appendBlog, likeOf, removeBlog } =
blogSlice.actions

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async dispatch => {
    const newBlog = await blogService.create(blogObject)
    dispatch(appendBlog(newBlog))
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    await blogService.update(likedBlog)
    dispatch(likeOf(likedBlog))
  }
}

export const deleteBlog = blog => {
  return async dispatch => {
    await blogService.deleteBlog(blog.id)
    dispatch(removeBlog({ id: blog.id }))
  }
}

export default blogSlice.reducer