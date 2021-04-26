import React, { useState,useEffect } from "react";
import history from "./utils/history";
import Popup from 'reactjs-popup';




//import {useState} from 'react';
import web3 from './web3';

import { Router, Route, Switch } from "react-router-dom";

import sb from  "./supplyabi";
import App from "./App";
import busd from "./BUSDabi";


function Supply() {
 

  
  const [tid,setId] = useState([]);
  const [tid1,setId1] = useState([]);
  var [tid2,setId2] = useState([]);

  var [tid3,setId3] = useState([]);
    useEffect(()=>{bal()},[])
 const bal = async () => {

   const accounts =  await web3.eth.getAccounts();
  //  var ga =[];
  var ga =  await sb.methods.balanceOf(accounts[0]).call();
  setId2(ga);
  var b = await sb.methods.borrowBalanceStored(accounts[0]).call();
  setId3(b);
  alert(ga);
  alert(b);
 }
      
  const approve = async (event) => {
    event.preventDefault();
    const accounts = await  web3.eth.getAccounts();
    var a = 1000;
   
    var amount = a+"000000000000000000";
    // var s = amount.toString();
    // alert(s)
    // var amount = 1000000000000000000000000000;
   await busd.methods.approve("0x452b10e0882c661113553B1273e4b6d26071Aa0c",amount).send({from:accounts[0]});
    alert("approved")
  }      
const mint = async (event) => {
  event.preventDefault();
  const accounts = await  web3.eth.getAccounts();
	//the entered amount should  be converted into decimal
  var amount = tid + "000000000000000000";
  alert(amount)
 await sb.methods.mint(amount).send({from:accounts[0]});
  alert("minted")
}
const redeem = async (event) => {
  event.preventDefault();
  const accounts = await  web3.eth.getAccounts();
	//the entered amount should be converted into decimal
  var amount = tid1+ "000000000000000000";
  alert(amount)
  await sb.methods.redeemUnderlying(amount).send({from:accounts[0]});
  alert("redeemed")
}


  

  return (    

    <div className="App">


<h1>Supply Market</h1>



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


    <div> Balance of eBUSD <br />{tid2} </div><br />
    <div>Available Borrow Balance <br />{tid3} </div><br />
    <div>Before Mint we want to approve</div>
    <button onClick = {approve}>Approve</button>
    <br /><br />
    <Popup trigger={<button> Mint</button>} position="right center"><br />
    <div>Enter the amount you want to  mint</div>
    <input type = "number" name="tid" required onChange={event => setId( event.target.value)} />
    <button  onClick={mint}>Confirm</button>
    </Popup>

    
    <br />
     
      <br /><br />
      <Popup trigger={<button> Redeem</button>} position="right center"><br />
    <div>Enter the amount you want to Redeem</div>
    <input type = "number" name="tid1" required onChange={event => setId1( event.target.value)} />
    <button  onClick={redeem}>Confirm</button>
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

export default Supply;
