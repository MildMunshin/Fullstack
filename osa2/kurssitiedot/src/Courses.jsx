const Header = (props) => {
  return ( 
    <div>
      <h2>{props.header.name}</h2>
    </div>
  )
}

const Content = (props) => {
  const { parts } = props

  return (
    <div>
      <ul>
        {parts.map(part =>
          <li key={part.id}>
            <p>{part.name} {part.exercises}</p>
          </li>
        )}
      </ul>
    </div>
  )
}

const Total = (props) => {
  const { parts } = props
  const exercise_points = parts.map(part => part.exercises)
  
  const initialValue = 0;
  const sumWithInitial = exercise_points.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    initialValue,
  );

  console.log(sumWithInitial);
  return (
    <b>total of {sumWithInitial} exercises</b>
  )
}

const Courses = (props) => {
  const { courses } = props

  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <Header header={course} />
          <Content parts={course.parts} />
          <Total parts={course.parts} />   
        </div>
      ))}
    </div>
  )
}

export default Courses