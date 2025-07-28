import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createAnecdote, voteOf } from './reducers/anecdoteReducer'
import Filter from './components/filter'
import Notification from './components/Notification'
import { showNotification } from './reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'
import { setAnecdotes } from './reducers/anecdoteReducer'
import { initializeAnecdotes } from './reducers/anecdoteReducer'

const App = () => {
  const dispatch = useDispatch()

  // useEffect(() => {
  //   anecdoteService
  //     .getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  // }, [])

  useEffect(() => {
    dispatch(initializeAnecdotes()) 
  }, []) 

  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes
    }
    return state.anecdotes.filter(anecdote =>
      anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  })

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  const vote = (id) => {
    console.log('vote', id)
    const anecdote = anecdotes.find(a => a.id === id)
    dispatch(voteOf(id))
    dispatch(showNotification(`you voted '${anecdote.content}'`, 5))
  }

  const addAnecdote = async () => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification/>
      <div>
        <Filter />
      </div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="anecdote"/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App