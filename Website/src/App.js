import React  from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import {Card,Button,Container} from 'react-bootstrap';
import Supply from "./Supply";
import './App.css';
import Borrow from "./borrow";


function App() {
  
  return (
    <div>
      <div class="jumbotron my-auto">
      
  
        <center>

          <br></br>
          <br></br>
          <br></br>
        <Router history={history}>
          <Switch>
            <Route path="/" exact>
              <div class="display-4  mb-1"><h1 class="homehead">CREDIT</h1></div>
              <br></br><br></br><br></br>
              
              <Button variant="primary"
                className="btn"
                onClick={() => {
                  history.push("/Supply");
                }}
              >
                Supply Concept    
              </Button>{' '}
              <br /><br />
              <Button variant="primary"
                className="btn"
                onClick={() => {
                  history.push("/Borrow");
                }}
              >
                Borrow Concept    
              </Button>{' '}





            </Route>
            
            <Route path="/Supply">
              <Supply />
            </Route>
            <Route path="/Borrow">
              <Borrow />
            </Route>
          </Switch>
        </Router>
        </center>
      </div>
      
    </div>
  );
}

export default App;
