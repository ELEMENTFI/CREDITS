import React  from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";

import Supply from "./Supply";


function App() {
  
  return (
    <div class="container h-100 d-flex justify-content-center">
      <div class="jumbotron my-auto">
      
  
        <center>

          <br></br>
          <br></br>
          <br></br>
        <Router history={history}>
          <Switch>
            <Route path="/" exact>
              <div class="display-4 mb-1">CREDIT</div>
              <br></br><br></br><br></br>
              
              <button
                class="btn btn-info btn-block"
                type="button"
                onClick={() => {
                  history.push("/Supply");
                }}
              >
                Supply Concept     
              </button>





            </Route>
            
            <Route path="/Supply">
              <Supply />
            </Route>
          </Switch>
        </Router>
        </center>
      </div>
      
    </div>
  );
}

export default App;
