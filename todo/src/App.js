import './App.scss'
import React, { useState } from 'react'
import HeaderTodo from './components/HeaderTodo/HeaderTodo'
import LeftBar from './components/LeftBar/LeftBar'
import Todo from './components/Todo/Todo'

function App() {

  const [todos, setTodos] = useState([])

  return (
    <div className="App">
      <HeaderTodo />
      <LeftBar />                         
      <Todo todos={todos} setTodos={setTodos} />      
    </div>
  )
}

export default App
