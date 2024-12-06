import { useState } from 'react'

const Heading = (props) => {
  return (
    <div>
      <h1> {props.headingname} </h1>
    </div>
  )
}

const Button = (props) =>{
  return(
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
const Maxanecdote = (props) => {
  return(
    <div>
    <div> {props.text} </div>
    <div> has {props.value} votes </div>
    </div>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const headingname1="Anecdote of the day"
  const headingname2="Anecdote with most votes"
  const [selected, setSelected] = useState(0)
  const [points,setPoints] = useState(new Array(anecdotes.length).fill(0))
  const maxElement = Math.max(...points)
  const maxIndex = points.indexOf(maxElement);


  const clickVote = (indexAnecdote) => {
    const copy = [...points]
    copy[indexAnecdote] += 1
    setPoints(copy)
    console.log(copy)
  }
  const clickAnecdote = () => {
    const randomInt=Math.floor(Math.random()*(anecdotes.length))
    console.log(randomInt)
    setSelected(randomInt)
  }

  return (
    <div>
      <Heading headingname={headingname1} />
      <div> {anecdotes[selected]} </div>
      <div> has {points[selected]} votes </div>
      <div> 
        <Button onClick={() => clickVote(selected)} text={"vote"} /> 
        <Button onClick={clickAnecdote} text={"next anecdote"} /> 
      </div>
      <Heading headingname={headingname2} />
      <Maxanecdote text={anecdotes[maxIndex]} value={points[maxIndex]} />
    </div>
  )
}

export default App