const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const mongoPerson = process.argv[3]

// const mongoNumber = process.argv[4]

// const url = `mongodb+srv://MildMunshin:Y6JdIPhFhQZDBEgm@cluster0.5bryfn2.mongodb.net/Puhelinluettelo?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

// mongoose.connect(url)

const url = process.env.MONGODB_URI

// MONGODB_URI="osoite_tahan" npm run dev

console.log('connecting to', url)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        const formats = [
          /^\d{2}-\d{7}$/,
          /^\d{3}-\d{7}$/,
          /^\d{3}-\d{3} \d{4}$/,
          /^\d{2}-\d{3} \d{4}$/,
        ]
        return formats.some(regex => regex.test(v))
      },
      message: props => `${props.value} is not a valid phone number (04-1234567, 04-123 4567, 040-1234567, 040-123 4567)`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

// const Person = mongoose.model('Person', personSchema)

// const person = new Person({
//   name: mongoPerson,
//   number: mongoNumber,
// })

// if (process.argv.length === 3) {
//   console.log('phonebook:')
//   Person.find({}).then(result => {
//     result.forEach(person => {
//       console.log(`${person.name} ${person.number}`)
//     })
//     mongoose.connection.close()
//   })
// }

// if (process.argv.length > 3) {
//   person.save().then(result => {
//     console.log(`added ${newPerson} number ${newNumber} to phonebook`)
//     mongoose.connection.close()
//   })
// }
