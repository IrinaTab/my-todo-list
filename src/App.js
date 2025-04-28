import "./styles.css"

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import TodoList from "./components/TodoList"; 


function App() {
  return (
    <div className="App center">
      <Router>

        <ScrollToTop />

        <header className="App-header">

          <TodoList />

        </header>
        
      </Router>

    </div>
  );
}

export default App;
