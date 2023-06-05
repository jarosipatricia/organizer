import React, { useEffect, useState } from 'react';
import { db } from "../firebase.js";
import { uid } from "uid";
import { set, ref, onValue, remove, update } from "firebase/database";
import './Todo.css';
import * as current from './CurrentUser';
import Menu from './Menu';
import todoPic from "../images/todopic.png";
import deleteIcon from "../images/deleteicon.png";
import notImportant from "../images/notImportant.png";
import important from "../images/important.png";

export default function Todo() {
  const currentUser = current.useAuth();
  const nameOfThePage = "todos";
  const doneMessage = 'Congrats! You are one step closer to empty your todo list!';
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [isTodoDone, setIsTodoDone] = useState(false);
  const [isImportant, setIsImportant] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        if (currentUser) { //if user is logged in read his todolist from db
          var dbRef = ref(db, `/${currentUser.uid}/${nameOfThePage}`)
          onValue(dbRef, (snapshot) => {
            setTodoList([]); //every time we try to  read the db it resets that way it doesnt re-add the old value
            const data = snapshot.val();
            if (data !== null) {
              Object.values(data).map((todo) => {
                setTodoList((oldArray) => [...oldArray, todo]); //take the old array then add the new todo
              });
            }
          });
        }
      }
    fetchData()
  }, [currentUser])

  function handleSavingToDatabase(event) {
    event.preventDefault();
    const todoId = uid();
    const dbReference = ref(db, `/${currentUser.uid}/${nameOfThePage}/${todoId}`);
    set(dbReference, {
      todo: todo,
      isImportant: isImportant,
      todoId: todoId
    });
    setTodo("");
  };

  function handleDelete(todoId) {
    const dbReference = ref(db, `/${currentUser.uid}/${nameOfThePage}/${todoId}`);
    remove(dbReference);
    setIsTodoDone(true);
    setTimeout(() => {setIsTodoDone(false); }, 5000);
  };

  function handleUpdate(todo) {
    update(ref(db, `/${currentUser.uid}/${nameOfThePage}/${todo.todoId}`), {
      isImportant: !todo.isImportant
    });
  };

  return (
    <div>
        <Menu></Menu>
        <img src={todoPic} alt="" className='todopic'></img>
        <form className='inputContainer' onSubmit={handleSavingToDatabase}>
          <p>
            <label className='todolabel' htmlFor="todo">Add a todo:</label>
            <input type="text" value={todo} onChange={(e) => setTodo(e.target.value)} placeholder="Add todo..." id="todo"></input>
          </p>
          <input type="submit" value="✓" id="todoSubmit" alt='add'/>
        </form>
        {isTodoDone ? <div className='doneMessage'>{doneMessage} </div> : null}
        {todoList.map((todo) => (
        <div className="todoContainer" data-testid="todoContainer" key={todo.todoId}>
          <div className='todo'>{todo.todo}</div>
          <img onClick={() => handleDelete(todo.todoId)} src={deleteIcon} alt="delete" className='deleteicon'></img>
          <img onClick={() => handleUpdate(todo)} src={notImportant} alt="star" className='starIcon'></img>
        </div>
      ))}
    </div>
  );
}