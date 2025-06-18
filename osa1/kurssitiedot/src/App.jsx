const Header = (props_header) => {
  console.log(props_header)
  return ( 
    <div>
      <h1>{props_header.course}</h1>
    </div>
  )
}

const Content = (props_content) => {
  return (
    <div>
      <Part
      part={props_content.parts[0].name} exercises={props_content.parts[0].exercises}
      />
      <Part
      part={props_content.parts[1].name} exercises={props_content.parts[1].exercises}
      />
      <Part
      part={props_content.parts[2].name} exercises={props_content.parts[2].exercises}
      />
    </div>
  )
}

const Part = (props_part) => {
  return (
    <p>{props_part.part} {props_part.exercises}</p>
  )
}

const Total = (props_total) => {
  return (
    <p>Number of exercises {props_total.exercises1 + props_total.exercises2 + props_total.exercises3}</p>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  
  return (
    <div>
      <Header course={course.name} />
      <Content
      parts={course.parts}
      />
      <Total
      exercises1={course.parts[0].exercises} 
      exercises2={course.parts[1].exercises}
      exercises3={course.parts[2].exercises}
      />

    </div>
  )
}

export default App