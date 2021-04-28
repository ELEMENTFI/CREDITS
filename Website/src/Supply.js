import React, { useState,useEffect } from "react";
import history from "./utils/history";
import Popup from "reactjs-popup"
import {Card,Button,Container,Modal,InputGroup,FormControl, Row, Col} from 'react-bootstrap';
import './App.css';

import './index.css';

//import {useState} from 'react';
import web3 from './web3';

import { Router, Route, Switch } from "react-router-dom";

import sb from  "./supplyabi";
import App from "./App";
import busd from "./BUSDabi";
import compt from "./comptroller";


function MyVerticallyCenteredModal1(props) {
  const [tid,setId] = useState([]);
  const [tid1,setId1] = useState([]);
  var [tid2,setId2] = useState([]);

  var [tid3,setId3] = useState([]);
  var [tid4,setId4] = useState([]);

  const mint = async (event) => {
    event.preventDefault();
    var x=document.getElementById("mymodal").style.visibility="hidden";

    const accounts = await web3.eth.getAccounts();
    var amount=document.getElementById("tid");
   amount = amount + "000000000000000000";
    alert(amount)
   await sb.methods.mint(amount).send({from:accounts[0]});
    alert("minted")
  }

  


  return (


    
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      id="mymodal"
      centered
    >
      <Modal.Header class="myModal" closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
        Enter the amount you want to  mint        </Modal.Title>
      </Modal.Header>
      <Modal.Body class="myModal">
        <h4 style={{textAlign: "center"}}></h4>
        <InputGroup>
  <InputGroup.Prepend>
   
  </InputGroup.Prepend>
  <FormControl class="myInput" id="tid" aria-label="Amount (to the nearest dollar)" />
  <InputGroup.Append>
   
  </InputGroup.Append>
</InputGroup>
      </Modal.Body>
      <Modal.Footer class="myModal">
        <Button variant="primary" onClick={mint}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
   


function MyVerticallyCenteredModal2(props) {
  
  const [tid,setId] = useState([]);
  const [tid1,setId1] = useState([]);
  var [tid2,setId2] = useState([]);

  var [tid3,setId3] = useState([]);
  var [tid4,setId4] = useState([]);

  
  const redeem = async (event) => {
    event.preventDefault();
    const accounts = await  web3.eth.getAccounts();

    var amount1=document.getElementById("tid1");
     amount1 = amount1+ "000000000000000000";
    alert(amount1)
    await sb.methods.redeemUnderlying(amount1).send({from:accounts[0]});
    alert("redeemed")
  }


  return (


    
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      id="mymodal1"
      centered
    >
      <Modal.Header className="myModal" closeButton>
        <Modal.Title id="contained-modal-title-vcenter" >
        Enter the amount you want to Redeem        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="myModal">
        <h4 style={{textAlign: "center"}}></h4>
        <InputGroup>
  <InputGroup.Prepend>
   
  </InputGroup.Prepend>
  <FormControl className="myInput" id="tid1" aria-label="Amount (to the nearest dollar)" />
  <InputGroup.Append>
   
  </InputGroup.Append>
</InputGroup>
      </Modal.Body>
      <Modal.Footer className="myModal">
        <Button variant="primary" onClick={redeem}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
    


function Supply() {
 
  const [modalShow1, setModalShow1] = React.useState(false);
  const [modalShow2, setModalShow2] = React.useState(false);
  
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
  var amount = tid + "000000000000000000";
  alert(amount)
 await sb.methods.mint(amount).send({from:accounts[0]});
  alert("minted")
}
const redeem = async (event) => {
  event.preventDefault();
  const accounts = await  web3.eth.getAccounts();
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
const exitcollateral = async (event) => {
  event.preventDefault();
  const accounts = await  web3.eth.getAccounts();
  await compt.methods.exitMarkets(["0x0075256cFc7467159360db309F5AC930ACef037d"]).send({from:accounts[0]});
  alert("collateral disabled")
}

  

  return (    
<Container fluid>
<button
                class="btn btn-primary float-right"
                type="button"
                style={{ float:"left",marginLeft:"20px"}}
                onClick={() => {
                  history.push("/");
                }}>
                Go Home Page 
              </button><br/><br/>
    <div className="App container-fluid">
<div class="App">


<h1 class="homehead">Supply Market</h1>


<center>
<Card className="card" style={{backgroundColor: "black",boxShadow:"1px 1px 10px 2px #fa3455",height:"350px",width:"300px" }}>

<br></br>



		<form onSubmit ={bal} id="create-course-form" >
   
     
    </form>


    <h4> eBUSD Wallet Balance<br />{tid2} </h4><br/>
    <h4>BUSD Wallet Balance <br />{tid3} </h4><br/>
    <h4>Before Mint we want to approve</h4>
    
    <button class="btn" onClick = {approve}>Approve</button>
    </Card>
    
    
    
    {/* <button  onClick={collateral}>Enable collateral</button> */}
      <br />
      <Container>
        <Row xs={2} md={4} lg={6}>
          <Col xs lg="2">
          <Popup trigger={<button class="btn"> Mint</button>} position="right center">
    <div>Enter the amount you want to  mint</div>
    <input type = "number" name="tid" required onChange={event => setId( event.target.value)} />
    <button class="btn" onClick={mint}>Confirm</button>
    </Popup>
          </Col>
          <br/>
          <Col>
          
{tid4 === true ? 
(
(
<div>
<button class="btn" onClick={collateral}>Disable Collateral</button>
</div>
)
):
(
(
<div>
<button class="btn" onClick={exitcollateral}>Enable Collateral</button> 
</div>
)
)}
          </Col>
          <br/>
          <Col>
          <Popup trigger={<button class="btn"> Redeem</button>} position="right center">
    <div>Enter the amount you want to Redeem</div>
    <input type = "number" name="tid1" required onChange={event => setId1( event.target.value)} />
    <button class="btn" onClick={redeem}>Confirm</button>
    </Popup>
          </Col>
        </Row>
        
 </Container>     
      <br />
      
    <br />
    <br />
    










      
<br></br>
<br></br>


</center>






              <br></br>
<br></br>


      

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



   
	  
      </div>    
      </Container>  
  );
}

export default Supply;
