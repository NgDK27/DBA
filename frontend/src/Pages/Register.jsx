import React from 'react'
import logo from '../Image/lazadaLogo.png';

const Register = () => {
  return (
    <h1 className="header">
        WELCOME TO LAZADA &nbsp;
        <img src={logo} height={50} width={50} alt='LazadaLogo'/>
        <div className="form-container">
    <form className='register-form'>
      <h1 className='reg-header'>Create Your Lazada Account</h1>
      <input type="text" placeholder= "Username" style={{height: "30px"}}/>
      <input type="text" placeholder= "Email" style={{height: "30px"}}/>
      <input type="text" placeholder = "Password" style={{height: "30px"}}/>
      <button className= "formButton" >Sign Up</button>
      <button className="LinkBtn">Already member? Login here</button>
    </form>
    </div>
    </h1>
  )
}

export default Register