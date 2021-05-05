import React, { useState,useEffect } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./utils/history";
import App from "./App";
import Supply from "./supplyabi";
import Popup from 'reactjs-popup';
import compt from "./comptroller";




//import {useState} from 'react';
import web3 from './web3';



function Borrow() {
 

  
    const [tid,setId] = useState([]);
     const [tid1,setId1] = useState([]);
     const[tid3,setId3] = useState([]);
     const[tid2,setId2] = useState([]);
     const[tid4,setId4] = useState([]);
     const[tid5,setId5] = useState([]);
    // var [tid2,setId2] = useState([]);
  
    // // var [tid3,setId3] = useState([]);
    // let r = [];
   const bal = async () => {
 
      const accounts =  await web3.eth.getAccounts();
   setId3( await compt.methods.getAccountLiquidity(accounts[0]).call());
setId2(tid3[1]/1000000000000000000)
     console.log("value",tid3[1])
     setId4(await Supply.methods.borrowBalanceStored(accounts[0]).call() );
setId5(tid4/1000000000000000000)
     console.log("borrow value",tid4)

    
   }
  //  alert(tid3[1]);
   useEffect(()=>{bal()},[tid3[1],tid4])
   const borrow = async(event) =>{
    event.preventDefault();
    const accounts = await  web3.eth.getAccounts();
    
    var am = tid * 100000000;
    var amount = am + "0000000000";
    if(tid<=tid2)
 {
  console.log(amount)
 await Supply.methods.borrow(amount).send({from:accounts[0]});
  alert("Borrowed")
 }
 else  alert("Your entered amount should be less then the available borrow limit ")
   }
   const repayborrow = async(event) =>{
    event.preventDefault();
    const accounts = await  web3.eth.getAccounts();
   
    var am = tid1 * 100000000;
   
    var amount = am + "0000000000";
  
    if(tid1<=tid5)
    {
 console.log(amount)
 await Supply.methods.repayBorrow(amount).send({from:accounts[0]});
  alert("Borrowed")
    }
    else alert("Your entered amount should be less then the available borrow balance ")
   }
        
   
    
  
    return (    
  
      <div className="App">
  
  
  <h1>Borrow Market</h1>
  
  
  
  <button
                  class="btn btn-info btn-block"
                  type="button"
                  onClick={() => {
                    history.push("/");
                  }}>
                  Go Home Page 
                </button>
  
  
                <br></br>
  <br></br>
  
  
        
  <center>
  <br></br>
  
  
          <form onSubmit ={bal} id="create-course-form" >
     
       
      </form>
  
  
      <div>         

{tid3[1] === undefined ? 
(
(
<div>

</div>
)
):
(
(
<div class="text-white ">
Available Borrow Limit {tid2}
</div>
)
)}
    </div> 
    <br /> 
     
  <Popup trigger={<button class="btn btn-primary"> Borrow</button>} position="right center"><br />
    <div class="text-white bg-dark">Enter the amount you want to  Borrow</div>
    <input type = "number" name="tid" required onChange={event => setId( event.target.value)} />
    <button class="btn btn-primary" onClick={borrow}>Confirm</button>
    </Popup>

      <br /><br />
      <div>Borrow Balance {tid4/1000000000000000000}</div>
      <br /><br />
      <Popup trigger={<button class="btn btn-primary">  Repay Borrow</button>} position="right center"><br />
    <div class="text-white bg-dark">Enter the amount you want to Repay Borrow</div>
    <input type = "number"  name="tid1" required onChange={event => setId1( event.target.value)} />
    <button class="btn btn-primary" onClick={repayborrow}>Confirm</button>
    </Popup>
       
  
  
  
  
  
  
  
  
  
  
        
  <br></br>
  <br></br>
  
  
  </center>
  
  <br></br>
  <br></br>
  
  
  
                      
                      
  
              <Router history={history}>
            <Switch>
              <Route path="/" exact>
                <div class="display-4 mb-1">Choose a route to go to</div>
                
              </Route>
              <Route path="/App">
                <App />
              </Route>
              
              
            </Switch>
          </Router>
  
          
          <div>
              
          </div>
  
  
  
  
  
  
  
  
      
  
  
  
      
        
        </div>      
    );
  }
  
  export default Borrow;
