import React, { useState,useEffect } from "react";
import history from "./utils/history";
import Popup from 'reactjs-popup';




//import {useState} from 'react';
import web3 from './web3';

import { Router, Route, Switch } from "react-router-dom";

import sb from  "./supplyabi";
import App from "./App";
import busd from "./BUSDabi";
import compt from "./comptroller";


function Supply() {
 

  
  const [tid,setId] = useState([]);
  const [tid1,setId1] = useState([]);
  var [tid2,setId2] = useState([]);

  var [tid3,setId3] = useState([]);
  var [tid4,setId4] = useState([]);
      useEffect(()=>{bal()},[])
 const bal = async () => {

   const accounts =  await web3.eth.getAccounts();
  //  var ga =[];
//  alert( await sb.methods.getAccountSnapshot(accounts[0]).call());
  
  var ga =  await sb.methods.balanceOf(accounts[0]).call();
  
  setId2(ga/1000000000000000000);
  //var b = await sb.methods.borrowBalanceStored(accounts[0]).call();
  // setId3(b);
  alert(ga);
  var b = await busd.methods.balanceOf(accounts[0]).call();
setId3(b/1000000000000000000)
  var c = await compt.methods.checkMembership(accounts[0],"0x0075256cFc7467159360db309F5AC930ACef037d").call();
  setId4(c);
 }
      
  const approve = async (event) => {
    event.preventDefault();
    const accounts = await  web3.eth.getAccounts();
    var a = 1000;
   
    var amount = a+"000000000000000000";
    // var s = amount.toString();
    // alert(bigint())
    // var amount = 1000000000000000000000000000;
   await busd.methods.approve("0x0075256cFc7467159360db309F5AC930ACef037d",amount).send({from:accounts[0]});
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
const collateral = async (event) => {
  event.preventDefault();
  const accounts = await  web3.eth.getAccounts();
  await compt.methods.enterMarkets(["0x0075256cFc7467159360db309F5AC930ACef037d"]).send({from:accounts[0]});
  alert("collateral enabled")
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


    <div> eBUSD Wallet Balance<br />{tid2} </div><br />
    <div>BUSD Waaaallet Balance <br />{tid3} </div><br />
    <div>Before Mint we want to approve</div>
    <button onClick = {approve}>Approve</button>
    <br /><br />
    <Popup trigger={<button> Mint</button>} position="right center"><br />
    <div>Enter the amount you want to  mint</div>
    <input type = "number" name="tid" required onChange={event => setId( event.target.value)} />
    <button  onClick={mint}>Confirm</button>
    </Popup>

    
    <br /><br />
    <button  onClick={collateral}>Enable collateral</button>
      <br /><br />
      <Popup trigger={<button> Redeem</button>} position="right center"><br />
    <div>Enter the amount you want to Redeem</div>
    <input type = "number" name="tid1" required onChange={event => setId1( event.target.value)} />
    <button  onClick={redeem}>Confirm</button>
    </Popup>
    <br />
    <br />
    










      
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
