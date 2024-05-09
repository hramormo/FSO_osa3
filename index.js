const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return ''
})

let persons = [
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

app.get('/api/persons', (request, response) =>{
    response.json(persons)
})

app.get('/api/info', (request, response)=> {
    const personCount = persons.length
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
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request,response) => {
    const body = request.body

    if(!body.name | !body.number){
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }
    else if(persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name is already in the phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    persons = persons.concat(person)

    response.json(person)


})


const generateId = () => {
    const minCeil = Math.ceil(1)
    const maxFloor = Math.floor(99999)
    return Math.floor(Math.random() * (maxFloor - minCeil) + minCeil)
}


const PORT = process.env.PORT ||3001
app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)})
