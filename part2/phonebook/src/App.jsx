import { useState, useEffect } from 'react'
import axios from 'axios'
import personsService from './services/persons'

const Notification = ({message,add}) => {
  const notificationStyle = {
    color : add ? 'green' : 'red',
    fontStyle : 'italic',
    fontSize : 20,
    background : 'lightgrey',
    borderStyle : 'solid',
    borderRadius : 5,
    padding: 10,
    marginBottom: 10
  }

  if(message === null) return null
  return(
    <div style = {notificationStyle} >
      {message}
    </div>
  )
}

const Name = (props) => {
  return(
    <div>
       {props.name} {props.number} 
       <button onClick={props.clickDelete} type="button"> delete </button>
    </div>
  )
}

const Filter =(props) => {
  return(
    <div> filter shown with <input value={props.filter} onChange={props.handleFilterChange}/> </div>
  )
}

const PersonForm = (props) => {
  return(
    <form onSubmit={props.addName} >
      <div>
        name: <input value={props.newName} onChange={props.handleNameChange} />
      </div>
      <div> 
        number : <input value ={props.newNumber} onChange={props.handleNumberChange}/> </div>
      <div>
        <button onClick={props.OnClick} type="submit" > add </button>
      </div>
    </form>    
  )
}

const Persons = (props) => {
 return(
  <div> {props.personsToShow.map(
    (person) => (<Name key={person.id} name={person.name} number={person.number} clickDelete={()=> props.clickDeleteOf(person.name,person.id)} />) )}
  </div>
 )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [replace, setReplace] = useState(false)
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [add,setAdd] = useState(true)

  const hook = () => {
    console.log('effect')

    const eventHandler = response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    }

    const promise = personsService.getAll()
    promise.then(eventHandler)
  }

  useEffect(hook,[])

  console.log('render', persons.length, 'persons')

  const personsToShow = filter === '' 
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) )

  const OnClick = () => {
    const personExists = persons.some( (person) => person.name.toLowerCase() === newName.toLowerCase())
    
    if(personExists){
      setIsDuplicate(true)
      const confirmReplace=confirm(`${newName} is already added to phonebook, replace the old number with a new one`)
      if(!confirmReplace){
        setReplace(false)
        return
      }
      else setReplace(true)
    }
    else setIsDuplicate(false)
  }

  const  addName = (event) => {
    event.preventDefault()
    console.log("button clicked ", event.target)

    if(!isDuplicate){

      const newObject ={
        name: newName, number : newNumber
      }

      const eventHandler = (response) => {
        console.log(response.data)
        setPersons(persons.concat(response.data))
        setAdd(true)
        setErrorMessage(`${newName} is Added`)
        setTimeout(()=> {setErrorMessage(null)} , 5000)
        setNewName('')
        setNewNumber('')    
      }
      
      const promise = personsService.create(newObject)
      console.log("data posted")
      promise.then(eventHandler)
    }
    else if(isDuplicate && replace) {
      const exisitingPerson = persons.find( (person) => person.name.toLowerCase() === newName.toLowerCase())
      const changedPerson = {...exisitingPerson, number : newNumber}

      const eventHandler = (response) => {
        console.log("number changed")
        setPersons(persons.map ( (person) => person.id === exisitingPerson.id ? response.data : person))
        setNewName('')
        setNewNumber('')
      }
      const promise = personsService.update(changedPerson.id,changedPerson)
      promise.then(eventHandler)
    }

  }

  const handleFilterChange = (event) =>{
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  const handleNameChange = (event) =>{
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) =>{
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const clickDeleteOf = (name,id) => {
    const yes= confirm(`Delete ${name} ?`)

    const eventHandler = () => {
      setPersons(persons.filter(person => person.id !== id))
      console.log(`${name} deleted successfully`)
    }

    if(yes) {
      const promise= personsService.erase(id)
      promise.then(eventHandler).catch(error => {
        setAdd(false)
        setErrorMessage(`The person '${name}' was already deleted from the server`)
        setTimeout(()=> {setErrorMessage(null)} , 5000)
        setPersons(persons.filter(person => person.id !== id))
      })
   }
  }

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message = {errorMessage} add={add} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h2>add a new</h2>
      
      <PersonForm 
      addName={addName}
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      OnClick={OnClick}
      />

      <h2>Numbers</h2>

      <Persons personsToShow={personsToShow} clickDeleteOf={clickDeleteOf}  />

    </div>
  )
}

export default App