import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.',
    'You cannot urinate against the wind.',
    'To confuse your enemies you have to first confuse yourself.',
    'Life is a struggle — by day for bread, and by night for flesh.'
  ]

  const [selected, setSelected] = useState(Math.floor(Math.random() * anecdotes.length))

  const n = anecdotes.length
  const a = Array(n).fill(0)

  const [votes, setVotes] = useState(() => Array(anecdotes.length).fill(0))

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomIndex)
  }

  const upvoteClick = () => {
  const copy = [...votes]
  copy[selected] += 1
  setVotes(copy)
}

  const max = Math.max(...votes)
  const indexOfMax = votes.indexOf(max)

  console.log(selected)
  console.log(votes)
  console.log(indexOfMax)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={upvoteClick}>vote</button>
      <button onClick={handleClick}>next anecdote</button>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[indexOfMax]}</p>
    </div>
  )
}

export default App