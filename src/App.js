import "./styles.css"

import {BrowserRouter as Router} from "react-router-dom";


import TodoList from "./components/TodoList"; 


function App() {
  return (
    <div className="App center">
      <Router>

        <header className="App-header">

          <TodoList />

        </header>
        
      </Router>

    </div>
  );
}

export default App;
