import { useState } from 'react'

const Heading = (props) => {
  return (
    <div>
      <h1> {props.headingname} </h1>
    </div>
  )
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const StatisticLine = (props) => {
  return (
    <tr>
      <td>{props.text}</td> 
      <td>{props.value}</td>
    </tr>
  )
}

const Statistics = (props) => {
  if(props.all == 0) {
    return (
      <div> No feedback given </div>
    )
  }
  return (
    <table>
      <tbody> 
        <StatisticLine text="good" value={props.goodvalue} />
        <StatisticLine text="neutral" value={props.neutralvalue} />
        <StatisticLine text="bad" value={props.badvalue} />
        <StatisticLine text="all" value={props.allvalue} />
        <StatisticLine text="average" value={props.averagevalue} />
        <StatisticLine text="positive" value={props.positivevalue + " %"} />
      </tbody>
    </table>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const headingname1 ='give feedback'
  const headingname2='statistics'
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [all, setAll] = useState(0)
  const [average, setAverage]=useState(0)
  const [positive, setPositive]=useState(0)

  const clickGood= () => {
    const updatedGood=good+1
    setGood(updatedGood)
    const updatedAll=updatedGood+neutral+bad
    setAll(updatedAll)
    const updatedAverage=(updatedGood-bad)/updatedAll
    setAverage(updatedAverage)
    const updatedPostive=(updatedGood/updatedAll)*100
    setPositive(updatedPostive)
  }

  const clickNeutral= () => {
    const updatedNeutral=neutral+1
    setNeutral(updatedNeutral)
    const updatedAll= good+updatedNeutral+bad
    setAll(updatedAll)
    const updatedAverage=(good-bad)/updatedAll
    setAverage(updatedAverage)
    const updatedPostive=(good/updatedAll)*100
    setPositive(updatedPostive)
  }

  const clickBad= () => {
    const updatedBad=bad+1
    setBad(updatedBad)
    const updatedAll=good+neutral+updatedBad
    setAll(updatedAll)
    const updatedAverage=(good-updatedBad)/updatedAll
    setAverage(updatedAverage)
    const updatedPostive=(good/updatedAll)*100
    setPositive(updatedPostive)
  }
  return (
    <div>
      <Heading headingname={headingname1} />
      <Button onClick={clickGood} text='good' />
      <Button onClick={clickNeutral} text='neutral' />
      <Button onClick={clickBad} text='bad' />
      <Heading headingname={headingname2} />
      <Statistics 
        goodvalue={good}
        neutralvalue={neutral}
        badvalue={bad}
        allvalue={all}
        averagevalue={average}
        positivevalue={positive}
      />

    </div>
  )
}

export default App