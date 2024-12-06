const Course = ({course}) => {

    const Header = ({heading}) => {
      return (
        <div>
          <h2>{heading}</h2>
        </div>
      )
    }

    const Part = (props) => {
      return (
        <p>
          {props.name} {props.exercises}
        </p>
      )
    }

    const Content = ({parts}) => {
      return (
        <div>
          {parts.map( (part) => (<Part key={part.id} name= {part.name} exercises={part.exercises} /> ))}
        </div>
      )
    }

    const Total = ({ parts }) => {
      const total = parts.reduce((sum, part) => sum + part.exercises, 0);
      return (
        <p>
          <strong> total of {total} exercises </strong>
        </p>
      )
    }

    

    return (
      <div>
        <Header heading={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

  export default Course