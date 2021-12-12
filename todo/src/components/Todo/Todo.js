import React, { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import './Todo.scss'

const Todo = ({ todos, setTodos }) => {

  const [value, setValue] = useState('')
  const [edit, setEdit] = useState(null)
  const [inputValue, setInputValue] = useState('')
  let rightBlock = todos.filter(todo => todo.complited === true)  
  let leftBlock = todos.filter(todo => todo.complited === false)  

  function delTodo(id) {
    let newTodos = [...todos].filter(todo => todo.id !== id)
    setTodos(newTodos)
  }

  function complitedTodo(id) {
    let newTodos = [...todos].filter(todo => {
      if (todo.id === id) {
        todo.complited = !todo.complited
      }
      return todo
    })    
    setTodos(newTodos)
  }
  
  function editTodo(id, title) {    
    setEdit(id)
    setValue(title)        
  }
  
  async function saveTodo(id, value) {
    if(!value) {
      return
    }    
    setTodos([...todos].filter(todo => {
      if (todo.id === id) {
        todo.title = value
      }
      return todo
    }))
    try {
      const response = await (fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'PUT',
        body: JSON.stringify([...todos].filter(todo => todo.id === id)),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }))
      const data = await response.json()            
      data.id = id
      setEdit(null)      
    } catch (error) {
      new Error(error)
    }    
  }

  async function fetchTodo(inputValue) {
    try {
      const response = await (fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: inputValue,
          status: true,
          complited: false,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }))
      const data = await response.json()      
      data.id = uuidv4()
      return data
    } catch (error) {
      new Error(error)
    }    
  }

  async function newTodo() {
    if (inputValue) {
      setTodos(
        [...todos, await fetchTodo(inputValue)]
      )
      setInputValue('')
    }
  }
  
  // autoFocus on edit
  let inputRef = useRef(null)
  function focusInput () {
    inputRef.current.focus()
  }
  useEffect(() => {
    if (inputRef.current !== null) {
      focusInput()
    }
  }, [edit])
  // save on press enter
  function pressEnter(e) {
    if (e.key === 'Enter') {
      edit ? saveTodo(edit, value) : newTodo()
      
    }
  }

  return (        
    <div className='content'>     
        {
          edit ?
            <div className='add'>
              <input                
                ref={inputRef} 
                type="text"                 
                placeholder="+ Add a task, press Enter to save" 
                value={value} 
                onChange={(e) => setValue(e.target.value)} 
                className='input-add-todo'
                onKeyPress={pressEnter}                
              />
              <button onClick={() => saveTodo(edit, value)} className='btn-add'>Save</button>
            </div>
          :
            <div className='add'>
              <input type="text" 
                placeholder="+ Add a task, press Enter to save" 
                value={inputValue} 
                onChange={(e) => setInputValue(e.target.value)} 
                className='input-add-todo'
                onKeyPress={pressEnter}
              />
              <button onClick={() => newTodo()} className='btn-add'>Add</button>
            </div>
        }        
      <div className='left'>
        <div className='total'>Total: {todos.length} </div>
        <div className='total-todo'> To do ({todos.filter(todo => todo.complited === false).length})</div>
        {
          leftBlock.map( todo => (
            <div key={todo.id} className='todo'>
              {
                edit === todo.id ? 
                  <div className='nocomplited'>
                    <div className='check-todo'></div>
                    <input 
                      className='change-todo'
                      value={value}                      
                      readOnly
                    />
                    <div className='btn-del' onClick={() => delTodo(todo.id)}></div>
                  </div>
                :
                  <div className='nocomplited'>
                    <div className='check-todo' onClick={() => complitedTodo(todo.id)}></div>
                    <div className='title-todo'>{ todo.title }</div>
                    <div className='btn-edit' onClick={() => editTodo(todo.id, todo.title)}></div>
                    <div className='btn-copy' ></div>                    
                    <div className='btn-del' onClick={() => delTodo(todo.id)}></div>
                  </div>
              }
            </div>
          ))
        }
      </div>
      <div className='right'>
        <div className='total-complited'> Complited ({todos.filter(todo => todo.complited === true).length})</div>
        {
          rightBlock.map( todo => (
            <div key={todo.id} className='complited'>
              <div className='checked-todo' onClick={() => complitedTodo(todo.id)}></div>
              <div className='title-todo'>{ todo.title }</div>              
              <div className='btn-del' onClick={() => delTodo(todo.id)}></div>
            </div>              
          ))
        }
      </div>
    </div>
  )
}

export default Todo