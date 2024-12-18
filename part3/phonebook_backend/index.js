const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const personsCount = persons.length
    const now = new Date()
    response.send(
        `<p> Phonebook has infor for ${personsCount} people
         <p> ${now.toString()} </p>`
    )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id',(request,response) => {
    const id = request.params.id
    const person = persons.find((person) => person.id === id)
    if(person) response.json(person)
    else response.status(404).end()
})

app.delete('/api/persons/:id', (request,response) => {
    const id = request.params.id
    console.log(id)
    const personExists =  persons.some(person => person.id=== id)

    if(!personExists){
      return response.status(400).json({
        error : 'The person was already deleted from the server'
      })
    }
    persons = persons.filter(person => person.id !== id)
    console.log(persons)
    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 2 ** 32))
}

app.post('/api/persons', (request,response) => {
    const body = request.body
    const personExists =  persons.some(person => person.name.toLowerCase()=== body.name.toLowerCase())

    if(!body.name || !body.number){
        return response.status(400).json({
            error : 'name or number is missing'
        })
    }

    
    if(personExists){
        return response.status(400).json({
            error : 'The name already exists in the phonebook'
        })
    }

    const person = {
        name : body.name,
        number : body.number,
        id : generateId()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
