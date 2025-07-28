import anecdoteReducer, { appendAnecdote, setAnecdotes } from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'
import notificationReducer from './reducers/notificationReducer'
import { configureStore } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer
  }
})

// anecdoteService.getAll().then( anecdotes =>
//   anecdotes.forEach(anecdote => {
//     store.dispatch(appendAnecdote(anecdote))
//   })
// )

anecdoteService.getAll().then(anecdotes =>
  store.dispatch(setAnecdotes(anecdotes))
)

export default store