import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Todo from "./components/Todo";
import Expensetracker from  "./components/ExpenseTracker";
import Calendarpage from './components/Calendar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Pomodoro from './components/Pomodoro';

function App() {
  return (
    <div className="App"> 
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/todo" element={<Todo />} />
          <Route path="/expensetracker" element={<Expensetracker />} />
          <Route path="/calendarpage" element={<Calendarpage />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
