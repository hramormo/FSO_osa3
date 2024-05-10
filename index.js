require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const morgan = require('morgan')
const cors = require('cors')



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
  
  app.use(requestLogger)

morgan.token('body', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return ''
})



/*let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]
*/
app.get('/api/persons', (request, response) =>{
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/api/info', (request, response, next)=> {
    const personCount = Person.find({}).length
    
    const timestamp = new Date()
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'long'
    }
    const formattedTimestamp = timestamp.toLocaleString('en-US', options).replace(/,/g, '')
    console.log(formattedTimestamp)
    response.send(`<p>Phonebook has info for ${personCount} people</p> <p>${formattedTimestamp}</p>`)
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if(person){
      response.json(person)
    } else {
      response.status(404).end()
    }
    })
    .catch(error => next(error))
    })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request,response) => {
    const body = request.body

    if(!body.name | !body.number){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    /*else if(persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name is already in the phonebook'
        })
    }*/

    const person = new Person({
        name: body.name,
        number: body.number,
    })
        
    
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })


})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body
  
    const person = {
      name: body.name,
      number: body.number,
    }
  
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })

const generateId = () => {
    const minCeil = Math.ceil(1)
    const maxFloor = Math.floor(99999)
    return Math.floor(Math.random() * (maxFloor - minCeil) + minCeil)
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformatted id'})
    }
  
    next(error)
  }
  
  app.use(errorHandler)

const PORT = process.env.PORT ||3001
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})
