import { useState } from 'react'

const Name = (props) => {
  return(
    <div> {props.name} {props.number} </div>
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
        <button onClick={props.OnClick} type="submit" >add</button>
      </div>
    </form>    
  )
}

const Persons = (props) => {
 return(
  <div> {props.personsToShow.map(
    (person) => (<Name key={person.id} name={person.name} number={person.number} />) )}
  </div>
 )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])


  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [filter, setFilter] = useState('')

  const personsToShow = filter === '' 
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()) )

  const OnClick = () => {
    const toFind=newName
    const found = persons.some( (person) => person.name === toFind)
    
    if(found){
      setIsDuplicate(true)
      return(
        alert(`${newName} is already added to phonebook`)
      )
    }
    setIsDuplicate(false)
  }

  const  addName = (event) => {
    event.preventDefault()
    console.log("button clicked ", event.target)

    if(!isDuplicate){

      const nameObject ={
        name: newName, number : newNumber, id : persons.length+1
      }
  
      setPersons(persons.concat(nameObject))
      setNewName('')
      setNewNumber('')
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

  return (
    <div>
      <h2>Phonebook</h2>

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

      <Persons personsToShow={personsToShow}/>

    </div>
  )
}

export default App