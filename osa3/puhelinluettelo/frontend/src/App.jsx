import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Filter = ({ filter, handleFilterChange }) => (
  <div>
    filter shown with: <input value={filter} onChange={handleFilterChange} />
  </div>
)

const PersonForm = ({ addName, newName, handleNameChange, newNumber, handleNumberChange }) => (
  <form onSubmit={addName}>
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <button type="submit">add</button>
  </form>
)

const Persons = ({ personsToShow, handleDelete }) => (
  <ul>
    {personsToShow.map(person =>
      <li key={person.id}>
        {person.name} {person.number} <button onClick={() => handleDelete(person.id)}>delete</button>
      </li>
    )}
  </ul>
)

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // console.log('render', persons.length, 'persons')
  
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [addedMessage, setAddedMessage] = useState(null)

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const addName = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        personService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            console.log('success!')
            setAddedMessage({ text: `${updatedPerson.name} changed`, type: 'success' })
            setTimeout(() => {
              setAddedMessage(null)
            }, 5000)
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            setNewName('')
            setNewNumber('')
          })
            .catch(error => {
              console.log('error!')
              setAddedMessage({
                text: `Information of ${newName} has already been removed from server`,
                type: 'error'
              })
              setTimeout(() => {
                setAddedMessage(null)
              }, 5000)
              setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      const nameObject = {
        name: newName,
        number: newNumber,
      }

      personService
        .create(nameObject)
        .then(returnedName => {
          console.log('success!')
          setAddedMessage({ text: `${nameObject.name} added`, type: 'success' })
          setTimeout(() => {
            setAddedMessage(null)
          }, 5000)
          setPersons(persons.concat(returnedName))
          setNewName('')
          setNewNumber('')
        })
    }
  }

  const handleNameChange = (event) => {
    // console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    // console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleDelete = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deletePerson(id)
        .then(() => {
          console.log('success!')
          setAddedMessage({ text: `${person.name} removed`, type: 'success' })
          setTimeout(() => {
            setAddedMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          console.log('error!')
          setAddedMessage({ text: `Information of ${person.name} has already been removed from server`, type: 'error' })
          setTimeout(() => {
            setAddedMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  // console.log(persons)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addedMessage?.text} type={addedMessage?.type} />


      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons personsToShow={personsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App