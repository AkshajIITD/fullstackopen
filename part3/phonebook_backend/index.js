require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :res[content-length] - :response-time ms :body'))


app.get('/info', (request, response) => {
  Person.countDocuments({}).then(count => {
    const now = new Date()
    response.send(
      `<p>Phonebook has info for ${count} people</p>
      <p>${now.toString()}</p>`
    )
  })

})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id',(request,response,next) => {
  const id = request.params.id
  Person.findById(id).then(person => { 
    response.json(person)
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request,response,next) => {
  const id = request.params.id
  console.log(`deleting person with id : ${id}`)
  Person.findById(id).then(person => {
    if(!person){
      return response.status(404).json({error : 'the person was laready deleted'})
    }
    return Person.findByIdAndDelete(id)
  })
  .then(()=>{
    console.log(`Person with ID ${id} deleted successfully`)
    response.status(204).end()
  })
  .catch(error => next(error))
})


app.post('/api/persons', (request,response) => {
  const body = request.body

  if(!body.name || !body.number){
      return response.status(400).json({
          error : 'name or number is missing'
      })
  }

  Person.findOne({name : body.name.toLowerCase()})
  .then(existingPerson => {
    if(existingPerson) {
      return response.status(400).json({error : 'the name already exists in the phonebook'})
    }

    const person = new Person({
      name : body.name,
      number : body.number,
    })

    return person.save()
  })
  .then(savedPerson => {
    response.json(savedPerson)
  })

})

app.put('/api/persons/:id', (request,response,next) => {
  const body = request.body
  const id = request.params.id
  const person = {
    name : body.name,
    number : body.number,
  }
  
  Person.findByIdAndUpdate(id,person, {new : true})
  .then(updatedPerson => {
    response.json(updatedPerson)
  })
  .catch(error => next(error))
})

const errorHandler = (error,request,response,next) => {
  console.error(error.message)

  if(error.name === 'CastError'){
    return response.status(400).send({error : 'malformatted id'})
  }

  next(error)

}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
