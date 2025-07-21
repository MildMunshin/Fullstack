require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.use(express.static('build'))

app.use(cors())

app.use(express.json())

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})

console.log('PORT:', process.env.PORT)
console.log('MONGODB_URI:', process.env.MONGODB_URI)


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    'name': 'Arto Hellas',
    'number': '040-123456',
    'id': '1'
  },
  {
    'name': 'Ada Lovelace',
    'number': '39-44-5323523',
    'id': '2'
  },
  {
    'name': 'Dan Abramov',
    'number': '12-43-234345',
    'id': '3'
  },
  {
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122',
    'id': '4'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// EI MONGOSSA!
app.get('/info', (request, response) => {
  const numberOfPersons = persons.length
  const currentTime = new Date().toString()
  const infoText = `
    <p>Phonebook has info for ${numberOfPersons} people</p>
    <p>${currentTime}</p>
    `
  response.send(infoText)
})

// const generateId = () => {
//   const maxId = persons.length > 0
//     ? Math.max(...persons.map(p => Number(p.id)))
//     : 0
//   return String(maxId + 1)
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log('POST body VIESTI:', body)

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const checkName = persons.find(person => person.name === body.name)
  if (checkName) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  // const person = {
  //   name: body.name,
  //   number: body.number,
  //   id: generateId()
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))

  // persons = persons.concat(person)

  // response.json(person)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   persons = persons.filter(person => person.id !== id)

//   response.status(204).end()
// })

// app.get('/api/persons', (request, response) => {
//   response.json(persons)
// })

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)